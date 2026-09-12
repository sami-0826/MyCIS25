import React from 'react';
import { TEACHERS } from '../data/defaultSchedule';
import { X, UserCheck, BookOpen, Search } from 'lucide-react';

interface TeacherDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeacherForSearch: (initial: string) => void;
}

export const TeacherDirectoryModal: React.FC<TeacherDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectTeacherForSearch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CIS Batch-25 Faculty Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Teacher initials reference & assigned courses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Teachers */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {TEACHERS.map((teacher) => (
            <div
              key={teacher.initial}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {teacher.initial}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {teacher.fullName}
                  </h3>
                </div>
                {teacher.designation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {teacher.designation}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <BookOpen className="w-3 h-3 text-indigo-500" />
                  <span className="text-[11px] font-medium">
                    {teacher.courses.join(', ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTeacherForSearch(teacher.initial);
                  onClose();
                }}
                className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3 h-3" />
                <span>Filter Classes</span>
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          Click "Filter Classes" to view all schedule slots assigned to that instructor.
        </div>
      </div>
    </div>
  );
};
