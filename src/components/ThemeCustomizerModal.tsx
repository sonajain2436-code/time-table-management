import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import { TimetableFont, TimetableTheme, TimetableDensity } from '../types';
import { Palette, Type, Layout, X, Check } from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { customization, setCustomization } = useTimetable();

  if (!isOpen) return null;

  const fontOptions: { id: TimetableFont; label: string; desc: string; sample: string }[] = [
    {
      id: 'sans',
      label: 'Plus Jakarta Sans',
      desc: 'Modern, crisp institutional sans-serif',
      sample: 'JECRC CSE 5A · DSA Lecture',
    },
    {
      id: 'serif',
      label: 'Academic Editorial Serif',
      desc: 'Classical university & collegiate typography',
      sample: 'Data Structures & Algorithms',
    },
    {
      id: 'mono',
      label: 'JetBrains Code Mono',
      desc: 'Precision algorithmic & tabular font',
      sample: '08:30 - 09:25 AM · B-204',
    },
  ];

  const themeOptions: { id: TimetableTheme; label: string; desc: string; previewClass: string }[] = [
    {
      id: 'jecrc-navy',
      label: 'JECRC Classic Navy & White',
      desc: 'Official institutional colorway (Deep Navy, Royal Blue & Pure White)',
      previewClass: 'bg-[#002b49] text-white',
    },
    {
      id: 'slate-minimal',
      label: 'Slate Minimalist',
      desc: 'Cool modern slate background with subtle hairline dividers',
      previewClass: 'bg-slate-200 text-slate-800',
    },
    {
      id: 'ivory-academic',
      label: 'Ivory Academic Parchment',
      desc: 'Warm paper ivory tone for prolonged reading comfort',
      previewClass: 'bg-[#f7f3eb] text-amber-950',
    },
    {
      id: 'cobalt-dark',
      label: 'Midnight Cobalt Dark',
      desc: 'High contrast dark theme with deep navy accents',
      previewClass: 'bg-slate-900 text-slate-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#002b49] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold">Timetable Typography & Theme Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-blue-200 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Font Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
              <Type className="h-4 w-4 text-blue-600" />
              <span>Timetable Typography Face</span>
            </div>

            <div className="grid gap-2">
              {fontOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCustomization((prev) => ({ ...prev, font: f.id }))}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition ${
                    customization.font === f.id
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{f.label}</div>
                    <div className="text-[11px] text-slate-500">{f.desc}</div>
                    <div className="mt-1 text-xs text-blue-800 font-medium italic">{f.sample}</div>
                  </div>

                  {customization.font === f.id && (
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme / Background Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
              <Palette className="h-4 w-4 text-blue-600" />
              <span>Canvas & Grid Background Theme</span>
            </div>

            <div className="grid gap-2">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCustomization((prev) => ({ ...prev, theme: t.id }))}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition ${
                    customization.theme === t.id
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg shadow-xs ring-1 ring-black/10 flex items-center justify-center text-xs font-bold ${t.previewClass}`}>
                      J
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.label}</div>
                      <div className="text-[11px] text-slate-500">{t.desc}</div>
                    </div>
                  </div>

                  {customization.theme === t.id && (
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Density Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
              <Layout className="h-4 w-4 text-blue-600" />
              <span>Display Layout Density</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'standard', 'relaxed'] as TimetableDensity[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setCustomization((prev) => ({ ...prev, density: d }))}
                  className={`py-2 text-xs font-bold capitalize rounded-lg border transition ${
                    customization.density === d
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#002b49] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#001c30]"
          >
            Apply Visual Style
          </button>
        </div>
      </div>
    </div>
  );
};
