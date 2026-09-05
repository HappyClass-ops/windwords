# Vocabulary / meanings

vocabulary.json is the portable 496-entry catalogue: id, phase, kind, word, image.
vocabulary.js provides browser lookup, phase banks and homograph acceptance.
Files are assets/words/<id>.jpg, 256px, loaded on demand (~9MB all together).
Do not merge noun/verb homographs or renumber catalogue IDs. A picture illustrates
one sense; bare-word marking accepts all recorded plausible grammatical uses.

meanings.js provides on-demand get(word, kind), shared by dictionary/game help.
It reuses the existing shared worker /api/dictionary endpoint (Merriam-Webster
Elementary), matching exact spelling/stem AND part of speech, excluding offensive
entries. Six original overrides cover sink, sail and bark noun/verb picture senses.
Requests are deduplicated and cached in-session, with a six-second timeout. No
eager 496-word download or new dictionary credentials. Attribution appears in help.
Unknown/offline meanings explicitly ask the teacher; never substitute grammar.
Same-POS words can have several senses: the provider's first definition is not
proof it matches every illustration. A teacher can report a mismatch for an
original override. All 496 keys are supported; we do not claim 496 meanings were
individually reviewed. Help tokens reject results after close/next/reveal changes.
Tests: tests/meanings.cjs and tests/reported-bugs.cjs; requests are mocked.
Inherited informal adverbs are excluded from scored prompts; keep their assets.
