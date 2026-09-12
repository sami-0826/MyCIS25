import React, { useState, useEffect } from 'react';
import { ClassSession, DayOfWeek, BatchId, SubSection, ClassType } from '../types';
import { DAYS_OF_WEEK, TEACHERS } from '../data/defaultSchedule';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Download,
  RotateCcw,
  Check,
  Edit3,
  Lock,
  Clock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { getBatchTheme } from '../utils/themeUtils';
import { setAdminPasscode as saveNewAdminPasscode } from '../utils/adminAuth';

interface RoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ClassSession[];
  onSaveSchedule: (newSchedule: ClassSession[]) => void;
  onResetSchedule: () => void;
  initialEditSession?: ClassSession | null;
  defaultBatch: BatchId;
  currentTime: Date;
  isSimulated: boolean;
  onSimulateTime: (day: DayOfWeek, timeStr: string) => void;
  onResetTime: () => void;
  isAdminAuthenticated: boolean;
  onAuthenticateAdmin: (passcode: string) => boolean;
  onDeauthenticateAdmin: () => void;
}

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSaveSchedule,
  onResetSchedule,
  initialEditSession,
  defaultBatch,
  isSimulated,
  onSimulateTime,
  onResetTime,
  isAdminAuthenticated,
  onAuthenticateAdmin,
  onDeauthenticateAdmin,
}) => {
  const theme = getBatchTheme(defaultBatch);
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'backup' | 'simulator'>('list');
  const [filterBatch, setFilterBatch] = useState<BatchId>(defaultBatch);

  // Passcode verification state
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Change Passcode state
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeChangeSuccess, setPasscodeChangeSuccess] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [batch, setBatch] = useState<BatchId>(defaultBatch);
  const [subSection, setSubSection] = useState<SubSection>('All');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [type, setType] = useState<ClassType>('Theory');
  const [teacherName, setTeacherName] = useState('');
  const [teacherInitial, setTeacherInitial] = useState('');
  const [room, setRoom] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  // Simulator state
  const [simDay, setSimDay] = useState<DayOfWeek>('Monday');
  const [simTime, setSimTime] = useState('10:15');

  // Import / Export JSON state
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (initialEditSession) {
      loadSessionIntoForm(initialEditSession);
      setActiveTab('form');
    }
  }, [initialEditSession]);

  const loadSessionIntoForm = (session: ClassSession) => {
    setEditingId(session.id);
    setBatch(session.batch);
    setSubSection(session.subSection);
    setCourseCode(session.courseCode);
    setCourseName(session.courseName);
    setType(session.type);
    setTeacherName(session.teacherName);
    setTeacherInitial(session.teacherInitial);
    setRoom(session.room);
    setDay(session.day);
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    setNotes(session.notes || '');
  };

  const resetForm = () => {
    setEditingId(null);
    setBatch(defaultBatch);
    setSubSection('All');
    setCourseCode('');
    setCourseName('');
    setType('Theory');
    setTeacherName('');
    setTeacherInitial('');
    setRoom('');
    setDay('Monday');
    setStartTime('08:30');
    setEndTime('10:00');
    setNotes('');
  };

  const handleSelectTeacherPreset = (tInitial: string) => {
    const t = TEACHERS.find((item) => item.initial === tInitial);
    if (t) {
      setTeacherName(t.fullName);
      setTeacherInitial(t.initial);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !startTime || !endTime) {
      alert('Please provide course code and start/end times');
      return;
    }

    const sessionData: ClassSession = {
      id: editingId || `slot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      batch,
      subSection,
      courseCode: courseCode.trim(),
      courseName: courseName.trim() || courseCode.trim(),
      type,
      teacherName: teacherName.trim() || 'TBA',
      teacherInitial: teacherInitial.trim().toUpperCase() || 'TBA',
      room: room.trim() || 'TBA',
      day,
      startTime,
      endTime,
      notes: notes.trim() || undefined,
    };

    let updated: ClassSession[];
    if (editingId) {
      updated = schedule.map((s) => (s.id === editingId ? sessionData : s));
      showToast(`Updated "${sessionData.courseCode}" successfully!`);
    } else {
      updated = [...schedule, sessionData];
      showToast(`Added new class "${sessionData.courseCode}"!`);
    }

    onSaveSchedule(updated);
    resetForm();
    setActiveTab('list');
  };

  const handleDeleteSession = (id: string, course: string) => {
    if (window.confirm(`Are you sure you want to delete "${course}"?`)) {
      const updated = schedule.filter((s) => s.id !== id);
      onSaveSchedule(updated);
      showToast(`Deleted "${course}".`);
    }
  };

  const handleDuplicateSession = (session: ClassSession) => {
    const duplicated: ClassSession = {
      ...session,
      id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      notes: session.notes ? `${session.notes} (Copy)` : '(Copy)',
    };
    const updated = [...schedule, duplicated];
    onSaveSchedule(updated);
    showToast(`Duplicated "${session.courseCode}".`);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(schedule, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mycis25_routine_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded routine JSON file!');
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(schedule, null, 2);
    navigator.clipboard.writeText(jsonStr);
    showToast('Copied routine JSON to clipboard!');
  };

  const handleImportJson = () => {
    setImportError(null);
    try {
      if (!importJsonText.trim()) {
        setImportError('Please paste valid routine JSON');
        return;
      }
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setImportError('Invalid format: array of class sessions expected');
        return;
      }
      onSaveSchedule(parsed);
      setImportJsonText('');
      showToast(`Imported ${parsed.length} class slots successfully!`);
      setActiveTab('list');
    } catch (e: any) {
      setImportError(`Invalid JSON: ${e.message}`);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    if (!enteredPasscode.trim()) {
      setPasscodeError('Please enter your admin passcode.');
      return;
    }
    const success = onAuthenticateAdmin(enteredPasscode);
    if (success) {
      setEnteredPasscode('');
      setPasscodeError(null);
      showToast('Admin access unlocked successfully!');
    } else {
      setPasscodeError('Incorrect passcode. Only authorized administrators can access this.');
    }
  };

  const handleChangePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode || newPasscode.trim().length < 4) {
      showToast('Passcode must be at least 4 characters long.');
      return;
    }
    const ok = saveNewAdminPasscode(newPasscode);
    if (ok) {
      setNewPasscode('');
      setPasscodeChangeSuccess(true);
      showToast('Admin passcode updated successfully!');
      setTimeout(() => setPasscodeChangeSuccess(false), 4000);
    } else {
      showToast('Failed to update passcode.');
    }
  };

  if (!isOpen) return null;

  // 1. If not authenticated, show secure admin passcode prompt
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/60 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                Restricted Admin Access
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200/60 dark:border-amber-800/40">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enter Admin Passcode
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
                Only you can update and manage the class routine. Regular students cannot make changes.
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-3 pt-1">
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={enteredPasscode}
                  onChange={(e) => {
                    setEnteredPasscode(e.target.value);
                    setPasscodeError(null);
                  }}
                  placeholder="Admin passcode..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passcodeError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
                  {passcodeError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Unlock Routine Editor
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-zinc-500">
                Default passcode: <code className="font-mono font-bold text-slate-700 dark:text-zinc-300">cis25admin</code>
                <div className="mt-0.5 text-[10px]">You can change this anytime inside Admin Settings</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const filteredSessions = schedule
    .filter((s) => s.batch === filterBatch)
    .sort((a, b) => {
      const dayDiff = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Admin & Routine Management
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Update class timings, manage slots, or import/export routine data.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDeauthenticateAdmin}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Lock Admin Session"
            >
              <Lock className="w-3 h-3" />
              <span>Lock</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-blue-600 text-white text-xs px-4 py-2 flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600 dark:text-white font-bold'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            All Classes ({schedule.length})
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveTab('form');
            }}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'form'
                ? 'border-blue-500 text-blue-600 dark:text-white font-bold'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingId ? 'Edit Slot' : 'Add Class Slot'}</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'border-blue-500 text-blue-600 dark:text-white font-bold'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Export / Import JSON
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'simulator'
                ? 'border-blue-500 text-blue-600 dark:text-white font-bold'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Test Clock</span>
            {isSimulated && (
              <span className="text-[10px] px-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded font-bold">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-white dark:bg-zinc-950">
          {/* TAB 1: LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Batch:</span>
                  {(['25A', '25B', '25C'] as BatchId[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => setFilterBatch(b)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                        filterBatch === b
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setBatch(filterBatch);
                    setActiveTab('form');
                  }}
                  className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Class</span>
                </button>
              </div>

              <div className="space-y-2">
                {filteredSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-black flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{s.day.slice(0, 3)}</span>
                        <span className="text-slate-500 dark:text-zinc-400 font-mono">{s.startTime}–{s.endTime}</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">[{s.courseCode}]</span>
                        <span className="text-slate-600 dark:text-zinc-400">{s.type}</span>
                        {s.subSection !== 'All' && (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">{s.batch}{s.subSection}</span>
                        )}
                      </div>
                      <div className="text-slate-700 dark:text-zinc-300 font-medium truncate">
                        {s.courseName} · {s.room} · {s.teacherName} ({s.teacherInitial})
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          loadSessionIntoForm(s);
                          setActiveTab('form');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateSession(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s.id, s.courseCode)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FORM */}
          {activeTab === 'form' && (
            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Batch</label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value as BatchId)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="25A">Batch 25A</option>
                    <option value="25B">Batch 25B</option>
                    <option value="25C">Batch 25C</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Section</label>
                  <select
                    value={subSection}
                    onChange={(e) => setSubSection(e.target.value as SubSection)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="All">All (Combined)</option>
                    <option value="1">Section 1 (e.g. {batch}1)</option>
                    <option value="2">Section 2 (e.g. {batch}2)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ClassType)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DS, CAO, Math I"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Course Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures (Theory)"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Day of Week</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">End Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Teacher Initials</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. MH, TA"
                      value={teacherInitial}
                      onChange={(e) => setTeacherInitial(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs uppercase"
                    />
                    <select
                      onChange={(e) => handleSelectTeacherPreset(e.target.value)}
                      className="text-xs bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-lg px-2"
                    >
                      <option value="">Preset</option>
                      {TEACHERS.map((t) => (
                        <option key={t.initial} value={t.initial}>{t.initial}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Teacher Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Mehedi Hassan"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 602, Software Lab 3"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bring lab manual, tutorial review"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Add Class Slot'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BACKUP / IMPORT EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Routine File (.json)</span>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Reset schedule back to official departmental defaults?')) {
                      onResetSchedule();
                      showToast('Schedule restored to departmental defaults!');
                      setActiveTab('list');
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-rose-400 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

              {/* Change Admin Passcode Section */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black space-y-2.5">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Change Admin Passcode
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Update your personal secret passcode. Only someone with this passcode can unlock routine editing.
                </p>
                <form onSubmit={handleChangePasscodeSubmit} className="flex flex-wrap sm:flex-nowrap gap-2 pt-1">
                  <input
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Enter new passcode (min 4 chars)"
                    className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                  >
                    Update Passcode
                  </button>
                </form>
                {passcodeChangeSuccess && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Passcode changed successfully!
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
                <label className="text-xs text-slate-700 dark:text-zinc-300 font-semibold block">
                  Paste JSON to Import Updated Routine
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste routine JSON array here..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {importError && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{importError}</p>
                )}
                <button
                  onClick={handleImportJson}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Apply Imported Routine
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Time Machine (Alert & Live Banner Tester)
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Simulate any day and time to test how the top banner reacts to "Class in Progress", "Next Up Today", or "You're Free".
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Target Day</label>
                    <select
                      value={simDay}
                      onChange={(e) => setSimDay(e.target.value as DayOfWeek)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 dark:text-zinc-400 block mb-1">Target Time (24h)</label>
                    <input
                      type="time"
                      value={simTime}
                      onChange={(e) => setSimTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onSimulateTime(simDay, simTime);
                      showToast(`Simulating ${simDay} at ${simTime}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Apply Simulation
                  </button>
                  {isSimulated && (
                    <button
                      onClick={() => {
                        onResetTime();
                        showToast('Returned to live clock');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                    >
                      Reset to Live Clock
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
