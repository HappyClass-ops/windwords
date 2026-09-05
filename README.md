# Pip's Wordwind Trail

Static game published from the main branch with GitHub Pages.

## Reusable vocabulary

`vocabulary.json` contains all 496 phase/type/word records with stable IDs and relative image URLs. Copy this catalogue and `assets/words/` into another Pip game. `vocabulary.js` exposes the same entries plus the existing phase banks and answer-matching helpers. Images are 256px JPEGs, about 9 MB for the entire collection; opening help requests only its selected image. No picture download is required at startup. Preserve separate word-type IDs for words such as sail.

Bare-word questions accept any recorded grammatical use, including additional common noun/verb uses in `kindsFor`. Picture help labels one interpretation; opening help does not silently change answer eligibility. Future sentence questions should carry an explicit context type and use that for marking.

## Progress and rewards

Progress remains on this device in the existing `wordwind_` localStorage namespace. Existing purchases are retained. Correct answers earn the existing base/hard/streak rewards; each checkpoint adds five stars. Shield costs 8 stars, permanent heart 30, permanent boots 60. Cosmetic glows and the crystal chime unlock after checkpoints and can be equipped or removed. Picture help is free. No login or shared cross-game wallet is claimed or implemented.

## Teaching notes

Word-type guides accompany every picture. Abstract words need the accompanying explanation; pictures alone cannot establish grammar. Some inherited flat-adverb entries (such as bad, mad and strict) are informal or pedagogically questionable; review the curriculum before expanding those entries. A future sentence mode would give clearer grammatical context than isolated words.

## Validation

Browser checks cover all picture URLs, dictionary navigation, duplicate-purchase protection, ambiguous answer eligibility, checkpoint continuation, and iPad viewport layouts. Actual iPad audio playback and a teacher's review of individual meanings remain useful manual checks.
