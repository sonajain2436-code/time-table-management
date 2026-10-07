export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type ClassType = 'regular' | 'supplementary' | 'play' | 'lab' | 'workshop' | 'seminar';

export interface TimeSlot {
  id: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  label: string;
  isBreak?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string; // e.g., 'Associate Professor', 'Assistant Professor', 'HOD', 'Professor'
  department: string;  // e.g., 'Computer Science & Engineering'
  email: string;
  phone: string;
  cabin: string;       // e.g., 'Block B, 2nd Floor, Cabin 208'
  isHOD?: boolean;
  isSubjectSpecialist?: boolean;
  specialistSubjects: string[]; // e.g., ['Data Structures & Algorithms (DSA)']
  status: 'available' | 'absent' | 'duty_leave';
  leaveReason?: string;
  dutyLeaveEvent?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  branch: string;
  semester: number;
  totalPlannedHours: number;
  completedHours: number;
  specialistTeacherId: string;
  type: 'theory' | 'lab' | 'remedial' | 'practical';
  colorTag: string; // tailwind color indicator
}

export interface Classroom {
  id: string;
  roomNumber: string; // e.g., 'B-204', 'A-101', 'Audi-1'
  block: string;      // e.g., 'Block B (Bhaskara)', 'Block A (Aryabhata)', 'Block C (Chanakya)'
  floor: string;      // e.g., 'Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'
  capacity: number;
  type: 'lecture_hall' | 'computer_lab' | 'auditorium' | 'workshop_hall';
  smartBoard: boolean;
  airConditioned: boolean;
}

export interface WorkshopInfo {
  title: string;
  enrolledStudentCount: number;
  targetBatch: string; // e.g., 'CSE 3rd Year (Selected 45 Students)'
  objective?: string;
}

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  slotId: string;
  branch: string;       // e.g., 'CSE', 'AI-DS', 'IT', 'ECE'
  semester: number;     // e.g., 5 (3rd Year)
  section: string;      // e.g., 'A', 'B', 'C'
  subjectId: string;
  teacherId: string;
  roomId: string;
  classType: ClassType;
  
  // Substitute logic
  isSubstituted?: boolean;
  substituteTeacherId?: string;
  substituteReason?: string;
  
  // Merged classes logic
  isMerged?: boolean;
  mergedSections?: string[]; // e.g., ['CSE-A', 'CSE-B']
  mergeAlertMessage?: string;
  
  // Room change tracking
  originalRoomId?: string;
  isRoomChanged?: boolean;
  roomChangeTimestamp?: string;
  roomChangeNote?: string;
  
  // Workshop logic
  workshopDetails?: WorkshopInfo;
  
  topic?: string;
}

export interface RoomChangeAlert {
  id: string;
  timestamp: string;
  subjectName: string;
  teacherName: string;
  section: string;
  oldRoomNumber: string;
  oldBlock: string;
  newRoomNumber: string;
  newBlock: string;
  newFloor: string;
  reason?: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  category: 'seminar' | 'workshop' | 'hackathon' | 'fest' | 'sports' | 'conference';
  startDate: string;
  endDate: string;
  venue: string;
  coordinatorName: string;
  coordinatorContact: string;
  department: string;
  description: string;
  dutyLeaveTeacherIds: string[];
}

export interface Holiday {
  id: string;
  title: string;
  date: string;
  day: string;
  type: 'gazetted' | 'festival' | 'exam' | 'institutional';
  description?: string;
}

export interface EventCoordinator {
  id: string;
  name: string;
  role: string;
  category: string; // 'Hackathons & Coding', 'Cultural & Renaissance', 'Seminars & Research', 'Sports', 'Placement'
  department: string;
  email: string;
  phone: string;
  officeLocation: string;
}

export type TimetableFont = 'sans' | 'serif' | 'mono';
export type TimetableTheme = 'jecrc-navy' | 'slate-minimal' | 'ivory-academic' | 'cobalt-dark';
export type TimetableDensity = 'compact' | 'standard' | 'relaxed';

export interface TimetableCustomization {
  font: TimetableFont;
  theme: TimetableTheme;
  density: TimetableDensity;
}

export interface ClashResult {
  hasClash: boolean;
  reasons: string[];
  conflictingEntries: TimetableEntry[];
}
