import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Classroom,
  ClassType,
  ClashResult,
  CollegeEvent,
  DayOfWeek,
  EventCoordinator,
  Holiday,
  Subject,
  Teacher,
  TimeSlot,
  TimetableCustomization,
  TimetableEntry,
  RoomChangeAlert,
  WorkshopInfo
} from '../types';
import {
  INITIAL_CLASSROOMS,
  INITIAL_COORDINATORS,
  INITIAL_EVENTS,
  INITIAL_HOLIDAYS,
  INITIAL_ROOM_ALERTS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_TIME_SLOTS,
  INITIAL_TIMETABLE_ENTRIES
} from '../data/mockData';

interface TimetableContextType {
  timeSlots: TimeSlot[];
  teachers: Teacher[];
  classrooms: Classroom[];
  subjects: Subject[];
  timetableEntries: TimetableEntry[];
  roomAlerts: RoomChangeAlert[];
  events: CollegeEvent[];
  holidays: Holiday[];
  coordinators: EventCoordinator[];
  customization: TimetableCustomization;
  
  // Navigation / Active View State
  activeRole: 'teacher' | 'hod' | 'specialist' | 'student';
  setActiveRole: (role: 'teacher' | 'hod' | 'specialist' | 'student') => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedSemester: number;
  setSelectedSemester: (sem: number) => void;
  selectedSection: string;
  setSelectedSection: (sec: string) => void;
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;
  isAndroidSimMode: boolean;
  setIsAndroidSimMode: (val: boolean) => void;
  
  // Timetable Operations
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => { success: boolean; error?: string };
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => { success: boolean; error?: string };
  deleteTimetableEntry: (id: string) => void;
  checkClashes: (entry: Partial<TimetableEntry>, excludeEntryId?: string) => ClashResult;
  changeClassRoom: (entryId: string, newRoomId: string, reason: string) => boolean;
  
  // Faculty & Substitute Management
  markTeacherAbsent: (teacherId: string, reason: string) => void;
  markTeacherAvailable: (teacherId: string) => void;
  assignSubstitute: (entryId: string, substituteTeacherId: string, reason: string) => void;
  removeSubstitute: (entryId: string) => void;
  applyDutyLeave: (teacherId: string, eventName: string, reason?: string) => void;
  getAvailableTeachersForSlot: (day: DayOfWeek, slotId: string, excludeTeacherId?: string) => Teacher[];
  
  // Merged & Workshop Classes
  mergeClasses: (entryId: string, secondSection: string, roomId?: string) => void;
  addWorkshop: (workshopData: {
    day: DayOfWeek;
    slotId: string;
    branch: string;
    semester: number;
    section: string;
    subjectId: string;
    teacherId: string;
    roomId: string;
    workshopDetails: WorkshopInfo;
  }) => { success: boolean; error?: string };

  // Infrastructure & Entities
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  addClassroom: (room: Omit<Classroom, 'id'>) => void;
  addEvent: (event: Omit<CollegeEvent, 'id'>) => void;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  updateSubjectHours: (subjectId: string, completedHours: number) => void;
  
  // Customization & Alerts
  setCustomization: React.Dispatch<React.SetStateAction<TimetableCustomization>>;
  dismissRoomAlert: (alertId: string) => void;
  clearAllRoomAlerts: () => void;
  resetAllData: () => void;
}

const TimetableContext = createContext<TimetableContextType | null>(null);

