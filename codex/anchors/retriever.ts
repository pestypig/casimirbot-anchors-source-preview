import * as fs from "node:fs";
import * as path from "node:path";
import { AnchorConfig, RetrieveCandidate } from "./types";

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function firstMatch(text: string, phrases: string[]): string | null {
  const normalized = normalize(text);
  for (const phrase of phrases) {
    if (normalized.includes(normalize(phrase))) return phrase;
  }
  return null;
}

function normalizeRelativePath(relPath: string): string {
  return relPath.replace(/\\/g, "/").replace(/^\.\//, "");
}

function safeRelativePath(relPath: string): string | null {
  const normalized = normalizeRelativePath(relPath);
  if (
    !normalized ||
    normalized.includes("\0") ||
    path.isAbsolute(normalized) ||
    path.win32.isAbsolute(normalized) ||
    normalized.split("/").some((part) => part === "." || part === "..")
  ) {
    return null;
  }
  return normalized;
}

function isWithin(base: string, target: string): boolean {
  const relative = path.relative(base, target);
  return relative === "" || (
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

export function anchorPathStatus(
  repoRoot: string,
  relPath: string,
  allowedRoots: string[],
): "allowed" | "missing" | "outside" {
  const candidate = safeRelativePath(relPath);
  if (!candidate) return "outside";
  const roots = allowedRoots
    .map(safeRelativePath)
    .filter((root): root is string => root !== null);
  const lexicalRoots = roots.filter((root) =>
    root.endsWith("/") ? candidate.startsWith(root) : candidate === root || candidate.startsWith(`${root}/`)
  );
  if (lexicalRoots.length === 0) return "outside";

  let realRepo: string;
  let realCandidate: string;
  try {
    realRepo = fs.realpathSync(repoRoot);
    realCandidate = fs.realpathSync(path.resolve(realRepo, candidate));
  } catch {
    return "missing";
  }
  if (!isWithin(realRepo, realCandidate)) return "outside";

  for (const root of lexicalRoots) {
    try {
      const realAllowedRoot = fs.realpathSync(path.resolve(realRepo, root));
      if (isWithin(realRepo, realAllowedRoot) && isWithin(realAllowedRoot, realCandidate)) {
        return "allowed";
      }
    } catch {
      // An absent configured root cannot admit the candidate.
    }
  }
  return "outside";
}

function uniqByPath(items: RetrieveCandidate[]): RetrieveCandidate[] {
  const seen = new Set<string>();
  const out: RetrieveCandidate[] = [];
  for (const item of items) {
    const key = normalizeRelativePath(item.path);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function retrieveCandidates(args: {
  userText: string;
  cfg: AnchorConfig;
  repoRoot: string;
  max?: number;
}): RetrieveCandidate[] {
  const { userText, cfg, repoRoot, max } = args;
  const candidates: RetrieveCandidate[] = [];

  for (const item of cfg.architecture.defaultBundle) {
    candidates.push({
      path: item.path,
      reason: item.why,
      source: "defaultBundle",
    });
  }

  for (const subsystem of cfg.architecture.subsystemRoots) {
    const match = firstMatch(userText, subsystem.keywords);
    if (!match) continue;
    for (const p of subsystem.paths) {
      candidates.push({
        path: p,
        reason: `Matched subsystem "${subsystem.name}" via keyword "${match}".`,
        source: "subsystemRoot",
      });
    }
  }

  for (const topic of cfg.architecture.topicBundles) {
    const match = firstMatch(userText, topic.keywords);
    if (!match) continue;
    for (const p of topic.paths) {
      candidates.push({
        path: p,
        reason: `Matched topic "${topic.name}" via keyword "${match}".`,
        source: "topicBundle",
      });
    }
  }

  const admitted = candidates.filter((item) =>
    anchorPathStatus(repoRoot, item.path, cfg.security.allowedAnchorRoots) === "allowed"
  );
  const unique = uniqByPath(admitted);

  if (typeof max === "number" && max > 0) {
    return unique.slice(0, max);
  }

  return unique;
}
