import React, { useState } from 'react';
import { BatchId, SubSection } from '../types';
import { getBatchTheme } from '../utils/themeUtils';
import { Bookmark, Share2, Check } from 'lucide-react';

interface BatchSelectorProps {
  selectedBatch: BatchId;
  onSelectBatch: (batch: BatchId) => void;
  selectedSubSection: SubSection;
  onSelectSubSection: (sub: SubSection) => void;
  pinnedBatch?: BatchId | null;
  onTogglePinBatch?: (batch: BatchId) => void;
}

export const BatchSelector: React.FC<BatchSelectorProps> = ({
  selectedBatch,
  onSelectBatch,
  selectedSubSection,
  onSelectSubSection,
  pinnedBatch,
  onTogglePinBatch,
}) => {
  const currentTheme = getBatchTheme(selectedBatch);
  const [copiedLink, setCopiedLink] = useState(false);

  const isCurrentBatchMyDefault = pinnedBatch === selectedBatch;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('batch', selectedBatch);
      if (selectedSubSection !== 'All') {
        url.searchParams.set('sub', selectedSubSection);
      } else {
        url.searchParams.delete('sub');
      }
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  const batches: {
    id: BatchId;
    label: string;
    dotColor: string;
    activeClasses: string;
  }[] = [
    {
      id: '25A',
      label: '25A',
      dotColor: 'bg-blue-500',
      activeClasses: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-500',
    },
    {
      id: '25B',
      label: '25B',
      dotColor: 'bg-emerald-500',
      activeClasses: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-500',
    },
    {
      id: '25C',
      label: '25C',
      dotColor: 'bg-orange-600',
      activeClasses: 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-500',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Top row: Label & My Batch / Course Guide / Share Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold ${currentTheme.accentText} tracking-wider uppercase transition-colors`}>
            BATCH SELECTOR
          </span>
          {pinnedBatch && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              My Batch: {pinnedBatch}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Direct Share Link button */}
          <button
            id="btn-copy-batch-link"
            onClick={handleCopyLink}
            title={`Copy direct link for Batch ${selectedBatch}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 border border-slate-200 dark:border-zinc-800 transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span>Share {selectedBatch}</span>
              </>
            )}
          </button>

          {/* My Batch Default Button */}
          {onTogglePinBatch && (
            <button
              id="btn-my-batch-toggle"
              onClick={() => onTogglePinBatch(selectedBatch)}
              title={
                isCurrentBatchMyDefault
                  ? `Batch ${selectedBatch} is your saved default. Every visit lands here.`
                  : `Save Batch ${selectedBatch} as your default so you always land here when entering the site.`
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                isCurrentBatchMyDefault
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 shadow-xs'
                  : 'bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <Bookmark
                className={`w-3 h-3 transition-transform ${
                  isCurrentBatchMyDefault ? 'fill-current text-amber-500' : 'text-slate-400'
                }`}
              />
              <span>{isCurrentBatchMyDefault ? `My Default (${selectedBatch})` : `Set as My Batch`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Batch Pills */}
      <div className="flex items-center gap-2.5">
        {batches.map(({ id, label, dotColor, activeClasses }) => {
          const isSelected = selectedBatch === id;
          const isMyBatch = pinnedBatch === id;

          return (
            <button
              key={id}
              id={`batch-pill-${id}`}
              onClick={() => onSelectBatch(id)}
              className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? activeClasses
                  : 'bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white shadow-xs'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : dotColor}`}
              />
              <span>{label}</span>

              {/* My Batch Default Bookmark tag */}
              {isMyBatch && (
                <span
                  title="Your saved default batch"
                  className={`inline-flex items-center ${
                    isSelected ? 'text-white/90' : 'text-amber-500 dark:text-amber-400'
                  }`}
                >
                  <Bookmark className="w-2.5 h-2.5 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-section / Lab Group Pills */}
      <div className="flex items-center gap-2">
        <button
          id="sub-full-batch"
          onClick={() => onSelectSubSection('All')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            selectedSubSection === 'All'
              ? currentTheme.subSectionActive
              : 'bg-slate-100 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          Full batch
        </button>

        <button
          id="sub-lab-group-1"
          onClick={() => onSelectSubSection('1')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            selectedSubSection === '1'
              ? currentTheme.subSectionActive
              : 'bg-slate-100 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          {selectedBatch}1 (lab group)
        </button>

        <button
          id="sub-lab-group-2"
          onClick={() => onSelectSubSection('2')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            selectedSubSection === '2'
              ? currentTheme.subSectionActive
              : 'bg-slate-100 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          {selectedBatch}2 (lab group)
        </button>
      </div>
    </div>
  );
};
