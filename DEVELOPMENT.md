# Pip's English — implemented adventure slice

## Story and journey
The islands have risen and separated the villagers. Pip reads word signs to cross
Sky Islands → Floating Forest → Crystal Peaks → Ember Volcano. Six correct leaps
lead to a multi-island beacon. Pip remains on each cleared checkpoint island.
Lighting the beacon opens a choice of two paths in the next region. The final
beacon brings the villagers home. Each region has two original illustrated views.

## Rules
- Classic: three word-type reveals per run; pictures/word pronunciation are free.
  No browsing the full dictionary during a run. Reopening a revealed word is free
  within that round. Ambiguous words continue to accept all known grammatical jobs.
- Learning: free explanations, unlimited retries, no shield/boots/route bonuses.
  Same two scenery choices and sequential progression. Cosmetics remain available.
- Classic Sunbeam Village: standard. Cloud Harbour: double stars + extra adverbs.
  Later first routes: double stars + extra adverbs. Later second routes: previous
  phase vocabulary + half stars. Fractions are retained (two half-stars = one).
- Checkpoints assess the **current route's word bank**, not an unseen next phase.
- Informal inherited adverbs bad, mad, strict, swift, soft, smart and quick are
  excluded from scored challenges pending teacher review; catalogue assets remain.
- Map records are correct leaps per region and route, not currency. Classic and
  Learning have independent unlocks/records. Existing stars and purchases survive.
- Shop purchases never happen merely by entering or inspecting an item.

## Modules and persistence
- vocabulary.js/json + assets/words: 496 reusable word-meaning pictures.
- adventure.js: village entrances, map, route metadata, mode-specific progress.
  `PipAdventure.attach` accepts the game's navigation/state callbacks. Add future
  games as entrances rather than embedding their rules in the village controller.
- game.js: word selection, grammar acceptance, reveals, animation and rewards.
- voice.js: latest-intent speech, shared in-flight requests, 180-entry persistent
  cache, cooldown after server failure, browser fallback. API secret stays server-side.
  Pip uses the existing service voice with pitch-preserving disabled and 1.4x
  playback; this is a cartoon treatment, not a newly trained/designed ElevenLabs voice.
- ambience.js: original lightweight procedural soundscapes for the four biomes.
  These are not ElevenLabs-generated music. Existing music/SFX remain in use.
- Storage is device-local; no account sync or authentication is claimed.

## Bug evidence and remaining service limitation
`work/test-pip-position.cjs` reproduced 216 px vertical drift after dictionary +
viewport resize. Recomputing the landing on resize and completed movements fixes it.
Reset also clears fall/flash/airborne animations, and menus don't open mid-jump.
The existing speech endpoint returned HTTP 200 for a diagnostic request. The
historic 502's upstream cause is not available from the generic server response;
quota exhaustion is not established. No Cloudflare secrets were read or changed.

## Art provenance
Built-in image generation; compact WebP finals in `assets/journey`. Original PNG
masters retained outside git in `outputs/windwords-journey/masters`.
Prompts: ascending illustrated sky/forest/crystal/volcano journey with no text;
four open-centre matching biome panels; village and open-counter shop as a two-panel
sheet; alternate cloud harbour, moonlit forest, aurora glacier, lava-lantern panels.
Village and shop have separate real HTML controls, not baked-in image buttons.

## Release review
Automated checks cover respawn/resize, checkpoint anchoring, locked route selection,
mode separation, reveal limits, duplicate purchases, voice cancellation/cache and
all 496 asset URLs. The browser run completed six normal leaps, branching progression,
all four Learning beacons, the volcano ending and a restart without page errors.
Human review is useful for voice character, music mix and touch feel; one bounded
optional prompt is in REVIEW-PROMPT.md. No paid voice calls are made by tests.
