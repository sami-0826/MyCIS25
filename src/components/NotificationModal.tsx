import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  Coffee,
  Check,
} from 'lucide-react';
import {
  NotificationSettings,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  sendBrowserNotification,
  playNotificationChime,
  isBrowserNotificationSupported,
} from '../utils/notificationUtils';
import { BatchId } from '../types';
import { getBatchTheme } from '../utils/themeUtils';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  selectedBatch: BatchId;
  onTriggerTestInApp: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  selectedBatch,
  onTriggerTestInApp,
}) => {
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState(false);
  const theme = getBatchTheme(selectedBatch);

  useEffect(() => {
    if (isOpen) {
      setBrowserPerm(getBrowserNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = () => {
    onUpdateSettings({
      ...settings,
      enabled: !settings.enabled,
    });
  };

  const handleToggleSound = () => {
    const nextSound = !settings.sound;
    onUpdateSettings({
      ...settings,
      sound: nextSound,
    });
    if (nextSound) {
      playNotificationChime();
    }
  };

  const handleRequestPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserPerm(perm);
    if (perm === 'granted') {
      sendBrowserNotification('🔔 MyCIS 25 Notifications Active!', {
        body: 'You will receive an alert 15 minutes before your first class or after class breaks.',
      });
    }
  };

  const handleSendTestNotification = () => {
    setTestSent(true);
    if (settings.sound) {
      playNotificationChime();
    }

    // In-app alert
    onTriggerTestInApp();

    // Browser system notification
    if (browserPerm === 'granted') {
      sendBrowserNotification('🔔 Test Alert: Class in 15 Minutes', {
        body: 'Data Structures (DS) starts in 15 mins at Room 602 with Md. Mehedi Hassan.',
      });
    }

    setTimeout(() => {
      setTestSent(false);
    }, 2500);
  };

  const hasBrowserSupport = isBrowserNotificationSupported();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="notification-settings-modal"
        className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
              <BellRing className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Class Notifications</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  15m Advance
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Smart reminders for Batch {selectedBatch}
              </p>
            </div>
          </div>

          <button
            id="btn-close-notification-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
            aria-label="Close notification settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Main Master Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                {settings.enabled ? (
                  <Bell className="w-4 h-4 text-emerald-500" />
                ) : (
                  <BellOff className="w-4 h-4 text-slate-400" />
                )}
                <span>15-Minute Class Reminders</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Receive notifications 15 minutes before qualifying classes
              </p>
            </div>

            <button
              id="toggle-notifications-master"
              type="button"
              role="switch"
              aria-checked={settings.enabled}
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Smart Rule Explanation Cards (As requested by user) */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>How the Smart Rule Works</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Notifies 15m Before</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Sent 15 minutes prior to the <strong>first class of the day</strong> or whenever you had <strong>no class running beforehand</strong> (after a free break).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
                  <Coffee className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>No Back-to-Back Spam</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  No notification is sent if there is a class directly before this one. You are already in session, avoiding disruptive alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Sound & Chime Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">Harmonic Audio Chime</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Play a pleasant chime when an alert fires</div>
              </div>
            </div>

            <button
              id="toggle-notification-sound"
              type="button"
              role="switch"
              aria-checked={settings.sound}
              onClick={handleToggleSound}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.sound ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.sound ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Browser System Permission Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  Browser System Alerts
                </span>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  browserPerm === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : browserPerm === 'denied'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                {browserPerm === 'granted' ? 'Allowed' : browserPerm === 'denied' ? 'Blocked' : 'Needs Permission'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              {browserPerm === 'granted'
                ? 'Desktop & mobile system notifications are enabled. You will receive alerts even when this tab is not actively focused.'
                : browserPerm === 'denied'
                ? 'Notifications are blocked in your browser settings. In-app banner notifications will still work while you have the app open.'
                : 'Allow browser notifications so you can receive alerts on your device even if you switch tabs or minimize the window.'}
            </p>

            {hasBrowserSupport && browserPerm !== 'granted' && browserPerm !== 'denied' && (
              <button
                id="btn-request-browser-perm"
                onClick={handleRequestPermission}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold ${theme.brandBg} text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Browser Notifications</span>
              </button>
            )}
          </div>

          {/* Test Notification Action */}
          <div className="pt-1 flex items-center justify-between gap-3">
            <button
              id="btn-test-notification"
              onClick={handleSendTestNotification}
              disabled={testSent}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {testSent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Notification Sent!</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Send Test 15m Alert</span>
                </>
              )}
            </button>

            <button
              id="btn-done-notifications"
              onClick={onClose}
              className={`py-2.5 px-5 rounded-xl text-xs font-bold ${theme.brandBg} text-white hover:opacity-90 transition-opacity cursor-pointer`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
