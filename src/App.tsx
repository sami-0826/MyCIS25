/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BatchId, SubSection, DayOfWeek, ViewMode } from './types';
import { INITIAL_SCHEDULE, DAYS_OF_WEEK } from './data/defaultSchedule';
import { computeLiveStatus, JS_DAY_MAP } from './utils/timeUtils';
import { Header } from './components/Header';
import { NextClassBanner } from './components/NextClassBanner';
import { BatchSelector } from './components/BatchSelector';
import { ViewNavTabs } from './components/ViewNavTabs';
import { SearchBar } from './components/SearchBar';
import { DayView } from './components/DayView';
import { WeeklyGrid } from './components/WeeklyGrid';
import { TeacherSection } from './components/TeacherSection';
import { CourseDetailModal } from './components/CourseDetailModal';
import { NotificationModal } from './components/NotificationModal';
import { ClassAlertBanner, ActiveClassAlert } from './components/ClassAlertBanner';
import { UserGuideModal } from './components/UserGuideModal';
import {
  loadNotificationSettings,
  saveNotificationSettings,
  NotificationSettings,
  shouldClassTriggerNotification,
  getNotifiedClassIdsToday,
  markClassNotifiedToday,
  playNotificationChime,
  sendBrowserNotification,
} from './utils/notificationUtils';
import { timeStringToMinutes, formatTo12Hour } from './utils/timeUtils';
import { getBatchTheme } from './utils/themeUtils';
import { Users, ArrowRight, Bookmark, Mail, BookOpen } from 'lucide-react';

