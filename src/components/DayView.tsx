import React from 'react';
import { ClassSession, DayOfWeek, BatchId } from '../types';
import { DAYS_OF_WEEK } from '../data/defaultSchedule';
import { formatTo12Hour } from '../utils/timeUtils';
import { Clock, MapPin, User, Edit3, HelpCircle } from 'lucide-react';
import { getBatchTheme } from '../utils/themeUtils';
import { getCourseInfo } from '../data/courses';

interface DayViewProps {
  classes: ClassSession[];
  activeDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  todayDay: DayOfWeek;
  activeClassId?: string | null;
  onEditClass?: (session: ClassSession) => void;
  selectedBatch: BatchId;
  onSelectCourse?: (courseCode: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  classes,
  activeDay,
  onSelectDay,
  todayDay,
  activeClassId,
  onEditClass,
  selectedBatch,
  onSelectCourse,
}) => {
  const theme = getBatchTheme(selectedBatch);
  const dayClasses = classes
    .filter((c) => c.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-3">
      {/* Day selector row */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = activeDay === day;
          const isToday = todayDay === day;
          const count = classes.filter((c) => c.day === day).length;

          return (
            <button
              key={day}
              id={`btn-day-${day}`}
              onClick={() => onSelectDay(day)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? `${theme.actionBtnBg} text-white shadow-xs ring-1 ${theme.ringColor}`
                  : 'bg-white text-slate-600 border border-slate-200 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-zinc-500'} font-mono`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {dayClasses.length === 0 ? (
        <div className={`rounded-2xl border ${theme.borderColor} bg-white dark:bg-zinc-950 p-12 sm:p-14 text-center shadow-sm dark:shadow-none`}>
          <h3 className={`text-lg sm:text-xl font-bold ${theme.headingText}`}>
            No classes on {activeDay}
          </h3>
          <p className={`text-sm mt-1.5 ${theme.mutedAccentText}`}>
            Enjoy the day off, {selectedBatch} — check the Week view for the rest.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {dayClasses.map((session, index) => {
            const isOngoing = activeClassId === session.id;
            const courseMeta = getCourseInfo(session.courseCode);

            return (
              <div
                key={session.id || index}
                className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs dark:shadow-none ${
                  isOngoing
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                    : `border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 hover:border-slate-300 dark:hover:border-zinc-700`
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  {/* Meta Pills: Time, Course Code, Type, SubSection, Live */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <Clock className={`w-3 h-3 ${theme.iconColor}`} />
                      {formatTo12Hour(session.startTime)} – {formatTo12Hour(session.endTime)}
                    </span>

                    {/* Course abbreviation pill with full name tooltip and click-to-guide */}
                    <button
                      onClick={() => onSelectCourse && onSelectCourse(session.courseCode)}
                      title={`${session.courseCode} stands for ${courseMeta.fullName}. Tap to view full course details.`}
                      className={`text-xs font-mono font-bold ${theme.badgeText} px-2 py-0.5 rounded-md ${theme.badgeBg} border ${theme.badgeBorder} flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      <span>{session.courseCode}</span>
                      <HelpCircle className="w-2.5 h-2.5 opacity-60" />
                    </button>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        session.type === 'Lab'
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {session.type}
                    </span>

                    {session.subSection !== 'All' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                        {session.batch}{session.subSection}
                      </span>
                    )}

                    {isOngoing && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                        Live Now
                      </span>
                    )}
                  </div>

                  {/* Prominent Full Course Name */}
                  <h4
                    onClick={() => onSelectCourse && onSelectCourse(session.courseCode)}
                    title={`Tap to view syllabus and details for ${courseMeta.fullName}`}
                    className={`text-base font-bold ${theme.headingText} hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer`}
                  >
                    {session.courseName}
                  </h4>

                  {/* Room & Teacher Details with Initial */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-zinc-400 pt-0.5">
                    <div className="flex items-center gap-1 text-slate-900 dark:text-zinc-200 font-medium">
                      <MapPin className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                      <span>{session.room}</span>
                    </div>

                    <div
                      className="flex items-center gap-1.5"
                      title={`${session.teacherName} (Teacher initial: ${session.teacherInitial})`}
                    >
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                      <span>{session.teacherName}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                        {session.teacherInitial}
                      </span>
                    </div>
                  </div>

                  {session.notes && (
                    <p className="text-xs text-slate-500 dark:text-zinc-500 italic">
                      Note: {session.notes}
                    </p>
                  )}
                </div>

                {onEditClass && (
                  <button
                    onClick={() => onEditClass(session)}
                    className="self-start sm:self-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit session"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
