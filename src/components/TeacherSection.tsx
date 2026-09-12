import React, { useState, useMemo } from 'react';
import { TEACHERS } from '../data/defaultSchedule';
import { BookOpen, Search, UserCheck, Calendar, Layers } from 'lucide-react';
import { BatchId, ClassSession, TeacherInfo } from '../types';
import { getBatchTheme } from '../utils/themeUtils';

interface TeacherSectionProps {
  onSelectTeacher: (initial: string) => void;
  activeTeacher?: string | null;
  selectedBatch: BatchId;
  schedule?: ClassSession[];
}

export const TeacherSection: React.FC<TeacherSectionProps> = ({
  onSelectTeacher,
  activeTeacher,
  selectedBatch,
  schedule = [],
}) => {
  const theme = getBatchTheme(selectedBatch);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Gather all teachers taking Batch-25 classes from the schedule & default directory
  const batch25Teachers = useMemo(() => {
    // Collect stats from current schedule for Batch 25 classes
    const batch25Sessions = schedule.filter((s) => s.batch.startsWith('25'));
    
    // Map initial -> { batches: Set, count: number, courses: Set, name: string }
    const statsMap: Record<
      string,
      { batches: Set<string>; count: number; courses: Set<string>; name?: string }
    > = {};

    batch25Sessions.forEach((s) => {
      const init = s.teacherInitial.toUpperCase().trim();
      if (!init) return;
      if (!statsMap[init]) {
        statsMap[init] = {
          batches: new Set(),
          count: 0,
          courses: new Set(),
          name: s.teacherName,
        };
      }
      statsMap[init].batches.add(s.batch);
      statsMap[init].courses.add(s.courseCode);
      statsMap[init].count += 1;
    });

    // Start with default TEACHERS who teach Batch 25
    const list: (TeacherInfo & {
      teachingBatches: string[];
      classCount: number;
    })[] = [];

    const processedInitials = new Set<string>();

    TEACHERS.forEach((t) => {
      const init = t.initial.toUpperCase();
      const stats = statsMap[init];
      processedInitials.add(init);

      list.push({
        ...t,
        teachingBatches: stats ? Array.from(stats.batches).sort() : [],
        classCount: stats ? stats.count : 0,
      });
    });

    // Also include any dynamically added teachers in Batch 25 schedule who are not in TEACHERS
    Object.entries(statsMap).forEach(([init, data]) => {
      if (!processedInitials.has(init)) {
        list.push({
          initial: init,
          fullName: data.name || init,
          designation: 'Faculty Member, CIS Batch-25',
          courses: Array.from(data.courses),
          teachingBatches: Array.from(data.batches).sort(),
          classCount: data.count,
        });
      }
    });

    return list;
  }, [schedule]);

  // 2. Filter by search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return batch25Teachers;
    const q = searchQuery.toLowerCase().trim();
    return batch25Teachers.filter((t) => {
      return (
        t.fullName.toLowerCase().includes(q) ||
        t.initial.toLowerCase().includes(q) ||
        t.courses.some((c) => c.toLowerCase().includes(q)) ||
        (t.designation && t.designation.toLowerCase().includes(q)) ||
        t.teachingBatches.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [batch25Teachers, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-base sm:text-lg font-bold ${theme.headingText}`}>
              Batch-25 Faculty Directory
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
              {batch25Teachers.length} Instructors
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Teachers and course instructors taking classes for Batch 25 (25A, 25B, and 25C).
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty or course..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-zinc-600 shadow-xs"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTeachers.map((teacher) => {
          const isSelected = activeTeacher === teacher.initial;
          return (
            <div
              key={teacher.initial}
              onClick={() => onSelectTeacher(teacher.initial)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? `${theme.cardHighlightBorder} ${theme.bannerBgTint} ring-1 ${theme.ringColor}/30 shadow-sm`
                  : 'border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 shadow-xs dark:shadow-none'
              }`}
            >
              <div className="space-y-2">
                {/* Header row: Initial Badge & Batches */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
                  >
                    {teacher.initial}
                  </span>

                  {isSelected ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${theme.brandBg} text-white`}
                    >
                      <UserCheck className="w-2.5 h-2.5" /> Filtering
                    </span>
                  ) : (
                    teacher.teachingBatches.length > 0 && (
                      <div className="flex items-center gap-1">
                        {teacher.teachingBatches.map((b) => (
                          <span
                            key={b}
                            className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )
                  )}
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${theme.headingText}`}>
                    {teacher.fullName}
                  </h4>
                  {teacher.designation && (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug mt-0.5">
                      {teacher.designation}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom course & schedule frequency summary */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-start gap-1.5 text-slate-600 dark:text-zinc-400">
                  <BookOpen className={`w-3.5 h-3.5 ${theme.iconColor} flex-shrink-0 mt-0.5`} />
                  <span className="leading-snug">{teacher.courses.join(', ')}</span>
                </div>

                {teacher.classCount > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>
                      {teacher.classCount} {teacher.classCount === 1 ? 'class' : 'classes'} / week for Batch 25
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-500">
          No Batch-25 instructors found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};
