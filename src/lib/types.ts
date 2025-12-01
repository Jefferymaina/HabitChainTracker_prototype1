export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  done: boolean;
  created_at: string;
}

export interface HabitChain {
  id: string;
  user_id: string;
  name: string | null;
  habit_ids: string[];
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitWithStreak extends Habit {
  streak: number;
  doneToday: boolean;
}

export type HabitColor = 'blue' | 'purple' | 'coral' | string;
