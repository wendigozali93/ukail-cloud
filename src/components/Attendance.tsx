import React, { useState } from "react";
import { Plus, Calendar, CheckCircle2, User, Eye, Trash2, HelpCircle, Save, Filter } from "lucide-react";
import { motion } from "motion/react";
import { Murid, Attendance } from "../types";

interface AttendanceProps {
  students: Murid[];
  attendance: Attendance[];
  onAddAttendance: (att: Attendance) => void;
  onDeleteAttendance: (id: string) => void;
}

export default function AttendanceComponent({
  students,
  attendance,
  onAddAttendance,
  onDeleteAttendance
}: AttendanceProps) {
  // Form values (frmAttendance fields)
  const [selectedNis, setSelectedNis] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"Hadir" | "Sakit" | "Izin" | "Alpa">("Hadir");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  
  // Filtering attendance table
  const [filterDate, setFilterDate] = useState("");
  const [filterNis, setFilterNis] = useState("ALL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNis) {
      alert("Harap pilih murid terlebih dahulu!");
      return;
    }

    const studentObj = students.find((s) => s.nis === selectedNis);
    if (!studentObj) return;

    // Check if attendance already recorded for this student on this date
    const alreadyExists = attendance.some(
      (a) => a.nis === selectedNis && a.tanggal === tanggal
    );

    if (alreadyExists) {
      const overwrite = window.confirm(
        `Absen untuk ${studentObj.nama} pada tanggal ${tanggal} sudah tercatat. Ingin menggantinya?`
      );
      if (!overwrite) return;
      
      // Delete existing first
      const existing = attendance.find((a) => a.nis === selectedNis && a.tanggal === tanggal);
      if (existing) onDeleteAttendance(existing.id);
    }

    onAddAttendance({
      id: `att-${Date.now()}`,
      tanggal,
      nis: selectedNis,
      nama: studentObj.nama,
      status: selectedStatus,
    });

    // Reset dropdown selection
    setSelectedNis("");
  };

  // Compute stats
  const totalRecords = attendance.length;
  const countHadir = attendance.filter((a) => a.status === "Hadir").length;
  const countSakit = attendance.filter((a) => a.status === "Sakit").length;
  const countIzin = attendance.filter((a) => a.status === "Izin").length;
  const countAlpa = attendance.filter((a) => a.status === "Alpa").length;

  const attendancePercent = totalRecords > 0 
    ? Math.round((countHadir / totalRecords) * 100) 
    : 100;

  const filteredAttendance = attendance.filter((a) => {
    const matchesDate = !filterDate || a.tanggal === filterDate;
    const matchesNis = filterNis === "ALL" || a.nis === filterNis;
    return matchesDate && matchesNis;
  }).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Panel */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Presensi / Absensi Murid</h3>
        <p className="text-xs text-slate-500">Logika pencatatan harian yang terhubung ke Sheet <code className="text-teal-700 font-mono bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-bold">ABSENSI</code></p>
      </div>

      {/* Grid: Form and Mini Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Save Attendance Form Card (frmAttendance) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 font-mono">UserForm: frmAttendance</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1 mb-4">Input Absensi Harian</h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Tanggal Presensi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Pilih Murid - <code className="text-blue-600 font-mono text-[10px]">cboMurid</code>
                </label>
                <select
                  value={selectedNis}
                  onChange={(e) => setSelectedNis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">-- Pilih Murid --</option>
                  {students.map((s) => (
                    <option key={s.nis} value={s.nis}>
                      {s.nama} ({s.nis})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  Status Kehadiran - <code className="text-blue-600 font-mono text-[10px]">cboStatus</code>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Hadir", "Sakit", "Izin", "Alpa"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                        selectedStatus === status
                          ? status === "Hadir"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
                            : status === "Sakit"
                            ? "bg-amber-50 text-amber-700 border-amber-300 shadow-sm"
                            : status === "Izin"
                            ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm"
                            : "bg-red-50 text-red-700 border-red-300 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 mt-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Presensi (SaveAttendance)
              </button>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-blue-600" />
              Logika Kode VBA
            </h5>
            <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[8px] text-teal-400 font-mono overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {"' Sub SaveAttendance()\n"}
              {"ws.Cells(r, 1) = Date\n"}
              {`ws.Cells(r, 2) = "${selectedNis || "frmAttendance.cboStudent"}"\n`}
              {`ws.Cells(r, 3) = "${selectedStatus}"`}
            </pre>
          </div>
        </div>

        {/* Attendance Statistics & Mini Report Chart Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Rangkuman Absensi</h4>
            <p className="text-xs text-slate-500">Ikhtisar kehadiran kumulatif seluruh murid kelas Anda.</p>
          </div>

          {/* Render circular indicator and simple bar stats */}
          <div className="my-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Circle Rate */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 text-center shadow-sm">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#2563eb"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * attendancePercent) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-bold text-slate-900">{attendancePercent}%</span>
                  <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">Kehadiran</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-2">Hadir: {countHadir} dari {totalRecords} Absen</span>
            </div>

            {/* List Metrics */}
            <div className="sm:col-span-7 space-y-2.5">
              {[
                { label: "Hadir (H)", count: countHadir, pct: totalRecords > 0 ? (countHadir / totalRecords) * 100 : 100, color: "bg-emerald-500" },
                { label: "Sakit (S)", count: countSakit, pct: totalRecords > 0 ? (countSakit / totalRecords) * 100 : 0, color: "bg-amber-500" },
                { label: "Izin (I)", count: countIzin, pct: totalRecords > 0 ? (countIzin / totalRecords) * 100 : 0, color: "bg-blue-500" },
                { label: "Alpa (A)", count: countAlpa, pct: totalRecords > 0 ? (countAlpa / totalRecords) * 100 : 0, color: "bg-red-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-400">{item.count} hari ({Math.round(item.pct)}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${item.pct}%` }} className={`h-full ${item.color} rounded-full transition-all duration-700`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-600 flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Rekap kehadiran dihitung otomatis menggunakan formula Excel di spreadsheet utama.</span>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Log Riwayat Presensi</h4>
          
          {/* Table Filters */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Filter Date */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-lg text-[10px] shadow-sm">
              <span className="text-slate-500 font-bold">Tanggal:</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent border-none text-slate-800 focus:outline-none font-mono text-[10px]"
              />
              {filterDate && (
                <button onClick={() => setFilterDate("")} className="text-slate-400 hover:text-slate-600 pl-1 cursor-pointer">✕</button>
              )}
            </div>

            {/* Filter Student */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-lg text-[10px] shadow-sm">
              <span className="text-slate-500 font-bold">Murid:</span>
              <select
                value={filterNis}
                onChange={(e) => setFilterNis(e.target.value)}
                className="bg-transparent border-none text-slate-800 focus:outline-none text-[10px] cursor-pointer"
              >
                <option value="ALL">Semua Murid</option>
                {students.map((s) => (
                  <option key={s.nis} value={s.nis}>{s.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4 w-32">Tanggal</th>
                <th className="py-3 px-4 w-28">NIS</th>
                <th className="py-3 px-4">Nama Murid</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-20 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 text-slate-700 text-xs transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{record.tanggal}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{record.nis}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{record.nama}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        record.status === "Hadir"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : record.status === "Sakit"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : record.status === "Izin"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteAttendance(record.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-all cursor-pointer"
                        title="Hapus Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-slate-400 text-xs">
                    Tidak ada record presensi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
