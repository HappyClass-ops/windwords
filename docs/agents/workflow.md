# Work one ticket, not an entire conversation

## Report → ready → working → verified → deployed

Owner can say: “Make a ticket: [symptom/idea]” or “Fix #N”. AI records the expected
behaviour, reproduction, accepted decisions, exclusions, blockers and cheapest
checks. A vague creative idea stays needs-triage, not ready-for-agent. Owner usually
wants the AI to decide ordinary technical details; do not conduct repeated grills.

Read AGENTS.md + exact ticket + one area guide (normally under 2,500 words total).
Inspect more only for a concrete dependency. Claim with an issue comment identifying
branch and base commit plus in-progress label. Use a separate branch/worktree per
simultaneous worker; never let two computers edit the same working tree.

For an approved batch, persist each ticket checkpoint but share one final full
suite/release gate; do not rerun the entire suite for every minor edit. A completed
fix has reproduction/acceptance evidence, not merely a clean syntax check.

## Commands (from repository root)

- git status --short; git pull --ff-only (only with a clean tree)
- First setup: npm ci after lockfile exists; Google Chrome must be installed.
- npm run dev: local-only preview server; no build/deployment step.
- node tests/voice.cjs / node tests/soundtrack.cjs: fast, mocked, no paid calls.
- node tests/world.cjs: focused scene checks; npm test: final combined gate.
- git diff --check; git add <named ticket files>; git commit; git push.
- gh issue view N --repo HappyClass-ops/windwords --comments

If Playwright is supplied by the host instead of npm, set PLAYWRIGHT_MODULE to its
module path for that machine. Never commit machine-specific runtime paths.
Do not copy node_modules or auth caches between computers.

## When to use a stronger or cheaper AI

Small isolated label/CSS/data corrections and running existing checks: cheaper
coding model, if already available. Lifecycle races, currency/save migration,
pedagogy, auth changes and cross-module design: capable reasoning model.
Two failed hypotheses → stop random edits; provide reproduction, evidence, scope
and two options to the stronger model/owner. No recursive agent trees. Do not buy
extra credits or invoke paid external generators without task-specific permission.
Ordinary work in the user-selected chat is not a reason to ask at every tool call.

## Definition of done / interruption

Record commit, tests actually run, remaining manual checks and deployment state.
Never close blocked tickets or silently count skipped tests as passes. If credits
run low, leave one resume note with branch, last commit, uncommitted files, command
that currently fails and next action. Stop at a coherent checkpoint. No new ticket
selection if the user assigned one exact issue.

## Another computer

Clone the handbook once, run its bootstrap script to clone Windwords beside it.
Before switching computers: commit and push the working branch, then comment the
next action on the ticket. On the other computer: fetch, checkout that branch,
pull --ff-only. If both changed, resolve explicitly; never force-push or reset.
GitHub syncs source, docs and tickets, NOT browser-saved pupil progress or secrets.

