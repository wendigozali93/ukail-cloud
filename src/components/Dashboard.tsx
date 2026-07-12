import React from "react";
import { Users, CalendarDays, Award, Sparkles, AlertCircle, FileText, ArrowUpRight, CloudLightning } from "lucide-react";
import { motion } from "motion/react";
import { Murid, Attendance, Assessment, AppSettings } from "../types";

interface DashboardProps {
  students: Murid[];
  attendance: Attendance[];
  assessments: Assessment[];
  settings: AppSettings;
  setActiveTab: (tab: string) => void;
  googleToken?: string | null;
  onConnectGoogle?: () => void;
  syncLoading?: boolean;
  syncUrl?: string | null;
  syncError?: string | null;
  onSync?: () => void;
}

export default function Dashboard({
  students,
  attendance,
  assessments,
  settings,
  setActiveTab,
  googleToken = null,
  onConnectGoogle = () => {},
  syncLoading = false,
  syncUrl = null,
  syncError = null,
  onSync = () => {}
}: DashboardProps) {
  
  // 1. Total Murid
  const totalStudents = students.length;

  // 2. Kehadiran Hari Ini / Terbaru
  // Let's find unique dates in attendance to compute latest date percentage
  const uniqueDates = Array.from(new Set(attendance.map((a) => a.tanggal))).sort();
  const latestDate = uniqueDates[uniqueDates.length - 1] || "Belum ada data";
  const latestAttendance = attendance.filter((a) => a.tanggal === latestDate);
  const presentCount = latestAttendance.filter((a) => a.status === "Hadir").length;
  const attendanceRate = latestAttendance.length > 0 
    ? Math.round((presentCount / latestAttendance.length) * 100) 
    : 100;

  // 3. Rata-rata Kelas
  const totalScores = assessments.map((a) => a.nilai);
  const classAverage = totalScores.length > 0 
    ? Math.round((totalScores.reduce((sum, current) => sum + current, 0) / totalScores.length) * 10) / 10 
    : 0;

  // 4. Sebaran Nilai (untuk custom SVG Chart)
  const binnedScores = {
    perluBimbingan: totalScores.filter((s) => s < 70).length,
    cukup: totalScores.filter((s) => s >= 70 && s < 80).length,
    baik: totalScores.filter((s) => s >= 80 && s < 90).length,
    sangatBaik: totalScores.filter((s) => s >= 90).length,
  };

  const maxBinCount = Math.max(
    binnedScores.perluBimbingan,
    binnedScores.cukup,
    binnedScores.baik,
    binnedScores.sangatBaik,
    1
  );

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Welcome Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-slate-100 to-indigo-50 border border-slate-200 rounded-2xl p-6 md:p-8 overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              UKAIL AI Learning Assistant Aktif
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Selamat Datang, {settings.teacherName}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl font-medium">
              Kelola data kelas, absensi, asesmen, dan manfaatkan asisten AI pintar untuk mengotomatiskan penyusunan narasi raport dan rancangan belajar harian Anda.
            </p>
          </div>
          <div className="flex gap-3 mt-2 md:mt-0">
            <button 
              onClick={() => setActiveTab("ai")}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Gunakan AI
            </button>
            <button 
              onClick={() => setActiveTab("vba")}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Lihat Kode VBA
            </button>
          </div>
        </div>
      </motion.div>

      {/* Google Cloud Sync Controller */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 border-l-4 border-l-emerald-500"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
            {/* Google Sheets Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#107C41" />
              <path d="M14 2V8H20L14 2Z" fill="#1F9A55" />
              <path d="M8 13H16V15H8V13ZM8 17H13V19H8V17ZM8 9H11V11H8V9Z" fill="white" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
              Google Sheets Cloud Database Sync
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-extrabold uppercase tracking-wide ${
                googleToken ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}>
                {googleToken ? "Koneksi Cloud Aktif" : "Memerlukan Otorisasi"}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed font-medium">
              {googleToken
                ? "Seluruh data murid, absensi harian, dan hasil asesmen terdata secara cloud di Google Drive Anda. Klik tombol untuk memicu sinkronisasi real-time."
                : "Masuk atau sambungkan kembali ke akun Google Anda untuk mengaktifkan sinkronisasi cloud otomatis secara aman."}
            </p>
            {syncUrl && (
              <div className="mt-2.5">
                <a
                  href={syncUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  Buka Spreadsheet Cloud UKAIL Anda ↗
                </a>
              </div>
            )}
            {syncError && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚠️ Error: {syncError}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 w-full md:w-auto">
          {googleToken ? (
            <button
              onClick={onSync}
              disabled={syncLoading}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {syncLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              )}
              {syncLoading ? "Mengunggah data..." : "Sinkron ke Google Sheets"}
            </button>
          ) : (
            <button
              onClick={onConnectGoogle}
              className="w-full md:w-auto bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Hubungkan Google Sheets
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stat 1: Total Siswa */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setActiveTab("students")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-500/40 transition-all cursor-pointer group relative"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Total Murid Terdaftar</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalStudents}</h3>
            <p className="text-emerald-700 text-xs font-semibold mt-2 flex items-center gap-1">
              <span>Fungsi VBA:</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">modDatabase.MuridTotal()</span>
            </p>
          </div>
        </motion.div>

        {/* Stat 2: Kehadiran */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setActiveTab("attendance")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-500/40 transition-all cursor-pointer group relative"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-slate-400 group-hover:text-teal-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Persentase Kehadiran ({latestDate})</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{attendanceRate}%</h3>
            <p className="text-teal-700 text-xs font-semibold mt-2 flex items-center gap-1">
              <span>Prosedur VBA:</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">modDashboard.LoadStatistic()</span>
            </p>
          </div>
        </motion.div>

        {/* Stat 3: Rata-rata Kelas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setActiveTab("assessments")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-500/40 transition-all cursor-pointer group relative"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Rata-Rata Nilai Kelas</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{classAverage}</h3>
            <p className="text-blue-700 text-xs font-semibold mt-2 flex items-center gap-1">
              <span>Fungsi VBA:</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">modAssessment.AverageClass()</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Custom SVG Distribution Chart (Bento Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">Distribusi Hasil Asesmen</h4>
            <p className="text-xs text-slate-500 font-medium">Pengelompokan hasil belajar murid untuk seluruh subjek evaluasi.</p>
          </div>

          {/* Render custom SVG bar chart */}
          <div className="mt-6 flex items-end justify-between gap-2 h-48 border-b border-slate-200 pb-2">
            {[
              { label: "Perlu Bimbingan (<70)", value: binnedScores.perluBimbingan, color: "from-rose-400 to-red-500" },
              { label: "Cukup (70-79)", value: binnedScores.cukup, color: "from-amber-400 to-yellow-500" },
              { label: "Baik (80-89)", value: binnedScores.baik, color: "from-teal-400 to-emerald-500" },
              { label: "Sangat Baik (90-100)", value: binnedScores.sangatBaik, color: "from-blue-400 to-indigo-500" },
            ].map((item, idx) => {
              const pct = (item.value / maxBinCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full flex justify-center items-end h-32">
                    {/* Tooltip on hover */}
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded font-semibold z-10 shadow-sm">
                      {item.value} Record
                    </span>
                    <div 
                      style={{ height: `${pct || 4}%` }} 
                      className={`w-12 sm:w-16 bg-gradient-to-t ${item.color} rounded-t-lg transition-all duration-700 shadow-sm`} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 text-center mt-2 font-bold truncate max-w-full px-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>Rata-Rata Kelas: <strong className="text-slate-800">{classAverage}</strong></span>
            <span>Total Entri Nilai: <strong className="text-slate-800">{totalScores.length}</strong></span>
          </div>
        </div>

        {/* Info & VBA ERP Mapping Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">Struktur ERP UKAIL</h4>
            <p className="text-xs text-slate-500 font-medium">Pemetaan database relasional antar-sheet pada file Excel.</p>
          </div>

          <div className="space-y-3 my-5">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span className="text-xs font-semibold font-mono text-slate-800">DATABASE MURID</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Relasi Utama (NIS)</span>
            </div>
            
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                <span className="text-xs font-semibold font-mono text-slate-800">ABSENSI</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Relasi Ganda (NIS, Tanggal)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <span className="text-xs font-semibold font-mono text-slate-800">ASESMEN</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Relasi Ganda (NIS, Subjek)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                <span className="text-xs font-semibold font-mono text-slate-800">SETTING</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Parameter Global (B2, B3, B4)</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-blue-800 font-semibold">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Logika bisnis web ini disesuaikan 1-banding-1 dengan referensi VBA Macro. Anda dapat menyalin kode bas dari tab <strong>VBA Explorer</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
