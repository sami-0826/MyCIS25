import React from 'react';
import { ViewMode, BatchId } from '../types';
import { ListChecks, Calendar, Search, Users } from 'lucide-react';
import { getBatchTheme } from '../utils/themeUtils';

interface ViewNavTabsProps {
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  selectedBatch: BatchId;
}

export const ViewNavTabs: React.FC<ViewNavTabsProps> = ({
  viewMode,
  onSelectViewMode,
  selectedBatch,
}) => {
  const theme = getBatchTheme(selectedBatch);

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Today', icon: <ListChecks className="w-3.5 h-3.5" /> },
    { id: 'week', label: 'Week', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'teachers', label: 'Teachers', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const isSelected = viewMode === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onSelectViewMode(tab.id)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              isSelected
                ? theme.activeTabStyle
                : `text-slate-500 hover:${theme.accentText} dark:text-zinc-400 dark:hover:text-zinc-100 font-medium`
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
