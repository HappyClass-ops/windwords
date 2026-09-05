# Accept valid bare-word uses of trim, nest and audited homographs

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 17
- Category: Assessment bug
- Priority: P1
- Recommended AI: Sol (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

Choosing trim or nest for a verb prompt is marked wrong despite the bare word having a valid verb use.

Accept common valid word classes when the prompt gives only the spelling; constrain to one class only when meaningful context explicitly disambiguates it.

## Reproduction / evaluation scenario

In a verb round choose trim or nest. Compare their existing pictured adjective/noun senses.

## Acceptance criteria

- [ ] Both reported verbs are accepted; current noun/adjective pictures and all 496 IDs remain unchanged.
- [ ] Audit current accepted-use metadata against the playable catalogue; do not blindly label every word every class.
- [ ] Normal and checkpoint scoring share the same acceptance rule; wrong-answer feedback cannot contradict it.
- [ ] Tests cover trim, nest, sail, sink, invalid uses and explicitly disambiguated cases.

## Routing and boundaries

A bounded acceptance-data/rule correction with deterministic tests; Sol can own this without a routine Astra review.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the vocabulary area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed: trim is adjective-only and nest noun-only in the catalogue; neither is in the extra accepted-use map. This is new coverage under completed #4/#8, not proof all earlier homographs regressed.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
