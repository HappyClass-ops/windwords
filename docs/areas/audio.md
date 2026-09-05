# Audio

voice.js owns latest-request playback, cache and cancellation. game.js owns story,
help and banner callers. soundtrack.js owns local arrangements and scene ambience.
Pip uses the teacher voice pitched up with playbackRate 1.4, preservesPitch false;
this is not a new trained voice. Explicit Next/Skip/mute may interrupt; automatic
round transitions must wait for narrated completion rather than fixed 2.3s timers.

Speech endpoint: https://prep2-phonics-api.goldenhappyaku.workers.dev/api/speech
Only text is sent from the browser. The shared Cloudflare worker owns its
ELEVENLABS_API_KEY secret. Do not read/dump secrets or change the shared phonics
worker casually. Use wrangler whoami / secret list for metadata; secret put only
with authorized input. Terminal login is machine-specific. Never commit .env,
DPAPI blobs, API keys, headers or auth configs. Rotate a pasted key via owner.

Seven locally composed arrangements + six 8-second ElevenLabs Sound Effects v2
loops in assets/audio/zones; not Music API tracks. Music API was paid-plan blocked.
Old flight/shop audio preserved but not loaded. Scene bus fades/ducks and pauses
when hidden. Browser tests/mock voice never spend credits.

WW-009/010 are later: fixed narration asset manifest and first-line autoplay bug.
Do not claim the silent first-page problem fixed merely because proxy returns200.

