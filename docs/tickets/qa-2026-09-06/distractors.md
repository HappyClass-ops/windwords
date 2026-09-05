# Keep checkpoint distractors genuinely wrong and answer counts exact

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 17, 24
- Category: Assessment/generator bug
- Priority: P1
- Recommended AI: Sol (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: needs-info
- Blocked by: #13

## What happened / expected

Candidates from another class can still be valid answers as homographs, weakening the challenge and changing intended answer counts.

Choose correct and incorrect candidates using accepted uses, not just the picture-bank label.

## Reproduction / evaluation scenario

Generate checkpoints across phases and target classes, then compare every displayed option to the accepted-use rule.

## Acceptance criteria

- [ ] Unique spellings, exact stated correct count and no accepted word classified as a distractor.
- [ ] Seeded/exhaustive tests across phases, class prompts and adverb settings.
- [ ] Finite generation with a defined smaller-set fallback when insufficient valid distractors exist; no rejection loop.
- [ ] Do not increase difficulty or alter word banks in this correctness fix.

## Routing and boundaries

Constrained generator work with strong invariants and finite-bank tests; no need for a flagship design exercise.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the vocabulary area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed: five candidates are chosen first, then correctness is recomputed, so extra homographs can increase the answer count.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
