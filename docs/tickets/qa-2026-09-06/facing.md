# Turn Pip toward the destination before each jump

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 16
- Category: Animation bug
- Priority: P2
- Recommended AI: Sol (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

Pip can jump backwards rather than facing the selected island.

Face the destination before take-off and retain that direction at landing, including leftward and checkpoint jumps.

## Reproduction / evaluation scenario

Alternate left/right destinations in normal and beacon rounds using each phase outfit.

## Acceptance criteria

- [ ] Both horizontal directions and nearly vertical jumps have deterministic facing.
- [ ] Mirroring does not invert position/lift transforms or crop sprite frames.
- [ ] Wrong landing, rescue, resize and replay retain a grounded, correctly facing Pip.
- [ ] Reuse existing sprite sheets; no new frames or generated assets.

## Routing and boundaries

Sprite orientation interacts with transform animations and phase atlases; Sol is the sensible bounded integrator.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the world area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed jump path rotates with delta-x but does not establish a corresponding sprite-facing state.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
