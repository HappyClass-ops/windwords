# Keep Pip on landed islands and scroll the journey behind him

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 15
- Category: Movement architecture / game feel
- Priority: P2
- Recommended AI: Astra (high reasoning)
- Deliverable: Implementation with narrow coordinate design first
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

After normal correct answers Pip and the landing island move back toward the original anchor, weakening the sense of climbing.

The landed island becomes the real anchor. Move a shared world/camera layer to frame progress while HUD/dialogs remain screen-fixed.

## Reproduction / evaluation scenario

Make three correct normal jumps, then a wrong landing, resize, open a clue and complete a multi-island beacon.

## Acceptance criteria

- [ ] One world-to-screen transform for islands, Pip, effects and hit targets; no independent ad hoc percentage fixes.
- [ ] Correct landing retains logical island identity; camera follows without a return jump.
- [ ] Respawn/rescue use the current anchor; no stale transitions after leaving/restarting.
- [ ] Normal and beacon paths, reduced motion, resize/orientation, labels and pointer hit areas tested; no endless offscreen DOM accumulation.
- [ ] No full engine rewrite or new images; integrate facing behavior if landed before this work.

## Routing and boundaries

Anchor ownership, camera transforms, picking and respawn are tightly coupled; Astra is worth using for the end-to-end change.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the world area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed moveNewAnchor animates toward the old anchor; beacon landings already update anchor identity differently.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
