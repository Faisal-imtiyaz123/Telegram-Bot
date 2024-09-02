import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './utils/logger';
import { handleStart } from './handlers/startHandler';
import { handleText } from './handlers/textHandler';
import { handleAction } from './handlers/actionHandler';
import { handleAnswer } from './handlers/answerHandler';

export const bot = new Telegraf(config.botToken);

mongoose.connect(config.mongoUri)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Set up handlers
bot.start(handleStart);
bot.on('text', handleText);
bot.action('start_quiz', handleAction);
bot.action(/answer_(\d+)_(\d+)/, handleAnswer);

bot.launch()
  .then(() => logger.info('Bot started'))
  .catch(err => logger.error('Error launching bot:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
