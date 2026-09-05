# Pip's Wordwind Trail

Static game published from the main branch with GitHub Pages.

Now entered through the **Pip's English** village: arrow keys or tap-to-walk to
the Word book, Map, Supply stop and Go play. The map provides locked stops, route
records and two scenery choices per region. See [DEVELOPMENT.md](DEVELOPMENT.md)
for the story, exact Classic/Learning rules and reusable module boundaries.

## Reusable vocabulary

`vocabulary.json` contains all 496 phase/type/word records with stable IDs and relative image URLs. Copy this catalogue and `assets/words/` into another Pip game. `vocabulary.js` exposes the same entries plus the existing phase banks and answer-matching helpers. Images are 256px JPEGs, about 9 MB for the entire collection; opening help requests only its selected image. No picture download is required at startup. Preserve separate word-type IDs for words such as sail.

Bare-word questions accept any recorded grammatical use, including additional common noun/verb uses in `kindsFor`. Picture help labels one interpretation; opening help does not silently change answer eligibility. Future sentence questions should carry an explicit context type and use that for marking.

## Progress and rewards

Progress remains on this device. Existing `wordwind_` purchases and stars are retained;
`pip_english_` stores separate Classic/Learning route records and unlocks. Classic
leaps receive route modifiers; each beacon adds five stars. Shield costs 8 stars,
permanent heart 30, permanent boots 60. Cosmetics unlock after checkpoints.
Pictures are free; Classic has three word-type reveals per run. Learning has free
explanations and retries, no gameplay upgrades or route modifiers. No login or
shared cross-game wallet is claimed or implemented.

## Teaching notes

Word-type guides accompany every picture. Abstract words need the accompanying explanation; pictures alone cannot establish grammar. Some inherited flat-adverb entries (such as bad, mad and strict) are informal or pedagogically questionable; review the curriculum before expanding those entries. A future sentence mode would give clearer grammatical context than isolated words.

## Validation

Browser checks cover all picture URLs, dictionary navigation, duplicate-purchase protection, ambiguous answer eligibility, checkpoint continuation, and iPad viewport layouts. Actual iPad audio playback and a teacher's review of individual meanings remain useful manual checks.

Run `npm install`, then `npm test` (Google Chrome installed). Browser tests use
Playwright locally; speech tests mock the service and consume no credits. No build
step is needed for GitHub Pages. Generated environment artwork is under 1 MB total;
word pictures still load only when opened.
