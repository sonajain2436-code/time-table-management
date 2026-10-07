import React, { useState, useEffect } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  DayOfWeek, 
  ClassType, 
  TimetableEntry, 
  WorkshopInfo 
} from '../types';
import { AlertCircle, CheckCircle2, Users, MapPin, X, Sparkles } from 'lucide-react';
import { BRANCH_LIST, SECTION_LIST, SEMESTER_LIST } from '../data/mockData';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEntry?: TimetableEntry | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  initialEntry,
}) => {
  const {
    timeSlots,
    teachers,
    classrooms,
    subjects,
    addTimetableEntry,
    updateTimetableEntry,
    checkClashes,
  } = useTimetable();

  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [slotId, setSlotId] = useState<string>('slot-1');
  const [branch, setBranch] = useState<string>('CSE');
  const [semester, setSemester] = useState<number>(5);
  const [section, setSection] = useState<string>('A');
  const [subjectId, setSubjectId] = useState<string>('sub-dsa');
  const [teacherId, setTeacherId] = useState<string>('t-ruchika');
  const [roomId, setRoomId] = useState<string>('room-b204');
  const [classType, setClassType] = useState<ClassType>('regular');
  const [topic, setTopic] = useState<string>('');

  // Merged Class State
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [secondSection, setSecondSection] = useState<string>('B');

  // Workshop Details State
  const [workshopTitle, setWorkshopTitle] = useState<string>('');
  const [enrolledStudentCount, setEnrolledStudentCount] = useState<number>(45);
  const [targetBatch, setTargetBatch] = useState<string>('Selected CSE 3rd Year Coders');

  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if initialEntry is provided for edit
  useEffect(() => {
    if (initialEntry) {
      setDay(initialEntry.day);
      setSlotId(initialEntry.slotId);
      setBranch(initialEntry.branch);
      setSemester(initialEntry.semester);
      setSection(initialEntry.section);
      setSubjectId(initialEntry.subjectId);
      setTeacherId(initialEntry.teacherId);
      setRoomId(initialEntry.roomId);
      setClassType(initialEntry.classType);
      setTopic(initialEntry.topic || '');
      setIsMerged(!!initialEntry.isMerged);
      if (initialEntry.mergedSections && initialEntry.mergedSections.length > 1) {
        setSecondSection(initialEntry.mergedSections[1].replace(`${initialEntry.branch}-${initialEntry.semester}`, ''));
      }
      if (initialEntry.workshopDetails) {
        setWorkshopTitle(initialEntry.workshopDetails.title);
        setEnrolledStudentCount(initialEntry.workshopDetails.enrolledStudentCount);
        setTargetBatch(initialEntry.workshopDetails.targetBatch);
      }
    } else {
      // Default to standard state
      setDay('Monday');
      setSlotId('slot-1');
      setBranch('CSE');
      setSemester(5);
      setSection('A');
      setSubjectId('sub-dsa');
      setTeacherId('t-ruchika');
      setRoomId('room-b204');
      setClassType('regular');
      setTopic('');
      setIsMerged(false);
      setWorkshopTitle('');
      setEnrolledStudentCount(45);
    }
    setFormError(null);
  }, [initialEntry, isOpen]);

  if (!isOpen) return null;

  // Real-time Clash Verification
  const currentPreviewData: Partial<TimetableEntry> = {
    day,
    slotId,
    branch,
    semester,
    section,
    teacherId,
    roomId,
  };

  const clashCheck = checkClashes(currentPreviewData, initialEntry?.id);
  const selectedRoomObj = classrooms.find((r) => r.id === roomId);
  const selectedTeacherObj = teachers.find((t) => t.id === teacherId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (clashCheck.hasClash) {
      setFormError('Cannot save schedule due to the detected scheduling clash. Please choose an alternate slot, teacher, or classroom.');
      return;
    }

    let workshopDetails: WorkshopInfo | undefined = undefined;
    if (classType === 'workshop') {
      workshopDetails = {
        title: workshopTitle || 'Technical Masterclass',
        enrolledStudentCount: Number(enrolledStudentCount) || 40,
        targetBatch: targetBatch || `${branch}-${semester}${section}`,
      };
    }

    const mergedSections = isMerged ? [`${branch}-${semester}${section}`, `${branch}-${semester}${secondSection}`] : undefined;
    const mergeAlertMessage = isMerged ? `Merged Class: ${branch}-${semester}${section} & ${branch}-${semester}${secondSection} in ${selectedRoomObj?.roomNumber}` : undefined;

    const payload = {
      day,
      slotId,
      branch,
      semester,
      section,
      subjectId,
      teacherId,
      roomId,
      classType,
      topic,
      isMerged,
      mergedSections,
      mergeAlertMessage,
      workshopDetails,
    };

    if (initialEntry) {
      const res = updateTimetableEntry(initialEntry.id, payload);
      if (!res.success) {
        setFormError(res.error || 'Failed to update entry');
        return;
      }
    } else {
      const res = addTimetableEntry(payload);
      if (!res.success) {
        setFormError(res.error || 'Failed to add entry');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#002b49] px-6 py-4 rounded-t-xl text-white">
          <div>
            <h3 className="text-base font-bold">
              {initialEntry ? 'Edit Scheduled Class' : 'Schedule Academic Session & Check Clash'}
            </h3>
            <p className="text-xs text-blue-200">
              Institutional timetable verification engine with real-time clash alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-blue-200 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clash Warning / Status Banner */}
        <div className="px-6 pt-4">
          {clashCheck.hasClash ? (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3.5 text-xs text-red-900">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>Scheduling Clash Detected! Cannot overlap resource:</span>
              </div>
              <ul className="mt-1.5 list-disc pl-5 space-y-1 font-medium">
                {clashCheck.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Conflict Free Slot:</strong> {selectedTeacherObj?.name} and Room {selectedRoomObj?.roomNumber} are available on {day} ({timeSlots.find(s => s.id === slotId)?.startTime} - {timeSlots.find(s => s.id === slotId)?.endTime}).
              </span>
            </div>
          )}

          {formError && (
            <div className="mt-2 rounded-lg bg-red-100 p-2 text-xs text-red-700">
              {formError}
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Day & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Day of Week
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
                Lecture Time Slot
              </label>
              <select
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {timeSlots
                  .filter((s) => !s.isBreak)
                  .map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label} ({slot.startTime} - {slot.endTime})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Branch, Semester, Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="CSE">CSE</option>
                <option value="AI-DS">AI-DS</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester / Year
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {SEMESTER_LIST.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem} ({Math.ceil(sem / 2)} Year)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {SECTION_LIST.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject & Teacher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  const subj = subjects.find(s => s.id === e.target.value);
                  if (subj) setTeacherId(subj.specialistTeacherId);
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teacher / Faculty
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.isHOD ? '(HOD)' : ''} {t.isSubjectSpecialist ? '★ Specialist' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Classroom with Block & Floor details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Classroom & Location (Block & Floor)
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {classrooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomNumber} · {room.block} ({room.floor}) — Cap: {room.capacity} students
                </option>
              ))}
            </select>
            {selectedRoomObj && (
              <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>
                  Located in {selectedRoomObj.block}, {selectedRoomObj.floor}. Smart Board: {selectedRoomObj.smartBoard ? 'Yes' : 'No'} · AC: {selectedRoomObj.airConditioned ? 'Yes' : 'No'}
                </span>
              </p>
            )}
          </div>

          {/* Class Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'regular' as ClassType, label: 'Regular Lecture' },
                { type: 'supplementary' as ClassType, label: 'Supplementary / Doubt' },
                { type: 'play' as ClassType, label: 'Play / Sports / Activity' },
                { type: 'lab' as ClassType, label: 'Practical Lab' },
                { type: 'workshop' as ClassType, label: 'Special Workshop' },
                { type: 'seminar' as ClassType, label: 'Seminar / Guest Talk' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setClassType(item.type)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition ${
                    classType === item.type
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Merged Class Option */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Merge with Another Section (Joint Lecture)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Combines two sections (e.g. CSE-5A + CSE-5B) into a single venue (e.g., Auditorium or B-204)
                </p>
              </div>
              <input
                type="checkbox"
                checked={isMerged}
                onChange={(e) => setIsMerged(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {isMerged && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-700">Merge with section:</span>
                <select
                  value={secondSection}
                  onChange={(e) => setSecondSection(e.target.value)}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
                >
                  {SECTION_LIST.filter(s => s !== section).map(sec => (
                    <option key={sec} value={sec}>
                      Section {sec} ({branch}-{semester}{sec})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] font-semibold text-amber-700">
                  ⚠️ Alert badge will be shown to both batches
                </span>
              </div>
            )}
          </div>

          {/* Workshop Details if workshop selected */}
          {classType === 'workshop' && (
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Workshop Configuration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                    Workshop Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced Graph DP Masterclass"
                    value={workshopTitle}
                    onChange={(e) => setWorkshopTitle(e.target.value)}
                    className="w-full rounded border border-purple-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                    Enrolled Students Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={enrolledStudentCount}
                    onChange={(e) => setEnrolledStudentCount(Number(e.target.value))}
                    className="w-full rounded border border-purple-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                  Target Student Group / Batch
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE Placement Aspirants Batch 1"
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full rounded border border-purple-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* Lecture Topic */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lecture Topic / Syllabus Unit
            </label>
            <input
              type="text"
              placeholder="e.g. Binary Search Trees & AVL Tree Rotations"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={clashCheck.hasClash}
              className={`px-5 py-2 text-xs font-bold rounded-lg text-white shadow-sm transition ${
                clashCheck.hasClash
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#002b49] hover:bg-[#001c30] active:scale-95'
              }`}
            >
              {initialEntry ? 'Save Changes' : 'Confirm & Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
