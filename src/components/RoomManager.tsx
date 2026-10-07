import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Building2, MapPin, Clock, Users, CheckCircle2, AlertTriangle, Monitor, Wind } from 'lucide-react';
import { DayOfWeek } from '../types';

export const RoomManager: React.FC = () => {
  const { classrooms, timetableEntries, timeSlots, subjects, teachers } = useTimetable();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('all');

  const blocks = Array.from(new Set(classrooms.map((r) => r.block)));

  const filteredRooms = classrooms.filter((r) =>
    selectedBlockFilter === 'all' ? true : r.block === selectedBlockFilter
  );

  return (
    <div className="space-y-5">
      {/* Header & Block Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Classroom Infrastructure & Spatial Occupancy (Block & Floor Directory)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Audit room-wise class allocations across Block A, Block B, Block C, and auditoriums to prevent physical space conflicts.
            </p>
          </div>

          {/* Controls: Day and Block Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>

            <select
              value={selectedBlockFilter}
              onChange={(e) => setSelectedBlockFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="all">All Blocks</option>
              {blocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          // Find classes in this room on selectedDay
          const roomClasses = timetableEntries.filter(
            (e) => e.roomId === room.id && e.day === selectedDay
          );

          return (
            <div
              key={room.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {room.roomNumber}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{room.block}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-700">{room.floor}</span>
                    </div>
                  </div>

                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">
                    Cap: {room.capacity}
                  </span>
                </div>

                {/* Facilities Badges */}
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Monitor className="h-3 w-3 text-blue-600" />
                    {room.smartBoard ? 'Smart Board' : 'Standard'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="h-3 w-3 text-cyan-600" />
                    {room.airConditioned ? 'Air Conditioned' : 'Non-AC'}
                  </span>
                </div>

                {/* Day Occupancy Schedule */}
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                    <span>{selectedDay} Schedule ({roomClasses.length} Booked Periods)</span>
                    <span className="text-slate-400 font-normal">08:30 AM – 04:20 PM</span>
                  </div>

                  {roomClasses.length === 0 ? (
                    <div className="rounded bg-emerald-50/70 p-2 text-center text-xs text-emerald-800 font-medium">
                      ✓ Entirely Free on {selectedDay} (Available for extra lectures or workshops)
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {roomClasses.map((entry) => {
                        const slot = timeSlots.find((s) => s.id === entry.slotId);
                        const subj = subjects.find((s) => s.id === entry.subjectId);
                        const teacher = teachers.find((t) => t.id === entry.teacherId);

                        return (
                          <div
                            key={entry.id}
                            className="rounded border border-slate-200 bg-slate-50 p-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{slot?.startTime} - {slot?.endTime}</span>
                              <span className="text-blue-700 font-bold">
                                {entry.branch}-{entry.semester}{entry.section}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 truncate mt-0.5">
                              {subj?.name} · {teacher?.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Maintained by JECRC Estate & Facility Management
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
