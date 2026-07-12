import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Camera,
  LineChart,
  Search,
  CheckCircle,
  FileImage,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Murid, ObservasiProfilItem } from "../types";

interface ObservasiProfilProps {
  students: Murid[];
}

export default function ObservasiProfil({ students }: ObservasiProfilProps) {
  // Dimensions and rubric levels
  const dimensiList = [
    "Beriman & Bertakwa",
    "Kebinekaan Global",
    "Gotong Royong",
    "Mandiri",
    "Bernalar Kritis",
    "Kreatif",
    "Cinta Tanah Air",
    "Komunikatif"
  ] as const;

  const kriteriaSkor = [
    { skor: 1, label: "BB", long: "Belum Berkembang", color: "bg-red-100 text-red-800 border-red-200" },
    { skor: 2, label: "MB", long: "Mulai Berkembang", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { skor: 3, label: "BSH", long: "Berkembang Sesuai Harapan", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { skor: 4, label: "SB", long: "Sangat Berkembang", color: "bg-emerald-100 text-emerald-800 border-emerald-200" }
  ];

  // Observasi Items State
  const [observasis, setObservasis] = useState<ObservasiProfilItem[]>(() => {
    const saved = localStorage.getItem("ukail_observasi_profil");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "obs-1",
            nis: "1201",
            namaMurid: "Ahmad Fauzi",
            tanggal: "2026-07-16",
            dimensi: "Gotong Royong",
            skor: 4,
            catatan: "Sangat proaktif memimpin piket kebersihan kelas dan membantu teman.",
            mediaSim: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200"
          },
          {
            id: "obs-2",
            nis: "1202",
            namaMurid: "Siti Aminah",
            tanggal: "2026-07-16",
            dimensi: "Bernalar Kritis",
            skor: 3,
            catatan: "Mampu merumuskan pertanyaan tajam saat pembelajaran IPA tentang ekosistem.",
            mediaSim: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=200"
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_observasi_profil", JSON.stringify(observasis));
  }, [observasis]);

  // Form states
  const [frmNis, setFrmNis] = useState("");
  const [frmDimensi, setFrmDimensi] = useState<typeof dimensiList[number]>("Beriman & Bertakwa");
  const [frmSkor, setFrmSkor] = useState(3);
  const [frmCatatan, setFrmCatatan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddObservasi = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.nis === frmNis);
    if (!student) return;

    const newItem: ObservasiProfilItem = {
      id: "obs-" + Date.now(),
      nis: frmNis,
      namaMurid: student.nama,
      tanggal: new Date().toISOString().split("T")[0],
      dimensi: frmDimensi,
      skor: frmSkor,
      catatan: frmCatatan || `Melakukan tindakan terpuji sesuai dimensi ${frmDimensi}.`,
      mediaSim: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200"
    };

    setObservasis((prev) => [newItem, ...prev]);
    setFrmNis("");
    setFrmCatatan("");
  };

  // Compute stats for 8 dimensions
  const getDimensionAverages = () => {
    return dimensiList.map((dim) => {
      const filtered = observasis.filter((o) => o.dimensi === dim);
      const avg = filtered.length > 0 
        ? Math.round((filtered.reduce((sum, item) => sum + item.skor, 0) / filtered.length) * 10) / 10
        : 2.5; // Baseline default if empty
      return { dimensi: dim, average: avg, count: filtered.length };
    });
  };

  const dimensionStats = getDimensionAverages();

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-indigo-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Evaluasi Karakter & Profil Pelajar Pancasila
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Asesmen Observasi & Sikap Karakter Lulusan
          </h2>
          <p className="text-indigo-200/80 text-xs mt-1 max-w-2xl font-medium">
            Dokumentasikan bukti otentik unjuk karya, foto kegiatan, dan rubrik pencapaian 8 dimensi profil lulusan sekolah dasar harian secara interaktif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Input Form with Rubrics */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Catat Lembar Observasi Baru
          </h3>

          <form onSubmit={handleAddObservasi} className="space-y-4">
            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Pilih Murid</label>
              <select
                required
                value={frmNis}
                onChange={(e) => setFrmNis(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="">-- Pilih Murid --</option>
                {students.map((s) => (
                  <option key={s.nis} value={s.nis}>{s.nama}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Dimensi Karakter</label>
                <select
                  value={frmDimensi}
                  onChange={(e) => setFrmDimensi(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                >
                  {dimensiList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Tingkat Capaian</label>
                <select
                  value={frmSkor}
                  onChange={(e) => setFrmSkor(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                >
                  <option value={1}>BB (Belum Berkembang)</option>
                  <option value={2}>MB (Mulai Berkembang)</option>
                  <option value={3}>BSH (Sesuai Harapan)</option>
                  <option value={4}>SB (Sangat Berkembang)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Catatan Kejadian / Bukti Otentik</label>
              <textarea
                value={frmCatatan}
                onChange={(e) => setFrmCatatan(e.target.value)}
                placeholder="e.g. Terlihat sukarela mengumpulkan sumbangan sosial atau membantu merapikan kursi..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              />
            </div>

            {/* Photo upload mock block */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-slate-400" />
                <div>
                  <span className="text-[10px] font-bold block text-slate-700">Bukti Foto / Media</span>
                  <span className="text-[9px] text-slate-400">Pencatatan real-time otomatis disimulasikan</span>
                </div>
              </div>
              <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold uppercase">
                Terlampir
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Simpan Observasi Karakter
            </button>
          </form>
        </div>

        {/* Right: Dimension Timeline & Progress Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <LineChart className="w-4 h-4 text-indigo-600" />
              Rata-rata Tingkat Dimensi Lulusan Kelas
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase">
              Bagan Nilai Kompetensi Rata-rata (Skor 1 - 4)
            </p>
          </div>

          <div className="space-y-3.5 my-6">
            {dimensionStats.map((stat, idx) => {
              const scorePct = (stat.average / 4) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">{stat.dimensi}</span>
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                      Rata-Rata: {stat.average} ({stat.count} Entri)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-[11px] text-blue-800 font-semibold leading-relaxed">
            Asesmen ini secara berkala menyusun rekapitulasi data portfolio murid untuk diintegrasikan ke dalam menu <strong>Rapor Karakter</strong> otomatis.
          </div>
        </div>
      </div>

      {/* Log list observations */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h4 className="text-sm font-extrabold text-slate-900">Histori Bukti Laporan & Foto Kegiatan Lapangan</h4>
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-4 text-[11px]"
              placeholder="Cari murid..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {observasis
            .filter((x) => x.namaMurid.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((item) => {
              const rub = kriteriaSkor.find((k) => k.skor === item.skor);
              return (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm relative hover:border-slate-300 transition-all">
                  <button
                    onClick={() => setObservasis(observasis.filter((x) => x.id !== item.id))}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={item.mediaSim}
                    alt="Observasi"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-300"
                  />
                  <div className="space-y-1 text-xs">
                    <span className="text-[9px] text-slate-400 font-mono font-bold block">{item.tanggal}</span>
                    <h4 className="font-extrabold text-slate-900">{item.namaMurid}</h4>
                    <p className="text-blue-700 font-bold leading-tight flex items-center gap-1.5">
                      Dimensi: {item.dimensi}
                      {rub && (
                        <span className={`inline-flex px-1.5 py-0.2 rounded font-mono font-black text-[9px] ${rub.color}`}>
                          {rub.label}
                        </span>
                      )}
                    </p>
                    <p className="text-slate-600 leading-snug">{item.catatan}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
