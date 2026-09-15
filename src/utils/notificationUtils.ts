import { ClassSession } from '../types';
import { timeStringToMinutes, formatTo12Hour } from './timeUtils';

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  systemNotification: boolean;
}

const SETTINGS_KEY = 'mycis25_notification_settings_v1';
const NOTIFIED_KEY_PREFIX = 'mycis25_notified_classes_';

export function getTodayDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Load saved settings
export function loadNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') {
    return { enabled: true, sound: true, systemNotification: true };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse notification settings', e);
  }
  // Default: notifications enabled for a great student experience
  return {
    enabled: true,
    sound: true,
    systemNotification: true,
  };
}

// Save settings
export function saveNotificationSettings(settings: NotificationSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings', e);
  }
}

// Check which classes were already notified today to prevent duplicates
export function getNotifiedClassIdsToday(d: Date = new Date()): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const dateKey = NOTIFIED_KEY_PREFIX + getTodayDateString(d);
  try {
    const raw = localStorage.getItem(dateKey);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch (e) {
    console.error('Failed to get notified classes', e);
  }
  return new Set();
}

export function markClassNotifiedToday(classId: string, d: Date = new Date()) {
  if (typeof window === 'undefined') return;
  const dateKey = NOTIFIED_KEY_PREFIX + getTodayDateString(d);
  try {
    const current = getNotifiedClassIdsToday(d);
    current.add(classId);
    localStorage.setItem(dateKey, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.error('Failed to save notified class', e);
  }
}

/**
 * Determines whether a class session qualifies for a 15-minute advance notification.
 *
 * Rules specified by user:
 * 1. Must send for the FIRST class of the day (no class before it).
 * 2. If there are previous classes: ONLY send if there was NO class running right before it
 *    (e.g. there is a free break/gap between the previous class ending and this class starting).
 * 3. NO notification will send if there is a class after the running one (i.e. back-to-back classes).
 */
export function shouldClassTriggerNotification(
  targetClass: ClassSession,
  todayClasses: ClassSession[]
): boolean {
  if (!targetClass || !todayClasses || todayClasses.length === 0) {
    return false;
  }

  // Sort today's classes by start time
  const sorted = [...todayClasses].sort(
    (a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime)
  );

  const index = sorted.findIndex((c) => c.id === targetClass.id);
  if (index === -1) return false;

  // Case 1: First class of the day -> Always eligible!
  if (index === 0) {
    return true;
  }

  // Case 2: Subsequent class
  const prevClass = sorted[index - 1];
  const prevEndMinutes = timeStringToMinutes(prevClass.endTime);
  const currStartMinutes = timeStringToMinutes(targetClass.startTime);

  // If the previous class ended right before (gap <= 15 minutes, or back-to-back),
  // then 15 minutes before currStartMinutes, the previous class was still running or ending.
  // The user rule explicitly states:
  // "This notification will send only when there were no class before or first class of the day.
  //  I mean no notification will send if there is a class after the running one"
  // Therefore, only send if there is a real break (> 15 minutes) before this class!
  const gapMinutes = currStartMinutes - prevEndMinutes;
  return gapMinutes > 15;
}

/**
 * Pleasant Web Audio API notification chime.
 * Two harmonious sine tones with soft attack and decay.
 */
export function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Resume context if suspended by browser autoplay policy
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: B5 (987.77 Hz) - harmonic fifth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    // AudioContext might be blocked until user gesture, safely ignore
  }
}

/**
 * Request system notification permission safely
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return 'denied';
  }
}

/**
 * Send browser system notification if allowed
 */
export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }
  try {
    const notif = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch (err) {
    console.warn('Failed to send browser notification:', err);
    return false;
  }
}

/**
 * Check if browser supports notifications
 */
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getBrowserNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}
