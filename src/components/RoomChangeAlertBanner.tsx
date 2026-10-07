import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { AlertTriangle, MapPin, Check, ArrowRight, X } from 'lucide-react';

export const RoomChangeAlertBanner: React.FC = () => {
  const { roomAlerts, dismissRoomAlert, clearAllRoomAlerts } = useTimetable();

  if (roomAlerts.length === 0) return null;

  return (
    <div id="room-alerts-section" className="bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
              !
            </span>
            <h2 className="text-sm font-bold text-amber-900 tracking-tight">
              Classroom Relocation Notice ({roomAlerts.length} Active Notice{roomAlerts.length > 1 ? 's' : ''})
            </h2>
          </div>
          {roomAlerts.length > 1 && (
            <button
              onClick={clearAllRoomAlerts}
              className="text-xs font-medium text-amber-800 hover:text-amber-950 underline underline-offset-2"
            >
              Dismiss All
            </button>
          )}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {roomAlerts.map((alert) => (
            <div
              key={alert.id}
              className="relative rounded-lg border border-amber-300 bg-white p-3 shadow-xs transition hover:border-amber-400"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold">
                    <span>{alert.subjectName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600 font-normal">{alert.section}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600 font-normal">{alert.teacherName}</span>
                  </div>

                  {/* Room Shift Details with Block and Floor */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                    {/* Old Room */}
                    <div className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 line-through">
                      <span className="font-semibold">{alert.oldRoomNumber}</span> ({alert.oldBlock})
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-amber-600 shrink-0" />

                    {/* New Room */}
                    <div className="flex items-center gap-1 rounded bg-amber-100 px-2.5 py-0.5 font-bold text-amber-900 ring-1 ring-amber-300">
                      <MapPin className="h-3 w-3 text-amber-700 shrink-0" />
                      <span>{alert.newRoomNumber}</span>
                      <span className="font-medium text-amber-800">({alert.newBlock}, {alert.newFloor})</span>
                    </div>
                  </div>

                  {alert.reason && (
                    <p className="mt-1 text-[11px] text-slate-600">
                      Reason: <span className="italic">{alert.reason}</span>
                    </p>
                  )}

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    Notified: {alert.timestamp}
                  </p>
                </div>

                <button
                  onClick={() => dismissRoomAlert(alert.id)}
                  title="Dismiss alert"
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
