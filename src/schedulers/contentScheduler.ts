const schedule = require('node-schedule');
import { Context } from 'telegraf';
import { bot } from '../bot';
import { logger } from '../utils/logger';
import { Content } from '../models/contentModel';
import { StateManager } from '../stateManager';

export function scheduleContentDelivery(ctx: Context, times: number, intervalInMinutes: number) {
  let counter = 0;
  const stateManager = StateManager.getInstance()

  logger.info(`Scheduling job for every ${intervalInMinutes} minutes`);

  const job = schedule.scheduleJob(`*/${intervalInMinutes} * * * *`, async () => {
    logger.info('Scheduled job triggered');

    if (counter < times) {
      try {
        const content = await Content.aggregate([{ $sample: { size: 1 } }]);

        if (content.length > 0) {
          await bot.telegram.sendMessage(ctx.chat?.id ?? '', content[0].paragraph);
          await bot.telegram.sendMessage(ctx.chat?.id ?? '', "Click 'Shoot Questions' to start the quiz.", {
            reply_markup: {
              inline_keyboard: [[{ text: 'Shoot Questions', callback_data: 'start_quiz' }]],
            },
          });

          counter += 1;

          logger.info(`Content sent, counter is now ${counter}`);
          console.log(counter,"c",times,"t")
          if (counter >= times) {
            job.cancel();
            await bot.telegram.sendMessage(ctx.chat?.id ?? '', "You've received all the questions you requested. See you next time!");
            logger.info('All scheduled content sent, job cancelled.');
          }
        } else {
          await bot.telegram.sendMessage(ctx.chat?.id ?? '', 'No content available at the moment.');
        }
      } catch (error) {
        logger.error('Error sending content:', error);
      }
    }
  });
  stateManager.quizData = { ctx, times, intervalInMinutes }

}
