const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../vocabulary.js','utf8'),context);
const vocabulary=context.window.PipVocabulary;

assert.equal(vocabulary.entries.length,496);
assert.equal(new Set(vocabulary.entries.map(entry=>entry.id)).size,496);
assert.equal(vocabulary.get(4,'adjective','trim').id,'p4-adjective-trim');
assert.equal(vocabulary.get(4,'noun','nest').id,'p4-noun-nest');

for(const word of Object.keys(vocabulary.acceptedUseMetadata)){
  assert(vocabulary.entries.some(entry=>entry.word===word),`accepted-use metadata must name a playable word: ${word}`);
}

assert(vocabulary.accepts('trim','verb'));
assert(vocabulary.accepts('trim','adjective'));
assert(vocabulary.accepts('trim','noun'));
assert(vocabulary.accepts('nest','verb'));
assert(vocabulary.accepts('nest','noun'));
assert(vocabulary.accepts('sail','verb'));
assert(vocabulary.accepts('sail','noun'));
assert(vocabulary.accepts('sink','verb'));
assert(vocabulary.accepts('sink','noun'));
assert(vocabulary.accepts('bag','noun'));
assert(vocabulary.accepts('bag','verb'));
assert.equal(vocabulary.get(2,'verb','bag'),undefined,'bag remains accepted as a verb safety net without becoming a verb teaching picture');

assert.equal(vocabulary.accepts('trim','adverb'),false);
assert.equal(vocabulary.accepts('nest','adjective'),false);
assert.equal(vocabulary.accepts('cat','verb'),false);
assert.equal(vocabulary.accepts('cap','verb'),false);
for(const word of ['pan','cap','cat','hat','pot'])assert.deepEqual(Array.from(vocabulary.kindsFor(word)),['noun'],word+' stays an early-years noun');
assert.equal(vocabulary.accepts('unknown','noun'),false);

assert(vocabulary.accepts('trim','adjective',{kind:'adjective'}));
assert.equal(vocabulary.accepts('trim','verb',{kind:'adjective'}),false);
assert(vocabulary.accepts('nest','noun',{kind:'noun'}));
assert.equal(vocabulary.accepts('nest','verb',{kind:'noun'}),false);

const game=fs.readFileSync(__dirname+'/../game.js','utf8');
assert.match(game,/PipSelection.create\(PipVocabulary.accepts\)/,'selection must use shared acceptance');
assert.match(game,/accepted=PipVocabulary\.accepts\(island\.dataset\.word,state\.targetKind\)/,'normal scoring must use shared acceptance');
assert.match(game,/else if \(accepted\) await correctChoice/,'normal scoring must honour the shared acceptance result');
assert.match(game,/const acceptedKinds = PipVocabulary\.kindsFor\(island\.dataset\.word\)/,'feedback must use shared accepted kinds');

console.log('PASS: 496 stable IDs; bounded playable metadata; trim/nest/sail/sink bare uses; invalid and context-disambiguated uses; shared normal/checkpoint/feedback rule.');
