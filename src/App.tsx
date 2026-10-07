/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimetableProvider, useTimetable } from './context/TimetableContext';
import { Header } from './components/Header';
import { RoomChangeAlertBanner } from './components/RoomChangeAlertBanner';
import { TimetableGrid } from './components/TimetableGrid';
import { TeacherSection } from './components/TeacherSection';
import { SubjectSpecialistSection } from './components/SubjectSpecialistSection';
import { HODSection } from './components/HODSection';
import { RoomManager } from './components/RoomManager';
import { AcademicCalendar } from './components/AcademicCalendar';
import { CoordinatorFinder } from './components/CoordinatorFinder';
import { ClassModal } from './components/ClassModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { AndroidFrame } from './components/AndroidFrame';
import { TimetableEntry } from './types';
import { 
  Calendar, 
  UserCheck, 
  BookOpen, 
  ShieldCheck, 
  Building2, 
  Award, 
  MapPin, 
  AlertTriangle,
  Info
} from 'lucide-react';

function TimetableDashboard() {
  const { activeRole, setActiveRole } = useTimetable();

  // Secondary sub-view switcher (e.g. within general campus utilities)
  const [utilityView, setUtilityView] = useState<'main' | 'rooms' | 'calendar' | 'coordinators'>('main');

  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleOpenNewClassModal = () => {
    setEditingEntry(null);
    setIsClassModalOpen(true);
  };

  const handleEditEntry = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setIsClassModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-jecrc-sans">
      <Header
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenClassModal={handleOpenNewClassModal}
      />

      {/* Prominent Classroom Relocation Alert Banner */}
      <RoomChangeAlertBanner />

      {/* Institutional Breadcrumbs & Secondary Sub-Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">JECRC Campus</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold capitalize">{activeRole} Portal</span>
            {utilityView !== 'main' && (
              <>
                <span>/</span>
                <span className="font-bold text-slate-900 capitalize">{utilityView}</span>
              </>
            )}
          </div>

          {/* Quick Institutional Tools Tabs */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setUtilityView('main')}
              className={`rounded px-2.5 py-1 font-semibold transition ${
                utilityView === 'main'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Primary Schedule
            </button>

            <button
              onClick={() => setUtilityView('rooms')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-semibold transition ${
                utilityView === 'rooms'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              <span>Rooms & Blocks</span>
            </button>

            <button
              onClick={() => setUtilityView('calendar')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-semibold transition ${
                utilityView === 'calendar'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span>Calendar & Leaves</span>
            </button>

            <button
              onClick={() => setUtilityView('coordinators')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-semibold transition ${
                utilityView === 'coordinators'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-blue-600" />
              <span>Event Coordinators</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6">
        {utilityView === 'rooms' ? (
          <RoomManager />
        ) : utilityView === 'calendar' ? (
          <AcademicCalendar />
        ) : utilityView === 'coordinators' ? (
          <CoordinatorFinder />
        ) : (
          <>
            {activeRole === 'student' && (
              <TimetableGrid
                onEditEntry={handleEditEntry}
                onOpenNewClassModal={handleOpenNewClassModal}
              />
            )}

            {activeRole === 'teacher' && (
              <TeacherSection
                onOpenClassModal={handleOpenNewClassModal}
                onEditEntry={handleEditEntry}
              />
            )}

            {activeRole === 'specialist' && (
              <SubjectSpecialistSection />
            )}

            {activeRole === 'hod' && (
              <HODSection />
            )}
          </>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002b49]">JECRC Foundation</span>
            <span>·</span>
            <span>Jaipur Engineering College and Research Centre</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Room & Clash Collision Engine Active</span>
            <span>·</span>
            <span>Academic Council RTU Compliant</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setEditingEntry(null);
        }}
        initialEntry={editingEntry}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <TimetableProvider>
      <AndroidFrame onOpenClassModal={() => {
        const addBtn = document.querySelector('button[title*="Add"]') as HTMLButtonElement;
        if (addBtn) addBtn.click();
      }}>
        <TimetableDashboard />
      </AndroidFrame>
    </TimetableProvider>
  );
}
