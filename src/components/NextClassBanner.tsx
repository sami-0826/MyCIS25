import React from 'react';
import { LiveClassStatus, BatchId, DayOfWeek } from '../types';
import { formatTo12Hour, formatDurationMinutes } from '../utils/timeUtils';
import { Sparkles, Radio, Clock, MapPin, User } from 'lucide-react';
import { getBatchTheme } from '../utils/themeUtils';

interface NextClassBannerProps {
  status: LiveClassStatus;
  selectedBatch: BatchId;
  currentDay: DayOfWeek;
}

export const NextClassBanner: React.FC<NextClassBannerProps> = ({
  status,
  selectedBatch,
  currentDay,
}) => {
  const { currentClass, nextClass, timeRemainingMinutes, progressPercent, status: statusType } = status;
  const dayUpper = currentDay.toUpperCase();
  const theme = getBatchTheme(selectedBatch);

  // 1. If class is currently ONGOING
  if (statusType === 'ongoing' && currentClass) {
    return (
      <div className={`rounded-2xl border ${theme.bannerBorder} bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-sm dark:shadow-lg dark:shadow-black/40 relative overflow-hidden transition-all duration-300`}>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
              LIVE · {dayUpper}
            </span>
          </div>
          <span className={`text-xs font-semibold ${theme.brandText}`}>
            Batch {selectedBatch}
          </span>
        </div>

        {/* Content body */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>CLASS IN PROGRESS</span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
              {currentClass.courseCode}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {currentClass.type}
            </span>
            {currentClass.subSection !== 'All' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                {currentClass.batch}{currentClass.subSection}
              </span>
            )}
          </div>

          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.headingText} mt-1`}>
            {currentClass.courseName}
          </h2>

          <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-slate-900 dark:text-zinc-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Ends in {timeRemainingMinutes !== null ? formatDurationMinutes(timeRemainingMinutes) : '--'}
              <span className="text-slate-400 dark:text-zinc-500">({formatTo12Hour(currentClass.endTime)})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              {currentClass.room}
            </span>
            <span className="flex items-center gap-1.5" title={`Instructor: ${currentClass.teacherName} (${currentClass.teacherInitial})`}>
              <User className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              <span>{currentClass.teacherName}</span>
              <span className="text-[10px] font-mono font-bold px-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                {currentClass.teacherInitial}
              </span>
            </span>
          </p>

          {/* Minimal progress bar */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className={`${theme.brandBg} h-full rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. If upcoming class later TODAY
  if (statusType === 'upcoming_today' && nextClass) {
    return (
      <div className={`rounded-2xl border ${theme.bannerBorder} bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-sm dark:shadow-lg dark:shadow-black/40 relative overflow-hidden transition-all duration-300`}>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${theme.batchPillDot} animate-pulse`} />
            <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
              LIVE · {dayUpper}
            </span>
          </div>
          <span className={`text-xs font-semibold ${theme.brandText}`}>
            Batch {selectedBatch}
          </span>
        </div>

        {/* Content body */}
        <div className="mt-3">
          <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>NEXT UP TODAY</span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
              {nextClass.courseCode}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {nextClass.type}
            </span>
            {nextClass.subSection !== 'All' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                {nextClass.batch}{nextClass.subSection}
              </span>
            )}
          </div>

          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.headingText} mt-1`}>
            {nextClass.courseName}
          </h2>

          <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-slate-900 dark:text-zinc-200 font-medium">
              Starts in {timeRemainingMinutes !== null ? formatDurationMinutes(timeRemainingMinutes) : '--'}
              <span className="text-slate-400 dark:text-zinc-500"> ({formatTo12Hour(nextClass.startTime)})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              {nextClass.room}
            </span>
            <span className="flex items-center gap-1.5" title={`Instructor: ${nextClass.teacherName} (${nextClass.teacherInitial})`}>
              <User className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              <span>{nextClass.teacherName}</span>
              <span className="text-[10px] font-mono font-bold px-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                {nextClass.teacherInitial}
              </span>
            </span>
          </p>
        </div>
      </div>
    );
  }

  // 3. Free for the rest of today / No classes today (Matches exact screenshot)
  return (
    <div className={`rounded-2xl border ${theme.bannerBorder} bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-sm dark:shadow-lg dark:shadow-black/40 relative overflow-hidden transition-all duration-300`}>
      {/* Top meta row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
            LIVE · {dayUpper}
          </span>
        </div>
        <span className={`text-xs font-semibold ${theme.brandText}`}>
          Batch {selectedBatch}
        </span>
      </div>

      {/* Content body */}
      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
          <span>YOU'RE FREE</span>
        </div>

        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.headingText} mt-1`}>
          No more classes today
        </h2>

        <p className={`text-sm mt-1 ${theme.mutedAccentText}`}>
          Enjoy your day, {selectedBatch}!
        </p>
      </div>
    </div>
  );
};
