// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Task types
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

// Habit types
export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  current_count: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

// Goal types
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Chat: undefined;
  Today: undefined;
  AddTask: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  category?: string;
}

export interface HabitForm {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
}

export interface GoalForm {
  title: string;
  description?: string;
  target_date?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  isAvailable: boolean;
  task?: Task;
}

export interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
} 