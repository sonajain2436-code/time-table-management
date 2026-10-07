import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Search, Phone, Mail, MapPin, Award, Check } from 'lucide-react';

export const CoordinatorFinder: React.FC = () => {
  const { coordinators } = useTimetable();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Hackathons & Coding', 'Seminars & Research', 'Sports', 'Cultural & Renaissance', 'Placement'];

  const filteredCoordinators = coordinators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Search Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Institutional Event Coordinator Directory
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Find faculty conveners and leads for Hackathons, Renaissance Fest, IEEE Seminars, Sports, and Campus Drives.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search coordinator, domain, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600"
            >
            </input>
          </div>
        </div>

        {/* Category Pills / Filter Tabs */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                selectedCategory === cat
                  ? 'bg-[#002b49] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoordinators.map((coord) => (
          <div
            key={coord.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between transition hover:border-blue-300"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{coord.name}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {coord.category}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs font-medium text-slate-700">{coord.role}</p>
              <p className="text-[11px] text-slate-500">{coord.department}</p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{coord.officeLocation}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{coord.email}</span>
                  </span>
                  <button
                    onClick={() => handleCopy(coord.email, `email-${coord.id}`)}
                    className="text-[10px] font-bold text-blue-600 hover:underline shrink-0 ml-1"
                  >
                    {copiedId === `email-${coord.id}` ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{coord.phone}</span>
                  </span>
                  <button
                    onClick={() => handleCopy(coord.phone, `phone-${coord.id}`)}
                    className="text-[10px] font-bold text-blue-600 hover:underline shrink-0 ml-1"
                  >
                    {copiedId === `phone-${coord.id}` ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>JECRC Faculty Council</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Check className="h-3 w-3" /> Active Convener
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
