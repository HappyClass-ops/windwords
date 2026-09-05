# Targeted architecture decisions, 2026-09-06

No general engine or monorepo migration. The static game is appropriate for Pages.
The user specifically values cheap navigation and safe changes over abstraction.

| Candidate | Before → after | Strength / action |
| --- | --- | --- |
| Run supply module | game wallet + hidden shop buttons + world state → guarded run-supplies interface consumed by both | Strong: WW-007; real second caller, isolated transaction tests |
| Speech completion | fixed banner sleeps + latest-request stop → completion/cancel result awaited at narration callers | Strong: WW-005; removes timing assumptions at the actual seam |
| Meaning lookup | grammar templates embedded in game → reusable sense-keyed original meaning catalogue | Strong: WW-004; dictionary and gameplay share lookup |
| Scene/style cleanup | layered legacy styles + newer overrides → area map and targeted edits first | Worth exploring later; no giant CSS rewrite this release |
| Universal Pip game engine | one game → speculative package system | Rejected for now: no second real runtime consumer |

Tests currently expose internals through a local test-server injection. Keep this
test-only, document it and improve individual interfaces when a ticket needs them;
do not rewrite every test just for architecture aesthetics. Long one-line source
can be reformatted in a later isolated mechanical ticket to reduce merge risk.
