import { BatchId } from '../types';

export interface BatchTheme {
  name: string;
  // Core colors
  primary: 'blue' | 'emerald' | 'orange';
  
  // Brand / Header
  brandBg: string;
  brandText: string;
  brandShadow: string;
  brandBorder: string;
  
  // Banner
  bannerBorder: string;
  bannerTagText: string;
  bannerBgTint: string;
  
  // Batch Pill
  batchPillActive: string;
  batchPillDot: string;
  subSectionActive: string;
  
  // Typography accents for light mode & dark mode
  headingText: string;
  accentText: string;
  mutedAccentText: string;
  iconColor: string;
  
  // Badges & Chips
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  
  // Active Tab & Buttons
  activeTabStyle: string;
  actionBtnBg: string;
  actionBtnHover: string;
  
  // Borders & Rings
  ringColor: string;
  focusRing: string;
  borderColor: string;
  cardHighlightBorder: string;
}

export const BATCH_THEMES: Record<BatchId, BatchTheme> = {
  '25A': {
    name: 'Blue',
    primary: 'blue',
    brandBg: 'bg-blue-600',
    brandText: 'text-blue-700 dark:text-blue-400',
    brandShadow: 'shadow-blue-600/20',
    brandBorder: 'border-blue-200 dark:border-blue-900/50',
    
    bannerBorder: 'border-blue-200 dark:border-blue-950/80',
    bannerTagText: 'text-blue-600 dark:text-blue-400',
    bannerBgTint: 'bg-blue-50/20 dark:bg-blue-950/10',
    
    batchPillActive: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-500',
    batchPillDot: 'bg-blue-500',
    subSectionActive: 'bg-blue-700 text-white dark:bg-blue-600 border-blue-600 dark:border-blue-500',
    
    headingText: 'text-blue-950 dark:text-white',
    accentText: 'text-blue-700 dark:text-blue-400',
    mutedAccentText: 'text-blue-600/80 dark:text-blue-300/80',
    iconColor: 'text-blue-600 dark:text-blue-400',
    
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeBorder: 'border-blue-200 dark:border-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    
    activeTabStyle: 'bg-blue-600 text-white shadow-sm shadow-blue-600/30',
    actionBtnBg: 'bg-blue-600',
    actionBtnHover: 'hover:bg-blue-500',
    
    ringColor: 'ring-blue-500',
    focusRing: 'focus:ring-blue-500',
    borderColor: 'border-blue-100 dark:border-blue-950/60',
    cardHighlightBorder: 'border-blue-400/80 dark:border-blue-500/60',
  },
  '25B': {
    name: 'Green',
    primary: 'emerald',
    brandBg: 'bg-emerald-600',
    brandText: 'text-emerald-700 dark:text-emerald-400',
    brandShadow: 'shadow-emerald-600/20',
    brandBorder: 'border-emerald-200 dark:border-emerald-900/50',
    
    bannerBorder: 'border-emerald-200 dark:border-emerald-950/80',
    bannerTagText: 'text-emerald-600 dark:text-emerald-400',
    bannerBgTint: 'bg-emerald-50/20 dark:bg-emerald-950/10',
    
    batchPillActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-500',
    batchPillDot: 'bg-emerald-500',
    subSectionActive: 'bg-emerald-700 text-white dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500',
    
    headingText: 'text-emerald-950 dark:text-white',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    mutedAccentText: 'text-emerald-600/80 dark:text-emerald-300/80',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeBorder: 'border-emerald-200 dark:border-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    
    activeTabStyle: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30',
    actionBtnBg: 'bg-emerald-600',
    actionBtnHover: 'hover:bg-emerald-500',
    
    ringColor: 'ring-emerald-500',
    focusRing: 'focus:ring-emerald-500',
    borderColor: 'border-emerald-100 dark:border-emerald-950/60',
    cardHighlightBorder: 'border-emerald-400/80 dark:border-emerald-500/60',
  },
  '25C': {
    name: 'Orange',
    primary: 'orange',
    brandBg: 'bg-orange-600',
    brandText: 'text-orange-700 dark:text-orange-400',
    brandShadow: 'shadow-orange-600/20',
    brandBorder: 'border-orange-200 dark:border-orange-900/50',
    
    bannerBorder: 'border-orange-200 dark:border-orange-950/80',
    bannerTagText: 'text-orange-600 dark:text-orange-400',
    bannerBgTint: 'bg-orange-50/20 dark:bg-orange-950/10',
    
    batchPillActive: 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-500',
    batchPillDot: 'bg-orange-500',
    subSectionActive: 'bg-orange-700 text-white dark:bg-orange-600 border-orange-600 dark:border-orange-500',
    
    headingText: 'text-orange-950 dark:text-white',
    accentText: 'text-orange-700 dark:text-orange-400',
    mutedAccentText: 'text-orange-600/80 dark:text-orange-300/80',
    iconColor: 'text-orange-600 dark:text-orange-400',
    
    badgeBg: 'bg-orange-50 dark:bg-orange-950/50',
    badgeBorder: 'border-orange-200 dark:border-orange-900/60',
    badgeText: 'text-orange-700 dark:text-orange-300',
    
    activeTabStyle: 'bg-orange-600 text-white shadow-sm shadow-orange-600/30',
    actionBtnBg: 'bg-orange-600',
    actionBtnHover: 'hover:bg-orange-500',
    
    ringColor: 'ring-orange-500',
    focusRing: 'focus:ring-orange-500',
    borderColor: 'border-orange-100 dark:border-orange-950/60',
    cardHighlightBorder: 'border-orange-400/80 dark:border-orange-500/60',
  },
};

export function getBatchTheme(batch: BatchId): BatchTheme {
  return BATCH_THEMES[batch] || BATCH_THEMES['25A'];
}
