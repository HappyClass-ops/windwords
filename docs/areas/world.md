# World / movement

world.js owns village, supply scene, map, route-choice dialogs and walking.
world.css overrides the retained baseline styles; investigate cascade before
adding another stylesheet. game.js owns gameplay islands and Pip’s landing.

Pip navigation uses normalized scene percentages. Walk frames are a horizontal
8-cell strip, --walk-frame selects the cell; all frames share scale/feet baseline.
Direct floor travel is preferable to compulsory down-across-up waypoints. Stops
must leave Pip on clear floor, not under labels or on the counter. No arrow/free
roaming, no full pathfinding engine unless obstacles actually require one.

Do not break: map records only, ???? for unexplored nodes, mode chosen at Go play,
new run starts Phase 2, multi-island beacon anchor follows each correct landing,
helpers cannot open mid-jump, resize recalculates standing coordinates.

Tests: world.cjs for scenes, pip-position.cjs for respawn/resize, adventure.cjs for
beacons/restart. Never use paid voice in browser tests. Real iPad touch/audio
judgement remains a reported manual check, not a headless proof.