const STORAGE_KEY_PREFIX = 'jecrc_timetable_v1_';

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}teachers`);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}classrooms`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSROOMS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subjects`);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}entries`);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE_ENTRIES;
  });

  const [roomAlerts, setRoomAlerts] = useState<RoomChangeAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}room_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ROOM_ALERTS;
  });

  const [events, setEvents] = useState<CollegeEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}holidays`);
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAYS;
  });

  const [coordinators] = useState<EventCoordinator[]>(INITIAL_COORDINATORS);

  const [customization, setCustomization] = useState<TimetableCustomization>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}customization`);
    return saved
      ? JSON.parse(saved)
      : { font: 'sans', theme: 'jecrc-navy', density: 'standard' };
  });

  // UI Navigation states
  const [activeRole, setActiveRole] = useState<'teacher' | 'hod' | 'specialist' | 'student'>('teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-ruchika'); // default to Dr. Ruchika
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [isAndroidSimMode, setIsAndroidSimMode] = useState<boolean>(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}teachers`, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}classrooms`, JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}entries`, JSON.stringify(timetableEntries));
  }, [timetableEntries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}room_alerts`, JSON.stringify(roomAlerts));
  }, [roomAlerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}holidays`, JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}customization`, JSON.stringify(customization));
  }, [customization]);

  // Clash Detection Engine
  const checkClashes = (entry: Partial<TimetableEntry>, excludeEntryId?: string): ClashResult => {
    const reasons: string[] = [];
    const conflictingEntries: TimetableEntry[] = [];

    if (!entry.day || !entry.slotId) {
      return { hasClash: false, reasons, conflictingEntries };
    }

    const sameSlotEntries = timetableEntries.filter(
      (e) => e.day === entry.day && e.slotId === entry.slotId && e.id !== excludeEntryId
    );

    // 1. Teacher Clash
    if (entry.teacherId) {
      const teacherClash = sameSlotEntries.find(
        (e) => (e.teacherId === entry.teacherId || e.substituteTeacherId === entry.teacherId)
      );
      if (teacherClash) {
        const teacherObj = teachers.find((t) => t.id === entry.teacherId);
        const subjObj = subjects.find((s) => s.id === teacherClash.subjectId);
        reasons.push(
          `Teacher Conflict: ${teacherObj?.name || 'Selected faculty'} is already assigned to ${teacherClash.branch}-${teacherClash.semester}${teacherClash.section} (${subjObj?.name || 'Subject'}) during this slot.`
        );
        conflictingEntries.push(teacherClash);
      }
    }

    // 2. Room Clash
    if (entry.roomId) {
      const roomClash = sameSlotEntries.find((e) => e.roomId === entry.roomId);
      if (roomClash) {
        const roomObj = classrooms.find((r) => r.id === entry.roomId);
        const subjObj = subjects.find((s) => s.id === roomClash.subjectId);
        reasons.push(
          `Room Occupancy Conflict: Room ${roomObj?.roomNumber || 'Selected room'} (${roomObj?.block || ''}) is already booked by ${roomClash.branch}-${roomClash.semester}${roomClash.section} for ${subjObj?.name || 'another class'}.`
        );
        conflictingEntries.push(roomClash);
      }
    }

    // 3. Section Clash (Only if not a merged class)
    if (entry.branch && entry.semester && entry.section) {
      const sectionClash = sameSlotEntries.find(
        (e) =>
          e.branch === entry.branch &&
          e.semester === entry.semester &&
          (e.section === entry.section || (e.mergedSections && e.mergedSections.includes(`${entry.branch}-${entry.semester}${entry.section}`)))
      );
      if (sectionClash) {
        const subjObj = subjects.find((s) => s.id === sectionClash.subjectId);
        reasons.push(
          `Section Overlap: Class ${entry.branch} Sem-${entry.semester} Sec-${entry.section} already has a scheduled class (${subjObj?.name || 'Subject'}) at this hour.`
        );
        conflictingEntries.push(sectionClash);
      }
    }

    return {
      hasClash: reasons.length > 0,
      reasons,
      conflictingEntries
    };
  };

  const addTimetableEntry = (newEntry: Omit<TimetableEntry, 'id'>) => {
    const clash = checkClashes(newEntry);
    if (clash.hasClash) {
      return { success: false, error: clash.reasons.join('\n') };
    }

    const entry: TimetableEntry = {
      ...newEntry,
      id: `tt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setTimetableEntries((prev) => [...prev, entry]);
    return { success: true };
  };

  const updateTimetableEntry = (id: string, updates: Partial<TimetableEntry>) => {
    const current = timetableEntries.find((e) => e.id === id);
    if (!current) return { success: false, error: 'Entry not found' };

    const merged = { ...current, ...updates };
    const clash = checkClashes(merged, id);
    if (clash.hasClash) {
      return { success: false, error: clash.reasons.join('\n') };
    }

    setTimetableEntries((prev) => prev.map((e) => (e.id === id ? merged : e)));
    return { success: true };
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetableEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Classroom Change & Real-Time Alert Broadcast
  const changeClassRoom = (entryId: string, newRoomId: string, reason: string): boolean => {
    const entry = timetableEntries.find((e) => e.id === entryId);
    if (!entry) return false;

    // Check if new room is occupied in that slot
    const slotBusy = timetableEntries.find(
      (e) => e.id !== entryId && e.day === entry.day && e.slotId === entry.slotId && e.roomId === newRoomId
    );
    if (slotBusy) return false;

    const oldRoom = classrooms.find((r) => r.id === entry.roomId);
    const newRoom = classrooms.find((r) => r.id === newRoomId);
    const subject = subjects.find((s) => s.id === entry.subjectId);
    const teacher = teachers.find((t) => t.id === entry.teacherId);

    if (!newRoom) return false;

    const updatedEntry: TimetableEntry = {
      ...entry,
      originalRoomId: entry.originalRoomId || entry.roomId,
      roomId: newRoomId,
      isRoomChanged: true,
      roomChangeTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomChangeNote: reason,
    };

    // Add alert banner
    const newAlert: RoomChangeAlert = {
      id: `alert-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      subjectName: subject?.name || 'Lecture',
      teacherName: teacher?.name || 'Faculty',
      section: `${entry.branch}-${entry.semester}${entry.section}`,
      oldRoomNumber: oldRoom?.roomNumber || 'Previous Room',
      oldBlock: oldRoom?.block || 'Block Unspecified',
      newRoomNumber: newRoom.roomNumber,
      newBlock: newRoom.block,
      newFloor: newRoom.floor,
      reason,
    };

    setTimetableEntries((prev) => prev.map((e) => (e.id === entryId ? updatedEntry : e)));
    setRoomAlerts((prev) => [newAlert, ...prev]);
    return true;
  };

  // Faculty status & substitution
  const markTeacherAbsent = (teacherId: string, reason: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, status: 'absent', leaveReason: reason } : t))
    );
  };

  const markTeacherAvailable = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, status: 'available', leaveReason: undefined, dutyLeaveEvent: undefined } : t))
    );
  };

  const applyDutyLeave = (teacherId: string, eventName: string, reason?: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teacherId
          ? {
              ...t,
              status: 'duty_leave',
              dutyLeaveEvent: eventName,
              leaveReason: reason || `On Duty Leave for ${eventName}`,
            }
          : t
      )
    );
  };

  const assignSubstitute = (entryId: string, substituteTeacherId: string, reason: string) => {
    setTimetableEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              isSubstituted: true,
              substituteTeacherId,
              substituteReason: reason,
            }
          : e
      )
    );
  };

  const removeSubstitute = (entryId: string) => {
    setTimetableEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              isSubstituted: false,
              substituteTeacherId: undefined,
              substituteReason: undefined,
            }
          : e
      )
    );
  };

  const getAvailableTeachersForSlot = (day: DayOfWeek, slotId: string, excludeTeacherId?: string): Teacher[] => {
    // Teachers who don't have a class in this day/slot and are 'available'
    const busyTeacherIds = new Set(
      timetableEntries
        .filter((e) => e.day === day && e.slotId === slotId)
        .map((e) => e.substituteTeacherId || e.teacherId)
    );

    return teachers.filter((t) => {
      if (t.id === excludeTeacherId) return false;
      if (t.status === 'absent' || t.status === 'duty_leave') return false;
      return !busyTeacherIds.has(t.id);
    });
  };

  const mergeClasses = (entryId: string, secondSection: string, roomId?: string) => {
    const entry = timetableEntries.find((e) => e.id === entryId);
    if (!entry) return;

    const targetRoom = roomId || 'room-audi1'; // Default to large auditorium
    const primaryCode = `${entry.branch}-${entry.semester}${entry.section}`;
    const mergedCode = `${entry.branch}-${entry.semester}${secondSection}`;

    setTimetableEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              roomId: targetRoom,
              isMerged: true,
              mergedSections: [primaryCode, mergedCode],
              mergeAlertMessage: `Merged Class: ${primaryCode} and ${mergedCode} combined in ${
                classrooms.find((r) => r.id === targetRoom)?.roomNumber || 'Auditorium'
              }`,
            }
          : e
      )
    );
  };

  const addWorkshop = (workshopData: {
    day: DayOfWeek;
    slotId: string;
    branch: string;
    semester: number;
    section: string;
    subjectId: string;
    teacherId: string;
    roomId: string;
    workshopDetails: WorkshopInfo;
  }) => {
    const entryData: Omit<TimetableEntry, 'id'> = {
      ...workshopData,
      classType: 'workshop',
      topic: `${workshopData.workshopDetails.title} (${workshopData.workshopDetails.enrolledStudentCount} Students)`,
    };
    return addTimetableEntry(entryData);
  };

  const addTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const teacher: Teacher = {
      ...newTeacher,
      id: `t-${Date.now()}`,
    };
    setTeachers((prev) => [...prev, teacher]);
  };

  const addSubject = (newSubject: Omit<Subject, 'id'>) => {
    const subject: Subject = {
      ...newSubject,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, subject]);
  };

  const addClassroom = (newRoom: Omit<Classroom, 'id'>) => {
    const room: Classroom = {
      ...newRoom,
      id: `room-${Date.now()}`,
    };
    setClassrooms((prev) => [...prev, room]);
  };

  const addEvent = (newEvent: Omit<CollegeEvent, 'id'>) => {
    const event: CollegeEvent = {
      ...newEvent,
      id: `event-${Date.now()}`,
    };
    setEvents((prev) => [event, ...prev]);
  };

  const addHoliday = (newHoliday: Omit<Holiday, 'id'>) => {
    const holiday: Holiday = {
      ...newHoliday,
      id: `hol-${Date.now()}`,
    };
    setHolidays((prev) => [holiday, ...prev]);
  };

  const updateSubjectHours = (subjectId: string, completedHours: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, completedHours } : s))
    );
  };

  const dismissRoomAlert = (alertId: string) => {
    setRoomAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const clearAllRoomAlerts = () => {
    setRoomAlerts([]);
  };

  const resetAllData = () => {
    setTeachers(INITIAL_TEACHERS);
    setClassrooms(INITIAL_CLASSROOMS);
    setSubjects(INITIAL_SUBJECTS);
    setTimetableEntries(INITIAL_TIMETABLE_ENTRIES);
    setRoomAlerts(INITIAL_ROOM_ALERTS);
    setEvents(INITIAL_EVENTS);
    setHolidays(INITIAL_HOLIDAYS);
    setCustomization({ font: 'sans', theme: 'jecrc-navy', density: 'standard' });
    localStorage.clear();
  };

  return (
    <TimetableContext.Provider
      value={{
        timeSlots,
        teachers,
        classrooms,
        subjects,
        timetableEntries,
        roomAlerts,
        events,
        holidays,
        coordinators,
        customization,
        activeRole,
        setActiveRole,
        selectedTeacherId,
        setSelectedTeacherId,
        selectedBranch,
        setSelectedBranch,
        selectedSemester,
        setSelectedSemester,
        selectedSection,
        setSelectedSection,
        selectedDay,
        setSelectedDay,
        isAndroidSimMode,
        setIsAndroidSimMode,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        checkClashes,
        changeClassRoom,
        markTeacherAbsent,
        markTeacherAvailable,
        assignSubstitute,
        removeSubstitute,
        applyDutyLeave,
        getAvailableTeachersForSlot,
        mergeClasses,
        addWorkshop,
        addTeacher,
        addSubject,
        addClassroom,
        addEvent,
        addHoliday,
        updateSubjectHours,
        setCustomization,
        dismissRoomAlert,
        clearAllRoomAlerts,
        resetAllData,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
