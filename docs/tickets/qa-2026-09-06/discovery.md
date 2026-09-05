# Connect map discoveries to real local practice records

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 4
- Category: Map mechanic / integration
- Priority: P3
- Recommended AI: Sol (medium; raise only for demonstrated need)
- Deliverable: Implementation after chosen design
- Readiness: needs-info
- Blocked by: #23, #24

## What happened / expected

The proposed island discoveries need genuine records rather than made-up statistics.

Tap explored regions for meaningful finds and the five most-seen words from that region, linked to dictionary pictures/practice stars.

## Reproduction / evaluation scenario

Visit a region, encounter words, open its map panel, then reload and inspect again.

## Acceptance criteria

- [ ] Count seen once per presented round, not per rerender/help reopen; define ties and fewer-than-five behavior.
- [ ] Do not equate frequency with correctness or mastery; show an honest empty state.
- [ ] No locked-region spoilers; map does not become level select.
- [ ] Uses existing saved-data contract and chosen prototype; no new identity/account system.

## Routing and boundaries

A real view over saved practice data needs consistent event semantics and migrations; Sol is sufficient once those exist.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the world area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Prototype approval and practice-data semantics are real dependencies; no fake map stats shipped in their absence.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
