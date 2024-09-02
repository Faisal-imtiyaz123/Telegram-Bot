import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Content } from '../models/contentModel';

dotenv.config();

const seedData = [
  {
    paragraph: "This is a sample paragraph for the quiz.",
    questions: [
      {
        text: "What is the capital of France?",
        choices: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: 0
      },
      {
        text: "Which planet is known as the Red Planet?",
        choices: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      }
    ]
  }
];

async function seedDatabase() {
  try {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    console.log('Connected to database');

    await Content.deleteMany({}); // Clear existing data if necessary
    console.log('Cleared existing data');

    await Content.insertMany(seedData);
    console.log('Seed data inserted');

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
