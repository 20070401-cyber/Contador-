export type DayStatus = 'completed' | 'missed' | 'today-pending' | 'today-completed';

export interface DayRecord {
  dateStr: string; // YYYY-MM-DD
  dayName: string; // LUN, MAR, etc.
  dayNumber: number; // 1-31
  monthName: string; // ENE, FEB, etc.
  status: DayStatus;
  isToday: boolean;
}

export interface StudyState {
  streak: number;
  lastStudiedDate: string | null; // YYYY-MM-DD
  history: string[]; // List of YYYY-MM-DD dates marked as studied
  currentQuoteIndex: number;
  bestStreak: number;
  totalStudyDays: number;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
  category: string;
}

export interface KotlinFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}
