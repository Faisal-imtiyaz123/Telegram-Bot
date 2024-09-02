import { Context } from 'telegraf';
import { scheduleContentDelivery } from '../schedulers/contentScheduler';
import { StateManager } from '../stateManager';
let times=0;

export async function handleText(ctx: Context) {
  const stateManager = StateManager.getInstance()
  let state = stateManager.state;
  if (state === 'idle') {
    await ctx.reply('Please enter /start to begin the quiz.');
  } else if (state === 'awaiting_times') {
    times = parseInt((ctx as any).message?.text ?? '', 10);
    if (isNaN(times) || times <= 0) {
      await ctx.reply('Please enter a valid positive number.');
      return;
    }

    await ctx.reply(`Great! You will receive questions ${times} times.`);
    stateManager.state = 'awaiting_interval';
    await ctx.reply("What should be the time gap between two sets of questions? Please enter a duration (e.g., 20m for 20 minutes or 1h for 1 hour).");
  } else if (state === 'awaiting_interval') {
    const timeInput = ((ctx as any).message?.text ?? '').trim().toLowerCase();
    const timeMatch = timeInput.match(/^(\d+)([mh])$/);
    if (!timeMatch) {
      await ctx.reply("Please enter a valid time duration (e.g., 20m for 20 minutes or 1h for 1 hour).");
      return;
    }

    const duration = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2] === 'm' ? 'minutes' : 'hours';

    await ctx.reply(`You will receive questions every ${duration} ${unit}.`);

    const intervalInMinutes = unit === 'minutes' ? duration : duration * 60;
    scheduleContentDelivery(ctx, times, intervalInMinutes);

    stateManager.state = 'idle'; // Reset state after scheduling
  }
}
