import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertOctagon, 
  Plane, 
  Sparkles, 
  ArrowRightLeft, 
  BookOpen, 
  Phone, 
  Mail,
  Plus
} from 'lucide-react';
import { DayOfWeek, TimetableEntry } from '../types';

interface TeacherSectionProps {
  onOpenClassModal: () => void;
  onEditEntry: (entry: TimetableEntry) => void;
}

export const TeacherSection: React.FC<TeacherSectionProps> = ({
  onOpenClassModal,
  onEditEntry,
}) => {
  const {
    teachers,
    selectedTeacherId,
    setSelectedTeacherId,
    timetableEntries,
    classrooms,
    subjects,
    timeSlots,
    markTeacherAbsent,
    markTeacherAvailable,
    applyDutyLeave,
    addWorkshop,
    changeClassRoom,
    assignSubstitute,
    getAvailableTeachersForSlot,
  } = useTimetable();

  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  // Modals inside teacher section
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  const [absentReason, setAbsentReason] = useState('Personal Emergency Leave');

  const [showDutyLeaveModal, setShowDutyLeaveModal] = useState(false);
  const [dutyLeaveEvent, setDutyLeaveEvent] = useState('IEEE National Conference / Research Symposium');

  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [workshopDay, setWorkshopDay] = useState<DayOfWeek>('Tuesday');
  const [workshopSlotId, setWorkshopSlotId] = useState('slot-4');
  const [workshopTitle, setWorkshopTitle] = useState('DSA Graph & Dynamic Programming Masterclass');
  const [workshopStudentCount, setWorkshopStudentCount] = useState(48);
  const [workshopBatch, setWorkshopBatch] = useState('CSE 3rd Year Shortlisted Coders');
  const [workshopRoomId, setWorkshopRoomId] = useState('room-b205');
  const [workshopSubjectId, setWorkshopSubjectId] = useState('sub-workshop-dsa');

  // Filter classes taught by this teacher (or where this teacher is assigned as substitute)
  const teacherEntries = timetableEntries.filter(
    (e) => e.teacherId === currentTeacher.id || e.substituteTeacherId === currentTeacher.id
  );

  // Today's classes
  const todayName = 'Monday'; // Default simulation day
  const todaysClasses = teacherEntries.filter((e) => e.day === todayName);

  const handleApplyWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addWorkshop({
      day: workshopDay,
      slotId: workshopSlotId,
      branch: 'CSE',
      semester: 5,
      section: 'A',
      subjectId: workshopSubjectId,
      teacherId: currentTeacher.id,
      roomId: workshopRoomId,
      workshopDetails: {
        title: workshopTitle,
        enrolledStudentCount: Number(workshopStudentCount),
        targetBatch: workshopBatch,
      },
    });

    if (res.success) {
      setShowWorkshopModal(false);
    } else {
      alert(`Workshop could not be added due to clash:\n${res.error}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Teacher Profile & Status Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#002b49] text-white shadow-md">
              <span className="text-xl font-black">
                {currentTeacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Faculty Switcher Dropdown */}
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.designation})
                    </option>
                  ))}
                </select>

                {currentTeacher.isSubjectSpecialist && (
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                    Subject Specialist
                  </span>
                )}
                {currentTeacher.isHOD && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                    HOD
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-600">
                {currentTeacher.department} · {currentTeacher.cabin}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {currentTeacher.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {currentTeacher.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Teacher Status Controls & Leave Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => markTeacherAvailable(currentTeacher.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  currentTeacher.status === 'available'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Available on Duty
              </button>

              <button
                onClick={() => setShowAbsentModal(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  currentTeacher.status === 'absent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mark Absent
              </button>

              <button
                onClick={() => setShowDutyLeaveModal(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  currentTeacher.status === 'duty_leave'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Duty Leave (DL)
              </button>
            </div>

            <button
              onClick={() => setShowWorkshopModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-purple-700 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-800 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>+ Add Student Workshop</span>
            </button>
          </div>
        </div>

        {/* Current Status Message */}
        {currentTeacher.status !== 'available' && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-amber-700 shrink-0" />
              <span>
                <strong>Notice:</strong> {currentTeacher.name} is marked as{' '}
                <span className="font-bold underline">{currentTeacher.status.toUpperCase()}</span>.
                Reason: {currentTeacher.leaveReason || currentTeacher.dutyLeaveEvent}.
              </span>
            </div>
            <button
              onClick={() => markTeacherAvailable(currentTeacher.id)}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Set Available
            </button>
          </div>
        )}
      </div>

      {/* Specialist Subject Focus (Especially for Dr. Ruchika - DSA) */}
      {currentTeacher.isSubjectSpecialist && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-700" />
              <h3 className="text-xs font-bold text-blue-900">
                Specialist Portfolio & Teaching Allocation: {currentTeacher.specialistSubjects.join(', ')}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-blue-800">
              Assigned to: CSE-5A, CSE-5B, IT-5A
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {currentTeacher.name} is designated by JECRC Academic Council for theoretical mastery, hands-on lab algorithmic problem solving, and special batch workshops.
          </p>
        </div>
      )}

      {/* Weekly Schedule for Selected Teacher */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Weekly Teaching Engagements ({teacherEntries.length} Assigned Periods)
            </h3>
            <p className="text-xs text-slate-500">
              Detailed list of lectures, labs, workshops, and doubt clearing sessions
            </p>
          </div>

          <button
            onClick={onOpenClassModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#002b49] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#001c30] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule New Slot</span>
          </button>
        </div>

        {teacherEntries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No active periods scheduled for {currentTeacher.name} currently.
          </div>
        ) : (
          <div className="space-y-3">
            {teacherEntries.map((entry) => {
              const slot = timeSlots.find((s) => s.id === entry.slotId);
              const subject = subjects.find((s) => s.id === entry.subjectId);
              const room = classrooms.find((r) => r.id === entry.roomId);
              const subTeacher = teachers.find((t) => t.id === entry.substituteTeacherId);

              return (
                <div
                  key={entry.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-3.5 text-xs transition ${
                    entry.isMerged
                      ? 'border-blue-300 bg-blue-50/30'
                      : entry.isRoomChanged
                      ? 'border-amber-300 bg-amber-50/30'
                      : entry.classType === 'workshop'
                      ? 'border-purple-300 bg-purple-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-800">
                        {entry.day}
                      </span>
                      <span className="font-mono text-slate-600">
                        {slot?.startTime} - {slot?.endTime} ({slot?.label})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-blue-700">
                        {entry.branch}-{entry.semester}{entry.section}
                      </span>
                      {entry.isMerged && (
                        <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          Merged with {entry.mergedSections?.join(' & ')}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {subject?.name}
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        ({subject?.code})
                      </span>
                    </div>

                    {entry.topic && (
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-700">Topic:</span> {entry.topic}
                      </p>
                    )}

                    {entry.workshopDetails && (
                      <p className="text-purple-800 font-semibold">
                        Workshop: {entry.workshopDetails.title} ({entry.workshopDetails.enrolledStudentCount} Students enrolled)
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      <span>
                        Room: <strong>{room?.roomNumber}</strong> ({room?.block}, {room?.floor})
                      </span>
                      {entry.isRoomChanged && (
                        <span className="text-amber-700 font-bold">
                          [Room Shift Alert Active]
                        </span>
                      )}
                    </div>

                    {entry.isSubstituted && (
                      <div className="rounded bg-rose-50 px-2 py-0.5 text-rose-800 font-medium">
                        Covered by Substitute: {subTeacher?.name} ({entry.substituteReason})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <button
                      onClick={() => onEditEntry(entry)}
                      className="rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mark Absent Modal */}
      {showAbsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-base font-bold text-rose-900 mb-1">
              Mark {currentTeacher.name} as Absent
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              System will notify the HOD and allow substituting other available faculty for today's classes.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                markTeacherAbsent(currentTeacher.id, absentReason);
                setShowAbsentModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Absence / Leave
                </label>
                <input
                  type="text"
                  value={absentReason}
                  onChange={(e) => setAbsentReason(e.target.value)}
                  placeholder="e.g. Health emergency / Unavoidable circumstance"
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAbsentModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
                >
                  Confirm Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duty Leave (DL) Modal */}
      {showDutyLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center gap-2 text-base font-bold text-blue-900 mb-1">
              <Plane className="h-5 w-5 text-blue-600" />
              <span>Apply Duty Leave (DL) for Official Event</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Duty Leave (DL) is granted for conferences, hackathons, academic seminars, and paper presentations.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyDutyLeave(currentTeacher.id, dutyLeaveEvent);
                setShowDutyLeaveModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event / Seminar Title
                </label>
                <input
                  type="text"
                  value={dutyLeaveEvent}
                  onChange={(e) => setDutyLeaveEvent(e.target.value)}
                  placeholder="e.g. IEEE Distributed Systems International Symposium"
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDutyLeaveModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  Submit DL Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Workshop Modal */}
      {showWorkshopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center gap-2 text-base font-bold text-purple-900 mb-1">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Schedule Student Workshop with Headcount</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Enables teachers to conduct targeted workshops for selected student numbers.
            </p>

            <form onSubmit={handleApplyWorkshop} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workshop Title & Topic
                </label>
                <input
                  type="text"
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day
                  </label>
                  <select
                    value={workshopDay}
                    onChange={(e) => setWorkshopDay(e.target.value as DayOfWeek)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={workshopSlotId}
                    onChange={(e) => setWorkshopSlotId(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    {timeSlots
                      .filter((s) => !s.isBreak)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} ({s.startTime})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={workshopStudentCount}
                    onChange={(e) => setWorkshopStudentCount(Number(e.target.value))}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Classroom Venue
                  </label>
                  <select
                    value={workshopRoomId}
                    onChange={(e) => setWorkshopRoomId(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    {classrooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.block})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Student Group / Batch
                </label>
                <input
                  type="text"
                  value={workshopBatch}
                  onChange={(e) => setWorkshopBatch(e.target.value)}
                  placeholder="e.g. 3rd Year Placement & Hackathon Aspirants"
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWorkshopModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-purple-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-purple-800"
                >
                  Add Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
