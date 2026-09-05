# Vocabulary / meanings

vocabulary.json is the portable 496-entry catalogue: id, phase, kind, word, image.
vocabulary.js provides browser lookup, phase banks and homograph acceptance.
Files are assets/words/<id>.jpg, 256px, loaded on demand (~9MB all together).
Do not merge noun/verb homographs or renumber catalogue IDs. A picture illustrates
one sense; bare-word marking accepts all recorded plausible grammatical uses.

Existing helpFor in game.js mostly describes grammar, not word meaning: WW-004
replaces this with original child-friendly definitions. Meaning data must be keyed
by kind + word (catalogue can repeat a word across phases). Check coverage against
all entries, and use matching sense examples (sink noun is basin, verb descends).
Never call a grammar template a definition. Ambiguous pictures need teacher context.
Inherited informal adverbs are excluded from scored prompts; keep their assets.

