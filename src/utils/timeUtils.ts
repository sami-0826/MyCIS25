import { ClassSession, DayOfWeek, LiveClassStatus } from '../types';
import { DAYS_OF_WEEK } from '../data/defaultSchedule';

// Map standard Date.getDay() (0=Sunday ... 6=Saturday) to DayOfWeek
export const JS_DAY_MAP: Record<number, DayOfWeek> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

// Convert "HH:MM" (24hr) to minutes from midnight
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

// Convert "HH:MM" 24h format to pleasant "08:30 AM" or "01:00 PM"
export function formatTo12Hour(timeStr: string): string {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  let hour = parseInt(hStr, 10);
  const minutes = mStr.padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

// Format duration e.g. "1h 30m" or "45m"
export function formatDurationMinutes(mins: number): string {
  if (mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h} hr`;
  return `${m} min`;
}

// Determine course color palette based on course code
export function getCourseTheme(courseCode: string) {
  const code = courseCode.toUpperCase();
  if (code.includes('DS') || code.includes('DATA')) {
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/30',
      accent: 'emerald',
      dot: 'bg-emerald-500',
    };
  }
  if (code.includes('MATH')) {
    return {
      bg: 'bg-amber-500/10 dark:bg-amber-950/40',
      border: 'border-amber-500/30 dark:border-amber-500/40',
      text: 'text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/30',
      accent: 'amber',
      dot: 'bg-amber-500',
    };
  }
  if (code.includes('CAO') || code.includes('ARCH')) {
    return {
      bg: 'bg-indigo-500/10 dark:bg-indigo-950/40',
      border: 'border-indigo-500/30 dark:border-indigo-500/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      badge: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border-indigo-500/30',
      accent: 'indigo',
      dot: 'bg-indigo-500',
    };
  }
  if (code.includes('ENG')) {
    return {
      bg: 'bg-purple-500/10 dark:bg-purple-950/40',
      border: 'border-purple-500/30 dark:border-purple-500/40',
      text: 'text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-500/20 text-purple-800 dark:text-purple-200 border-purple-500/30',
      accent: 'purple',
      dot: 'bg-purple-500',
    };
  }
  return {
    bg: 'bg-sky-500/10 dark:bg-sky-950/40',
    border: 'border-sky-500/30 dark:border-sky-500/40',
    text: 'text-sky-700 dark:text-sky-300',
    badge: 'bg-sky-500/20 text-sky-800 dark:text-sky-200 border-sky-500/30',
    accent: 'sky',
    dot: 'bg-sky-500',
  };
}

// Compute live class status given a list of sessions, current simulated or actual date
export function computeLiveStatus(
  classes: ClassSession[],
  now: Date
): LiveClassStatus {
  const currentDay = JS_DAY_MAP[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Classes for current day, sorted by start time
  const todayClasses = classes
    .filter((c) => c.day === currentDay)
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  // 1. Is there a class in progress?
  for (const session of todayClasses) {
    const start = timeStringToMinutes(session.startTime);
    const end = timeStringToMinutes(session.endTime);

    if (currentMinutes >= start && currentMinutes < end) {
      const totalDuration = end - start;
      const elapsed = currentMinutes - start;
      const progress = totalDuration > 0 ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : 0;
      const remaining = end - currentMinutes;

      return {
        currentClass: session,
        nextClass: null,
        timeRemainingMinutes: remaining,
        progressPercent: Math.round(progress),
        status: 'ongoing',
        nextDay: currentDay,
      };
    }
  }

  // 2. Is there an upcoming class today?
  for (const session of todayClasses) {
    const start = timeStringToMinutes(session.startTime);
    if (start > currentMinutes) {
      const diff = start - currentMinutes;
      return {
        currentClass: null,
        nextClass: session,
        timeRemainingMinutes: diff,
        progressPercent: 0,
        status: 'upcoming_today',
        nextDay: currentDay,
      };
    }
  }

  // 3. If no more classes today, find the next class across upcoming days
  const daySequence: DayOfWeek[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  const currentDayIndex = daySequence.indexOf(currentDay);

  for (let offset = 1; offset <= 7; offset++) {
    const targetDayIndex = (currentDayIndex + offset) % 7;
    const targetDay = daySequence[targetDayIndex];
    const dayClasses = classes
      .filter((c) => c.day === targetDay)
      .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

    if (dayClasses.length > 0) {
      const firstClass = dayClasses[0];
      return {
        currentClass: null,
        nextClass: firstClass,
        timeRemainingMinutes: null,
        progressPercent: 0,
        status: 'upcoming_future',
        nextDay: targetDay,
      };
    }
  }

  return {
    currentClass: null,
    nextClass: null,
    timeRemainingMinutes: null,
    progressPercent: 0,
    status: 'no_classes',
  };
}

// LocalStorage helpers
const STORAGE_KEY = 'cis_batch_25_routine_fall2026_v2';

export function loadStoredSchedule(): ClassSession[] | null {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load schedule from localStorage', err);
  }
  return null;
}

export function saveStoredSchedule(schedule: ClassSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  } catch (err) {
    console.error('Failed to save schedule to localStorage', err);
  }
}

export function clearStoredSchedule() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear stored schedule', err);
  }
}
