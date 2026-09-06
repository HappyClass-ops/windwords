# Windwords playtest follow-up — 7 September 2026

## Implementation prompt

Polish the village, journey map, climbing transitions, checkpoint flow, and supply stop without changing Windwords' learning rules or stable vocabulary IDs. Preserve clear labels and accessible controls while making interactions playful and child-friendly. Reuse existing artwork wherever possible and keep browser download size low.

### P0 — broken or disorienting gameplay

1. Pip must remain visible through every jump and camera transition. Pan the world smoothly toward the newly landed island, keep upcoming islands visible as they arrive, and keep Pip synchronised with the resting island's hover.
2. Preload the village walking sprite so Pip never blinks out on the first walk.
3. In the village, let Pip walk directly across valid grass and stone instead of following unnatural invisible zig-zags.
4. Opening a supply item must not shrink the room or push a panel outside the viewport. Present the details as a contained overlay.

### P1 — layout and legibility

1. Move the Map and Supply Stop signs and their glowing destinations upward so each label sits clearly above its landmark.
2. Move Go Play lower and inward. Give it a distinct gold glow so it reads as the primary destination.
3. Keep the journey-map artwork proportional, centred, and symmetrical. Space the four stage markers and cloud veils evenly.
4. Put supply items visually on the counter and keep the Continue control comfortably inside its sign.
5. Replace repeated route-record sentences with a large personal-best number, a clear label, and a separate beacon-status badge. Use “Not travelled yet” only for routes with no record.

### P1 — checkpoint learning review

After a beacon is restored, show a celebratory review of every unique word Pip jumped on during that checkpoint stage. Show one large picture-and-word card at a time, announce the word, display progress such as “Word 2 of 7”, and require the child to advance through every card before opening the supply stop or route map. The last button should clearly continue to the journey.

### P2 — copy and cleanup

1. Remove “free” from the in-game “Meaning / picture” label.
2. Remove the Teacher device tools section from the Word book.
3. Keep elastic menu feedback brief, meaningful, keyboard-visible, and disabled for reduced-motion users.

## Intentionally not implemented

- The proposed AI-generated beacon cutscene video is deferred. This checkout has no lightweight video-generation pipeline, and adding a large browser video would work against the explicit loading-size requirement. The existing animated beacon restoration remains in place, followed by the new word review.
- “Also, you can literally see the me” was truncated in the playtest notes and did not identify an actionable element.
