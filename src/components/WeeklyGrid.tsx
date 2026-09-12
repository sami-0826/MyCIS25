import React from 'react';
import { ClassSession, BatchId, DayOfWeek, SubSection } from '../types';
import { DAYS_OF_WEEK } from '../data/defaultSchedule';
import { formatTo12Hour } from '../utils/timeUtils';
import { Clock, MapPin, User, Info } from 'lucide-react';
import { getBatchTheme } from '../utils/themeUtils';
import { getCourseInfo } from '../data/courses';

interface WeeklyGridProps {
  classes: ClassSession[];
  selectedBatch: BatchId;
  selectedSubSection: SubSection;
  todayDay: DayOfWeek;
  activeClassId?: string | null;
  onEditClass?: (session: ClassSession) => void;
  onSelectCourse?: (courseCode: string) => void;
}

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  classes,
  selectedBatch,
  selectedSubSection,
  todayDay,
  activeClassId,
  onEditClass,
  onSelectCourse,
}) => {
  const theme = getBatchTheme(selectedBatch);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-bold ${theme.headingText}`}>
          Weekly Schedule Overview ({selectedBatch}
          {selectedSubSection !== 'All' ? ` · Group ${selectedSubSection}` : ''})
        </h3>
        <span className="text-xs text-slate-400 dark:text-zinc-500">
          Saturday – Thursday
        </span>
      </div>

      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day) => {
          const isToday = todayDay === day;
          const dayClasses = classes
            .filter((c) => c.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day}
              className={`rounded-2xl border p-3.5 sm:p-4 transition-colors ${
                isToday
                  ? `${theme.cardHighlightBorder} bg-white dark:bg-zinc-950 shadow-xs ring-1 ${theme.ringColor}`
                  : 'border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isToday ? theme.brandText : 'text-slate-900 dark:text-zinc-100'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                  {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              {/* Day's Classes */}
              {dayClasses.length === 0 ? (
                <div className="py-3 text-center text-xs text-slate-400 dark:text-zinc-500 italic">
                  No classes scheduled
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dayClasses.map((session) => {
                    const isOngoing = activeClassId === session.id;
                    const courseMeta = getCourseInfo(session.courseCode);

                    return (
                      <div
                        key={session.id}
                        onClick={() => {
                          if (onSelectCourse) {
                            onSelectCourse(session.courseCode);
                          } else if (onEditClass) {
                            onEditClass(session);
                          }
                        }}
                        title={`${session.courseCode}: ${courseMeta.fullName} · Tap to view full course info`}
                        className={`rounded-xl border p-3 transition-all cursor-pointer group ${
                          isOngoing
                            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10 ring-1 ring-emerald-500/30'
                            : 'border-slate-200 dark:border-zinc-800/80 bg-slate-50/80 dark:bg-black hover:border-slate-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                          <span className={`text-xs font-mono font-bold ${theme.accentText} flex items-center gap-1`}>
                            <Clock className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                            {formatTo12Hour(session.startTime)} – {formatTo12Hour(session.endTime)}
                          </span>

                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
                            >
                              {session.courseCode}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                session.type === 'Lab'
                                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                              }`}
                            >
                              {session.type}
                            </span>
                          </div>
                        </div>

                        {/* Full Course Name */}
                        <div className={`text-sm font-bold ${theme.headingText} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors`}>
                          {session.courseName}
                        </div>

                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400 mt-2 pt-1.5 border-t border-slate-100 dark:border-zinc-800/80">
                          <div className="flex items-center gap-1 truncate text-slate-700 dark:text-zinc-300">
                            <MapPin className={`w-3 h-3 ${theme.iconColor} flex-shrink-0`} />
                            <span className="truncate">{session.room}</span>
                          </div>
                          <div
                            className="flex items-center gap-1 text-slate-600 dark:text-zinc-400 truncate max-w-[55%]"
                            title={`${session.teacherName} (${session.teacherInitial})`}
                          >
                            <User className="w-3 h-3 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                            <span className="truncate">{session.teacherName}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
