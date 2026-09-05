# Show what each shop item does, its price and its unlock progress

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 1, 7
- Category: Shop comprehension / usability
- Priority: P2
- Recommended AI: Terra (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

A bright extra note and Unlock: 3 checkpoints do not explain an item's effect or what the child must do. Saved-star prices disappear behind unlock labels.

Use literal child-friendly descriptions plus a small effect demonstration where existing assets allow it. Show price separately from eligibility and depict restored beacons rather than relying on checkpoint jargon.

## Reproduction / evaluation scenario

With 25 saved stars and few/no completed beacons, inspect each village cosmetic and compare a checkpoint supply stop.

## Acceptance criteria

- [ ] Crystal chime says it plays a cheerful extra sound after a right answer; a Preview sound button respects mute and requires a tap.
- [ ] Every item shows effect, saved/run wallet, price, ownership and unlock requirement independently.
- [ ] Beacon requirement has a visual count and plain explanation; locked children can still see what saved stars will buy.
- [ ] Existing currency math, prices and unlock rules are unchanged; redesign is in the economy ticket.

## Routing and boundaries

Concrete copy, presentation and existing-state rendering; Terra can implement and verify it directly.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the economy area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed: three cosmetics cost saved stars AND require 1/3/2 completed checkpoints; the disabled button hides their price.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
