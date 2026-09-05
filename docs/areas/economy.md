# Economy / saves

Before WW-007: game.js mixes saved coins with purchases. world.js uses a stock()
adapter reading old hidden shop buttons; this is a genuine coupling to remove.
After WW-007: run-supplies.js owns temporary stock, run wallet and guarded purchase
outcomes. The game owns hearts/reveals; the world displays stock and stop choices.
Keep purchase validation independent of whether a button happens to be disabled.

Saved wordwind_coins and cosmetics remain on device. Never delete legacy shield,
boots or maxHearts data; do not apply permanent advantages in the new Classic run.
Award saved cosmetic stars and run stars explicitly, spend from the appropriate
wallet. Learning no run-aid purchases. Check insufficient funds, caps, double-click,
restart, mode switching and one continuation after leaving a checkpoint shop.

