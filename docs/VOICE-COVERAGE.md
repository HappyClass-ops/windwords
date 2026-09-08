# Local voice coverage log

Last audited: 8 September 2026. Runtime source: `voice-manifest.js` and the checked-in files under `assets/audio`.

The game is local-audio-only. A missing or failed local clip settles the speech request as unavailable and stays silent; it does not call a remote speech API or show an ElevenLabs/service warning to the player.

## Currently voiced

- All 468 unique curriculum spellings represented by the 496 stable vocabulary entries have a local teacher clip. This covers island word buttons and the single-word checkpoint review.
- All three opening story pages have local Pip clips.
- All four bosses have local introduction, attack and defeat lines used by the current profiles.
- Pip has local summit-clear and Phase 3, 4 and 5 unlock announcements.
- The normal noun, verb, adjective and adverb prompt variants in the manifest are local.

The manifest currently contains 519 entries (492 teacher, 12 Pip and 15 boss), and all 519 referenced audio files existed at this audit.

## Not yet voiced

- Meaning/help narration combines a word with a live dictionary definition, so those generated full sentences do not have exact local clips. The word itself remains available from its word button.
- The generic `BOSS BATTLE` banner wording is visual only; the following boss introduction is voiced.
- The Ready / Go cue is intentionally visual with a sound effect, not spoken.
- Dynamic boss prompts are locally covered for two or three remaining islands. Variants for one and for four through ten remaining islands are not yet recorded, including the initial five-island Kraken and seven-island Golem prompts.
- Any future or edited story, phase, boss or prompt line is silent until an exact role/text/version entry and local file are added to the manifest.

Update this log whenever the manifest, spoken UI copy or voice lookup rules change.
