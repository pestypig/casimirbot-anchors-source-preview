# CasimirBot Anchors utility source preview

This MIT-licensed source preview preserves eight exact first-party files from `codex/anchors/` at private platform commit `c5fbb6cc9153fca800837e731c55e9839937badf`. `SOURCE_SELECTION.json` identifies their paths, Git blobs, sizes, and SHA-256 hashes. The inventory's historical status records the prepublication review; the MIT license here applies to the selected first-party source and authored demo metadata.

The six TypeScript helpers route questions toward candidate source documents, validate answer anchors, and format the resulting references. The included `codex/anchors/anchors.config.json` describes paths in the private CasimirBot platform. The linked architecture documents, `docs/ethos/ideology.json`, model invocation, and application integration are not included. This is source for inspection, not a standalone answering service or supported package.

The `examples/` directory contains original synthetic fixtures and a fixed-answer demo. With Node.js and npm installed, run `npm ci` and `npm run demo` from this preview's root. The demo exercises routing, candidate retrieval, path admission, answer verification, and formatting without reading the private platform documents or calling a model. Its successful run establishes only that this synthetic example works in the tested environment.

No model, scientific, or security authority is established by this utility. In particular, its path checks have not received a security review suitable for untrusted configuration or caller input. Its repository-relative references may be stale outside the source snapshot. `package.json` is marked private to prevent accidental npm publication.

The MIT license does not include the private platform documentation, ideology data, external `tsx` package, or any hosted service. The historical CasimirBot repository remains private.
