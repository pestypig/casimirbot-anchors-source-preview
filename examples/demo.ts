import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { formatAnchoredAnswer } from "../codex/anchors/formatter";
import { anchorPathStatus, retrieveCandidates } from "../codex/anchors/retriever";
import { routeIntent } from "../codex/anchors/router";
import type { AnchorConfig, AnchoredAnswer } from "../codex/anchors/types";
import { verifyAnchoredAnswer } from "../codex/anchors/verifier";

const exampleDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(exampleDir, "..");
const cfg = JSON.parse(readFileSync(resolve(exampleDir, "demo-config.json"), "utf8")) as AnchorConfig;
const question = "How should this module architecture explain its observation and values?";
const intent = routeIntent(question, cfg);
const candidates = retrieveCandidates({ userText: question, cfg, repoRoot });

if (intent !== "hybrid" || candidates.length !== 2) {
  throw new Error("Synthetic route or retrieval did not match the fixture");
}
if (anchorPathStatus(repoRoot, "examples/docs/../ideology.json", cfg.security.allowedAnchorRoots) !== "outside") {
  throw new Error("Traversal fixture was unexpectedly admitted");
}

// A real caller would separately obtain and assess model output. This answer is fixed test data.
const answer: AnchoredAnswer = {
  answer: "The synthetic module returns a source-identified observation without an effect.",
  architectureAnchors: candidates.map(({ path, reason }) => ({ path, why: reason })),
  ideologyAnchors: [{ nodeId: "synthetic:care", why: "Names the example value without proving it." }],
};
const result = verifyAnchoredAnswer({ repoRoot, mode: "chat", cfg, answer });
if (!result.ok || result.warnings.length || result.errors.length) {
  throw new Error("Synthetic answer verification failed");
}

console.log(`Route: ${intent}`);
console.log(`Candidates: ${candidates.length}`);
console.log(formatAnchoredAnswer(result.sanitized));
