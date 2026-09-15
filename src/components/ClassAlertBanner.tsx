import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, Clock, MapPin, X, ArrowRight, User } from 'lucide-react';
import { ClassSession } from '../types';
import { formatTo12Hour } from '../utils/timeUtils';
import { getCourseTheme } from '../utils/timeUtils';

export interface ActiveClassAlert {
  classSession: ClassSession;
  minutesUntilStart: number;
  isFirstClassOfDay: boolean;
  isTest?: boolean;
}

interface ClassAlertBannerProps {
  alert: ActiveClassAlert | null;
  onDismiss: () => void;
  onSelectCourse?: (courseCode: string) => void;
}

export const ClassAlertBanner: React.FC<ClassAlertBannerProps> = ({
  alert,
  onDismiss,
  onSelectCourse,
}) => {
  if (!alert) return null;

  const { classSession, minutesUntilStart, isFirstClassOfDay, isTest } = alert;
  const courseTheme = getCourseTheme(classSession.courseCode);

  return (
    <AnimatePresence>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          id="class-alert-banner"
          className="p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl border-2 border-indigo-500/40 dark:border-indigo-400/40 text-slate-900 dark:text-zinc-100 relative overflow-hidden"
        >
          {/* Subtle glowing accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500 text-white shadow-xs">
                    {isTest ? 'TEST NOTIFICATION' : `STARTING IN ${minutesUntilStart}m`}
                  </span>
                  {isFirstClassOfDay && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      First Class of Day
                    </span>
                  )}
                  {classSession.subSection !== 'All' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {classSession.batch}{classSession.subSection}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {classSession.courseName}{' '}
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">
                    ({classSession.courseCode})
                  </span>
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-300 pt-0.5 flex-wrap">
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Starts {formatTo12Hour(classSession.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{classSession.room}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-slate-500 dark:text-zinc-400">
                    <User className="w-3.5 h-3.5" />
                    <span>{classSession.teacherName}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onDismiss}
              id="btn-dismiss-class-alert"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {onSelectCourse && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-end">
              <button
                onClick={() => {
                  onSelectCourse(classSession.courseCode);
                  onDismiss();
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Course Guide</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
