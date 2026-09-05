# Replace irrelevant gear announcements with meaningful beacon dialogue

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 23
- Category: Story copy / audio UX
- Priority: P2
- Recommended AI: Terra (medium; raise only for demonstrated need)
- Deliverable: Implementation using existing speech pipeline
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

Checkpoint transitions announce gear equipped even though that statement does not help children understand progress.

Use a short truthful line about restoring the beacon, rescuing friends or reaching the next place; mention gear only if a meaningful change is actually shown.

## Reproduction / evaluation scenario

Restore each non-final beacon and listen/read the transition message.

## Acceptance criteria

- [ ] No phantom glider/gear reward claim; text and spoken line match actual state.
- [ ] Keep it short and non-repetitive; no change to route, rewards or checkpoint timing.
- [ ] Update fixed-script inventory for #9 so obsolete lines are not pre-recorded.
- [ ] No new generation or sound-level changes.

## Routing and boundaries

A narrow script/content change with clear exclusions suits Terra.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the audio area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed transition constructs a skin/gear equipped announcement.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
