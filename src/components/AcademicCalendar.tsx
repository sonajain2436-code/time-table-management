import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Calendar as CalendarIcon, Plane, Sparkles, Plus, AlertCircle, MapPin, User, CheckCircle2 } from 'lucide-react';
import { CollegeEvent, Holiday } from '../types';

export const AcademicCalendar: React.FC = () => {
  const { events, holidays, teachers, addEvent, addHoliday, applyDutyLeave } = useTimetable();

  const [activeTab, setActiveTab] = useState<'events' | 'holidays'>('events');

  // New Event Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'seminar' | 'workshop' | 'hackathon' | 'fest' | 'sports'>('seminar');
  const [eventStartDate, setEventStartDate] = useState('2026-10-18');
  const [eventEndDate, setEventEndDate] = useState('2026-10-19');
  const [eventVenue, setEventVenue] = useState('Block C Auditorium & Seminar Hall');
  const [eventCoordinator, setEventCoordinator] = useState('Dr. Ruchika');
  const [eventContact, setEventContact] = useState('+91 98290 41234');
  const [eventDutyTeacherId, setEventDutyTeacherId] = useState('t-ruchika');

  // New Holiday Form State
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayDate, setHolidayDate] = useState('2026-10-24');
  const [holidayDay, setHolidayDay] = useState('Saturday');
  const [holidayType, setHolidayType] = useState<'gazetted' | 'festival' | 'exam'>('festival');
  const [holidayDesc, setHolidayDesc] = useState('College Holiday - All Teaching Suspended');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    addEvent({
      title: eventTitle,
      category: eventCategory,
      startDate: eventStartDate,
      endDate: eventEndDate,
      venue: eventVenue,
      coordinatorName: eventCoordinator,
      coordinatorContact: eventContact,
      department: 'CSE / Academic Affairs',
      description: `Official campus event: ${eventTitle}. Faculty assigned on Duty Leave.`,
      dutyLeaveTeacherIds: eventDutyTeacherId ? [eventDutyTeacherId] : [],
    });

    if (eventDutyTeacherId) {
      applyDutyLeave(eventDutyTeacherId, eventTitle, `Duty Leave for ${eventTitle}`);
    }

    setShowEventModal(false);
    setEventTitle('');
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle) return;

    addHoliday({
      title: holidayTitle,
      date: holidayDate,
      day: holidayDay,
      type: holidayType,
      description: holidayDesc,
    });

    setShowHolidayModal(false);
    setHolidayTitle('');
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Academic Calendar, Institutional Holidays & Duty Leave (DL)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Synchronize teaching schedules with gazetted holidays, Renaissance fest, and faculty research seminar Duty Leaves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'events' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Events & Duty Leaves ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('holidays')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === 'holidays' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Holidays & Off Days ({holidays.length})
              </button>
            </div>

            {activeTab === 'events' ? (
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Event / DL</span>
              </button>
            ) : (
              <button
                onClick={() => setShowHolidayModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Holiday</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab: Events & Seminars with Duty Leave */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => {
              const dutyTeachers = teachers.filter((t) =>
                event.dutyLeaveTeacherIds?.includes(t.id)
              );

              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-700 uppercase tracking-wider">
                        {event.category}
                      </span>
                      <span className="font-mono text-slate-500 font-medium">
                        {event.startDate} to {event.endDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-600">{event.description}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{event.venue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        Coordinator: <strong>{event.coordinatorName}</strong> ({event.coordinatorContact})
                      </span>
                    </div>

                    {/* Duty Leave Teachers Tag */}
                    {dutyTeachers.length > 0 && (
                      <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                          <Plane className="h-3.5 w-3.5 text-blue-700" />
                          <span>Approved Faculty on Duty Leave (DL):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {dutyTeachers.map((t) => (
                            <span
                              key={t.id}
                              className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-blue-800 ring-1 ring-blue-200"
                            >
                              {t.name} (Substitutes assigned for their lectures)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    JECRC Foundation College Event Secretariat
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Holidays */}
      {activeTab === 'holidays' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Institutional Holiday Schedule 2026 (Teaching Suspended Days)
            </h3>
            <span className="text-xs text-slate-500">
              Classes will automatically reflect holiday status on these days
            </span>
          </div>

          <div className="space-y-2.5">
            {holidays.map((hol) => (
              <div
                key={hol.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs transition hover:bg-white"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{hol.title}</span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                      {hol.type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-slate-500">{hol.description}</p>
                </div>

                <div className="mt-2 sm:mt-0 flex items-center gap-2 font-mono font-bold text-slate-800">
                  <span>{hol.date}</span>
                  <span className="text-slate-400">({hol.day})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add Academic Event / Seminar & Duty Leave
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Events will notify academic timetable coordinators and register Duty Leave for involved teachers.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Renaissance 2026 or IEEE National Conference"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="seminar">Seminar / Conference</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="fest">College Fest</option>
                    <option value="workshop">Workshop</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Coordinator Name
                  </label>
                  <input
                    type="text"
                    value={eventCoordinator}
                    onChange={(e) => setEventCoordinator(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={eventContact}
                    onChange={(e) => setEventContact(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Faculty to Duty Leave (DL)
                </label>
                <select
                  value={eventDutyTeacherId}
                  onChange={(e) => setEventDutyTeacherId(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="">None (No DL)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  Confirm Event & Schedule DL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add Official Institutional Holiday
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Marks date as off-campus holiday, preventing scheduling clashes.
            </p>

            <form onSubmit={handleCreateHoliday} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Holiday Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Break or Dussehra"
                  value={holidayTitle}
                  onChange={(e) => setHolidayTitle(e.target.value)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={holidayDate}
                    onChange={(e) => setHolidayDate(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day of Week
                  </label>
                  <input
                    type="text"
                    value={holidayDay}
                    onChange={(e) => setHolidayDay(e.target.value)}
                    className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classification
                </label>
                <select
                  value={holidayType}
                  onChange={(e) => setHolidayType(e.target.value as any)}
                  className="w-full rounded border border-slate-300 p-2 text-xs text-slate-800"
                >
                  <option value="festival">Festival Holiday</option>
                  <option value="gazetted">National Gazetted Holiday</option>
                  <option value="exam">Mid-Term / Examination Week</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHolidayModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
                >
                  Register Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
