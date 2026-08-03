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

/** Multi-site support: a stored site entry */
export interface SavedSite {
  id: string;          // unique id (timestamp)
  name: string;        // user name for this site
  siteName: string;    // construction site name
  createdAt: string;   // ISO date string
}
