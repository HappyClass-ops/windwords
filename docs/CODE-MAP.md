# Read only the area you need

| Change | Entry / owner | Guide | Targeted check |
| --- | --- | --- | --- |
| Signboards, clouds, paths, shop scene | world.js, world.css | areas/world.md | tests/world.cjs |
| Word meanings, pictures, homographs | vocabulary.js/json, game.js help | areas/vocabulary.md | meanings/coverage and browser help tests |
| Narration, music, sound effects | voice.js, soundtrack.js, game.js callers | areas/audio.md | tests/voice.cjs, tests/soundtrack.cjs |
| Run rewards and supply purchases | game.js, run-supplies.js after WW-007 | areas/economy.md | run-supplies tests + browser checkpoint flow |
| Pip landing/respawn/checkpoints | game.js | areas/world.md | tests/pip-position.cjs, tests/adventure.cjs |
| Generation/cropping/reuse | assets + manifest | areas/assets.md | catalogue/asset inventory |
| Tickets/releases/another computer | docs/agents + package.json | agents/workflow.md | npm test and git diff --check |

Baseline source is compact one-line JavaScript with plain browser globals, not a
bundled framework. Use symbol searches, not giant whole-file outputs. Source tests
currently expose a narrow browser fixture; do not copy that trick into production.

