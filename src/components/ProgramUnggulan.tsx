import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Camera,
  Activity,
  FileText,
  Clock,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProgramUnggulanItem } from "../types";

export default function ProgramUnggulan() {
  const [activeTab, setActiveTab] = useState<"DAFTAR" | "BUAT_BARU">("DAFTAR");
  const [searchQuery, setSearchQuery] = useState("");

  const kategoriList = [
    "Literasi",
    "Numerasi",
    "Karakter",
    "STEAM",
    "Deep Learning",
    "Lingkungan",
    "Parenting"
  ] as const;

  const [programs, setPrograms] = useState<ProgramUnggulanItem[]>(() => {
    const saved = localStorage.getItem("ukail_programs_unggulan");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "prog-1",
            namaProgram: "Pojok Baca Kreatif & Pohon Literasi Kelas",
            kategori: "Literasi",
            perencanaan: "Membangun sudut baca dengan koleksi buku sumbangan alumni dan murid. Membuat pohon karton untuk menempel ulasan buku.",
            pelaksanaan: "Murid membaca selama 15 menit setiap hari Senin pagi sebelum mulai KBM dan merangkum dalam pohon literasi.",
            dokumentasiSim: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200",
            evaluasi: "Sangat baik, minat baca naik pesat. Pohon literasi sudah terisi lebih dari 40 ulasan buku harian.",
            refleksi: "Perlu menambah variasi buku fiksi dan non-fiksi bulanan.",
            status: "Aktif",
            tanggalMulai: "2026-07-15",
            tanggalSelesai: "2026-12-18"
          },
          {
            id: "prog-2",
            namaProgram: "STEAM Project: Pembuatan Kincir Angin Mini",
            kategori: "STEAM",
            perencanaan: "Rancangan KBM interaktif membuat kincir angin mini dari stik es krim dan dinamo bekas untuk mengamati konsep energi alternatif.",
            pelaksanaan: "Murid bekerja kelompok pada hari Jumat sore, mendesain, menguji putaran baling-baling.",
            dokumentasiSim: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=200",
            evaluasi: "Murid memahami konsep konversi energi secara kinetik. 4 dari 5 kelompok berhasil memutar lampu LED kecil.",
            refleksi: "Persiapan bahan stik kayu es krim sebaiknya disediakan sekolah agar seragam.",
            status: "Selesai",
            tanggalMulai: "2026-07-20",
            tanggalSelesai: "2026-07-25"
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_programs_unggulan", JSON.stringify(programs));
  }, [programs]);

  // Form states
  const [frmNama, setFrmNama] = useState("");
  const [frmKat, setFrmKat] = useState<typeof kategoriList[number]>("Literasi");
  const [frmPerencanaan, setFrmPerencanaan] = useState("");
  const [frmPelaksanaan, setFrmPelaksanaan] = useState("");
  const [frmEvaluasi, setFrmEvaluasi] = useState("");
  const [frmRefleksi, setFrmRefleksi] = useState("");
  const [frmStatus, setFrmStatus] = useState<"Rencana" | "Aktif" | "Selesai">("Rencana");
  const [frmMulai, setFrmMulai] = useState("");
  const [frmSelesai, setFrmSelesai] = useState("");

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frmNama) return;

    const newItem: ProgramUnggulanItem = {
      id: "prog-" + Date.now(),
      namaProgram: frmNama,
      kategori: frmKat,
      perencanaan: frmPerencanaan,
      pelaksanaan: frmPelaksanaan,
      evaluasi: frmEvaluasi,
      refleksi: frmRefleksi,
      status: frmStatus,
      tanggalMulai: frmMulai || new Date().toISOString().split("T")[0],
      tanggalSelesai: frmSelesai || new Date().toISOString().split("T")[0],
      dokumentasiSim: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200"
    };

    setPrograms((prev) => [newItem, ...prev]);
    setActiveTab("DAFTAR");

    // Reset Form
    setFrmNama("");
    setFrmPerencanaan("");
    setFrmPelaksanaan("");
    setFrmEvaluasi("");
    setFrmRefleksi("");
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[10px] font-bold uppercase tracking-wider">
            SaaS Coordinator Program Sekolah
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Program Unggulan & Inovasi Kelas
          </h2>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("DAFTAR")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "DAFTAR" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daftar Program Aktif
          </button>
          <button
            onClick={() => setActiveTab("BUAT_BARU")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "BUAT_BARU" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Buat Inovasi Baru
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "DAFTAR" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Search query bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs"
                placeholder="Cari berdasarkan nama inovasi atau kategori..."
              />
            </div>

            {/* Program Bento Cards / Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {programs
                .filter(
                  (p) =>
                    p.namaProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.kategori.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <button
                      onClick={() => setPrograms(programs.filter((x) => x.id !== p.id))}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-4">
                      {/* Top labels */}
                      <div className="flex items-center gap-2.5">
                        <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">
                          {p.kategori}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          p.status === "Selesai"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : p.status === "Aktif"
                            ? "bg-blue-50 border-blue-100 text-blue-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      {/* Title & Timeline */}
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">{p.namaProgram}</h4>
                        <span className="text-[10px] text-slate-400 font-bold font-mono mt-0.5 block flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {p.tanggalMulai} s.d. {p.tanggalSelesai}
                        </span>
                      </div>

                      {/* Stages accordion simulation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed border-t border-slate-100 pt-3">
                        <div>
                          <strong className="text-slate-800 font-bold block">1. Perencanaan (Planning):</strong>
                          <span className="text-slate-500 font-semibold">{p.perencanaan}</span>
                        </div>
                        <div>
                          <strong className="text-slate-800 font-bold block">2. Pelaksanaan (Execution):</strong>
                          <span className="text-slate-500 font-semibold">{p.pelaksanaan}</span>
                        </div>
                        <div>
                          <strong className="text-emerald-800 font-bold block">3. Evaluasi (Evaluation):</strong>
                          <span className="text-slate-500 font-semibold">{p.evaluasi}</span>
                        </div>
                        <div>
                          <strong className="text-indigo-800 font-bold block">4. Refleksi & Laporan (Reflection):</strong>
                          <span className="text-slate-500 font-semibold">{p.refleksi}</span>
                        </div>
                      </div>
                    </div>

                    {/* Documentation and progress preview */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                      <img
                        src={p.dokumentasiSim}
                        alt="Dokumentasi"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="text-[10px] text-slate-400 font-semibold">
                        <span>Laporan foto dokumentasi terunggah harian secara cloud.</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Sajikan Kerangka Acuan Program Inovasi Baru
            </h3>

            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Nama Inovasi / Program</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pekan STEAM Kreatif daur ulang botol plastik"
                    value={frmNama}
                    onChange={(e) => setFrmNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Kategori Utama</label>
                  <select
                    value={frmKat}
                    onChange={(e) => setFrmKat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                  >
                    {kategoriList.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Fase 1: Perencanaan (Planning)</label>
                  <textarea
                    required
                    value={frmPerencanaan}
                    onChange={(e) => setFrmPerencanaan(e.target.value)}
                    placeholder="Tuliskan tujuan, sasaran, bahan-bahan, dan persiapan harian..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Fase 2: Pelaksanaan (Execution)</label>
                  <textarea
                    required
                    value={frmPelaksanaan}
                    onChange={(e) => setFrmPelaksanaan(e.target.value)}
                    placeholder="Tuliskan bagaimana program dieksekusi bersama murid kelas harian..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Fase 3: Evaluasi (Evaluation)</label>
                  <textarea
                    required
                    value={frmEvaluasi}
                    onChange={(e) => setFrmEvaluasi(e.target.value)}
                    placeholder="Tuliskan indikator keberhasilan, respon murid, dan data terukur..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Fase 4: Refleksi & Rekomendasi (Reflection)</label>
                  <textarea
                    required
                    value={frmRefleksi}
                    onChange={(e) => setFrmRefleksi(e.target.value)}
                    placeholder="Tuliskan pelajaran berharga (lesson learned) dan perbaikan ke depan..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={frmMulai}
                    onChange={(e) => setFrmMulai(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={frmSelesai}
                    onChange={(e) => setFrmSelesai(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Status Proyek</label>
                  <select
                    value={frmStatus}
                    onChange={(e) => setFrmStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                  >
                    <option value="Rencana">Rencana</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Sahkan Program Inovasi
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
