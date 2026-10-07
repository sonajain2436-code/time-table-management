import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  Calendar, 
  UserCheck, 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  Smartphone, 
  Palette, 
  Bell, 
  RotateCcw,
  Search
} from 'lucide-react';

interface HeaderProps {
  onOpenThemeModal: () => void;
  onOpenClassModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenThemeModal, onOpenClassModal }) => {
  const {
    activeRole,
    setActiveRole,
    roomAlerts,
    isAndroidSimMode,
    setIsAndroidSimMode,
    selectedTeacherId,
    teachers,
    resetAllData
  } = useTimetable();

  const currentTeacher = teachers.find(t => t.id === selectedTeacherId);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#002b49] text-white shadow-md">
      {/* Top Banner / JECRC Identity */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Zone 1: Institutional Wordmark & Crest */}
        <div className="flex items-center gap-3">
          {/* Institutional Shield Badge */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-400 fill-current" aria-hidden="true">
              <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4zm0 2.18l7 3.11v4.71c0 4.62-3.13 8.94-7 10.05-3.87-1.11-7-5.43-7-10.05V7.29l7-3.11zM11 7h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                JECRC Foundation
              </h1>
              <span className="hidden rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/30 sm:inline-block">
                Academic Timetable System
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              Department of Computer Science & Engineering · Jaipur Campus
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line) */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveRole('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeRole === 'teacher'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <UserCheck className="h-4 w-4 text-blue-300" />
            <span>Teacher Portal</span>
          </button>

          <button
            onClick={() => setActiveRole('specialist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeRole === 'specialist'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <BookOpen className="h-4 w-4 text-emerald-300" />
            <span>Subject Specialist</span>
          </button>

          <button
            onClick={() => setActiveRole('hod')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeRole === 'hod'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <span>HOD Section</span>
          </button>

          <button
            onClick={() => setActiveRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeRole === 'student'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Calendar className="h-4 w-4 text-cyan-300" />
            <span>Class Timetable</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick Schedule Button */}
          <button
            onClick={onOpenClassModal}
            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500 active:scale-95"
          >
            <span className="text-sm font-bold leading-none">+</span>
            <span className="hidden sm:inline">Add / Clash Check</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Android App View Mode Toggle */}
          <button
            onClick={() => setIsAndroidSimMode(!isAndroidSimMode)}
            title="Toggle Android App Phone Frame View"
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              isAndroidSimMode
                ? 'bg-emerald-500 text-slate-900 font-bold shadow'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Android View</span>
          </button>

          {/* Theme & Font Customizer */}
          <button
            onClick={onOpenThemeModal}
            title="Customize Timetable Font & Background Theme"
            className="rounded-md bg-white/10 p-1.5 text-blue-100 hover:bg-white/20 hover:text-white transition"
          >
            <Palette className="h-4 w-4" />
          </button>

          {/* Room Change Alert Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                const alertEl = document.getElementById('room-alerts-section');
                if (alertEl) alertEl.scrollIntoView({ behavior: 'smooth' });
              }}
              title={`${roomAlerts.length} Active Classroom Change Alerts`}
              className="relative rounded-md bg-white/10 p-1.5 text-blue-100 hover:bg-white/20 hover:text-white transition"
            >
              <Bell className="h-4 w-4" />
              {roomAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#002b49]">
                  {roomAlerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all timetable data and sample entries to JECRC defaults?')) {
                resetAllData();
              }
            }}
            title="Reset to default data"
            className="rounded-md bg-white/10 p-1.5 text-blue-200 hover:bg-white/20 transition hidden sm:inline-flex"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="flex border-t border-white/10 bg-[#00223a] px-3 py-1 lg:hidden overflow-x-auto text-xs">
        <button
          onClick={() => setActiveRole('teacher')}
          className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
            activeRole === 'teacher' ? 'bg-white/20 text-white font-semibold' : 'text-blue-200'
          }`}
        >
          Teacher Portal
        </button>
        <button
          onClick={() => setActiveRole('specialist')}
          className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
            activeRole === 'specialist' ? 'bg-white/20 text-white font-semibold' : 'text-blue-200'
          }`}
        >
          DSA Specialist
        </button>
        <button
          onClick={() => setActiveRole('hod')}
          className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
            activeRole === 'hod' ? 'bg-white/20 text-white font-semibold' : 'text-blue-200'
          }`}
        >
          HOD Section
        </button>
        <button
          onClick={() => setActiveRole('student')}
          className={`px-3 py-1.5 whitespace-nowrap rounded font-medium ${
            activeRole === 'student' ? 'bg-white/20 text-white font-semibold' : 'text-blue-200'
          }`}
        >
          Timetable Grid
        </button>
      </div>
    </header>
  );
};
