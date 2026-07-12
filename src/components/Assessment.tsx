import React, { useState } from "react";
import { Plus, Award, Save, Calendar, BarChart3, HelpCircle, Trash2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Murid, Assessment } from "../types";

interface AssessmentProps {
  students: Murid[];
  assessments: Assessment[];
  onAddAssessment: (as: Assessment) => void;
  onDeleteAssessment: (id: string) => void;
}

const subjectsList = [
  "Matematika",
  "IPA (Ilmu Pengetahuan Alam)",
  "IPS (Ilmu Pengetahuan Sosial)",
  "Bahasa Indonesia",
  "Pendidikan Pancasila (PPKn)",
  "Seni Budaya & Prakarya (SBdP)",
  "Pendidikan Jasmani (PJOK)"
];

export default function AssessmentComponent({
  students,
  assessments,
  onAddAssessment,
  onDeleteAssessment
}: AssessmentProps) {
  // Form fields
  const [selectedNis, setSelectedNis] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjectsList[0]);
  const [score, setScore] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);

  // Filters
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterNis, setFilterNis] = useState("ALL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNis) {
      alert("Harap pilih murid terlebih dahulu!");
      return;
    }

    if (!score || isNaN(Number(score))) {
      alert("Harap masukkan nilai numerik yang valid!");
      return;
    }

    const numericScore = Number(score);
    if (numericScore < 0 || numericScore > 100) {
      alert("Nilai harus berada di rentang 0-100!");
      return;
    }

    const studentObj = students.find((s) => s.nis === selectedNis);
    if (!studentObj) return;

    onAddAssessment({
      id: `as-${Date.now()}`,
      nis: selectedNis,
      nama: studentObj.nama,
      subjek: selectedSubject,
      nilai: numericScore,
      tanggal
    });

    // Reset score field
    setScore("");
  };

  // Calculations
  const averageClass = assessments.length > 0
    ? Math.round((assessments.reduce((sum, item) => sum + item.nilai, 0) / assessments.length) * 10) / 10
    : 0;

  const highestScore = assessments.length > 0
    ? Math.max(...assessments.map((a) => a.nilai))
    : 0;

  const lowestScore = assessments.length > 0
    ? Math.min(...assessments.map((a) => a.nilai))
    : 0;

  // Filtered List
  const filteredAssessments = assessments.filter((a) => {
    const matchesSubject = filterSubject === "ALL" || a.subjek.startsWith(filterSubject);
    const matchesNis = filterNis === "ALL" || a.nis === filterNis;
    return matchesSubject && matchesNis;
  }).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  // Compute student-specific averages
  const studentAverages = students.map((student) => {
    const studentScores = assessments.filter((a) => a.nis === student.nis);
    const avg = studentScores.length > 0
      ? Math.round((studentScores.reduce((sum, a) => sum + a.nilai, 0) / studentScores.length) * 10) / 10
      : 0;
    return {
      nis: student.nis,
      nama: student.nama,
      avg,
      count: studentScores.length
    };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Panel */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Evaluasi & Asesmen Nilai</h3>
        <p className="text-xs text-slate-500">Pencatatan evaluasi harian, UTS, dan UAS murid kelas Anda ke Sheet <code className="text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-bold">ASESMEN</code></p>
      </div>

      {/* Grid Layout: Input and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Save Assessment Form Card (frmAssessment) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 font-mono">UserForm: frmAssessment</span>
            <h4 className="text-sm font-bold text-slate-900 mt-1 mb-4">Input Nilai Asesmen Baru</h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Tanggal Evaluasi
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
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Pilih Subjek Evaluasi - <code className="text-blue-600 font-mono text-[10px]">cboSubject</code>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {subjectsList.map((subj, idx) => (
                    <option key={idx} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Nilai Murid (0 - 100) - <code className="text-blue-600 font-mono text-[10px]">txtScore</code>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
                  placeholder="Contoh: 85"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 mt-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Nilai (SaveAssessment)
              </button>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-blue-600" />
              Logika Kode VBA
            </h5>
            <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[8px] text-indigo-400 font-mono overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {"' Sub SaveAssessment()\n"}
              {"ws.Cells(r, 4) = CDbl(frmAssessment.txtScore.Value)"}
            </pre>
          </div>
        </div>

        {/* Grade Statistics Dashboard Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Analisis Hasil Evaluasi</h4>
            <p className="text-xs text-slate-500">Statistik performa kognitif murid dalam kelas saat ini.</p>
          </div>

          {/* Core Metrics Bento Grid */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center shadow-sm">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold mb-1">Rata-Rata Kelas</span>
              <span className="text-2xl font-black text-blue-600">{averageClass}</span>
            </div>
            
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center shadow-sm">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold mb-1">Nilai Tertinggi</span>
              <span className="text-2xl font-black text-emerald-600">{highestScore}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center shadow-sm">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold mb-1">Nilai Terendah</span>
              <span className="text-2xl font-black text-red-600">{lowestScore}</span>
            </div>
          </div>

          {/* Student Rankings List */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Peringkat Nilai Rata-Rata Murid</span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {studentAverages.map((student, index) => (
                <div key={student.nis} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                      index === 0 ? "bg-amber-500 text-white" : index === 1 ? "bg-slate-400 text-white" : index === 2 ? "bg-amber-700 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{student.nama}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[10px] text-slate-400">{student.count} Ujian</span>
                    <span className="font-bold text-blue-600">{student.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-600 flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100 mt-3">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Kalkulasi otomatis ranking sinkron dengan lembar formula Excel Anda.</span>
          </div>
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Log Riwayat Asesmen</h4>

          {/* Table Filters */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Filter Subject */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-lg text-[10px] shadow-sm">
              <span className="text-slate-500 font-bold">Subjek:</span>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-transparent border-none text-slate-800 focus:outline-none text-[10px] max-w-xs cursor-pointer"
              >
                <option value="ALL">Semua Subjek</option>
                {subjectsList.map((s, idx) => (
                  <option key={idx} value={s.split(" ")[0]}>{s.split(" ")[0]}</option>
                ))}
              </select>
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
                <th className="py-3 px-4">Subjek</th>
                <th className="py-3 px-4 w-28">Nilai</th>
                <th className="py-3 px-4 w-20 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 text-slate-700 text-xs transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{record.tanggal}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{record.nis}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{record.nama}</td>
                    <td className="py-3 px-4 text-slate-600">{record.subjek}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded font-mono font-bold text-xs border ${
                        record.nilai >= 85 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : record.nilai >= 75 
                          ? "bg-blue-50 text-blue-700 border-blue-200" 
                          : record.nilai >= 65 
                          ? "bg-amber-50 text-amber-700 border-amber-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {record.nilai}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteAssessment(record.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-all cursor-pointer"
                        title="Hapus Nilai"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-slate-400 text-xs">
                    Tidak ada data asesmen yang sesuai kriteria.
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
