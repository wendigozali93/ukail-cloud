import React, { useState, useEffect } from "react";
import {
  Calendar,
  GraduationCap,
  ClipboardList,
  Layers,
  BookOpen,
  FileSpreadsheet,
  Plus,
  Trash2,
  Save,
  Check,
  Sparkles,
  ArrowRight,
  Search,
  MessageSquare,
  AlertCircle,
  Clock,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Murid } from "../types";

interface AdminSuiteProps {
  students: Murid[];
}

interface CalendarEvent {
  id: string;
  tanggal: string;
  kegiatan: string;
  kategori: "Akademik" | "Ujian" | "Rapat" | "Libur";
}

interface JournalRecord {
  id: string;
  tanggal: string;
  hari: string;
  mapel: string;
  bab: string;
  tujuan: string;
  moodKelas: "Sangat Kondusif" | "Cukup Aktif" | "Perlu Perhatian";
  catatan: string;
}

interface ConsultationRecord {
  id: string;
  tanggal: string;
  namaMurid: string;
  namaWali: string;
  topik: string;
  solusi: string;
  tindakLanjut: string;
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

// Initial Mock Academic Calendar
const initialEvents: CalendarEvent[] = [
  { id: "ev-1", tanggal: "2026-07-13", kegiatan: "Hari Pertama Masuk Sekolah (Awal TP 2026/2027)", kategori: "Akademik" },
  { id: "ev-2", tanggal: "2026-08-17", kegiatan: "Upacara Peringatan HUT RI ke-81", kategori: "Libur" },
  { id: "ev-3", tanggal: "2026-09-21", kegiatan: "Asesmen Tengah Semester (ATS) Ganjil", kategori: "Ujian" },
  { id: "ev-4", tanggal: "2026-10-05", kegiatan: "Rapat Pleno Komite & Wali Murid", kategori: "Rapat" },
  { id: "ev-5", tanggal: "2026-12-07", kegiatan: "Asesmen Akhir Semester (AAS) Ganjil", kategori: "Ujian" },
  { id: "ev-6", tanggal: "2026-12-18", kegiatan: "Pembagian Rapor Hasil Belajar Semester 1", kategori: "Akademik" },
];

// Initial Jurnal Pembelajaran
const initialJournals: JournalRecord[] = [
  {
    id: "jr-1",
    tanggal: "2026-07-14",
    hari: "Selasa",
    mapel: "Matematika",
    bab: "Bilangan Cacah Sampai 100.000",
    tujuan: "Murid dapat membaca dan menulis bilangan cacah besar.",
    moodKelas: "Sangat Kondusif",
    catatan: "Siti Aminah dan Ahmad Fauzi sangat aktif menjawab pertanyaan pemantik."
  },
  {
    id: "jr-2",
    tanggal: "2026-07-15",
    hari: "Rabu",
    mapel: "IPA",
    bab: "Sistem Organ Tubuh Manusia",
    tujuan: "Murid dapat mengidentifikasi letak organ pernapasan harian.",
    moodKelas: "Cukup Aktif",
    catatan: "Eksperimen menggunakan botol bekas dan balon berjalan lancar."
  }
];

// Initial Konsultasi Bulanan
const initialConsultations: ConsultationRecord[] = [
  {
    id: "cs-1",
    tanggal: "2026-07-20",
    namaMurid: "Budi Santoso",
    namaWali: "Slamet Santoso",
    topik: "Konsentrasi belajar Budi sering menurun di jam siang akibat asma yang kadang kambuh.",
    solusi: "Menempatkan Budi di kursi baris depan dekat jendela yang udaranya bersih dan memantau pemakaian inhaler harian.",
    tindakLanjut: "Orang tua akan membekali obat pribadi dan guru memantau kebersihan ventilasi kelas."
  }
];

export default function AdminSuite({ students }: AdminSuiteProps) {
  const [activeTab, setActiveTab] = useState<"CALENDAR" | "CP_ATP" | "JOURNAL" | "PROTA_PROMES" | "LESSON_PLANS" | "CONSULTATION">("CALENDAR");

  // Local state persisted in localStorage or fallback
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("ukail_cal_events");
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [journals, setJournals] = useState<JournalRecord[]>(() => {
    const saved = localStorage.getItem("ukail_journals");
    return saved ? JSON.parse(saved) : initialJournals;
  });

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    const saved = localStorage.getItem("ukail_consultations");
    return saved ? JSON.parse(saved) : initialConsultations;
  });

  // Save states in useEffect
  useEffect(() => {
    localStorage.setItem("ukail_cal_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("ukail_journals", JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem("ukail_consultations", JSON.stringify(consultations));
  }, [consultations]);

  // Form states
  // 1. Calendar event
  const [evtTanggal, setEvtTanggal] = useState("");
  const [evtKegiatan, setEvtKegiatan] = useState("");
  const [evtKategori, setEvtKategori] = useState<"Akademik" | "Ujian" | "Rapat" | "Libur">("Akademik");

  // 2. Journal form
  const [jrTanggal, setJrTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jrHari, setJrHari] = useState("Senin");
  const [jrMapel, setJrMapel] = useState("Matematika");
  const [jrBab, setJrBab] = useState("");
  const [jrTujuan, setJrTujuan] = useState("");
  const [jrMood, setJrMood] = useState<"Sangat Kondusif" | "Cukup Aktif" | "Perlu Perhatian">("Sangat Kondusif");
  const [jrCatatan, setJrCatatan] = useState("");

  // 3. Consultation form
  const [csTanggal, setCsTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [csNis, setCsNis] = useState("");
  const [csTopik, setCsTopik] = useState("");
  const [csSolusi, setCsSolusi] = useState("");
  const [csTindak, setCsTindak] = useState("");

  // Modul Ajar subject selection
  const [selectedLPSubject, setSelectedLPSubject] = useState("Matematika");
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [generatedModulContent, setGeneratedModulContent] = useState<any>(null);

  // Add Calendar Event
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTanggal || !evtKegiatan) return;

    const newEvt: CalendarEvent = {
      id: "ev-" + Date.now(),
      tanggal: evtTanggal,
      kegiatan: evtKegiatan,
      kategori: evtKategori
    };

    setEvents((prev) => [...prev, newEvt].sort((a, b) => a.tanggal.localeCompare(b.tanggal)));
    setEvtTanggal("");
    setEvtKegiatan("");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Add Journal Entry
  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jrBab || !jrTujuan) {
      alert("Harap isi pokok bahasan bab dan tujuan pembelajaran!");
      return;
    }

    const newJr: JournalRecord = {
      id: "jr-" + Date.now(),
      tanggal: jrTanggal,
      hari: jrHari,
      mapel: jrMapel,
      bab: jrBab,
      tujuan: jrTujuan,
      moodKelas: jrMood,
      catatan: jrCatatan
    };

    setJournals((prev) => [newJr, ...prev]);
    setJrBab("");
    setJrTujuan("");
    setJrCatatan("");
  };

  const handleDeleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  // Add Consultation Record
  const handleAddConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csNis || !csTopik) {
      alert("Pilih murid dan isi deskripsi topik konsultasi!");
      return;
    }

    const targetMurid = students.find((s) => s.nis === csNis);
    if (!targetMurid) return;

    const newCs: ConsultationRecord = {
      id: "cs-" + Date.now(),
      tanggal: csTanggal,
      namaMurid: targetMurid.nama,
      namaWali: targetMurid.namaIbu !== "-" ? targetMurid.namaIbu : targetMurid.namaAyah,
      topik: csTopik,
      solusi: csSolusi,
      tindakLanjut: csTindak
    };

    setConsultations((prev) => [newCs, ...prev]);
    setCsTopik("");
    setCsSolusi("");
    setCsTindak("");
    setCsNis("");
  };

  const handleDeleteConsultation = (id: string) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  };

  // AI Module Generation simulation (matching user constraints for educational richness)
  const triggerAIGenerator = () => {
    setIsAIGenerating(true);
    setGeneratedModulContent(null);

    setTimeout(() => {
      setIsAIGenerating(false);
      // Predefined rich curricula for indonesian Merdeka Curriculum
      const databaseModul: Record<string, any> = {
        "Matematika": {
          judul: "Modul Ajar Matematika - Fase C (Kelas 5) - Bilangan Cacah",
          elemen: "Bilangan",
          alokasi: "2 JP x 35 Menit (Pertemuan 1)",
          tujuan: [
            "Murid dapat mengonstruksikan penulisan nominal angka sampai 100.000 dengan benar.",
            "Murid dapat membandingkan dan mengurutkan bilangan cacah besar dalam konteks kehidupan sehari-hari."
          ],
          metode: "Problem-Based Learning (PBL) & Diskusi Kelompok",
          kegiatan: {
            pembuka: "Apersepsi menggunakan replika uang mainan nominal besar. Guru menyajikan masalah kontekstual belanja.",
            inti: "1. Murid berkelompok sesuai gaya belajar (visual menganalisis bagan nilai tempat, kinestetik bermain kartu angka).\n2. Guru membimbing penyelidikan kelompok tentang perbandingan bilangan cacah.\n3. Presentasi perwakilan kelompok harian.",
            penutup: "Refleksi belajar individu, pengerjaan kuis kilat, doa penutup harian."
          },
          asesmen: "Formatif (Lembar Kerja Kelompok) & Sumatif (Pilihan Ganda)"
        },
        "IPA (Ilmu Pengetahuan Alam)": {
          judul: "Modul Ajar IPAS - Fase C (Kelas 5) - Cahaya dan Sifatnya",
          elemen: "Pemahaman IPAS (Sains Fisika)",
          alokasi: "2 JP x 35 Menit",
          tujuan: [
            "Murid dapat menganalisis sifat-sifat cahaya (merambat lurus, dipantulkan, menembus benda bening, dibiaskan) melalui percobaan terpadu.",
            "Murid mampu membuat laporan hasil percobaan pemantulan cahaya secara mandiri."
          ],
          metode: "Inquiry Guided Learning (Eksperimen Kelompok)",
          kegiatan: {
            pembuka: "Menghidupkan senter dalam ruangan gelap, mengamati arah rambatan berkas cahaya senter.",
            inti: "1. Eksperimen Sifat Cahaya: Menembus benda bening (menggunakan gelas kaca), membiaskan (pensil dalam air).\n2. Murid mencatat hipotesis dan hasil akhir praktikum di LKPD.\n3. Diskusi interaktif menguji kesimpulan praktikum.",
            penutup: "Meringkas 4 sifat utama cahaya bersama guru, memberikan apresiasi keaktifan praktikum."
          },
          asesmen: "Kinerja Praktikum (Rubrik Pengamatan Senter & Cermin) + Tes Tulis Esai"
        },
        "IPS (Ilmu Pengetahuan Sosial)": {
          judul: "Modul Ajar IPAS - Fase C - Warisan Sejarah Kerajaan Hindu-Buddha",
          elemen: "Waktu, Keberlanjutan, dan Perubahan",
          alokasi: "2 JP x 35 Menit",
          tujuan: [
            "Murid dapat memetakan peninggalan kerajaan Hindu-Buddha di Indonesia beserta fungsinya.",
            "Murid mampu menceritakan nilai toleransi budaya bersejarah bagi peradaban masa kini."
          ],
          metode: "Cooperative Script & Mind Mapping",
          kegiatan: {
            pembuka: "Guru menyajikan foto Candi Prambanan dan Candi Borobudur sebagai stimulus visual sejarah.",
            inti: "1. Membaca literasi singkat silsilah kerajaan Sriwijaya & Majapahit.\n2. Membuat peta pikiran peninggalan artefak kuno per wilayah daerah.\n3. Sesi tanya jawab tebak nama tokoh pahlawan sejarah (Gajah Mada, Hayam Wuruk).",
            penutup: "Kesimpulan bahwa warisan sejarah mendasari persatuan NKRI hari ini."
          },
          asesmen: "Penilaian Peta Pikiran (Mind Map Rubric) & Keaktifan Diskusi"
        },
        "Bahasa Indonesia": {
          judul: "Modul Ajar Bahasa Indonesia - Menulis Teks Deskripsi Alami",
          elemen: "Menulis & Membaca",
          alokasi: "2 JP",
          tujuan: [
            "Murid dapat menulis paragraf deskripsi singkat tentang objek sekolah dengan diksi yang kaya.",
            "Murid terampil mengoreksi kesesuaian tanda baca titik dan koma pada tulisan mandiri."
          ],
          metode: "Field Trip Observasi Lingkungan Sekolah",
          kegiatan: {
            pembuka: "Membaca bersama contoh paragraf deskripsi tentang keindahan taman kelas.",
            inti: "1. Murid keluar kelas sejenak untuk mengamati satu objek hidup (pohon/tanaman/kolam).\n2. Murid merancang draf deskripsi berdasarkan pancaindra.\n3. Penyuntingan bersama tanda baca berpasangan.",
            penutup: "Membacakan hasil deskripsi terindah di hadapan kelas."
          },
          asesmen: "Portofolio Teks Deskripsi (Kriteria: Pilihan kata, Ketepatan PUEBI)"
        }
      };

      // Fallback for general subjects
      setGeneratedModulContent(databaseModul[selectedLPSubject] || {
        judul: `Modul Ajar ${selectedLPSubject} - Rencana Merdeka Belajar`,
        elemen: "Kompetensi Fase C",
        alokasi: "2 JP x 35 Menit",
        tujuan: [
          `Murid memahami konsep dasar pelajaran ${selectedLPSubject} secara kontekstual harian.`,
          `Mendorong kemampuan berfikir kritis murid melalui studi kasus tematik.`
        ],
        metode: "Saintifik, Ceramah Interaktif, Penugasan Mandiri",
        kegiatan: {
          pembuka: "Ice breaking singkat dan penyampaian target belajar.",
          inti: "Pemaparan materi, tanya-jawab terpadu, latihan penguatan di buku tulis harian.",
          penutup: "Umpan balik guru atas pemahaman materi murid dan refleksi akhir."
        },
        asesmen: "Latihan Soal & Pengamatan Sikap (Profil Pelajar Pancasila)"
      });
    }, 900);
  };

  // Predefined ATP CP Capaian Pembelajaran data
  const dynamicAtpCp: Record<string, { cp: string; atp: string[] }> = {
    "Matematika": {
      cp: "Fase C (Kelas 5): Peserta didik dapat membaca, menulis, membandingkan, mengurutkan, dan menentukan nilai tempat bilangan cacah sampai 100.000, serta melakukan operasi hitung penjumlahan, pengurangan, perkalian, dan pembagian pecahan.",
      atp: [
        "1.1 Membaca dan menulis bilangan cacah sampai 100.000 dengan lancar.",
        "1.2 Membandingkan nilai bilangan cacah besar berdasarkan nilai tempat.",
        "1.3 Menyelesaikan masalah operasi hitung campuran dalam kehidupan sehari-hari.",
        "1.4 Memahami pecahan senilai dan menyederhanakan pecahan kompleks."
      ]
    },
    "IPA (Ilmu Pengetahuan Alam)": {
      cp: "Fase C: Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia, memahami sifat-sifat bunyi dan cahaya melalui percobaan, dan menganalisis siklus air serta dampaknya bagi bumi.",
      atp: [
        "1.1 Mengidentifikasi sistem pencernaan dan organ tubuh manusia.",
        "1.2 Melakukan percobaan sifat-sifat cahaya merambat dan membias.",
        "1.3 Menjelaskan siklus daur air tanah secara runtut.",
        "1.4 Mendesain peta konsep rantai makanan ekosistem hutan."
      ]
    },
    "Bahasa Indonesia": {
      cp: "Fase C: Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, membaca teks deskripsi, memahami ide pokok, serta menulis karangan eksposisi dan narasi secara mandiri.",
      atp: [
        "1.1 Menemukan gagasan pokok teks narasi fiksi.",
        "1.2 Menulis teks deskriptif bertema alam sekitar.",
        "1.3 Mengidentifikasi imbuhan ter- dan pe- dalam kalimat majemuk.",
        "1.4 Berpidato singkat bertema kebersihan lingkungan sekolah."
      ]
    }
  };

  // Promes matrix scheduler checkbox states
  const [promesWeeks, setPromesWeeks] = useState<Record<string, boolean>>({
    "Mat-W1": true, "Mat-W2": true, "Mat-W3": false, "Mat-W4": false,
    "Ipa-W1": false, "Ipa-W2": true, "Ipa-W3": true, "Ipa-W4": false,
    "Indo-W1": true, "Indo-W2": false, "Indo-W3": true, "Indo-W4": true
  });

  const togglePromesCheckbox = (key: string) => {
    setPromesWeeks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Module Title Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              Modul Administrasi Kurikulum Merdeka
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">Suite Administrasi Guru Terpadu</h3>
            <p className="text-xs text-slate-400 mt-1">
              Rancang kalender pendidikan, analisis tujuan pembelajaran (ATP), jurnal harian, dan auto-generate modul ajar.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen (Ctrl+P)
          </button>
        </div>
      </div>

      {/* Internal Ribbon Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
        {[
          { id: "CALENDAR", label: "Kalender Pendidikan", icon: Calendar },
          { id: "CP_ATP", label: "Analisis CP & ATP", icon: Layers },
          { id: "JOURNAL", label: "Jurnal Pembelajaran", icon: ClipboardList },
          { id: "PROTA_PROMES", label: "Prota & Promes", icon: FileSpreadsheet },
          { id: "LESSON_PLANS", label: "Modul Ajar (RPP)", icon: BookOpen },
          { id: "CONSULTATION", label: "Konsultasi Bulanan", icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* RENDER CONTENT BASED ON ACTIVE SUB TAB */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          {/* 1. KALENDER PENDIDIKAN */}
          {activeTab === "CALENDAR" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Form Input Event (Kiri) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Rencanakan Kegiatan Baru</h4>
                  <p className="text-xs text-slate-500 mb-4">Tambahkan jadwal agenda kurikulum akademik ke kalender sekolah.</p>

                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tanggal Agenda</label>
                      <input
                        type="date"
                        value={evtTanggal}
                        onChange={(e) => setEvtTanggal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Kategori Agenda</label>
                      <select
                        value={evtKategori}
                        onChange={(e: any) => setEvtKategori(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-bold"
                      >
                        <option value="Akademik">Akademik (KBM)</option>
                        <option value="Ujian">Evaluasi & Ujian</option>
                        <option value="Rapat">Rapat Koordinasi</option>
                        <option value="Libur">Hari Libur / Upacara</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Nama Kegiatan harian</label>
                      <textarea
                        rows={2}
                        value={evtKegiatan}
                        onChange={(e) => setEvtKegiatan(e.target.value)}
                        placeholder="Contoh: Pembagian Lembar UTS Ganjil..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Sematkan Agenda (AddEvent)
                    </button>
                  </form>
                </div>

                <div className="mt-6 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 leading-relaxed">
                  <strong>Macro Excel:</strong> Data ini akan disinkronkan harian ke worksheet <code>SETTINGS_CALENDAR</code> range <code>A2:D50</code>.
                </div>
              </div>

              {/* Event Timeline List (Kanan) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-[480px] flex flex-col">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h4 className="text-sm font-bold text-slate-900">Agenda Kalender Pendidikan</h4>
                  <p className="text-xs text-slate-500">Daftar estimasi jadwal akademik aktif selama Semester ini.</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {events.length > 0 ? (
                    events.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/75 transition-all border border-slate-100 rounded-xl flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex gap-3">
                          {/* Categorized Ribbon marker */}
                          <div className={`w-2.5 h-10 rounded-full shrink-0 ${
                            evt.kategori === "Akademik" ? "bg-blue-500" :
                            evt.kategori === "Ujian" ? "bg-amber-500" :
                            evt.kategori === "Rapat" ? "bg-purple-500" : "bg-red-500"
                          }`} />
                          <div>
                            <span className="font-mono text-[10px] text-slate-400 block font-bold">{evt.tanggal}</span>
                            <span className="font-bold text-slate-900 block mt-0.5 leading-snug">{evt.kegiatan}</span>
                            <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              evt.kategori === "Akademik" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                              evt.kategori === "Ujian" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              evt.kategori === "Rapat" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                              "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                              {evt.kategori}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                      Belum ada agenda pendidikan tercatat.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. ANALISIS CP & ATP */}
          {activeTab === "CP_ATP" && (
            <div className="space-y-6">
              {/* Top Selector banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Analisis Capaian Pembelajaran (CP)</h4>
                    <p className="text-xs text-slate-500">Menganalisis ketercapaian Alur Tujuan Pembelajaran (ATP) per mata pelajaran.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Pilih Mapel:</span>
                    <select
                      value={selectedLPSubject}
                      onChange={(e) => setSelectedLPSubject(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold cursor-pointer focus:outline-none"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="IPA (Ilmu Pengetahuan Alam)">IPA (Sains)</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>

                {/* CP Banner */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <span className="font-extrabold uppercase tracking-wider text-[9px] text-blue-600 block mb-1">
                    Capaian Pembelajaran (CP) Resmi Pemerintah:
                  </span>
                  {dynamicAtpCp[selectedLPSubject]?.cp || "Fase C: Peserta didik menunjukkan penguasaan materi ajar dengan kompetensi dasar berpikir komparatif dan logis."}
                </div>
              </div>

              {/* ATP & Progress tracker list */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alur Tujuan Pembelajaran (ATP) Kelas 5</h4>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    Fase C - SD Negeri 1
                  </span>
                </div>

                <div className="space-y-3.5">
                  {(dynamicAtpCp[selectedLPSubject]?.atp || [
                    "1.1 Menguasai materi teoretis dasar pembelajaran.",
                    "1.2 Menyelesaikan studi kasus mandiri harian.",
                    "1.3 Menerapkan prinsip kolaboratif di kelas."
                  ]).map((atpItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{atpItem}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            Target Ketercapaian Minimum (KKTP): <span className="font-bold text-slate-600 font-mono">75</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2 py-0.5 rounded uppercase">
                        Selesai Diajarkan
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. JURNAL PEMBELAJARAN */}
          {activeTab === "JOURNAL" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Form Input Journal (Kiri) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Log Jurnal Kelas</h4>
                  <p className="text-xs text-slate-500 mb-4">Catat bahan ajar harian dan kondisi murid secara langsung.</p>

                  <form onSubmit={handleAddJournal} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tanggal</label>
                        <input
                          type="date"
                          value={jrTanggal}
                          onChange={(e) => setJrTanggal(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Hari</label>
                        <select
                          value={jrHari}
                          onChange={(e) => setJrHari(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Mapel</label>
                        <select
                          value={jrMapel}
                          onChange={(e) => setJrMapel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-bold"
                        >
                          {subjectsList.map((m, idx) => (
                            <option key={idx} value={m.split(" ")[0]}>{m.split(" ")[0]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Kondisi Kelas</label>
                        <select
                          value={jrMood}
                          onChange={(e: any) => setJrMood(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Sangat Kondusif">Sangat Kondusif</option>
                          <option value="Cukup Aktif">Cukup Aktif</option>
                          <option value="Perlu Perhatian">Perlu Perhatian</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Materi Pokok / Bab</label>
                      <input
                        type="text"
                        value={jrBab}
                        onChange={(e) => setJrBab(e.target.value)}
                        placeholder="Contoh: Bab 2 - Struktur Daun"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tujuan Pembelajaran</label>
                      <input
                        type="text"
                        value={jrTujuan}
                        onChange={(e) => setJrTujuan(e.target.value)}
                        placeholder="Contoh: Menguji adanya klorofil pada daun hijau"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Catatan Kejadian Harian</label>
                      <textarea
                        rows={2}
                        value={jrCatatan}
                        onChange={(e) => setJrCatatan(e.target.value)}
                        placeholder="Contoh: Beberapa murid perlu remidial materi minggu lalu..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Jurnal Harian (SaveJournal)
                    </button>
                  </form>
                </div>

                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[9px] text-indigo-800 flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-600" />
                  <span>Menggunakan standardisasi Kurikulum Merdeka Fase C Nasional.</span>
                </div>
              </div>

              {/* Journal Table Timeline (Kanan) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-[530px] flex flex-col">
                <div className="border-b border-slate-100 pb-2.5 mb-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Jurnal Mengajar Harian Guru</h4>
                    <p className="text-xs text-slate-500">Histori logging kegiatan KBM tatap muka di kelas.</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border px-2 py-0.5 rounded">
                    {journals.length} Jurnal
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {journals.length > 0 ? (
                    journals.map((jr) => (
                      <div
                        key={jr.id}
                        className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-xl text-xs space-y-2 relative"
                      >
                        <button
                          onClick={() => handleDeleteJournal(jr.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Hapus Jurnal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono font-bold">
                          <span>{jr.hari}, {jr.tanggal}</span>
                          <span>•</span>
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.1 rounded uppercase text-[8px]">
                            {jr.mapel}
                          </span>
                        </div>

                        <div>
                          <h5 className="font-extrabold text-slate-900 text-sm leading-tight">{jr.bab}</h5>
                          <p className="text-[11px] text-slate-600 font-medium mt-1">TP: {jr.tujuan}</p>
                        </div>

                        {jr.catatan && (
                          <div className="p-2 bg-white rounded-lg border border-slate-200/60 text-[10px] italic text-slate-500">
                            <strong>Catatan:</strong> {jr.catatan}
                          </div>
                        )}

                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] text-slate-400">Keadaan Kelas:</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            jr.moodKelas === "Sangat Kondusif" ? "bg-emerald-50 text-emerald-700" :
                            jr.moodKelas === "Cukup Aktif" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {jr.moodKelas}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 italic">
                      Belum ada entri jurnal KBM.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. PROTA & PROMES */}
          {activeTab === "PROTA_PROMES" && (
            <div className="space-y-6">
              {/* Program Tahunan Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Program Tahunan (Prota) - TP 2026/2027</h4>
                  <p className="text-xs text-slate-500">Distribusi alokasi waktu belajar efektif untuk satu tahun pelajaran.</p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-4 w-12">No</th>
                        <th className="py-2.5 px-4 w-32">Mata Pelajaran</th>
                        <th className="py-2.5 px-4">Kompetensi Dasar / Bab Pokok</th>
                        <th className="py-2.5 px-4 w-28">Alokasi Waktu</th>
                        <th className="py-2.5 px-4 w-32">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {[
                        { no: 1, mapel: "Matematika", bab: "Bab 1: Bilangan Cacah Sampai 100.000", jp: "12 JP", sem: "Semester 1" },
                        { no: 2, mapel: "Matematika", bab: "Bab 2: FPB dan KPK Terapan", jp: "14 JP", sem: "Semester 1" },
                        { no: 3, mapel: "IPA", bab: "Bab 1: Organ Pernapasan & Sirkulasi Manusia", jp: "16 JP", sem: "Semester 1" },
                        { no: 4, mapel: "IPA", bab: "Bab 2: Sifat Sinar Cahaya & Indra Penglihatan", jp: "12 JP", sem: "Semester 1" },
                        { no: 5, mapel: "Bahasa Indonesia", bab: "Bab 1: Menulis Deskripsi & Narasi Fiksi", jp: "10 JP", sem: "Semester 1" },
                        { no: 6, mapel: "Bahasa Indonesia", bab: "Bab 2: Unsur Intrinsik Cerita Dongeng", jp: "10 JP", sem: "Semester 1" }
                      ].map((item) => (
                        <tr key={item.no} className="hover:bg-slate-50/55">
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-400">{item.no}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.mapel}</td>
                          <td className="py-2.5 px-4 font-medium">{item.bab}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{item.jp}</td>
                          <td className="py-2.5 px-4">
                            <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">
                              {item.sem}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Program Semester Section (Visual Checkbox Grid) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Program Semester (Promes) - Bulan Juli 2026</h4>
                  <p className="text-xs text-slate-500">Centang perencanaan jadwal mengajar mingguan (W1, W2, W3, W4) di bawah ini.</p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-center border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-3 px-4 text-left w-48">Mata Pelajaran (Fase C)</th>
                        <th className="py-3 px-4 w-28">Minggu 1</th>
                        <th className="py-3 px-4 w-28">Minggu 2</th>
                        <th className="py-3 px-4 w-28">Minggu 3</th>
                        <th className="py-3 px-4 w-28">Minggu 4</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {[
                        { id: "Mat", name: "Matematika (12 JP)" },
                        { id: "Ipa", name: "IPA (16 JP)" },
                        { id: "Indo", name: "Bahasa Indonesia (10 JP)" }
                      ].map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 text-left font-bold text-slate-900">{sub.name}</td>
                          {["W1", "W2", "W3", "W4"].map((week) => {
                            const key = `${sub.id}-${week}`;
                            const checked = promesWeeks[key];
                            return (
                              <td key={week} className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => togglePromesCheckbox(key)}
                                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mx-auto cursor-pointer ${
                                    checked
                                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                      : "bg-white border-slate-300 hover:border-blue-500"
                                  }`}
                                >
                                  {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. MODUL AJAR (LESSON PLANS) */}
          {activeTab === "LESSON_PLANS" && (
            <div className="space-y-6">
              {/* Controls and Select Subject */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Perancang Modul Ajar (RPP Plus)</h4>
                    <p className="text-xs text-slate-500">Pilih mata pelajaran untuk melihat atau menyusun rencana pembelajaran Merdeka.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={selectedLPSubject}
                      onChange={(e) => {
                        setSelectedLPSubject(e.target.value);
                        setGeneratedModulContent(null);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold cursor-pointer focus:outline-none"
                    >
                      {subjectsList.map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>

                    <button
                      onClick={triggerAIGenerator}
                      disabled={isAIGenerating}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                      {isAIGenerating ? "Menyusun dengan AI..." : "Susun Rencana Ajar (AI)"}
                    </button>
                  </div>
                </div>
              </div>

              {/* RENDER DYNAMIC MODULE DETAIL */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
                {isAIGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-xs font-bold text-slate-800">Menghubungkan ke Mesin AI UKAIL...</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Memformulasikan langkah ajar berdiferensiasi berdasarkan minat murid.</span>
                  </div>
                ) : generatedModulContent ? (
                  <div className="space-y-6">
                    {/* Header Modul */}
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 font-mono">Output Rencana Modul Ajar</span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-tight">{generatedModulContent.judul}</h3>
                      <p className="text-[10px] text-slate-500 mt-1">Elemen Utama: <strong>{generatedModulContent.elemen}</strong> | Alokasi: <strong>{generatedModulContent.alokasi}</strong></p>
                    </div>

                    {/* Tujuan Pembelajaran */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">A. Tujuan Pembelajaran (TP)</h4>
                      <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 font-medium">
                        {generatedModulContent.tujuan.map((t: string, idx: number) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Metode & Pendekatan */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">B. Metode Pembelajaran</h4>
                      <p className="text-xs text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg font-semibold">{generatedModulContent.metode}</p>
                    </div>

                    {/* Langkah Kegiatan */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">C. Langkah-Langkah Kegiatan Pembelajaran</h4>
                      <div className="space-y-2.5 text-xs leading-relaxed">
                        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                          <strong className="text-slate-900 block text-[11px] uppercase tracking-wide">1. Pendahuluan (10 Menit)</strong>
                          <p className="text-slate-600 mt-1">{generatedModulContent.kegiatan.pembuka}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                          <strong className="text-slate-900 block text-[11px] uppercase tracking-wide">2. Kegiatan Inti (50 Menit)</strong>
                          <p className="text-slate-600 mt-1 whitespace-pre-line">{generatedModulContent.kegiatan.inti}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                          <strong className="text-slate-900 block text-[11px] uppercase tracking-wide">3. Penutup (10 Menit)</strong>
                          <p className="text-slate-600 mt-1">{generatedModulContent.kegiatan.penutup}</p>
                        </div>
                      </div>
                    </div>

                    {/* Asesmen */}
                    <div className="space-y-2 border-t border-slate-150 pt-4">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">D. Rencana Asesmen</h4>
                      <p className="text-xs text-slate-600">{generatedModulContent.asesmen}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <BookOpen className="w-12 h-12 text-slate-200 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Rencana Pembelajaran Kosong</span>
                    <span className="text-[10px] text-slate-400 mt-1 max-w-sm">
                      Silakan pilih mapel dan klik <strong>"Susun Rencana Ajar (AI)"</strong> untuk membuat draf rencana pembelajaran harian instan.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. KONSULTASI BULANAN & LAPORAN */}
          {activeTab === "CONSULTATION" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Form Input Record (Kiri) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Log Konsultasi Orang Tua</h4>
                  <p className="text-xs text-slate-500 mb-4">Dokumentasikan catatan bimbingan atau konsultasi bulanan bersama wali murid.</p>

                  <form onSubmit={handleAddConsultation} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold">Tanggal Pertemuan</label>
                        <input
                          type="date"
                          value={csTanggal}
                          onChange={(e) => setCsTanggal(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold">Nama Murid</label>
                        <select
                          value={csNis}
                          onChange={(e) => setCsNis(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                          required
                        >
                          <option value="">-- Pilih Murid --</option>
                          {students.map((s) => (
                            <option key={s.nis} value={s.nis}>{s.nama}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold">Topik Permasalahan / Bahasan</label>
                      <textarea
                        rows={2}
                        value={csTopik}
                        onChange={(e) => setCsTopik(e.target.value)}
                        placeholder="Contoh: Perkembangan nilai kognitif matematika harian..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold">Solusi yang Disepakati</label>
                      <textarea
                        rows={2}
                        value={csSolusi}
                        onChange={(e) => setCsSolusi(e.target.value)}
                        placeholder="Contoh: Mengulang latihan di rumah 15 menit sebelum tidur..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold">Tindak Lanjut & Evaluasi</label>
                      <textarea
                        rows={2}
                        value={csTindak}
                        onChange={(e) => setCsTindak(e.target.value)}
                        placeholder="Contoh: Guru memantau pengerjaan PR harian di sekolah harian..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Sematkan Hasil Konsultasi (AddConsult)
                    </button>
                  </form>
                </div>
              </div>

              {/* Consultation Logs Timeline (Kanan) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-[530px] flex flex-col">
                <div className="border-b border-slate-100 pb-2.5 mb-4">
                  <h4 className="text-sm font-bold text-slate-900">Riwayat Bimbingan & Konsultasi</h4>
                  <p className="text-xs text-slate-500">Histori perbincangan harian dan solusi untuk murid Anda.</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {consultations.length > 0 ? (
                    consultations.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-xl text-xs space-y-2 relative"
                      >
                        <button
                          onClick={() => handleDeleteConsultation(c.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Hapus Rekor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
                          <span>Pertemuan: {c.tanggal}</span>
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-sans">Wali: {c.namaWali}</span>
                        </div>

                        <div>
                          <h5 className="font-extrabold text-slate-900 text-sm leading-tight">Murid: {c.namaMurid}</h5>
                          <p className="text-[11px] text-slate-700 mt-1.5"><strong>Bahasan:</strong> {c.topik}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-150 text-[10px] leading-relaxed">
                          <div>
                            <strong className="text-slate-800 block">Solusi Bersama:</strong>
                            <p className="text-slate-600 mt-0.5">{c.solusi}</p>
                          </div>
                          <div>
                            <strong className="text-slate-800 block">Rencana Tindak Lanjut:</strong>
                            <p className="text-slate-600 mt-0.5">{c.tindakLanjut}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 italic">
                      Belum ada konsultasi tercatat.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
