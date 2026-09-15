import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  Calendar,
  Bell,
  Users,
  Search,
  Bookmark,
  Smartphone,
  CheckCircle2,
  X,
  Lightbulb,
  Compass,
  ArrowRight,
  ExternalLink,
  Volume2,
  Share2,
  FileDown,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { BatchId } from '../types';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBatch: BatchId;
  onOpenNotifications: () => void;
}

type GuideSection = 'best-way' | 'all-features' | 'tips' | 'faq';

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  selectedBatch,
  onOpenNotifications,
}) => {
  const [activeSection, setActiveSection] = useState<GuideSection>('best-way');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const features = [
    {
      id: 'realtime-status',
      title: 'Live Class Status & Next Class Countdown',
      category: 'Schedule',
      icon: Clock,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description:
        'Calculates real-time campus clock status, showing your ongoing class with time remaining, or countdown to the next upcoming lecture with room and teacher tags.',
    },
    {
      id: 'batch-switch',
      title: 'Batch Switching & Preference Pinning',
      category: 'Personalization',
      icon: Bookmark,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      description:
        'Switch seamlessly between Batch 25A, 25B, and 25C. Your selected batch is saved automatically as "My Batch" and remembered whenever you return.',
    },
    {
      id: 'subsection-filtering',
      title: 'Sub-section (Lab Group) Filtering',
      category: 'Schedule',
      icon: Layers,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      description:
        'Filter routine by Sub-section 1, Sub-section 2, or All. Prevents clutter during split laboratory and practical computing sessions.',
    },
    {
      id: 'class-notifications',
      title: 'Class Alerts & Browser Notifications',
      category: 'Alerts',
      icon: Bell,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      description:
        'Get timely alerts 5, 10, 15, or 20 minutes before class starts. Includes browser system notifications, in-app alert banner, and audio chime.',
    },
    {
      id: 'dual-views',
      title: 'Dual Layouts: Day View & Weekly Grid',
      category: 'Views',
      icon: Calendar,
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
      description:
        'Choose between a focused Day-by-Day timeline card view or the comprehensive Weekly Grid timetable matrix showing the full academic week.',
    },
    {
      id: 'search-filter',
      title: 'Instant Search & Course Filter',
      category: 'Navigation',
      icon: Search,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      description:
        'Quickly locate classes by course code (e.g., CIS-112), subject title, room number (e.g., Room 602), or teacher initials across the whole routine.',
    },
    {
      id: 'teacher-directory',
      title: 'Faculty & Teacher Directory',
      category: 'Directory',
      icon: Users,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
      description:
        'Dedicated teacher profiles showing initials, designations, faculty rooms, email addresses, and courses taught for quick student-teacher communication.',
    },
    {
      id: 'course-modal',
      title: 'Course Syllabus & Details Modal',
      category: 'Curriculum',
      icon: BookOpen,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      description:
        'Click any course card to inspect credit hours, theory vs lab classification, prerequisites, weekly hours, and instructors.',
    },
    {
      id: 'calendar-export',
      title: 'Calendar Export (.ICS)',
      category: 'Productivity',
      icon: FileDown,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      description:
        'Export your weekly class schedule directly into Google Calendar, Apple Calendar, or Microsoft Outlook with one click.',
    },
    {
      id: 'theme-mode',
      title: 'Persistent Dark & Light Themes',
      category: 'Design',
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      description:
        'Comfortable high-contrast dark theme optimized for low-light halls and a clean crisp light theme for bright outdoor campus viewing.',
    },
  ];

  const filteredFeatures = features.filter((feat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      feat.title.toLowerCase().includes(q) ||
      feat.description.toLowerCase().includes(q) ||
      feat.category.toLowerCase().includes(q)
    );
  });

  const faqs = [
    {
      q: 'How does MyCIS 25 know which class is happening right now?',
      a: 'The system computes current time and day dynamically based on local clock and university class timings, updating every second to reflect active periods and upcoming countdowns.',
    },
    {
      q: 'Will notifications work if I close the browser tab?',
      a: 'If you allow browser notifications and keep the tab open or pinned in the background, notifications trigger automatically before each class. On mobile, adding the page to your home screen keeps it accessible quickly.',
    },
    {
      q: 'How do I share my batch schedule with a classmate?',
      a: 'You can simply share the URL with the batch parameter appended (e.g. ?batch=25B). When your classmate opens the link, it automatically switches to Batch 25B.',
    },
    {
      q: 'Can I test notifications to make sure sound and popups work?',
      a: 'Yes! Click the Bell icon in the header, then click the "Trigger Test Alert" button to hear the chime and preview the in-app alert banner immediately.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="user-guide-modal-container"
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden text-slate-800 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  MyCIS 25 User Guide
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                  Feature Manual
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Best ways to use, routine navigation, and full feature catalog for CIS Batch-25
              </p>
            </div>
          </div>
          <button
            id="btn-close-user-guide"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close user guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-100 dark:border-zinc-800 overflow-x-auto scrollbar-none bg-white dark:bg-zinc-900">
          <button
            onClick={() => setActiveSection('best-way')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'best-way'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Best Way to Use</span>
          </button>

          <button
            onClick={() => setActiveSection('all-features')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'all-features'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Features ({features.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('tips')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'tips'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pro-Tips & Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveSection('faq')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'faq'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: BEST WAY TO USE */}
          {activeSection === 'best-way' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                      Recommended 4-Step Routine Setup
                    </h3>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      Follow these simple steps once to have a reliable, zero-effort daily class schedule.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNotifications();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Setup Notifications</span>
                </button>
              </div>

              {/* Step by step cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        STEP 1
                      </span>
                      <Bookmark className="w-4 h-4 text-amber-500" />
                    </div>
                    <h4 className="text-sm font-bold mb-1.5 text-slate-900 dark:text-white">
                      Select & Pin Your Batch
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Tap your batch at the top (<strong>Batch 25A</strong>, <strong>25B</strong>, or{' '}
                      <strong>25C</strong>). The app instantly pins it with a bookmark indicator so you
                      never need to reselect it again.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center text-[11px] text-slate-500 dark:text-zinc-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-1.5">Currently active:</span>
                    <span>Batch {selectedBatch}</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        STEP 2
                      </span>
                      <Bell className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold mb-1.5 text-slate-900 dark:text-white">
                      Turn On Class Notifications
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Click the <strong>Bell icon</strong> in the header to activate class reminders. Set your preferred alert time (default is 15 minutes before class) to get room numbers and alerts before lectures begin.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Includes pleasant sound chime & room alert</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        STEP 3
                      </span>
                      <Clock className="w-4 h-4 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-bold mb-1.5 text-slate-900 dark:text-white">
                      Rely on Live Status & Next Class
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      While on campus, glancing at the top banner instantly shows whether a class is in progress (with remaining minutes) or counts down to the next upcoming room location.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                    <span>Zero manual math needed for class times</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        STEP 4
                      </span>
                      <Users className="w-4 h-4 text-purple-500" />
                    </div>
                    <h4 className="text-sm font-bold mb-1.5 text-slate-900 dark:text-white">
                      Inspect Syllabus & Faculty
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Click any class card to open the Course Inspector with syllabus details, credit breakdown, and assigned faculty contacts. Scroll to the bottom to consult teacher office rooms and emails.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    <span>Direct links to email professors</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ALL FEATURES */}
          {activeSection === 'all-features' && (
            <div className="space-y-4">
              {/* Search Bar for Features */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search features (e.g., countdown, notifications, grid, teachers)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.id}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex items-start gap-3.5"
                    >
                      <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${feat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {feat.title}
                          </h4>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 shrink-0">
                            {feat.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredFeatures.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No features found matching "{searchQuery}".
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: PRO-TIPS & SHORTCUTS */}
          {activeSection === 'tips' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Campus Efficiency Tips
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Speed tricks and shortcuts designed for daily CIS students on phones or laptops.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Bookmark className="w-4 h-4" />
                    <h5 className="text-xs font-bold">Deep Linking Your Batch</h5>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Bookmark your browser with{' '}
                    <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-900 dark:text-zinc-200 font-mono text-[11px]">
                      ?batch=25B
                    </code>{' '}
                    or{' '}
                    <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-900 dark:text-zinc-200 font-mono text-[11px]">
                      ?sub=1
                    </code>{' '}
                    to always open directly into your batch and laboratory group.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                    <h5 className="text-xs font-bold">Add to Phone Home Screen</h5>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    In Safari (iOS) tap <em>Share &rarr; Add to Home Screen</em>, or in Chrome (Android) tap the menu &rarr; <em>Install App / Add to Home screen</em>. It launches instantly like a native mobile app!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Volume2 className="w-4 h-4" />
                    <h5 className="text-xs font-bold">Auditory Chime Reminders</h5>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Keep the notification chime enabled in Notification Settings. A soft dual-tone sine chime alerts you even if your phone screen is faced away on your desk.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Calendar className="w-4 h-4" />
                    <h5 className="text-xs font-bold">Sync with Google / Apple Calendar</h5>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Use the <strong>Weekly Grid</strong> view to view your whole week at a glance, and use the calendar download to sync repeat appointments into your phone's main calendar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: FAQ */}
          {activeSection === 'faq' && (
            <div className="space-y-3">
              {faqs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2"
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 pl-5.5 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>MyCIS 25 &bull; Built for Department of CIS (Batch-25)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenNotifications();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Configure Alerts</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
