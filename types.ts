export interface UserData {
  name: string;
  siteName: string;
}

export type AttendanceRecord = {
  date: string; // ISO string for date: YYYY-MM-DD
  time: string; // HH:mm:ss
};

export type ExpenseType = 'transportation' | 'toll' | 'parking';

export interface ExpenseRecord {
  id: string; // Unique ID, e.g., timestamp
  date: string; // ISO string for date: YYYY-MM-DD
  type: ExpenseType;
  amount: number;
  description?: string;
}
