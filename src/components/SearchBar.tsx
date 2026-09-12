import React from 'react';
import { Search, X, Layers } from 'lucide-react';
import { TEACHERS } from '../data/defaultSchedule';
import { BatchId } from '../types';
import { getBatchTheme } from '../utils/themeUtils';
import { getCourseInfo } from '../data/courses';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchAllBatches: boolean;
  onToggleSearchAllBatches: () => void;
  activeFilterTeacher: string | null;
  onSelectFilterTeacher: (initial: string | null) => void;
  activeFilterCourse: string | null;
  onSelectFilterCourse: (course: string | null) => void;
  resultsCount?: number;
  selectedBatch: BatchId;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  searchAllBatches,
  onToggleSearchAllBatches,
  activeFilterTeacher,
  onSelectFilterTeacher,
  activeFilterCourse,
  onSelectFilterCourse,
  resultsCount,
  selectedBatch,
}) => {
  const theme = getBatchTheme(selectedBatch);
  const commonCourses = ['DS', 'Math I', 'CAO', 'English II'];
  const hasAnyFilter = searchQuery.trim().length > 0 || activeFilterTeacher !== null || activeFilterCourse !== null;

  const handleClearAll = () => {
    onSearchChange('');
    onSelectFilterTeacher(null);
    onSelectFilterCourse(null);
  };

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-4 space-y-3 shadow-xs dark:shadow-none`}>
      {/* Input box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            id="routine-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by teacher initial (MH, TA...), room, or subject..."
            className={`w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${theme.focusRing}`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Toggle search all batches */}
        <button
          onClick={onToggleSearchAllBatches}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            searchAllBatches
              ? `${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`
              : 'bg-slate-50 dark:bg-black text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 ${theme.iconColor}`} />
          <span>All Batches</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              searchAllBatches ? theme.batchPillDot : 'bg-slate-300 dark:bg-zinc-600'
            }`}
          />
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 dark:text-zinc-400 text-[11px] mr-1 font-medium">
          Quick filters:
        </span>

        {TEACHERS.map((t) => {
          const isSelected = activeFilterTeacher === t.initial;
          return (
            <button
              key={t.initial}
              onClick={() => onSelectFilterTeacher(isSelected ? null : t.initial)}
              title={`${t.fullName} (${t.initial})`}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border transition-all cursor-pointer ${
                isSelected
                  ? `${theme.actionBtnBg} text-white ${theme.borderColor}`
                  : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.initial}
            </button>
          );
        })}

        <span className="text-slate-300 dark:text-zinc-700 mx-1">|</span>

        {commonCourses.map((c) => {
          const isSelected = activeFilterCourse === c;
          const courseInfo = getCourseInfo(c);
          return (
            <button
              key={c}
              onClick={() => onSelectFilterCourse(isSelected ? null : c)}
              title={`${c}: ${courseInfo.fullName}`}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                isSelected
                  ? `${theme.actionBtnBg} text-white ${theme.borderColor}`
                  : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c}
            </button>
          );
        })}

        {hasAnyFilter && (
          <button
            onClick={handleClearAll}
            className="ml-auto text-[11px] text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {hasAnyFilter && resultsCount !== undefined && (
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
          Showing <span className={`font-bold ${theme.headingText}`}>{resultsCount}</span> matching slots
          {searchAllBatches ? ' across 25A, 25B, and 25C' : ''}
        </div>
      )}
    </div>
  );
};
