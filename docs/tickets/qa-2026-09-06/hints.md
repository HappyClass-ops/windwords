# Separate meaning-picture help from two limited word-type reveals

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 12, 14
- Category: Learning mechanic / rules
- Priority: P1
- Recommended AI: Astra (high reasoning)
- Deliverable: Design contract, then separately authorized implementation
- Readiness: needs-triage
- Blocked by: None

## What happened / expected

Current Picture hint refills a word-type reveal even though pictures are free. The user wants meaning help and explicit class answers to be distinct.

Classic has clear Meaning/picture and Word type actions; word-type answers have two uses per run and can be replenished at a shop. Learning remains free unless the owner changes that policy.

## Reproduction / evaluation scenario

Start Classic, open ?, inspect the free picture, spend a reveal and inspect the Picture hint shop item.

## Acceptance criteria

- [ ] Document a complete help-state table before coding, including costs, limits, repeated opens, offline meanings and mode differences.
- [ ] Proposed default: 3 meaning-picture helps and 2 type reveals per Classic run; reopening the same helped sense is free; replenish each separately. The three-help allowance needs approval.
- [ ] No explicit class leakage through badge, alt text, replay, voice or other-kinds text before Type reveal. Definitions may naturally suggest the answer; do not distort definitions.
- [ ] Record assistance on the attempt so XP cannot count revealed answers as independent success; paid generation is not part of this ticket.

## Routing and boundaries

Two help budgets affect assessment validity, audio, purchases and future XP; resolve the contract once before downstream work.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the vocabulary area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Owner explicitly chose two type reveals, but not a number/cost for meaning-picture helps. Keep that open rather than silently treating the proposal as approved.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
