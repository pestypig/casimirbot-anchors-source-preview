# CasimirBot Anchors utility — private review draft

This unlicensed local draft preserves eight exact committed files from `codex/anchors/` for rights and technical review. It is **not approved for public distribution**. `SOURCE_SELECTION.json` identifies the source commit, paths, Git blobs, sizes, and SHA-256 hashes.

The six TypeScript helpers route questions toward candidate source documents, validate answer anchors, and format the resulting references. The included `codex/anchors/anchors.config.json` describes paths in the private CasimirBot platform. The linked architecture documents, `docs/ethos/ideology.json`, model invocation, and application integration are not included. This is source for inspection, not a standalone answering service or supported package.

The `examples/` directory contains original synthetic fixtures and a fixed-answer demo. With Node.js and npm installed, run `npm install` and `npm run demo` from this draft's root. The demo exercises routing, candidate retrieval, path admission, answer verification, and formatting without reading the private platform documents or calling a model. Its successful run establishes only that this synthetic example works in the tested environment.

No model, scientific, or security authority is established by this utility. In particular, its path checks have not received a security review suitable for untrusted configuration or caller input. Its repository-relative references may be stale outside the source snapshot. `package.json` is marked private to prevent accidental npm publication.

Publication requires exact rights for all eight files, review of copied content and path handling, a truthful license and notices, final tree/history scans, and a specific public-exposure approval. The historical CasimirBot repository remains private.
