import React from "react";
import { AppSettings } from "../types";
import { Settings, Save, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onLogout: () => void;
}

export default function SettingsComponent({
  settings,
  onUpdateSettings,
  onLogout
}: SettingsProps) {
  const [appName, setAppName] = React.useState(settings.appName);
  const [teacherName, setTeacherName] = React.useState(settings.teacherName);
  const [semester, setSemester] = React.useState(settings.semester);
  const [year, setYear] = React.useState(settings.year);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      appName,
      version: settings.version,
      teacherName,
      semester: Number(semester),
      year
    });
    alert("Pengaturan konfigurasi berhasil disimpan!");
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Panel */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Pengaturan Sistem</h3>
        <p className="text-xs text-slate-500">Sinkronisasi sel parameter global yang terikat dengan Sheet <code className="text-amber-700 font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">SETTING</code></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Core Settings Form */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Parameter Worksheet Settings</h4>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                Nama Aplikasi
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                Tahun Ajaran (Sheet SETTING Cell B2) - <code className="text-blue-600 font-mono text-[10px]">CurrentYear</code>
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
                placeholder="Contoh: 2026/2027"
              />
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                Semester (Sheet SETTING Cell B3) - <code className="text-blue-600 font-mono text-[10px]">CurrentSemester</code>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={1}>Ganjil (Semester 1)</option>
                <option value={2}>Genap (Semester 2)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                Nama Wali Kelas (Sheet SETTING Cell B4) - <code className="text-blue-600 font-mono text-[10px]">CurrentTeacher</code>
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                placeholder="Contoh: Wendi Gozali, S.Pd."
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Keluar Sesi (Logout)
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Konfigurasi
            </button>
          </div>
        </form>

        {/* Excel Cell Reference Mapping Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Referensi Worksheet</h4>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Konfigurasi di atas memetakan langsung ke sheet bernama <strong className="text-slate-800">"SETTING"</strong> pada file Excel Anda:
            </p>

            {/* Visual Sheet Layout */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden font-mono text-[10px] text-slate-600 shadow-inner">
              <div className="grid grid-cols-12 bg-slate-100 py-1.5 px-3 border-b border-slate-200 font-bold text-slate-500 select-none">
                <div className="col-span-2">Sel</div>
                <div className="col-span-4">Kolom A (Label)</div>
                <div className="col-span-6">Kolom B (Nilai / Value)</div>
              </div>

              <div className="p-3 space-y-2 leading-relaxed">
                <div className="grid grid-cols-12 border-b border-slate-200 pb-1.5">
                  <div className="col-span-2 text-blue-600 font-bold">B2</div>
                  <div className="col-span-4 text-slate-500">Tahun Ajaran</div>
                  <div className="col-span-6 text-emerald-700 truncate font-semibold">"{year}"</div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-200 pb-1.5">
                  <div className="col-span-2 text-blue-600 font-bold">B3</div>
                  <div className="col-span-4 text-slate-500">Semester</div>
                  <div className="col-span-6 text-emerald-700 truncate font-semibold">{semester}</div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 text-blue-600 font-bold">B4</div>
                  <div className="col-span-4 text-slate-500">Wali Kelas</div>
                  <div className="col-span-6 text-emerald-700 truncate font-semibold">"{teacherName}"</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2 text-[10px] text-slate-500 mt-4 shadow-inner">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              Mengubah parameter di sini juga akan memperbarui seluruh tajuk laporan harian dan deskripsi raport siswa Anda secara real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
