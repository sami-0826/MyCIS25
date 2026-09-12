import React, { useState, useEffect } from 'react';
import { GraduationCap, Sun, Moon, Bookmark } from 'lucide-react';
import { BatchId } from '../types';
import { getBatchTheme } from '../utils/themeUtils';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedBatch: BatchId;
  isPinned?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedBatch,
  isPinned = false,
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
            <div className="flex items-center gap-2">
              <h1 className={`text-base sm:text-lg font-bold tracking-tight ${theme.headingText} leading-tight transition-colors`}>
                MyCIS 25
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} transition-colors inline-flex items-center gap-1`}
                title={isPinned ? `Batch ${selectedBatch} is your saved "My Batch" default` : `Batch ${selectedBatch}`}
              >
                {isPinned && <Bookmark className="w-2.5 h-2.5 fill-current text-amber-500" />}
                <span>{isPinned ? `My Batch: ${selectedBatch}` : selectedBatch}</span>
              </span>
            </div>
            <p className={`text-xs ${theme.mutedAccentText} leading-tight transition-colors`}>
              Class Routine
            </p>
          </div>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800"
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
