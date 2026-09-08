export interface User {
  id: string;
  username: string;
  email: string;
  totalFocusTime: number;
}

export interface Fish {
  level: number;
  experience: number;
  name: string;
  stage: 'egg' | 'fry' | 'juvenile' | 'adult';
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number;
  timestamp: Date;
  success: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  goalMinutes: number;
  currentMinutes: number;
  rewardFood: number;
  isCompleted: boolean;
}
