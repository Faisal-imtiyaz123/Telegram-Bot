import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  paragraph: String,
  questions: [{
    text: String,
    choices: [String],
    correctAnswer: Number
  }]
});

export const Content = mongoose.model('Content', contentSchema);
