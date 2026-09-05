# Keep Pip visible while inspecting shop items

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 3
- Category: Shop layout bug
- Priority: P2
- Recommended AI: Terra (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

The item information card hides Pip, particularly at the rightmost counter position.

Inspection reserves a visible character area or docks the card away from Pip. Do not move Pip off the floor just to avoid the overlay.

## Reproduction / evaluation scenario

Inspect left, middle and right items, then switch between them on desktop and tablet.

## Acceptance criteria

- [ ] Pip and the selected item remain visible at every inspection stop.
- [ ] Close/buy controls stay reachable at narrow widths and zoom.
- [ ] Inspection is not purchase; touch hit areas stay separate.
- [ ] Coordinate with the reopened path ticket, but do not rewrite navigation or price rules here.

## Routing and boundaries

Item-panel placement is separate from navigation geometry; solve it with responsive layout and visual checks.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the world area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

The diagonal/straight movement part of report 3 belongs to #6; this ticket owns only occlusion.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
