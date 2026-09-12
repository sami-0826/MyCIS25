/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CourseDefinition, getCourseInfo, COURSE_DEFINITIONS } from '../data/courses';
import { TEACHERS } from '../data/defaultSchedule';
import { X, BookOpen, Clock, Users, GraduationCap, CheckCircle2 } from 'lucide-react';
import { BatchId } from '../types';
import { getBatchTheme } from '../utils/themeUtils';

interface CourseDetailModalProps {
  courseCode: string | null;
  onClose: () => void;
  selectedBatch: BatchId;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  courseCode,
  onClose,
  selectedBatch,
}) => {
  if (!courseCode) return null;

  const course: CourseDefinition = getCourseInfo(courseCode);
  const theme = getBatchTheme(selectedBatch);

  // Find faculty teaching this course
  const faculty = TEACHERS.filter((t) =>
    course.instructors.includes(t.initial) ||
    t.courses.some((c) => c.toLowerCase().includes(course.shortName.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-zinc-900 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                {course.code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                {course.type}
              </span>
              {course.creditHours && (
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                  {course.creditHours}
                </span>
              )}
            </div>
            <h3 className={`text-xl font-bold ${theme.headingText} leading-snug`}>
              {course.fullName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Overview / Description */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Overview</span>
            </div>
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm">
              {course.description}
            </p>
          </div>

          {/* Key Topics */}
          {course.topics && course.topics.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Key Syllabus Topics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {course.topics.map((t, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Taking This Course */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Assigned Instructors</span>
            </div>
            <div className="space-y-2">
              {faculty.length > 0 ? (
                faculty.map((f) => (
                  <div
                    key={f.initial}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                        <span>{f.fullName}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold">
                          {f.initial}
                        </span>
                      </div>
                      {f.designation && (
                        <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                          {f.designation}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 dark:text-zinc-400 italic">
                  Instructors assigned per department routine schedule
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Batch-25 Semester Curriculum
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${theme.brandBg} text-white hover:opacity-90 transition-opacity cursor-pointer`}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
