# Design and implement honest per-word practice stars

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 5
- Category: Pedagogy / persistent mechanic
- Priority: P2
- Recommended AI: Astra (high reasoning)
- Deliverable: Design contract, then separately authorized implementation
- Readiness: needs-triage
- Blocked by: #13, #15

## What happened / expected

There is no per-word record, XP or visible dictionary progression.

Track seen/attempted/independent-correct/assisted practice and show three earned word-practice stars in the dictionary, separate from spendable currency.

## Reproduction / evaluation scenario

Answer the same word on different days, reveal its answer, restart and reopen its dictionary entry.

## Acceptance criteria

- [ ] Proposed: independent first-try correct +2 XP, maximum 2 XP per sense/day; levels at 2/6/12 XP on at least 1/3/6 distinct practice days. Assisted answers/merely seeing a word earn no mastery XP; no missed-day penalty.
- [ ] Explain that six practice days means six days encountering that word, not six app visits; 496 words need a review opportunity strategy, not a promise all master in a week.
- [ ] Use stable spelling + assessed kind; duplicate phase entries map consistently; picture sense is not proof of the assessed kind.
- [ ] Versioned bounded local storage; no pupil names/logins or cloud sync. Default shared class/device record is labelled practice evidence, not an individual mastery diagnosis.
- [ ] Test duplicate clicks, reload, day boundaries/clock rollback, assisted success, wrong attempts, reset/export and preservation of existing currency. Approve the pacing and scope before implementation.

## Routing and boundaries

Stable identity, assisted evidence, daily pacing and save migration need careful reasoning; errors would create misleading progress.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the vocabulary area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

The daily XP numbers are proposed tuning, not educationally validated mastery thresholds. Shared classroom use cannot infer individual pupil knowledge.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
