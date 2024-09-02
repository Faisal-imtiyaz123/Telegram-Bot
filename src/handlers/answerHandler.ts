import { Context } from 'telegraf'
import { Content } from '../models/contentModel';
import { User } from '../models/userModel';

export async function handleAnswer(ctx: Context) {
  try {
    const match = (ctx as any).match as RegExpMatchArray;
    const questionIndex = Number(match[1]);
    const choiceIndex = Number(match[2]);

    const content = await Content.aggregate([{ $sample: { size: 1 } }]);
    if (content.length > 0) {
      const question = content[0].questions[questionIndex];
      const isCorrect = choiceIndex === question.correctAnswer;

      const user = await User.findOne({ telegramId: ctx.from?.id });

      if (user) {
        if (isCorrect) {
          user.score += 10;
          await user.save();
          await ctx.reply('Correct! 🎉 You’ve earned 10 points.');
        } else {
          await ctx.reply('Incorrect! 😞 Better luck next time.');
        }
      } else {
        await ctx.reply('User not found.');
      }
    } else {
      await ctx.reply('No content available at the moment.');
    }
  } catch (error) {
    console.error('Error processing answer:', error);
    await ctx.reply('An error occurred while processing your answer.');
  }
}
