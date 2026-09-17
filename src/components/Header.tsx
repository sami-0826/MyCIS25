import React, { useState, useEffect } from 'react';
import { GraduationCap, Sun, Moon, RotateCcw, Bell, BellOff, BookOpen } from 'lucide-react';
import { BatchId } from '../types';
import { getBatchTheme } from '../utils/themeUtils';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedBatch: BatchId;
  isPinned?: boolean;
  notificationsEnabled?: boolean;
  onOpenNotifications?: () => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedBatch,
  isPinned = false,
  notificationsEnabled = false,
  onOpenNotifications,
  onOpenGuide,
}) => {
  const theme = getBatchTheme(selectedBatch);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/30 dark:bg-black/30 backdrop-blur-md border-b border-slate-200/40 dark:border-zinc-800/40 shadow-xs'
          : 'bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-800/80'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Icon & Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${theme.brandBg} flex items-center justify-center text-white ${theme.brandShadow} flex-shrink-0 transition-all duration-300`}
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base sm:text-lg font-bold tracking-tight ${theme.headingText} leading-tight transition-colors`}>
              MyCIS 25
            </h1>
            <p className={`text-xs ${theme.mutedAccentText} leading-tight transition-colors`}>
              Fall 2026
            </p>
          </div>
        </div>

        {/* Right: Actions (Guide, Notifications, Reload, Theme Toggle & Install App) */}
        <div className="flex items-center gap-2">
          {/* Custom PWA Install App Button */}
          <button
            id="installBtn"
            style={{ display: 'none' }}
            title="Install MyCIS 25"
            aria-label="Install App"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 transition-colors cursor-pointer shadow-xs"
          >
            📲 Install App
          </button>

          {/* Feature Guide & Best Ways to Use Button */}
          <button
            id="btn-header-guide"
            onClick={onOpenGuide}
            title="User Guide & Features (Best ways to use MyCIS 25)"
            aria-label="User Guide and Features"
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800 flex items-center justify-center group"
          >
            <BookOpen className="w-4 h-4 text-slate-600 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>

          {/* Class Notifications Button */}
          <button
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            title={notificationsEnabled ? 'Class notifications active (15m before class)' : 'Configure class notifications'}
            aria-label="Class notifications settings"
            className="relative p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800 flex items-center justify-center group"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
              </>
            ) : (
              <BellOff className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors" />
            )}
          </button>

          {/* Reload Page Button */}
          <button
            id="btn-reload-header"
            onClick={() => window.location.reload()}
            title="Reload schedule"
            aria-label="Reload schedule"
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800 flex items-center justify-center group"
          >
            <RotateCcw className="w-4 h-4 text-slate-600 dark:text-zinc-300 group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800 flex items-center justify-center"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
