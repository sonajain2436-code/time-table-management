import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { TimetableEntry, DayOfWeek } from '../types';
import { 
  Clock, 
  MapPin, 
  User, 
  Users, 
  AlertTriangle, 
  ArrowRightLeft, 
  UserCheck, 
  Sparkles, 
  Coffee,
  Edit2,
  Trash2
} from 'lucide-react';
import { SECTION_LIST, SEMESTER_LIST } from '../data/mockData';

interface TimetableGridProps {
  onEditEntry: (entry: TimetableEntry) => void;
  onOpenNewClassModal: () => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  onEditEntry,
  onOpenNewClassModal,
}) => {
  const {
    timeSlots,
    timetableEntries,
    teachers,
    classrooms,
    subjects,
    selectedDay,
    setSelectedDay,
    selectedBranch,
    setSelectedBranch,
    selectedSemester,
    setSelectedSemester,
    selectedSection,
    setSelectedSection,
    deleteTimetableEntry,
    changeClassRoom,
    assignSubstitute,
    getAvailableTeachersForSlot,
    customization,
  } = useTimetable();

  const [activeRoomChangeModal, setActiveRoomChangeModal] = useState<TimetableEntry | null>(null);
  const [selectedNewRoomId, setSelectedNewRoomId] = useState<string>('');
  const [roomChangeReason, setRoomChangeReason] = useState<string>('Audio/Projector Issue');

  const [activeSubModal, setActiveSubModal] = useState<TimetableEntry | null>(null);
  const [selectedSubTeacherId, setSelectedSubTeacherId] = useState<string>('');
  const [subReason, setSubReason] = useState<string>('Faculty on Emergency Leave');

  // Filter entries for the selected Day, Branch, Semester, Section (or merged into this section)
  const currentSectionCode = `${selectedBranch}-${selectedSemester}${selectedSection}`;
  
  const entriesForSectionAndDay = timetableEntries.filter((entry) => {
    if (entry.day !== selectedDay) return false;
    
    // Direct match
    if (
      entry.branch === selectedBranch &&
      entry.semester === selectedSemester &&
      entry.section === selectedSection
    ) {
      return true;
    }

    // Merged match
    if (entry.isMerged && entry.mergedSections?.includes(currentSectionCode)) {
      return true;
    }

    return false;
  });

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Handle Room Change submission
  const handleConfirmRoomChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoomChangeModal || !selectedNewRoomId) return;

    changeClassRoom(activeRoomChangeModal.id, selectedNewRoomId, roomChangeReason);
    setActiveRoomChangeModal(null);
  };

  // Handle Substitute Assignment
  const handleConfirmSubstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubModal || !selectedSubTeacherId) return;

    assignSubstitute(activeSubModal.id, selectedSubTeacherId, subReason);
    setActiveSubModal(null);
  };

  // Theme styles based on customization
  const getThemeContainerClass = () => {
    switch (customization.theme) {
      case 'cobalt-dark':
        return 'bg-slate-900 text-slate-100 border-slate-800';
      case 'ivory-academic':
        return 'bg-[#faf8f5] text-amber-950 border-amber-200/60';
      case 'slate-minimal':
        return 'bg-slate-50 text-slate-900 border-slate-200';
      case 'jecrc-navy':
      default:
        return 'bg-white text-slate-900 border-slate-200';
    }
  };

  const getFontFamilyClass = () => {
    switch (customization.font) {
      case 'serif':
        return 'font-jecrc-serif';
      case 'mono':
        return 'font-jecrc-mono';
      case 'sans':
      default:
        return 'font-jecrc-sans';
    }
  };

  return (
    <div className={`space-y-4 ${getFontFamilyClass()}`}>
      {/* Top Controls: Day selector, Branch / Section filter, Add Class CTA */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Academic Cohort Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-blue-600"
            >
              <option value="CSE">CSE</option>
              <option value="AI-DS">AI-DS</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Sem:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-blue-600"
            >
              {SEMESTER_LIST.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}th Sem
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Section:</span>
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
              {SECTION_LIST.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                    selectedSection === sec
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sec {sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewClassModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#002b49] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#001c30] transition active:scale-95"
          >
            <span>+ Add Lecture / Activity</span>
          </button>
        </div>
      </div>

      {/* Weekday Switcher Bar */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
        {days.map((day) => {
          const count = timetableEntries.filter(
            (e) =>
              e.day === day &&
              e.branch === selectedBranch &&
              e.semester === selectedSemester &&
              (e.section === selectedSection || e.mergedSections?.includes(currentSectionCode))
          ).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition ${
                selectedDay === day
                  ? 'bg-[#002b49] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{day}</span>
              <span
                className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold ${
                  selectedDay === day ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timetable Slot List / Timeline */}
      <div className={`rounded-xl border ${getThemeContainerClass()} p-4 shadow-sm space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#002b49] tracking-tight">
              {selectedBranch} Sem-{selectedSemester} (Section {selectedSection}) Schedule · {selectedDay}
            </h2>
            <span className="text-xs text-slate-500 font-normal">
              ({entriesForSectionAndDay.length} Scheduled Periods)
            </span>
          </div>

          <span className="text-xs text-slate-500">
            JECRC Foundation Academic Calendar 2026
          </span>
        </div>

        {/* Slot Rows */}
        <div className="space-y-3">
          {timeSlots.map((slot) => {
            if (slot.isBreak) {
              return (
                <div
                  key={slot.id}
                  className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-amber-300 bg-amber-50/70 py-2.5 text-xs text-amber-900 font-medium"
                >
                  <Coffee className="h-4 w-4 text-amber-600" />
                  <span>
                    <strong>{slot.label}</strong> ({slot.startTime} – {slot.endTime})
                  </span>
                </div>
              );
            }

            const entry = entriesForSectionAndDay.find((e) => e.slotId === slot.id);
            const subject = subjects.find((s) => s.id === entry?.subjectId);
            const teacher = teachers.find((t) => t.id === entry?.teacherId);
            const substituteTeacher = teachers.find((t) => t.id === entry?.substituteTeacherId);
            const room = classrooms.find((r) => r.id === entry?.roomId);
            const originalRoom = classrooms.find((r) => r.id === entry?.originalRoomId);

            if (!entry) {
              return (
                <div
                  key={slot.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-400 gap-2 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-mono font-bold text-slate-500">{slot.label}</span>
                    <span className="text-slate-400">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="italic">Free Period / Self Study / Library Hour</span>
                  </div>

                  <button
                    onClick={onOpenNewClassModal}
                    className="self-start sm:self-auto text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    + Assign Session
                  </button>
                </div>
              );
            }

            return (
              <div
                key={slot.id}
                className={`relative rounded-xl border p-4 transition shadow-xs ${
                  entry.isMerged
                    ? 'border-blue-300 bg-blue-50/40'
                    : entry.isRoomChanged
                    ? 'border-amber-300 bg-amber-50/30'
                    : entry.classType === 'workshop'
                    ? 'border-purple-300 bg-purple-50/30'
                    : entry.classType === 'supplementary'
                    ? 'border-indigo-200 bg-indigo-50/30'
                    : entry.classType === 'play'
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Merged Class Banner */}
                {entry.isMerged && (
                  <div className="mb-2 flex items-center gap-1.5 rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-900 ring-1 ring-blue-300">
                    <Users className="h-3.5 w-3.5 text-blue-700" />
                    <span>⚠️ MERGED CLASS: {entry.mergedSections?.join(' & ')} Combined Session</span>
                    {entry.mergeAlertMessage && (
                      <span className="font-normal text-blue-800">· {entry.mergeAlertMessage}</span>
                    )}
                  </div>
                )}

                {/* Room Relocation Banner */}
                {entry.isRoomChanged && (
                  <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                    <span>CLASSROOM SHIFTED:</span>
                    <span className="line-through font-normal text-slate-600">
                      Was {originalRoom?.roomNumber || 'Old Room'}
                    </span>
                    <span>→ Now in</span>
                    <span className="underline decoration-amber-600 font-extrabold text-amber-950">
                      {room?.roomNumber} ({room?.block}, {room?.floor})
                    </span>
                    {entry.roomChangeNote && (
                      <span className="text-[11px] font-normal italic text-amber-800">
                        ({entry.roomChangeNote})
                      </span>
                    )}
                  </div>
                )}

                {/* Substitute Teacher Alert */}
                {entry.isSubstituted && (
                  <div className="mb-2 flex items-center gap-1.5 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-900 ring-1 ring-rose-300">
                    <UserCheck className="h-3.5 w-3.5 text-rose-700" />
                    <span>SUBSTITUTE FACULTY ASSIGNED:</span>
                    <span className="font-bold underline text-rose-950">
                      {substituteTeacher?.name || 'Substitute'}
                    </span>
                    <span className="font-normal text-rose-800">
                      (Original faculty {teacher?.name} on leave: {entry.substituteReason || 'Absent'})
                    </span>
                  </div>
                )}

                {/* Main Card Content */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="space-y-1">
                    {/* Time Slot & Class Type Tag */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-800">
                        {slot.label}: {slot.startTime} – {slot.endTime}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-600">
                        {entry.branch}-{entry.semester}{entry.section}
                      </span>

                      {/* Class Type Label */}
                      <span className="font-bold text-blue-700">
                        {entry.classType === 'regular' && 'Lecture'}
                        {entry.classType === 'supplementary' && 'Supplementary / Remedial'}
                        {entry.classType === 'play' && 'Sports & Wellness Class'}
                        {entry.classType === 'lab' && 'Practical / Coding Lab'}
                        {entry.classType === 'workshop' && 'Interactive Workshop'}
                        {entry.classType === 'seminar' && 'Academic Seminar'}
                      </span>
                    </div>

                    {/* Subject Name */}
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {subject?.name || 'Subject'}
                      <span className="ml-2 text-xs font-mono font-normal text-slate-500">
                        ({subject?.code})
                      </span>
                    </h3>

                    {/* Topic or Workshop Details */}
                    {entry.topic && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium text-slate-700">Topic: </span>
                        {entry.topic}
                      </p>
                    )}

                    {entry.workshopDetails && (
                      <div className="flex items-center gap-2 text-xs text-purple-900 font-medium">
                        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                        <span>Workshop: {entry.workshopDetails.title}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold">{entry.workshopDetails.enrolledStudentCount} Enrolled Students</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-purple-700">{entry.workshopDetails.targetBatch}</span>
                      </div>
                    )}

                    {/* Faculty & Classroom Meta */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                      {/* Teacher */}
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {teacher?.name}{' '}
                          {teacher?.isSubjectSpecialist && (
                            <span className="text-blue-600 font-bold">★ Specialist</span>
                          )}
                        </span>
                        {teacher?.cabin && (
                          <span className="text-[11px] text-slate-400">({teacher.cabin})</span>
                        )}
                      </div>

                      <span aria-hidden="true">·</span>

                      {/* Classroom with Block & Floor */}
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        <span>
                          Room {room?.roomNumber}
                        </span>
                        <span className="font-normal text-slate-500">
                          ({room?.block}, {room?.floor})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Shift Classroom Button */}
                    <button
                      onClick={() => {
                        setActiveRoomChangeModal(entry);
                        setSelectedNewRoomId(room?.id || '');
                      }}
                      title="Shift lecture to a different classroom & send alert"
                      className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/60 hover:text-amber-900 transition"
                    >
                      <MapPin className="h-3 w-3 text-amber-600" />
                      <span>Shift Room</span>
                    </button>

                    {/* Assign Substitute Button */}
                    <button
                      onClick={() => {
                        setActiveSubModal(entry);
                        const freeTeachers = getAvailableTeachersForSlot(entry.day, entry.slotId, entry.teacherId);
                        if (freeTeachers.length > 0) {
                          setSelectedSubTeacherId(freeTeachers[0].id);
                        }
                      }}
                      title="Assign a substitute teacher if primary faculty is absent"
                      className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-900 transition"
                    >
                      <ArrowRightLeft className="h-3 w-3 text-blue-600" />
                      <span>Substitute</span>
                    </button>

                    {/* Edit Session */}
                    <button
                      onClick={() => onEditEntry(entry)}
                      title="Edit class details or merge sections"
                      className="rounded-md border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Entry */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${subject?.name} from ${slot.label}?`)) {
                          deleteTimetableEntry(entry.id);
                        }
                      }}
                      title="Remove class"
                      className="rounded-md border border-slate-200 bg-white p-1 text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classroom Relocation Modal */}
      {activeRoomChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center gap-2 text-base font-bold text-amber-900 mb-1">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Shift Classroom & Broadcast Alert</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Moving this class will immediately notify faculty and students, displaying the new Room, Block, and Floor.
            </p>

            <form onSubmit={handleConfirmRoomChange} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Target Classroom (Block & Floor)
                </label>
                <select
                  value={selectedNewRoomId}
                  onChange={(e) => setSelectedNewRoomId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {classrooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} · {room.block} ({room.floor}) — Cap: {room.capacity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Room Shift
                </label>
                <input
                  type="text"
                  value={roomChangeReason}
                  onChange={(e) => setRoomChangeReason(e.target.value)}
                  placeholder="e.g. Projector failure, AC maintenance, capacity increase"
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRoomChangeModal(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
                >
                  Confirm Room Shift & Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Substitute Modal */}
      {activeSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center gap-2 text-base font-bold text-blue-900 mb-1">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <span>Assign Substitute Faculty</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Finding faculty free during {activeSubModal.day} {timeSlots.find(s => s.id === activeSubModal.slotId)?.label}.
            </p>

            {(() => {
              const freeTeachers = getAvailableTeachersForSlot(activeSubModal.day, activeSubModal.slotId, activeSubModal.teacherId);
              return (
                <form onSubmit={handleConfirmSubstitute} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available Free Teachers ({freeTeachers.length} available)
                    </label>
                    {freeTeachers.length > 0 ? (
                      <select
                        value={selectedSubTeacherId}
                        onChange={(e) => setSelectedSubTeacherId(e.target.value)}
                        className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800"
                      >
                        {freeTeachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.department}) · {t.cabin}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="rounded bg-rose-50 p-2 text-xs text-rose-700">
                        No free teachers available during this slot. Please choose another faculty manually or reschedule.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reason for Substitution
                    </label>
                    <input
                      type="text"
                      value={subReason}
                      onChange={(e) => setSubReason(e.target.value)}
                      placeholder="e.g. Primary teacher on emergency medical leave"
                      className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSubModal(null)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={freeTeachers.length === 0}
                      className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-400"
                    >
                      Assign Substitute
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
