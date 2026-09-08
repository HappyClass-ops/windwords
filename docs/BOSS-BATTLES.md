# Windwords checkpoint boss battles

Every phase checkpoint is now a readable boss encounter. The urgency bar creates pressure without making reading speed the learning objective: a timeout performs a visible move, removes only an incorrect island, and gives a spoken hint in Learning. Classic can consume a cloud shield or one heart, but timer damage stops at one heart and can never cause sudden defeat.

| Phase | Boss | Literacy decision | Pressure | Recovery |
| --- | --- | --- | --- | --- |
| 2 | The Spore Bramble | Short-vowel verbs | Brambles bind an island | Doing-word hint; 15s per landing |
| 3 | The Cloud Kraken | Long-vowel nouns | Squall sinks an island | Naming-word hint; 15s per landing |
| 4 | The Gale Golem | Blend-rich adjectives | Wind mist shrouds an island | Describing-word hint; 10s per landing |
| 5 | The Magma Wyrm | Nouns, then verbs, then adverbs | Lava melts an island | Stage-specific hint; 8s per landing |

The Classic summit has three deterministic stages: break the shield with nouns, dodge fountains with verbs, then light the beacon with adverbs. Each right landing removes one health rune. Boss state owns its timer, pauses while the tab is hidden or while a promised correct island is arriving, respects reduced motion, and is stopped before review/results so music and intervals cannot leak into another scene.

Each encounter waits for the boss introduction playback result (including muted, unavailable, failed or cancelled results), shows a short Ready / Go cue, and only then enables choices, island scheduling and the countdown. The island scheduler owns fixed slots through active, destruction, empty, spawning and active states. It keeps four replacements planned, serialises every operation per slot and commits a selectable correct answer within a configurable two-second maximum gap.

## Audio

Boss dialogue is baked with ElevenLabs Flash v2.5 and registered in `voice-manifest.js`. Runtime playback is local and spends no API credits. Voice recipes use the existing George base with distinct delivery: Moss `.75 speed / .90 stability`, Kraken `.85 / .62`, Gale `1.05 / .70`, and Volcano `.78 / .45`. The generator remains idempotent and skips existing clips.

Each boss has a dedicated local MP3 plus a 132–150 BPM procedural layer in `soundtrack.js`. All four tracks are free for use under the [Pixabay Content License](https://pixabay.com/service/license-summary/):

- Moss: “That 8 Bit Music Short” by moodmode — <https://pixabay.com/music/video-games-that-8-bit-music-short-322060/>
- Kraken: “BOSS Battle Part2” by Retro-BGM-Chan — <https://pixabay.com/music/video-games-boss-battle-part2-%E3%83%9C%E3%82%B9%E3%81%9B%E3%82%93%E5%BE%8C%E5%8D%8A-534626/>
- Gale: “Battle Time” by Lesiakower — <https://pixabay.com/music/video-games-battle-time-178551/>
- Volcano: “Multi Boss | Fast-Paced 8-Bit Chiptune” by NickPanek — <https://pixabay.com/music/video-games-multi-boss-fast-paced-8-bit-chiptune-358679/>

## Future sprite-sheet production specification

The shipped bosses are code-native silhouettes so no generated art is required. A later approved art pass can replace each silhouette with one `2048 × 1024` transparent WebP atlas: 4 columns × 2 rows, eight `512 × 512` cells, consistent feet/core anchor at `(256, 448)`, at least 32px transparent padding, and no text. Frame order is idle A/B, windup A/B, attack A/B, hit, purified. Prompts should request a towering friendly 2D storybook sky-island boss, bold readable silhouette, limited phase palette, no horror, no weapons, no UI, and the boss-specific materials (moss/mushrooms; thundercloud/rain ribbons; stone/cloud turbine; obsidian/lava cracks). Validate anatomy, transparent alpha, cell isolation and silhouette readability at 160px before cropping.

## Verification

Run `npm test` from the repository root. The boss program checks all four contracts, dedicated music states, visible mounting, accelerated timeout hazards and the one-heart floor. The existing progression test still proves the three-stage finale, once-only rewards, teaching review and music exit.
