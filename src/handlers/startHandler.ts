import { Context } from 'telegraf';
import { StateManager } from '../stateManager';

export async function handleStart(ctx: Context) {
  const stateManager = StateManager.getInstance()
  stateManager.state = 'awaiting_times';
  await ctx.reply("Welcome! Would you like to start the quiz? Please enter how many times you'd like to receive questions.");
}