export default function App() {
  // 1. Persistent Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mycis25_dark_mode');
    if (saved !== null) return saved === 'true';
    return true; // default dark mode
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('mycis25_dark_mode', String(darkMode));
  }, [darkMode]);

  // 2. Schedule Data directly from authoritative schedule
  const schedule = INITIAL_SCHEDULE;

  // 3. Time & Real-time Live Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayDayOfWeek: DayOfWeek = JS_DAY_MAP[currentTime.getDay()] || 'Monday';

  // 4. Batch & SubSection Resolution: "My Batch" Default Preference
  const [pinnedBatch, setPinnedBatch] = useState<BatchId | null>(() => {
    const saved = localStorage.getItem('mycis25_my_batch') || localStorage.getItem('mycis25_pinned_batch');
    if (saved === '25A' || saved === '25B' || saved === '25C') return saved as BatchId;
    return null;
  });

  const [selectedBatch, setSelectedBatch] = useState<BatchId>(() => {
    // 1. Check URL query parameter first: ?batch=25B or ?b=25b
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlBatch = (params.get('batch') || params.get('b'))?.toUpperCase();
      if (urlBatch === '25A' || urlBatch === '25B' || urlBatch === '25C') {
        return urlBatch as BatchId;
      }
      // 2. Check URL hash: #25A, #25B, #25C
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (hash === '25A' || hash === '25B' || hash === '25C') {
        return hash as BatchId;
      }
    }

    // 3. Check student's saved "My Batch" default
    const saved = localStorage.getItem('mycis25_my_batch') || localStorage.getItem('mycis25_pinned_batch');
    if (saved === '25A' || saved === '25B' || saved === '25C') {
      return saved as BatchId;
    }

    // 4. Default fallback for brand new first-time visitor
    return '25A';
  });

  const [selectedSubSection, setSelectedSubSection] = useState<SubSection>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSub = params.get('sub');
      if (urlSub === '1' || urlSub === '2' || urlSub === 'All') {
        return urlSub as SubSection;
      }
    }
    const savedSub = localStorage.getItem('mycis25_my_sub') || localStorage.getItem('mycis25_pinned_sub');
    if (savedSub === '1' || savedSub === '2' || savedSub === 'All') {
      return savedSub as SubSection;
    }
    return 'All';
  });

  // Course Guide & Details Modal
  const [activeCourseModal, setActiveCourseModal] = useState<string | null>(null);

  // Notification Settings, Active In-App Alert, and Modal
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() =>
    loadNotificationSettings()
  );
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [activeClassAlert, setActiveClassAlert] = useState<ActiveClassAlert | null>(null);

  const handleUpdateNotificationSettings = (newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  // Toast feedback for pinning
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Auto-dismiss in-app class alert after 15 seconds
  useEffect(() => {
    if (!activeClassAlert) return;
    const timer = setTimeout(() => {
      setActiveClassAlert(null);
    }, 15000);
    return () => clearTimeout(timer);
  }, [activeClassAlert]);

  const handleSelectBatch = (batch: BatchId) => {
    setSelectedBatch(batch);
    setSelectedSubSection('All');

    // Automatically remember the student's batch choice as "My Batch" default
    setPinnedBatch(batch);
    localStorage.setItem('mycis25_my_batch', batch);
    localStorage.setItem('mycis25_pinned_batch', batch);
    localStorage.setItem('mycis25_my_sub', 'All');
    localStorage.setItem('mycis25_pinned_sub', 'All');

    // Sync URL without reloading for easy bookmarking/sharing
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('batch', batch);
      url.searchParams.delete('sub');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSelectSubSection = (sub: SubSection) => {
    setSelectedSubSection(sub);
    localStorage.setItem('mycis25_my_sub', sub);
    localStorage.setItem('mycis25_pinned_sub', sub);

    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      if (sub === 'All') {
        url.searchParams.delete('sub');
      } else {
        url.searchParams.set('sub', sub);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleTogglePinBatch = (batch: BatchId) => {
    if (pinnedBatch === batch) {
      setPinnedBatch(null);
      localStorage.removeItem('mycis25_my_batch');
      localStorage.removeItem('mycis25_pinned_batch');
      localStorage.removeItem('mycis25_my_sub');
      localStorage.removeItem('mycis25_pinned_sub');
      setToastMessage(`Default cleared for Batch ${batch}.`);
    } else {
      setPinnedBatch(batch);
      localStorage.setItem('mycis25_my_batch', batch);
      localStorage.setItem('mycis25_pinned_batch', batch);
      localStorage.setItem('mycis25_my_sub', selectedSubSection);
      localStorage.setItem('mycis25_pinned_sub', selectedSubSection);
      setToastMessage(`★ Batch ${batch} saved as My Batch! You will land here on every visit.`);
    }
  };

  // 5. View Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => {
    return DAYS_OF_WEEK.includes(todayDayOfWeek) ? todayDayOfWeek : 'Saturday';
  });

  useEffect(() => {
    if (DAYS_OF_WEEK.includes(todayDayOfWeek)) {
      setActiveDay(todayDayOfWeek);
    }
  }, [todayDayOfWeek]);

  // 6. Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAllBatches, setSearchAllBatches] = useState(false);
  const [activeFilterTeacher, setActiveFilterTeacher] = useState<string | null>(null);
  const [activeFilterCourse, setActiveFilterCourse] = useState<string | null>(null);

  // 7. Filtered Schedule Computations
  const batchSectionClasses = useMemo(() => {
    return schedule.filter((c) => {
      if (c.batch !== selectedBatch) return false;
      if (selectedSubSection === 'All') return true;
      return c.subSection === 'All' || c.subSection === selectedSubSection;
    });
  }, [schedule, selectedBatch, selectedSubSection]);

  const liveStatus = useMemo(() => {
    return computeLiveStatus(batchSectionClasses, currentTime);
  }, [batchSectionClasses, currentTime]);

  // 15-Minute Advance Smart Notification Watcher
  // Rule:
  // - Sends notification 15 minutes before class starts.
  // - Only for first class of the day, or when there was NO class right before it (after a free break/gap).
  // - Will NOT send if there is a class running right before it (back-to-back classes).
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const todayClasses = batchSectionClasses
      .filter((c) => c.day === todayDayOfWeek)
      .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

    if (todayClasses.length === 0) return;

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const notifiedIds = getNotifiedClassIdsToday(currentTime);

    for (let i = 0; i < todayClasses.length; i++) {
      const session = todayClasses[i];

      // Check smart rule criteria: first class of day OR after a free break
      if (!shouldClassTriggerNotification(session, todayClasses)) {
        continue;
      }

      // Check if already notified today
      if (notifiedIds.has(session.id)) {
        continue;
      }

      const startMinutes = timeStringToMinutes(session.startTime);
      const diff = startMinutes - currentMinutes;

      // When remaining time is within 15 minutes (between 1 and 15 mins inclusive)
      if (diff > 0 && diff <= 15) {
        markClassNotifiedToday(session.id, currentTime);

        if (notificationSettings.sound) {
          playNotificationChime();
        }

        sendBrowserNotification(`🔔 Class in ${diff}m: ${session.courseCode}`, {
          body: `${session.courseName} starts at ${formatTo12Hour(session.startTime)} in ${session.room} (${session.teacherName}).`,
        });

        setActiveClassAlert({
          classSession: session,
          minutesUntilStart: diff,
          isFirstClassOfDay: i === 0,
        });

        break; // Process one alert per cycle
      }
    }
  }, [currentTime, batchSectionClasses, todayDayOfWeek, notificationSettings]);

  const handleTriggerTestAlert = () => {
    const testClass = batchSectionClasses[0] || schedule[0];
    setActiveClassAlert({
      classSession: testClass,
      minutesUntilStart: 15,
      isFirstClassOfDay: true,
      isTest: true,
    });
  };

  const isSearchActive =
    searchQuery.trim().length > 0 || activeFilterTeacher !== null || activeFilterCourse !== null;

  const displayClasses = useMemo(() => {
    const baseList = searchAllBatches && isSearchActive ? schedule : batchSectionClasses;

    if (!isSearchActive) {
      return baseList;
    }

    const query = searchQuery.trim().toLowerCase();

    return baseList.filter((c) => {
      if (activeFilterTeacher && c.teacherInitial.toUpperCase() !== activeFilterTeacher.toUpperCase()) {
        return false;
      }
      if (activeFilterCourse && !c.courseCode.toUpperCase().includes(activeFilterCourse.toUpperCase())) {
        return false;
      }
      if (query) {
        const matchCode = c.courseCode.toLowerCase().includes(query);
        const matchName = c.courseName.toLowerCase().includes(query);
        const matchTeacher =
          c.teacherName.toLowerCase().includes(query) || c.teacherInitial.toLowerCase().includes(query);
        const matchRoom = c.room.toLowerCase().includes(query);
        const matchDay = c.day.toLowerCase().includes(query);
        const matchNotes = c.notes?.toLowerCase().includes(query);

        return matchCode || matchName || matchTeacher || matchRoom || matchDay || matchNotes;
      }
      return true;
    });
  }, [
    schedule,
    batchSectionClasses,
    searchAllBatches,
    isSearchActive,
    searchQuery,
    activeFilterTeacher,
    activeFilterCourse,
  ]);

  const theme = getBatchTheme(selectedBatch);

  const handleSelectTeacherFromSection = (initial: string) => {
    if (activeFilterTeacher === initial) {
      setActiveFilterTeacher(null);
    } else {
      setActiveFilterTeacher(initial);
      setViewMode('search');
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-black text-zinc-100'
          : `bg-slate-50 ${theme.headingText}`
      } flex flex-col font-sans transition-colors duration-300`}
    >
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        selectedBatch={selectedBatch}
        isPinned={pinnedBatch === selectedBatch}
        notificationsEnabled={notificationSettings.enabled}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenGuide={() => setIsUserGuideOpen(true)}
      />

      {/* 15-Minute Advance Class In-App Floating Alert */}
      <ClassAlertBanner
        alert={activeClassAlert}
        onDismiss={() => setActiveClassAlert(null)}
        onSelectCourse={(courseCode) => setActiveCourseModal(courseCode)}
      />

      {/* Main Centered Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* 1. Live Banner Card */}
        <section aria-label="Live Class Status">
          <NextClassBanner
            status={liveStatus}
            selectedBatch={selectedBatch}
            currentDay={todayDayOfWeek}
          />
        </section>

        {/* 2. Pick Your Batch Section with My Batch Default & Quick Share */}
        <section aria-label="Pick Your Batch">
          <BatchSelector
            selectedBatch={selectedBatch}
            onSelectBatch={handleSelectBatch}
            selectedSubSection={selectedSubSection}
            onSelectSubSection={handleSelectSubSection}
            pinnedBatch={pinnedBatch}
            onTogglePinBatch={handleTogglePinBatch}
          />
        </section>

        {/* 3. Navigation View Switcher (Today, Week, Search) */}
        <section aria-label="View Mode Switcher" className="pt-1">
          <ViewNavTabs
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
            selectedBatch={selectedBatch}
          />
        </section>

        {/* 5. Active Content Area Based on View Mode */}
        <section aria-label="Routine Content">
          {viewMode === 'today' && (
            <div className="space-y-4">
              <DayView
                classes={displayClasses}
                activeDay={activeDay}
                onSelectDay={setActiveDay}
                todayDay={todayDayOfWeek}
                activeClassId={liveStatus.currentClass?.id}
                selectedBatch={selectedBatch}
                onSelectCourse={(courseCode) => setActiveCourseModal(courseCode)}
              />

              {/* Minimal Tap to View Teachers Section Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme.badgeBg} ${theme.badgeText}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">Batch-25 Faculty Directory</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">Instructors taking 25A, 25B, and 25C classes</div>
                  </div>
                </div>
                <button
                  onClick={() => setViewMode('teachers')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${theme.brandBg} text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1 shrink-0`}
                >
                  <span>View Teachers</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'week' && (
            <div className="space-y-4">
              <WeeklyGrid
                classes={displayClasses}
                selectedBatch={selectedBatch}
                selectedSubSection={selectedSubSection}
                todayDay={todayDayOfWeek}
                activeClassId={liveStatus.currentClass?.id}
                onSelectCourse={(courseCode) => setActiveCourseModal(courseCode)}
              />

              {/* Minimal Tap to View Teachers Section Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme.badgeBg} ${theme.badgeText}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">Batch-25 Faculty Directory</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">Instructors taking 25A, 25B, and 25C classes</div>
                  </div>
                </div>
                <button
                  onClick={() => setViewMode('teachers')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${theme.brandBg} text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1 shrink-0`}
                >
                  <span>View Teachers</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'search' && (
            <div className="space-y-4">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchAllBatches={searchAllBatches}
                onToggleSearchAllBatches={() => setSearchAllBatches(!searchAllBatches)}
                activeFilterTeacher={activeFilterTeacher}
                onSelectFilterTeacher={setActiveFilterTeacher}
                activeFilterCourse={activeFilterCourse}
                onSelectFilterCourse={setActiveFilterCourse}
                resultsCount={displayClasses.length}
                selectedBatch={selectedBatch}
              />

              <DayView
                classes={displayClasses}
                activeDay={activeDay}
                onSelectDay={setActiveDay}
                todayDay={todayDayOfWeek}
                activeClassId={liveStatus.currentClass?.id}
                selectedBatch={selectedBatch}
                onSelectCourse={(courseCode) => setActiveCourseModal(courseCode)}
              />
            </div>
          )}

          {viewMode === 'teachers' && (
            <div className="space-y-4">
              <TeacherSection
                onSelectTeacher={handleSelectTeacherFromSection}
                activeTeacher={activeFilterTeacher}
                selectedBatch={selectedBatch}
                schedule={schedule}
              />
            </div>
          )}
        </section>

        {/* 6. Clean Minimal Footer */}
        <footer className="pt-8 pb-6 text-center space-y-2 text-xs text-slate-500 dark:text-zinc-500">
          <p>Built for CIS Batch-25 &bull; Fall-2026 (Effective 19 Sep 2026)</p>
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-zinc-400">
            <span>Suggestions or fixes?</span>
            <a
              id="footer-feedback-link"
              href="mailto:samiulanowarofficial@gmail.com?subject=MyCIS%20Routine%20Feedback%20%2F%20Fixes"
              className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-zinc-300 underline underline-offset-4 decoration-slate-300 dark:decoration-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:decoration-indigo-400 transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>Send Feedback</span>
            </a>
            <span className="text-slate-300 dark:text-zinc-700">&bull;</span>
            <button
              id="footer-guide-button"
              onClick={() => setIsUserGuideOpen(true)}
              className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-zinc-300 underline underline-offset-4 decoration-slate-300 dark:decoration-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:decoration-indigo-400 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              <span>User Guide & Features</span>
            </button>
          </div>
        </footer>
      </main>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 border border-slate-700 dark:border-zinc-300 transition-all animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 fill-current shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white dark:text-zinc-500 dark:hover:text-zinc-900 cursor-pointer text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <CourseDetailModal
          courseCode={activeCourseModal}
          onClose={() => setActiveCourseModal(null)}
          selectedBatch={selectedBatch}
        />
      )}

      {/* Notification Settings Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={handleUpdateNotificationSettings}
        selectedBatch={selectedBatch}
        onTriggerTestInApp={handleTriggerTestAlert}
      />

      {/* User Guide & Feature Manual Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        selectedBatch={selectedBatch}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />
    </div>
  );
}
