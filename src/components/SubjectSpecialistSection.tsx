import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  MapPin, 
  Users, 
  Award, 
  Plus, 
  Calendar,
  Flame,
  Activity
} from 'lucide-react';
import { Subject } from '../types';

export const SubjectSpecialistSection: React.FC = () => {
  const {
    teachers,
    subjects,
    timetableEntries,
    classrooms,
    timeSlots,
    updateSubjectHours,
  } = useTimetable();

  // Specialist subjects list
  const specialistSubjects = subjects.filter((s) => s.specialistTeacherId);

  // Selected subject focus (default to DSA - Data Structures & Algorithms)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-dsa');
  const [showLogHoursModal, setShowLogHoursModal] = useState<boolean>(false);
  const [hoursToAdd, setHoursToAdd] = useState<number>(2);
  const [sessionTopicLog, setSessionTopicLog] = useState<string>('Graph Cycle Detection (Tarjan Algorithm)');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const specialistFaculty = teachers.find((t) => t.id === currentSubject.specialistTeacherId);

  // All entries for this subject across all sections
  const subjectEntries = timetableEntries.filter((e) => e.subjectId === currentSubject.id);

  // Related supplementary classes
  const supplementaryEntries = timetableEntries.filter(
    (e) => e.teacherId === specialistFaculty?.id && e.classType === 'supplementary'
  );

  // Play / Sports classes
  const playEntries = timetableEntries.filter((e) => e.classType === 'play');

  const progressPercentage = Math.min(
    100,
    Math.round((currentSubject.completedHours / currentSubject.totalPlannedHours) * 100)
  );

  const remainingHours = Math.max(0, currentSubject.totalPlannedHours - currentSubject.completedHours);

  // Calculate distinct sections where this subject is taught
  const distinctSections = Array.from(
    new Set(subjectEntries.map((e) => `${e.branch}-${e.semester}${e.section}`))
  );

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    const newTotal = currentSubject.completedHours + Number(hoursToAdd);
    updateSubjectHours(currentSubject.id, newTotal);
    setShowLogHoursModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Subject Specialist Header & Switcher */}
      <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Award className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Subject Specialist Syllabus & Lecture Hours Tracker
                </h2>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                  Curriculum Monitoring
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Auditing required syllabus teaching hours, section distributions, supplementary doubt classes, and student contact time.
              </p>
            </div>
          </div>

          {/* Subject Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Track Course:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
            >
              {specialistSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Specialist Banner (e.g., Dr. Ruchika for DSA) */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900">Designated Specialist:</span>
                <span className="text-sm font-black text-slate-900">{specialistFaculty?.name}</span>
                <span className="text-xs text-slate-500">({specialistFaculty?.designation})</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                Cabin: {specialistFaculty?.cabin} · Email: {specialistFaculty?.email}
              </p>
            </div>

            <button
              onClick={() => setShowLogHoursModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Completed Hours</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: Total Hours, Completed, Remaining, Weekly Commitment */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Planned Syllabus Hours</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {currentSubject.totalPlannedHours} <span className="text-xs font-medium text-slate-500">Hours</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Approved by RTU / JECRC Academic Board
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Delivered / Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono tabular-nums">
            {currentSubject.completedHours} <span className="text-xs font-medium text-slate-500">Hours</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {progressPercentage}% of semester curriculum covered
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Remaining Hours</span>
            <Flame className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono tabular-nums">
            {remainingHours} <span className="text-xs font-medium text-slate-500">Hours</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Required before end-term examinations
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Weekly Contact Classes</span>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono tabular-nums">
            {subjectEntries.length} <span className="text-xs font-medium text-slate-500">Periods / Wk</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {distinctSections.length || 1} Student Sections
          </p>
        </div>
      </div>

      {/* Syllabus Progress Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800">
            Syllabus Velocity Progress: {currentSubject.name}
          </span>
          <span className="text-xs font-mono font-bold text-blue-700">
            {currentSubject.completedHours} / {currentSubject.totalPlannedHours} Hours ({progressPercentage}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden ring-1 ring-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Unit 1: Fundamentals (Complete)</span>
          <span>Unit 2: Trees & BSTs (Complete)</span>
          <span>Unit 3: Graphs & Shortest Path (In Progress)</span>
          <span>Unit 4: Dynamic Programming & NP (Pending)</span>
        </div>
      </div>

      {/* Which Classes Specialist Has Lectures In */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Regular Scheduled Lectures for this Subject */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Active Sections & Timetable Slots
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {subjectEntries.length} Slots Scheduled
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Students and sections taught by {specialistFaculty?.name} for {currentSubject.name}:
          </p>

          <div className="space-y-2">
            {subjectEntries.map((entry) => {
              const slot = timeSlots.find((s) => s.id === entry.slotId);
              const room = classrooms.find((r) => r.id === entry.roomId);

              return (
                <div
                  key={entry.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{entry.branch}-{entry.semester}{entry.section}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-700">{entry.day}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-600 font-normal">{slot?.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{room?.roomNumber} ({room?.block}, {room?.floor})</span>
                      {entry.topic && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="italic text-slate-500 truncate max-w-xs">{entry.topic}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    {entry.classType.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Supplementary Doubt Classes & Play Activity Classes */}
        <div className="space-y-4">
          {/* Supplementary / Remedial */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs mb-1">
              <BookOpen className="h-4 w-4 text-indigo-700" />
              <span>Supplementary & Remedial Doubt-Clearing Classes</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Extra academic contact hours dedicated for weak students and advanced coding practice.
            </p>

            <div className="space-y-2">
              {supplementaryEntries.map((entry) => {
                const room = classrooms.find((r) => r.id === entry.roomId);
                const slot = timeSlots.find((s) => s.id === entry.slotId);

                return (
                  <div
                    key={entry.id}
                    className="rounded-md border border-indigo-200 bg-white p-2.5 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-indigo-900">
                        {entry.branch}-{entry.semester}{entry.section} · {entry.day} ({slot?.label})
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Venue: {room?.roomNumber} · Topic: {entry.topic || 'Doubt resolution'}
                      </div>
                    </div>
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                      Supplementary
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Play / Sports & Activity Sessions */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs mb-1">
              <Activity className="h-4 w-4 text-emerald-700" />
              <span>Play Class & Wellness Periods Scheduled</span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Scheduled outdoor games, fitness, and mental wellness periods for student recreation.
            </p>

            <div className="space-y-2">
              {playEntries.slice(0, 2).map((entry) => {
                const room = classrooms.find((r) => r.id === entry.roomId);
                const slot = timeSlots.find((s) => s.id === entry.slotId);

                return (
                  <div
                    key={entry.id}
                    className="rounded-md border border-emerald-200 bg-white p-2 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-emerald-900">
                        {entry.branch}-{entry.semester}{entry.section} · {entry.day} ({slot?.label})
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Location: {room?.roomNumber} · Activity: {entry.topic}
                      </div>
                    </div>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Play / Sports
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Log Hours Modal */}
      {showLogHoursModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Log Delivered Lecture Hours: {currentSubject.name}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Updates official syllabus completion logs for HOD and Academic Council review.
            </p>

            <form onSubmit={handleLogHours} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Teaching Hours Completed
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(Number(e.target.value))}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lecture Topic / Chapter Covered
                </label>
                <input
                  type="text"
                  value={sessionTopicLog}
                  onChange={(e) => setSessionTopicLog(e.target.value)}
                  placeholder="e.g. Dynamic Programming matrix chain multiplication"
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogHoursModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  Confirm & Update Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
