# Bosses and Pip's Outfitters — 10 September 2026

Implemented locally on `codex/boss-outfitters`. Human acceptance remains pending; this document does not claim deployment or listening verification.

## Bosses

- Larger responsive sprites for all four bosses, themed arena wash, aura and vignette; islands and HUD stay above the atmosphere.
- Twelve local ElevenLabs recordings with distinct voices: Callum (Bramble), Brian (Kraken), Harry (Golem), Adam (Chronos). Earlier narrator recordings are superseded. Runtime voice lookup retains each boss role.
- Existing four music tracks use direct HTML audio instead of Web Audio media-source routing, with fades, speech ducking, interaction retries and mute/visibility handling. This addresses a possible silent routing failure; the reported device symptom has not been reproduced or heard in this pass.
- Supplied heavy whoosh, thunder, air spell and void attack sounds are trimmed and faded. Their measured peaks align with attack impact after the visual warning. Production settings and provenance: `assets/audio/boss/production.json`.
- Intro speech and teaching instructions precede the attack timer. Speech, pending effects and encounter callbacks are cancelled on exit.

## Outfitters

- The existing village shop contains a dressing mirror, clothing rack and props cabinet, using the existing walk destinations. Classic journey stops retain run supplies.
- Categorised browse/owned views, free preview, stand/walk/jump previews, buy/equip, original-look reset and three saved looks.
- 24 new paid items: five hats, five tops, four boots, four held props, four fur dyes and two glows. Existing outfits, glows and chime remain available. Hats replace goggles; held props have no combat advantage.
- Neutral Pip action and walking art plus pose-specific clothing/prop layers are composited when an outfit changes. Legacy outfits retain their action art and gain matching walking art. Runtime artwork and pose manifest: `assets/outfitters/`; full generation boards are outside Git.
- One saved star per correct answer and five per completed checkpoint. Run-star multipliers remain separate. A full ordinary journey earns approximately 69 saved stars in Learning or 66 in Classic; the 30 paid items total 908 stars. Prices range from 10-star dyes to a 90-star glow.
- Existing saved balances and owned items migrate to `wordwind_wardrobe_v2`. Balance, ownership and equipped look save together. Buying validates assets, balance and ownership; storage failure does not debit. Web Locks serialise mutations where supported.

## Verification and human handoff

Only changed JavaScript syntax checks and `git diff --check` are used, per the owner's low-credit instruction. No new tests, full suite, browser automation or device matrix. Generated art received limited visual inspection; individual accessory alignment and audio mixing still need human acceptance.

Use the local HTTP preview from `node scripts/dev.cjs`, rather than opening the HTML as a file. Local changes are not automatically on the public website.

1. Enter all four bosses: listen through intro into music, then trigger an attack and defeat. Check each voice and SFX, music volume and word readability.
2. Mute/unmute; switch tabs; leave and re-enter a boss. Check for silence or leftover voices/effects.
3. Visit Outfitters and walk to all three fixtures; open/close the mirror.
4. Try hats, tops, boots, props, dyes and glows through standing, walking and jumping. Review clipping and pose alignment, especially gliding.
5. Preview/cancel without spending; buy, equip, save a look and reload. Confirm legacy ownership and balance are retained.
6. Check saved-star earnings separately from Classic run rewards and supplies. Review narrow-screen/touch layout with a human.
