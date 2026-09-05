# Model routing — advisory, evidence-led

Read only this guide, AGENTS, the assigned issue and its relevant area guide.
Do not reload the 24-point report for a one-ticket assignment.

## Recommendation versus assignment

The issue body + ai:* label identify the recommended model. The claim comment
identifies the actual worker/model (or unknown), branch, base commit and scope.
These are different fields; a model name is not a GitHub user assignee or a lock.
One writer per branch; do not compete with an active claim.

If the owner asks a different AI to attempt it, BEFORE edits say:

> This ticket recommends Sol because [ticket-specific risk]. I am Terra. I can
> attempt the assigned scope; I will run [named check] and escalate if [risk].

Adapt names truthfully. If model identity is unavailable, say that rather than
inventing it. This is a notice, not a compulsory extra confirmation round when the
owner already explicitly assigned the work. Do not silently relabel the ticket
as recommended for yourself. Scope, unresolved decisions, sandbox and cost limits
still apply. A higher-cost model should likewise flag an originally cheaper route.

## Initial routing, not a permanent ability hierarchy

| Model | Default fit here | Escalate when |
| --- | --- | --- |
| Terra | Bounded copy/layout, deterministic small selection policies, existing checks | It cannot bound a lifecycle/save/rule dependency or two hypotheses fail |
| Sol | Default nontrivial implementation: vocabulary rules, finite generators, playback, sprite integration, saved-data views | Product contract remains ambiguous, or cross-cutting state/geometry repeatedly defeats its tests |
| Astra | Coupled camera/navigation contracts, assessment/assistance semantics, mastery/save policy, economy/finale design | Still needs a teacher decision, real-device evidence, permission or a specialist; capability does not remove those boundaries |
| Gemini | Small explicit production edits with a concrete example/check; mock-data prototypes and asset planning in isolation | Work expands into unbounded production changes, ambiguous pedagogy, save migration or unverified tool capability |

All can succeed or fail. The owner's experience of Gemini being fast/cheap is
useful local evidence, not a verified benchmark for its exact configured version.
Do not invent a Gemini API model ID from the name “3.8”. No assumption that one
model always out-reasons another on every ticket, or that Astra must review all work.

## Cost control and readiness

Optimise cost per accepted result: reading + implementation + tests + retries +
review, not per-token price alone. No numerical plan-credit/latency guarantees.
Use medium reasoning for bounded Sol/Terra tasks, high for coupled Astra tasks;
increase only when needed. Do not launch models/paid generators merely because a
ticket recommends them. The owner selects the worker or explicitly delegates.

- ready-for-agent: sufficient contract for the stated deliverable; not automatic authorization.
- needs-info: blocked by a linked ticket/explicit missing input; do not implement around it.
- needs-triage/planning-only: shape the listed design/prototype first. Production
  implementation needs the owner's assignment/approval; ordinary choices within
  an explicitly authorized design-and-build brief remain the AI's responsibility.
- Run relevant deterministic checks without paid calls. One final combined gate
  for an approved release batch, not one full suite per CSS edit.
- After two failed evidence-based hypotheses, record reproduction, expected/actual,
  attempts, diff and the next bounded question. Escalate rather than start over.
- Record actual result, check commands, rework and any observed usage after work.
  Revise recommendations from that evidence, not self-praise or anecdotes alone.

## Gemini access

Gemini's default remains an isolated prototype folder. Explicit assignment of a
bounded production ticket such as #19 can permit a dedicated game checkout/branch
with named edits; it does not permit sibling games, secrets, broad refactors,
production deployment or asset generation. The umbrella GEMINI-START-HERE explains
sandboxing. Markdown is guidance; filesystem/tool permissions are enforcement.

## Current model sources (checked 2026-09-06)

OpenAI describes [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
as its most capable model for hard end-to-end work,
[Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) as a flagship,
and [Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra) as balancing
intelligence and cost. Those product descriptions support initial routing, not
measured performance on Pip tickets. API prices are not the user's Codex plan
credit multipliers. Availability and tools vary by the actual selected host.
