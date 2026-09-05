# Avoid consecutive repeated words without starving small word banks

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 13
- Category: Selection bug / variety
- Priority: P2
- Recommended AI: Terra (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: needs-info
- Blocked by: #14

## What happened / expected

The same spellings can recur as correct options or distractors immediately after a round.

Exclude spellings displayed in the previous two rounds where the eligible pool permits, with a deterministic oldest-first relaxation for small pools.

## Reproduction / evaluation scenario

Play or seed consecutive rounds and compare all displayed spellings, not only the chosen answer.

## Acceptance criteria

- [ ] Tests cover normal/checkpoint transitions, all phases, kinds and adverb settings.
- [ ] No duplicates within a round, no infinite loops, and fallback is explicit/tested.
- [ ] History resets on a new run, not on a mere panel opening; transition policy is documented.
- [ ] Later deliberate review may reuse older words, but never silently bypass this near-repeat guard.

## Routing and boundaries

A small bounded recent-word policy is suitable for Terra once candidate correctness is established.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the vocabulary area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed selection remembers previous kind, not previous spellings. This is independent of adding mastery weighting.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
