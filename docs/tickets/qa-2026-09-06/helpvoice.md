# Read the useful meaning once without redundant picture questions

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 6
- Category: Audio/teaching UX
- Priority: P2
- Recommended AI: Terra (medium; raise only for demonstrated need)
- Deliverable: Implementation after help contract
- Readiness: needs-info
- Blocked by: #15

## What happened / expected

After explaining a revealed word, narration still asks what the child can name in the already-explained picture.

Unrevealed help may ask a short observation question; revealed help reads the word and meaning without the redundant question. Type speech follows the separate reveal rules.

## Reproduction / evaluation scenario

Open a noun clue, reveal its meaning, then Hear again; compare Learning/dictionary and unrevealed Classic.

## Acceptance criteria

- [ ] One state table governs opening and replay; only unknown/observation state uses the question.
- [ ] Closing, changing words or opening another panel cannot emit a stale result.
- [ ] No change to accepted answers or reveal charging; no new audio generated.
- [ ] Repeated fixed prompts are catalogued for #9 rather than fetched as part of every long TTS string.

## Routing and boundaries

Small state-to-copy mapping once the help states are fixed; Terra is sufficient with table-driven tests.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the audio area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Observed: automatic meaning speech appends the guide; replay concatenates the definition/guide fields too.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
