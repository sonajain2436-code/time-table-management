import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Building2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart, 
  Layers, 
  MapPin,
  Trash2
} from 'lucide-react';
import { Teacher, Subject, Classroom } from '../types';
import { BRANCH_LIST, SEMESTER_LIST } from '../data/mockData';

export const HODSection: React.FC = () => {
  const {
    teachers,
    subjects,
    classrooms,
    timetableEntries,
    addTeacher,
    addSubject,
    addClassroom,
  } = useTimetable();

  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'subjects' | 'classrooms'>('overview');

  // New Teacher Form State
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherDesignation, setNewTeacherDesignation] = useState('Assistant Professor');
  const [newTeacherDept, setNewTeacherDept] = useState('Computer Science & Engineering');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherCabin, setNewTeacherCabin] = useState('Block B, Floor 2, Room 210');
  const [isHODRole, setIsHODRole] = useState(false);
  const [isSpecialistRole, setIsSpecialistRole] = useState(false);
  const [specialistSubjectInput, setSpecialistSubjectInput] = useState('');

  // New Subject Form State
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectBranch, setNewSubjectBranch] = useState('CSE');
  const [newSubjectSem, setNewSubjectSem] = useState(5);
  const [newSubjectPlannedHours, setNewSubjectPlannedHours] = useState(48);
  const [newSubjectTeacherId, setNewSubjectTeacherId] = useState(teachers[0]?.id || '');
  const [newSubjectType, setNewSubjectType] = useState<'theory' | 'lab' | 'remedial'>('theory');

  // New Classroom Form State
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newBlock, setNewBlock] = useState('Block B (Bhaskara)');
  const [newFloor, setNewFloor] = useState('2nd Floor');
  const [newCapacity, setNewCapacity] = useState(70);
  const [hasSmartBoard, setHasSmartBoard] = useState(true);
  const [hasAC, setHasAC] = useState(true);

  // Success notifications
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) return;

    addTeacher({
      name: newTeacherName,
      designation: newTeacherDesignation,
      department: newTeacherDept,
      email: newTeacherEmail,
      phone: newTeacherPhone || '+91 98290 00000',
      cabin: newTeacherCabin,
      isHOD: isHODRole,
      isSubjectSpecialist: isSpecialistRole,
      specialistSubjects: specialistSubjectInput ? [specialistSubjectInput] : [],
      status: 'available',
    });

    setFormSuccessMessage(`Faculty profile for ${newTeacherName} successfully created.`);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherPhone('');
    setSpecialistSubjectInput('');
    setTimeout(() => setFormSuccessMessage(null), 3500);
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName || !newSubjectCode) return;

    addSubject({
      code: newSubjectCode,
      name: newSubjectName,
      branch: newSubjectBranch,
      semester: newSubjectSem,
      totalPlannedHours: Number(newSubjectPlannedHours),
      completedHours: 0,
      specialistTeacherId: newSubjectTeacherId,
      type: newSubjectType,
      colorTag: 'blue',
    });

    setFormSuccessMessage(`Subject ${newSubjectName} (${newSubjectCode}) added to curriculum.`);
    setNewSubjectCode('');
    setNewSubjectName('');
    setTimeout(() => setFormSuccessMessage(null), 3500);
  };

  const handleAddClassroomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    addClassroom({
      roomNumber: newRoomNumber,
      block: newBlock,
      floor: newFloor,
      capacity: Number(newCapacity),
      type: 'lecture_hall',
      smartBoard: hasSmartBoard,
      airConditioned: hasAC,
    });

    setFormSuccessMessage(`Classroom ${newRoomNumber} added to ${newBlock}.`);
    setNewRoomNumber('');
    setTimeout(() => setFormSuccessMessage(null), 3500);
  };

  // Compute workload for each teacher
  const teacherWorkload = teachers.map((t) => {
    const assignedPeriods = timetableEntries.filter(
      (e) => e.teacherId === t.id || e.substituteTeacherId === t.id
    ).length;
    return {
      teacher: t,
      periods: assignedPeriods,
    };
  });

  return (
    <div className="space-y-5">
      {/* HOD Command Center Banner */}
      <div className="rounded-xl border border-slate-200 bg-[#002b49] p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold sm:text-lg">
                HOD Academic Secretariat & Department Administration
              </h2>
              <p className="text-xs text-blue-200">
                Dr. Sanjay Sharma · Head of Department, Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'overview' ? 'bg-white text-slate-900 shadow' : 'text-blue-100 hover:text-white'
              }`}
            >
              Overview & Load
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'teachers' ? 'bg-white text-slate-900 shadow' : 'text-blue-100 hover:text-white'
              }`}
            >
              + Add Faculty
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'subjects' ? 'bg-white text-slate-900 shadow' : 'text-blue-100 hover:text-white'
              }`}
            >
              + Add Subject
            </button>
            <button
              onClick={() => setActiveTab('classrooms')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeTab === 'classrooms' ? 'bg-white text-slate-900 shadow' : 'text-blue-100 hover:text-white'
              }`}
            >
              + Add Room
            </button>
          </div>
        </div>

        {formSuccessMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/40">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{formSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Tab: Overview & Faculty Load Breakdown */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Department Faculty</span>
              <div className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1">
                {teachers.length}
              </div>
              <span className="text-[11px] text-slate-500">Full-time Academic Members</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Curricular Courses</span>
              <div className="text-2xl font-black text-blue-700 font-mono tabular-nums mt-1">
                {subjects.length}
              </div>
              <span className="text-[11px] text-slate-500">Across Sem 1 - Sem 8</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Allocated Classrooms</span>
              <div className="text-2xl font-black text-amber-600 font-mono tabular-nums mt-1">
                {classrooms.length}
              </div>
              <span className="text-[11px] text-slate-500">Block A, B, C & Sports</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Weekly Total Periods</span>
              <div className="text-2xl font-black text-emerald-600 font-mono tabular-nums mt-1">
                {timetableEntries.length}
              </div>
              <span className="text-[11px] text-slate-500">Live Scheduled Classes</span>
            </div>
          </div>

          {/* Faculty Workload Table */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Faculty Workload & Commitment Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Weekly lecture distribution against AICTE / RTU normative standards (Target: 14–18 periods/wk)
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-900">
                  <tr>
                    <th className="py-2.5 px-3">Faculty Member</th>
                    <th className="py-2.5 px-3">Designation / Role</th>
                    <th className="py-2.5 px-3">Cabin Location</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Weekly Load</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherWorkload.map(({ teacher, periods }) => (
                    <tr key={teacher.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {teacher.name}
                        {teacher.isSubjectSpecialist && (
                          <span className="ml-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            Specialist
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{teacher.designation}</td>
                      <td className="py-2.5 px-3 text-slate-500">{teacher.cabin}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-semibold ${
                            teacher.status === 'available'
                              ? 'text-emerald-700'
                              : teacher.status === 'absent'
                              ? 'text-rose-700 font-bold'
                              : 'text-blue-700'
                          }`}
                        >
                          {teacher.status === 'available' && 'On Duty'}
                          {teacher.status === 'absent' && 'Absent (On Leave)'}
                          {teacher.status === 'duty_leave' && 'Duty Leave (DL)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {periods} Periods
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Add Teacher */}
      {activeTab === 'teachers' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Register New Faculty / Teacher Profile
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Add teachers, assign Subject Specialist status or HOD administrative designation.
          </p>

          <form onSubmit={handleAddTeacherSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (with Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ruchika"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation
                </label>
                <select
                  value={newTeacherDesignation}
                  onChange={(e) => setNewTeacherDesignation(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lab Instructor">Lab Instructor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ruchika.cse@jecrc.ac.in"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98290 12345"
                  value={newTeacherPhone}
                  onChange={(e) => setNewTeacherPhone(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cabin Location (Block & Floor)
              </label>
              <input
                type="text"
                value={newTeacherCabin}
                onChange={(e) => setNewTeacherCabin(e.target.value)}
                placeholder="e.g. Block B (Bhaskara), Floor 2, Cabin 208"
                className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
              />
            </div>

            {/* Checkbox Roles */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isSpecialistRole}
                  onChange={(e) => setIsSpecialistRole(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span>Designate as Subject Specialist</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isHODRole}
                  onChange={(e) => setIsHODRole(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span>HOD Administrative Privileges</span>
              </label>
            </div>

            {isSpecialistRole && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specialist Subject Domain
                </label>
                <input
                  type="text"
                  value={specialistSubjectInput}
                  onChange={(e) => setSpecialistSubjectInput(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms (DSA)"
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>
            )}

            <button
              type="submit"
              className="rounded-lg bg-[#002b49] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#001c30]"
            >
              Add Faculty Member
            </button>
          </form>
        </div>
      )}

      {/* Tab: Add Subject */}
      {activeTab === 'subjects' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Add New Academic Subject / Course
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Configure course code, planned syllabus hours, and assign specialist faculty.
          </p>

          <form onSubmit={handleAddSubjectSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-501"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms (DSA)"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch
                </label>
                <select
                  value={newSubjectBranch}
                  onChange={(e) => setNewSubjectBranch(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="CSE">CSE</option>
                  <option value="AI-DS">AI-DS</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  value={newSubjectSem}
                  onChange={(e) => setNewSubjectSem(Number(e.target.value))}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  {SEMESTER_LIST.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Planned Hours
                </label>
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={newSubjectPlannedHours}
                  onChange={(e) => setNewSubjectPlannedHours(Number(e.target.value))}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead / Specialist Faculty
              </label>
              <select
                value={newSubjectTeacherId}
                onChange={(e) => setNewSubjectTeacherId(e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.designation})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#002b49] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#001c30]"
            >
              Add Course to Curriculum
            </button>
          </form>
        </div>
      )}

      {/* Tab: Add Classroom */}
      {activeTab === 'classrooms' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Register New Classroom & Campus Infrastructure
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Define Block, Floor, Capacity, and Smart Facilities for conflict-free spatial routing.
          </p>

          <form onSubmit={handleAddClassroomSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Identifier / Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-206 or Audi-2"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Block / Building
                </label>
                <select
                  value={newBlock}
                  onChange={(e) => setNewBlock(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="Block B (Bhaskara)">Block B (Bhaskara)</option>
                  <option value="Block A (Aryabhata)">Block A (Aryabhata)</option>
                  <option value="Block C (Chanakya)">Block C (Chanakya)</option>
                  <option value="Workshop Complex">Workshop Complex</option>
                  <option value="Sports Arena">Sports Arena</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Floor Level
                </label>
                <select
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  min={20}
                  max={400}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={hasSmartBoard}
                  onChange={(e) => setHasSmartBoard(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span>Interactive Smart Board</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={hasAC}
                  onChange={(e) => setHasAC(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span>Air Conditioned</span>
              </label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#002b49] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#001c30]"
            >
              Save Classroom Infrastructure
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
