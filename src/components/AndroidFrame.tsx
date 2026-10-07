import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  BookOpen, 
  Plus, 
  X
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onOpenClassModal: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, onOpenClassModal }) => {
  const { isAndroidSimMode, setIsAndroidSimMode, activeRole, setActiveRole } = useTimetable();

  if (!isAndroidSimMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-2 sm:px-6 flex flex-col items-center justify-center">
      {/* Simulation Info Pill */}
      <div className="mb-3 flex items-center gap-3 text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Android App Simulation Mode (Pixel Tablet / Fold)
        </span>
        <button
          onClick={() => setIsAndroidSimMode(false)}
          className="rounded bg-white/10 px-2 py-0.5 text-xs text-white hover:bg-white/20 transition flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Exit Android Bezel View
        </button>
      </div>

      {/* Android Device Bezel */}
      <div className="relative w-full max-w-4xl rounded-[36px] bg-slate-950 p-3 sm:p-4 shadow-2xl ring-4 ring-slate-800">
        {/* Android Screen Container */}
        <div className="relative overflow-hidden rounded-[26px] bg-slate-50 flex flex-col h-[86vh] max-h-[920px]">
          
          {/* Android Status Bar */}
          <div className="flex h-7 items-center justify-between bg-[#00223a] px-5 text-[11px] font-medium text-white select-none">
            <div className="flex items-center gap-2 font-mono font-bold tracking-tight">
              <span>08:30</span>
              <span className="text-[10px] text-blue-200">JECRC Campus</span>
            </div>

            {/* Android Camera Punch Hole */}
            <div className="h-3 w-3 rounded-full bg-black ring-1 ring-white/10" />

            {/* Android Status Icons */}
            <div className="flex items-center gap-2 text-white">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono">98%</span>
                <Battery className="h-3.5 w-3.5 text-emerald-400 fill-current" />
              </div>
            </div>
          </div>

          {/* Android App Content Area */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Android Floating Action Button (FAB) */}
          <button
            onClick={onOpenClassModal}
            title="Android FAB: Add Class / Check Clash"
            className="absolute bottom-16 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#002b49] text-white shadow-xl ring-2 ring-white hover:scale-105 active:scale-95 transition"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Android Bottom Navigation Bar */}
          <div className="flex items-center justify-around border-t border-slate-200 bg-white py-2 px-3 shadow-md z-30">
            <button
              onClick={() => setActiveRole('teacher')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeRole === 'teacher' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Teacher</span>
            </button>

            <button
              onClick={() => setActiveRole('specialist')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeRole === 'specialist' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Specialist</span>
            </button>

            <button
              onClick={() => setActiveRole('student')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeRole === 'student' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Timetable</span>
            </button>

            <button
              onClick={() => setActiveRole('hod')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeRole === 'hod' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>HOD</span>
            </button>
          </div>

          {/* Android Home Navigation Gesture Bar */}
          <div className="flex h-3 items-center justify-center bg-white pb-1">
            <div className="h-1 w-28 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
