# Audio

voice.js owns latest-request playback, cache and cancellation. game.js owns story,
help and banner callers. soundtrack.js owns local arrangements and scene ambience.
Pip uses the teacher voice pitched up with playbackRate 1.4, preservesPitch false;
this is not a new trained voice. Explicit Next/Skip/mute may interrupt; automatic
round transitions must wait for narrated completion rather than fixed 2.3s timers.

say() returns a Promise: ended, cancelled, disabled, empty, unavailable or timeout.
Banner waits for both its minimum display time and this Promise. Explicit stop
settles cancellation; a bounded watchdog prevents a stalled device blocking play.
tests/voice-completion.cjs checks lifecycle; reported-bugs.cjs checks the caller.

Speech playback is local-only through `voice-manifest.js`. Missing, mismatched or
failed clips settle as unavailable and remain silent; the browser does not call a
remote speech service or show a provider failure warning. Maintain the current
and missing coverage inventory in `docs/VOICE-COVERAGE.md`. Never commit .env,
DPAPI blobs, API keys, headers or auth configs.

Seven locally composed arrangements + six 8-second ElevenLabs Sound Effects v2
loops in assets/audio/zones; not Music API tracks. Music API was paid-plan blocked.
Old flight/shop audio preserved but not loaded. Scene bus fades/ducks and pauses
when hidden. Browser tests/mock voice never spend credits.

WW-009 has versioned local playback with fixture coverage and a populated checked-in
manifest. WW-010 initializes the overlay before narration and offers replay on
playback failure. Real-iPad listening is still unverified.
Do not claim the silent first-page problem fixed merely because proxy returns200.
