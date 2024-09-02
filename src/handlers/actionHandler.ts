import { Context } from 'telegraf';
import { StateManager } from '../stateManager';
import { Content } from '../models/contentModel';
import { bot } from '../bot';

export async function handleAction(ctx: Context) {
    const stateManager = StateManager.getInstance();
    const quizData = stateManager.quizData;
  console.log("action triggered")
  if (quizData) {
    const { ctx: originalCtx } = quizData;

    try {
      const content = await Content.aggregate([{ $sample: { size: 1 } }]);
      if (content.length > 0) {
        const question = content[0].questions[0]; // Assuming you want to show the first question
        const options = question.choices.map((choice: string, index: number) => ({
          text: choice,
          callback_data: `answer_0_${index}`, // Assuming questionIndex is 0
        }));

        await bot.telegram.sendMessage(originalCtx.chat?.id ?? '', question.text, {
          reply_markup: {
            inline_keyboard: [options],
          },
        });
      } else {
        await bot.telegram.sendMessage(originalCtx.chat?.id ?? '', 'No content available at the moment.');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      await ctx.reply('An error occurred while fetching the quiz question.');
    }
  } else {
    await ctx.reply('No quiz data available. Please start the quiz.');
  }
}
