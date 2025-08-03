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
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
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
  current_streak: number;
  longest_streak: number;
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
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  TaskList: undefined;
  CreateTask: undefined;
  EditTask: { taskId: string };
  HabitList: undefined;
  CreateHabit: undefined;
  GoalList: undefined;
  CreateGoal: undefined;
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
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
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