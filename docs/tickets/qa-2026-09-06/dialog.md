# Fit Pip story text and controls without unnecessary clipping

Triage snapshot: 2026-09-06. Current request is tickets/planning only, not permission to start coding.

- Report points: 10
- Category: Responsive layout bug
- Priority: P2
- Recommended AI: Terra (medium; raise only for demonstrated need)
- Deliverable: Implementation
- Readiness: ready-for-agent
- Blocked by: None

## What happened / expected

Ordinary story pages crop Pip, text and buttons; scrolling compensates for a cramped layout.

Normal story pages fit a tablet with Pip and Next/Skip visible. Keep accessible scrolling as fallback for zoom/very small screens, not by shrinking text illegibly.

## Reproduction / evaluation scenario

Start the story and compare pages one and two in tablet landscape/portrait and a short-height viewport.

## Acceptance criteria

- [ ] Test 1024x768, 768x1024, 390x844 and 200% browser zoom.
- [ ] No clipped Next/Skip; long text has an intentional reading area with reachable controls.
- [ ] Readable text and touch targets; decorative Pip may scale down before text does.
- [ ] Audio order, story wording and game rules remain unchanged.

## Routing and boundaries

Bounded responsive CSS/layout work with supplied screenshots and viewport checks.

Another model may attempt this when the owner explicitly assigns it, but must announce the recommendation mismatch BEFORE edits and respect blockers, scope and permissions. Recommendation is not an exclusive lock. Check the repository's agent instructions and the world area guide; do not reread the whole conversation.

No paid generation, secret changes, curriculum expansion, production push or deployment is authorized by this planning pass. A later implementation assignment must retain its own cost and release boundaries.

## Evidence / scope note

Screenshots supplied show text/buttons outside the visible story panel; layered modal size rules need inspection, not another blind override.

User report and static inspection are not a completed reproduction test. Claim actual worker/branch/base in a comment, keep one active status label, and close only with acceptance evidence. GitHub is the live status; this file is a dated brief.
