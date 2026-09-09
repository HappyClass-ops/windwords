# Paused Outfitters prototype and repair plan

Owner decision: pause cosmetic development, retain all boss changes and restore the previous live shop/wardrobe. No more generation or extensive testing now.

## Reference snapshot

Branch `codex/outfitters-reference` preserves the complete unfinished prototype, runtime artwork, catalogue, composition code, economy changes and pose manifest. It is reference work, not approved production artwork. Do not merge it wholesale into the active game. Original implementation commit: `7642bc1`.

On another PC: `git fetch origin`, then `git switch --track origin/codex/outfitters-reference` (or inspect it in a separate worktree). The boss-only continuation remains on `codex/boss-outfitters`.

## Problems seen by the owner

- Single garments stretched/rotated across poses do not follow anatomy; sleeves and boots look pasted on, especially jumping/gliding.
- Held weapons disappear behind the body/clothing because the broad foreground mask occludes the prop. Fix frame-specific depth and grip, not just global z-index.
- The character protrudes beyond the mirror frame; preview scale and framing vary through movement.
- Three shop fixtures are unnecessary and visually cluttered.

## Agreed future direction

1. Keep the existing illustrated room background. Add only ONE small mirror, diagonally angled into a suitable corner, with a single Dress Pip access point for every category. No separate clothing rack, props cabinet or extra merchandise fixtures. Fit it to existing walk paths; do not redraw the navigation map for decoration.
2. Fix consistent scale, foot/head alignment and clipping within the mirror glass, preserving tail and accessory space. The frame sits in front of the reflection.
3. Prove ONE Moss Scout outfit using Pip's six action poses and eight walking frames. Draw clothing for each frame; do not affine-stretch one garment across all poses. Use image generation with existing frame references, then align and clean up. Generation alone does not guarantee animation consistency.
4. Initially bake top/boots into complete outfit animation sheets. Keep hats, props, masked fur colours and glows modular. Preserve Pip's face, silhouette and style. No need to create three outfits before the first proof is approved.
5. Author frame-specific head/hand anchors, angles and explicit back/body/front-hand layers. Split a held prop where necessary so only the gripping fingers cover it; its blade/head remains visible. Include left-facing movement and gliding in the human check.
6. Human review of that one outfit in the mirror and gameplay comes BEFORE more generation. Only then expand. Separate tops/boots require dedicated per-frame art and should not be promised from a single source illustration.
7. Retain useful catalogue, try-on, purchase, saved-look and economy logic from this branch selectively. Preserve existing stars/ownership; give an equivalent replacement or saved-star refund for withdrawn items. The prototype's `wordwind_wardrobe_v2` record must not overwrite newer legacy-wallet progress when resumed; reconcile migration explicitly.

## Scope and acceptance

No new art work is authorised by this pause. Boss audio, SFX, music and arena changes remain active. Check only JavaScript syntax and patch whitespace for the rollback; human gameplay testing later. Generated master boards are not in Git; deployable processed assets and the pose manifest are in this reference branch. No credentials belong in Git.
