# Show the climb toward a visible beacon station

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 11
- Category: Visual progression / game feel
- Priority: P2
- Recommended AI: Sol (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: needs-info
- Blocked by: #26

## What happened / expected

Text and tiny progress dots do not make approaching a checkpoint feel like a physical destination.

A beacon station becomes visibly nearer through the six-leap climb, lights when restored and anchors the next-route/supply transition.

## Reproduction / evaluation scenario

Compare start, middle, last leap and beacon-clear moments without reading labels.

## Acceptance criteria

- [ ] Visual progression tracks actual completed leaps, never advances for a failed answer.
- [ ] Beacon completion has distinct unlit/lit state; no purely textual progress dependency.
- [ ] Existing art/code-native effects first; clear reduced-motion/static equivalent.
- [ ] Keep HUD readable, targets unobscured, branch/stop order unchanged; no new generation without approval.

## Routing and boundaries

With the camera contract stable, Sol can integrate scene progress and an accessible visual milestone.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the world area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Do after persistent-anchor camera work so a second visual coordinate model is not built.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
