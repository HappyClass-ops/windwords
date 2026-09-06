# Economy / saves

run-supplies.js owns temporary stock, run wallet and guarded purchase
outcomes. The game owns hearts/reveals; the world displays stock and stop choices.
Keep purchase validation independent of whether a button happens to be disabled.

Classic non-final beacons offer Visit supply stop / Continue, then route choice.
No mid-run/village run-aid purchases. Village shop sells saved-star cosmetics.
Run aids: one automatic rescue (4), refill one heart (3), add one reveal (2).
Each type once per stop, shield capacity one, hearts capacity three, type reveals capacity two.
Start always resets the run wallet/aids and begins at three hearts and two type reveals.
world.checkpointStop() resolves once when skipping/exiting; cancellation exits
without continuing an ended run. HUD shows run stars in Classic.

Saved wordwind_coins and cosmetics remain on device. Never delete legacy shield,
boots or maxHearts data; do not apply permanent advantages in the new Classic run.
Award saved cosmetic stars and run stars explicitly, spend from the appropriate
wallet. Learning no run-aid purchases. Check insufficient funds, caps, double-click,
restart, mode switching and one continuation after leaving a checkpoint shop.
