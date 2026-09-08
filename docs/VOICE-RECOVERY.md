# Restore the ElevenLabs voice

The game deliberately does not fall back to the browser's synthetic voice. If the shared speech Worker cannot reach ElevenLabs, the game shows a visible warning and remains silent while music and sound effects continue.

The Worker source is maintained in the sibling `prep2-phonics` repository at `cloudflare/worker.mjs`. Its ElevenLabs key is an encrypted Cloudflare secret and must never be added to either repository.

From the `prep2-phonics` repository:

```powershell
npx wrangler login
npx wrangler secret put ELEVENLABS_API_KEY
npx wrangler deploy
```

Enter the replacement key only at Wrangler's hidden prompt. Do not pass it on the command line, paste it into source, or include it in an issue.

Verify the deployment without exposing the key:

```powershell
Invoke-WebRequest -Uri 'https://prep2-phonics-api.goldenhappyaku.workers.dev/health'

$headers = @{ Origin = 'https://happyclass-ops.github.io' }
$response = Invoke-WebRequest -Uri 'https://prep2-phonics-api.goldenhappyaku.workers.dev/api/speech' -Method Post -Headers $headers -ContentType 'application/json' -Body '{"text":"Voice check."}' -SkipHttpErrorCheck
$response.StatusCode
$response.Headers['Content-Type']
```

A repaired service returns status `200` and an `audio/*` content type. Status `502` means the Worker reached ElevenLabs but ElevenLabs rejected or could not complete the request; check the ElevenLabs subscription/quota and replace the Cloudflare secret if the key is no longer valid.
