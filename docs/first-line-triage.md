# Read-only lead for later ticket #10

At release e8a60ca, beginStory() calls renderStory() (which starts Pip speech)
BEFORE showOverlay(storyOverlay). showOverlay() calls stopNarration(), so it
cancels the pending first-line request. Later Next renders without opening the
overlay again. This is a concrete call-order lead, separate from iPad autoplay.

When #10 is approved, first reproduce with a fake speech-start/cancel trace, then
coordinate overlay opening and narration. Also test a cold, real iPad tap and
Skip/Next/mute; don't claim autoplay solved merely by rearranging these calls.
No implementation or paid generation for #10 was done in this batch.
