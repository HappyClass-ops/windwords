# Assets and provenance

Shipped: assets/words (496 sense-specific 256px JPEGs), assets/journey (small WebPs),
Pip phase atlases and assets/audio (MP3). Keep runtime paths relative for Pages.
Do not preload the full word library. Keep original/alternate images until accepted.

Desktop ../asset-masters is an optional LOCAL archive excluded from both repos.
Inventory and crop manifest come from the prior windwords-image-library archive.
Do not upload large masters or private generation exports automatically. Another
computer can run/edit using Git assets; master work needs a separate backup copy.

Game asset generation must use multi-panel sprite sheets, never one call per word.
Owner currently forbids image generation. When later approved: explicit row/column
manifest; reference Pip; expressions can vary; inspect anatomy and sense; keep text
outside crop rectangles. Check real alpha (checkerboard artwork is not transparency).
Crop by measured bounds, exclude neighbouring captions/art, keep source sheet.
Walk: 4x2 generated frames → horizontal 8-frame 2048x256 WebP strip, shared scale and
feet baseline; animate cell selection, not rotating one still image. See
scripts/prepare-journey-assets.py and assets/provenance.json when editing frames.

