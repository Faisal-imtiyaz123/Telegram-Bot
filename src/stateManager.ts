// src/stateManager.ts

import { Context } from "telegraf";

interface QuizData {
    ctx: Context;
    times: number;
    intervalInMinutes: number;
  }
  
  export class StateManager {
    private static instance: StateManager;
    public state: 'idle' | 'awaiting_times' | 'awaiting_interval' = 'idle';
    public quizData: QuizData | null = null;
  
    private constructor() {}
  
    public static getInstance(): StateManager {
      if (!StateManager.instance) {
        StateManager.instance = new StateManager();
      }
      return StateManager.instance;
    }
  }
  