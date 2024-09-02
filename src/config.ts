import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN as string,
  mongoUri: process.env.MONGO_URI as string,
};
