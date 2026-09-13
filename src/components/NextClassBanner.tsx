import React from 'react';
import { LiveClassStatus, BatchId, DayOfWeek } from '../types';
import { formatTo12Hour, formatDurationMinutes } from '../utils/timeUtils';
import { Sparkles, Radio, Clock, MapPin, User } from 'lucide-react';
import { getBatchTheme } from '../utils/themeUtils';
import { motion } from 'motion/react';

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
        <div className="mt-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex-wrap">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>CLASS IN PROGRESS</span>
            <motion.span
              animate={{
                y: [0, -3, 0],
                rotate: [-4, 4, -4],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block text-base leading-none select-none cursor-default"
              role="img"
              aria-label="Books stack"
              title="Studying / Lecture"
            >
              📚
            </motion.span>
            <motion.span
              animate={{
                rotate: [0, -12, 0, -12, 0],
                x: [0, 2, 0, 2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: 'easeInOut',
              }}
              className="inline-block text-base leading-none select-none cursor-default"
              role="img"
              aria-label="Writing notebook"
              title="Taking notes"
            >
              ✍️
            </motion.span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
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
            </div>

            {/* Floating animated study icon on larger screens */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">
              <motion.span
                animate={{
                  y: [0, -2.5, 0],
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-2xl select-none"
                role="img"
                aria-label="Lecture in progress"
              >
                📚
              </motion.span>
            </div>
          </div>

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
      <div className="mt-3 relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 flex-wrap">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
          </motion.div>
          <span>YOU'RE FREE</span>
          <motion.span
            animate={{
              rotate: [0, -18, 18, -12, 12, 0],
              scale: [1, 1.25, 1.25, 1.1, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: 'easeInOut',
            }}
            className="inline-block origin-bottom text-base leading-none select-none cursor-default"
            role="img"
            aria-label="Party popper"
            title="Party celebration"
          >
            🎉
          </motion.span>
          <motion.span
            animate={{
              y: [0, -3.5, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 0.3,
              ease: 'easeInOut',
            }}
            className="inline-block text-base leading-none select-none cursor-default"
            role="img"
            aria-label="Partying face"
            title="Partying face"
          >
            🥳
          </motion.span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.headingText} mt-1 flex items-center gap-2 flex-wrap`}>
              <span>No more classes today</span>
              <motion.span
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="inline-block text-xl sm:text-2xl select-none cursor-default"
                role="img"
                aria-label="Relaxing with sunglasses"
                title="Chill time"
              >
                😎
              </motion.span>
            </h2>

            <p className={`text-sm mt-1 ${theme.mutedAccentText}`}>
              Enjoy your day, {selectedBatch}! Rest up or catch up on projects.
            </p>
          </div>

          {/* Floating animated chill badge on larger screens */}
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 shrink-0">
            <motion.span
              animate={{
                y: [0, -3, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-2xl select-none"
              role="img"
              aria-label="Relaxing beach vibe"
            >
              🏖️
            </motion.span>
          </div>
        </div>
      </div>

      {/* Subtle celebratory ambient glow */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
