import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: String,
  score: { type: Number, default: 0 }
});

export const User = mongoose.model('User', userSchema);
