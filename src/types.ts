export type BatchId = '25A' | '25B' | '25C';

export type SubSection = 'All' | '1' | '2';

export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type ClassType = 'Theory' | 'Lab';

export interface ClassSession {
  id: string;
  batch: BatchId;
  subSection: SubSection; // 'All' for whole batch, '1' for e.g. 25A1, '2' for e.g. 25A2
  courseCode: string;     // e.g. "DS", "Math I", "English II", "CAO"
  courseName: string;     // e.g. "Data Structures", "Mathematics I"
  type: ClassType;        // Theory vs Lab
  teacherName: string;    // e.g. "Md. Mehedi Hassan"
  teacherInitial: string; // e.g. "MH"
  room: string;           // e.g. "Room 602", "Software Lab 3"
  day: DayOfWeek;
  startTime: string;      // 24-hr format "HH:MM", e.g. "08:30", "11:30"
  endTime: string;        // 24-hr format "HH:MM", e.g. "10:00", "13:00"
  notes?: string;
  color?: string;
}

export interface TeacherInfo {
  initial: string;
  fullName: string;
  designation?: string;
  email?: string;
  courses: string[];
}

export type ViewMode = 'today' | 'week' | 'search' | 'teachers';

export interface LiveClassStatus {
  currentClass: ClassSession | null;
  nextClass: ClassSession | null;
  timeRemainingMinutes: number | null; // until current ends, or until next begins
  progressPercent: number;             // for current class progress
  status: 'ongoing' | 'upcoming_today' | 'upcoming_future' | 'no_classes';
  nextDay?: DayOfWeek;
}
