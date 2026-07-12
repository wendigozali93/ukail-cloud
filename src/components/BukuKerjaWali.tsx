import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  User,
  Users,
  Calendar,
  Grid,
  FileText,
  Bookmark,
  AlertTriangle,
  Home,
  Briefcase,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Search,
  Save,
  Printer,
  FileSpreadsheet,
  Download,
  Award,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Murid,
  InventarisItem,
  StrukturOrganisasi,
  JadwalPelajaranItem,
  CatatanPrestasi,
  CatatanPelanggaran,
  HomeVisit,
  PortofolioItem,
  JurnalHarianWali
} from "../types";

interface BukuKerjaWaliProps {
  students: Murid[];
  onUpdateStudent: (student: Murid) => void;
}

export default function BukuKerjaWali({ students, onUpdateStudent }: BukuKerjaWaliProps) {
  const [activeMenu, setActiveMenu] = useState<
    | "IDENTITAS"
    | "SISWA"
    | "STRUKTUR"
    | "JADWAL_PELAJARAN"
    | "JADWAL_PIKET"
    | "INVENTARIS"
    | "ORANG_TUA"
    | "PRESTASI"
    | "PELANGGARAN"
    | "HOME_VISIT"
    | "PORTOFOLIO"
    | "JURNAL_HARIAN"
  >("IDENTITAS");

  // Identitas Kelas State
  const [identitas, setIdentitas] = useState({
    namaKelas: localStorage.getItem("ukail_id_namaKelas") || "Kelas 5-A",
    waliKelas: localStorage.getItem("ukail_id_waliKelas") || "Drs. Ahmad Fauzi, M.Pd.",
    nip: localStorage.getItem("ukail_id_nip") || "19840212 201001 1 005",
    sekolah: localStorage.getItem("ukail_id_sekolah") || "SD Negeri 1 Belajar",
    tahunPelajaran: localStorage.getItem("ukail_id_tahun") || "2026/2027",
    ruangan: localStorage.getItem("ukail_id_ruangan") || "Gedung Utama Lt. 2",
    semester: localStorage.getItem("ukail_id_semester") || "Ganjil (1)"
  });

  const handleSaveIdentitas = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ukail_id_namaKelas", identitas.namaKelas);
    localStorage.setItem("ukail_id_waliKelas", identitas.waliKelas);
    localStorage.setItem("ukail_id_nip", identitas.nip);
    localStorage.setItem("ukail_id_sekolah", identitas.sekolah);
    localStorage.setItem("ukail_id_tahun", identitas.tahunPelajaran);
    localStorage.setItem("ukail_id_ruangan", identitas.ruangan);
    localStorage.setItem("ukail_id_semester", identitas.semester);
    alert("Identitas Kelas berhasil disimpan harian secara cloud!");
  };

  // Struktur Organisasi State
  const [struktur, setStruktur] = useState<StrukturOrganisasi>(() => {
    const saved = localStorage.getItem("ukail_struktur");
    return saved
      ? JSON.parse(saved)
      : {
          waliKelas: "Drs. Ahmad Fauzi, M.Pd.",
          ketuaKelas: "Ahmad Fauzi",
          wakilKetua: "Siti Aminah",
          sekretaris: "Budi Santoso",
          bendahara: "Lani Lestari",
          seksiKebersihan: "Roni Hermansyah",
          seksiKeindahan: "Dewi Lestari",
          seksiKeamanan: "Eko Prasetyo"
        };
  });

  useEffect(() => {
    localStorage.setItem("ukail_struktur", JSON.stringify(struktur));
  }, [struktur]);

  // Jadwal Pelajaran State
  const [jadwalPelajaran, setJadwalPelajaran] = useState<JadwalPelajaranItem[]>(() => {
    const saved = localStorage.getItem("ukail_jadwal_pelajaran");
    return saved
      ? JSON.parse(saved)
      : [
          { hari: "Senin", pukul: "07:30 - 09:00", mapel: "Pendidikan Pancasila", pengajar: "Drs. Ahmad Fauzi, M.Pd." },
          { hari: "Senin", pukul: "09:15 - 10:45", mapel: "Bahasa Indonesia", pengajar: "Ibu Hartati, S.Pd." },
          { hari: "Selasa", pukul: "07:30 - 09:00", mapel: "Matematika", pengajar: "Pak Gunawan, S.Si." },
          { hari: "Selasa", pukul: "09:15 - 10:45", mapel: "IPA (IPAS)", pengajar: "Ibu Indah, S.Pd." }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_jadwal_pelajaran", JSON.stringify(jadwalPelajaran));
  }, [jadwalPelajaran]);

  // Inventaris State
  const [inventaris, setInventaris] = useState<InventarisItem[]>(() => {
    const saved = localStorage.getItem("ukail_inventaris");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "inv-1", namaBarang: "Meja Guru", jumlah: 1, kondisi: "Baik", keterangan: "Bahan Kayu Jati" },
          { id: "inv-2", namaBarang: "Meja Murid", jumlah: 16, kondisi: "Baik", keterangan: "Double desk" },
          { id: "inv-3", namaBarang: "Papan Tulis Whiteboard", jumlah: 1, kondisi: "Baik", keterangan: "Magnetik" },
          { id: "inv-4", namaBarang: "Lemari Buku Kelas", jumlah: 1, kondisi: "Rusak Ringan", keterangan: "Pintu kanan goyang" }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_inventaris", JSON.stringify(inventaris));
  }, [inventaris]);

  // Catatan Prestasi State
  const [prestasiList, setPrestasiList] = useState<CatatanPrestasi[]>(() => {
    const saved = localStorage.getItem("ukail_prestasi");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "pr-1",
            nis: "1201",
            namaMurid: "Ahmad Fauzi",
            prestasi: "Juara 1 Lomba Pidato Bahasa Indonesia",
            tanggal: "2026-08-20",
            tingkat: "Kecamatan",
            keterangan: "Menerima piala emas dan piagam penghargaan"
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_prestasi", JSON.stringify(prestasiList));
  }, [prestasiList]);

  // Catatan Pelanggaran State
  const [pelanggaranList, setPelanggaranList] = useState<CatatanPelanggaran[]>(() => {
    const saved = localStorage.getItem("ukail_pelanggaran");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "pl-1",
            nis: "1203",
            namaMurid: "Budi Santoso",
            pelanggaran: "Terlambat masuk kelas tanpa keterangan",
            tanggal: "2026-07-16",
            tindakLanjut: "Diberikan teguran lisan dan bimbingan wali kelas",
            poin: 5
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_pelanggaran", JSON.stringify(pelanggaranList));
  }, [pelanggaranList]);

  // Catatan Home Visit State
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>(() => {
    const saved = localStorage.getItem("ukail_home_visits");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "hv-1",
            nis: "1203",
            namaMurid: "Budi Santoso",
            tanggal: "2026-07-22",
            tujuan: "Koordinasi kesehatan asma Budi",
            hasil: "Orang tua sepakat membekali inhaler pribadi harian",
            mediaSim: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200"
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_home_visits", JSON.stringify(homeVisits));
  }, [homeVisits]);

  // Portofolio State
  const [portofolios, setPortofolios] = useState<PortofolioItem[]>(() => {
    const saved = localStorage.getItem("ukail_portofolios");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "pf-1",
            nis: "1202",
            namaMurid: "Siti Aminah",
            namaKarya: "Model Paru-Paru Sederhana dari Balon",
            tanggal: "2026-07-15",
            kategori: "Proyek Sains",
            nilai: 92,
            catatan: "Sangat kreatif, bahan daur ulang terpasang rapi dan bekerja baik."
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_portofolios", JSON.stringify(portofolios));
  }, [portofolios]);

  // Jurnal Harian Wali State
  const [jurnalsWali, setJurnalsWali] = useState<JurnalHarianWali[]>(() => {
    const saved = localStorage.getItem("ukail_jurnals_wali");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "jw-1",
            tanggal: "2026-07-13",
            kegiatan: "Pelaksanaan MPLS Hari Pertama",
            kejadianPenting: "Murid berkenalan, pembagian struktur organisasi darurat",
            penanganan: "Kelas kondusif, murid antusias.",
            status: "Selesai"
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("ukail_jurnals_wali", JSON.stringify(jurnalsWali));
  }, [jurnalsWali]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  // CSV Export simulation
  const handleExportCSV = (title: string, data: any[]) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form Adding temporary states
  // 1. Jadwal Pelajaran Form
  const [frmHari, setFrmHari] = useState<any>("Senin");
  const [frmPukul, setFrmPukul] = useState("");
  const [frmMapel, setFrmMapel] = useState("");
  const [frmPengajar, setFrmPengajar] = useState("");

  const handleAddJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frmPukul || !frmMapel || !frmPengajar) return;
    setJadwalPelajaran((prev) => [...prev, { hari: frmHari, pukul: frmPukul, mapel: frmMapel, pengajar: frmPengajar }]);
    setFrmPukul("");
    setFrmMapel("");
    setFrmPengajar("");
  };

  // 2. Inventaris Form
  const [invNama, setInvNama] = useState("");
  const [invJumlah, setInvJumlah] = useState(1);
  const [invKondisi, setInvKondisi] = useState<any>("Baik");
  const [invKet, setInvKet] = useState("");

  const handleAddInventaris = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invNama) return;
    const newItem: InventarisItem = {
      id: "inv-" + Date.now(),
      namaBarang: invNama,
      jumlah: invJumlah,
      kondisi: invKondisi,
      keterangan: invKet
    };
    setInventaris((prev) => [...prev, newItem]);
    setInvNama("");
    setInvJumlah(1);
    setInvKet("");
  };

  // 3. Prestasi Form
  const [prNis, setPrNis] = useState("");
  const [prNama, setPrNama] = useState("");
  const [prTingkat, setPrTingkat] = useState<any>("Sekolah");
  const [prDesc, setPrDesc] = useState("");
  const [prTanggal, setPrTanggal] = useState("");

  const handleAddPrestasi = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.nis === prNis);
    if (!student || !prNama) return;
    const newItem: CatatanPrestasi = {
      id: "pr-" + Date.now(),
      nis: prNis,
      namaMurid: student.nama,
      prestasi: prNama,
      tanggal: prTanggal || new Date().toISOString().split("T")[0],
      tingkat: prTingkat,
      keterangan: prDesc
    };
    setPrestasiList((prev) => [...prev, newItem]);
    setPrNama("");
    setPrDesc("");
    setPrNis("");
  };

  // 4. Pelanggaran Form
  const [plNis, setPlNis] = useState("");
  const [plNama, setPlNama] = useState("");
  const [plSolusi, setPlSolusi] = useState("");
  const [plPoin, setPlPoin] = useState(5);
  const [plTanggal, setPlTanggal] = useState("");

  const handleAddPelanggaran = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.nis === plNis);
    if (!student || !plNama) return;
    const newItem: CatatanPelanggaran = {
      id: "pl-" + Date.now(),
      nis: plNis,
      namaMurid: student.nama,
      pelanggaran: plNama,
      tanggal: plTanggal || new Date().toISOString().split("T")[0],
      tindakLanjut: plSolusi,
      poin: Number(plPoin)
    };
    setPelanggaranList((prev) => [...prev, newItem]);
    setPlNama("");
    setPlSolusi("");
    setPlNis("");
  };

  // 5. Home Visit Form
  const [hvNis, setHvNis] = useState("");
  const [hvTujuan, setHvTujuan] = useState("");
  const [hvHasil, setHvHasil] = useState("");
  const [hvTanggal, setHvTanggal] = useState("");

  const handleAddHomeVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.nis === hvNis);
    if (!student || !hvTujuan) return;
    const newItem: HomeVisit = {
      id: "hv-" + Date.now(),
      nis: hvNis,
      namaMurid: student.nama,
      tanggal: hvTanggal || new Date().toISOString().split("T")[0],
      tujuan: hvTujuan,
      hasil: hvHasil,
      mediaSim: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200"
    };
    setHomeVisits((prev) => [...prev, newItem]);
    setHvTujuan("");
    setHvHasil("");
    setHvNis("");
  };

  // 6. Portofolio Form
  const [pfNis, setPfNis] = useState("");
  const [pfKarya, setPfKarya] = useState("");
  const [pfKategori, setPfKategori] = useState<any>("Proyek Sains");
  const [pfNilai, setPfNilai] = useState(80);
  const [pfCatatan, setPfCatatan] = useState("");
  const [pfTanggal, setPfTanggal] = useState("");

  const handleAddPortofolio = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.nis === pfNis);
    if (!student || !pfKarya) return;
    const newItem: PortofolioItem = {
      id: "pf-" + Date.now(),
      nis: pfNis,
      namaMurid: student.nama,
      namaKarya: pfKarya,
      tanggal: pfTanggal || new Date().toISOString().split("T")[0],
      kategori: pfKategori,
      nilai: pfNilai,
      catatan: pfCatatan
    };
    setPortofolios((prev) => [...prev, newItem]);
    setPfKarya("");
    setPfCatatan("");
    setPfNis("");
  };

  // 7. Jurnal Wali Form
  const [jwKegiatan, setJwKegiatan] = useState("");
  const [jwKejadian, setJwKejadian] = useState("");
  const [jwPenanganan, setJwPenanganan] = useState("");
  const [jwStatus, setJwStatus] = useState<any>("Selesai");
  const [jwTanggal, setJwTanggal] = useState("");

  const handleAddJurnalWali = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jwKegiatan) return;
    const newItem: JurnalHarianWali = {
      id: "jw-" + Date.now(),
      tanggal: jwTanggal || new Date().toISOString().split("T")[0],
      kegiatan: jwKegiatan,
      kejadianPenting: jwKejadian,
      penanganan: jwPenanganan,
      status: jwStatus
    };
    setJurnalsWali((prev) => [newItem, ...prev]);
    setJwKegiatan("");
    setJwKejadian("");
    setJwPenanganan("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans text-slate-800">
      {/* 12 Menu Sub-sidebar navigation (Left) */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit space-y-1">
        <div className="pb-3 border-b border-slate-100 mb-3 text-center lg:text-left">
          <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-2 justify-center lg:justify-start">
            <FolderOpen className="w-4 h-4 text-blue-600" />
            Buku Wali Kelas
          </h4>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">12 Kelengkapan Dokumen Administrasi</p>
        </div>

        {[
          { id: "IDENTITAS", label: "1. Identitas Kelas", icon: Home },
          { id: "SISWA", label: "2. Data Profil Murid", icon: User },
          { id: "STRUKTUR", label: "3. Struktur Organisasi", icon: Users },
          { id: "JADWAL_PELAJARAN", label: "4. Jadwal Pelajaran", icon: BookOpen },
          { id: "JADWAL_PIKET", label: "5. Jadwal Piket Harian", icon: Calendar },
          { id: "INVENTARIS", label: "6. Inventaris Kelas", icon: Briefcase },
          { id: "ORANG_TUA", label: "7. Data Orang Tua", icon: Users },
          { id: "PRESTASI", label: "8. Catatan Prestasi", icon: Award },
          { id: "PELANGGARAN", label: "9. Catatan Pelanggaran", icon: AlertTriangle },
          { id: "HOME_VISIT", label: "10. Catatan Home Visit", icon: Home },
          { id: "PORTOFOLIO", label: "11. Portofolio Karya", icon: BookMarked },
          { id: "JURNAL_HARIAN", label: "12. Jurnal Wali Kelas", icon: FileText }
        ].map((m) => {
          const IconComp = m.icon;
          const isActive = activeMenu === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMenu(m.id as any)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2.5 cursor-pointer border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100 font-extrabold"
                  : "bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Interactive Forms and Document Sheets (Right) */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[550px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Header with Print and Export option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 tracking-wider">
                  UKAIL SaaS Kelengkapan Administrasi
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  {activeMenu === "IDENTITAS" && "Identitas & Profil Kelas"}
                  {activeMenu === "SISWA" && "Database Profil Siswa Kelas"}
                  {activeMenu === "STRUKTUR" && "Struktur Organisasi Kepengurusan"}
                  {activeMenu === "JADWAL_PELAJARAN" && "Jadwal Pelajaran Kelas"}
                  {activeMenu === "JADWAL_PIKET" && "Jadwal Piket Kebersihan Harian"}
                  {activeMenu === "INVENTARIS" && "Daftar Inventaris Sarana Prasarana"}
                  {activeMenu === "ORANG_TUA" && "Daftar Wali / Orang Tua Murid"}
                  {activeMenu === "PRESTASI" && "Catatan Piagam & Prestasi Murid"}
                  {activeMenu === "PELANGGARAN" && "Log Catatan Pelanggaran & Poin"}
                  {activeMenu === "HOME_VISIT" && "Buku Laporan Home Visit Wali Kelas"}
                  {activeMenu === "PORTOFOLIO" && "Portofolio Karya & Proyek Siswa"}
                  {activeMenu === "JURNAL_HARIAN" && "Jurnal Harian & Catatan Khusus Kelas"}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto select-none">
                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() =>
                    handleExportCSV(
                      activeMenu,
                      activeMenu === "INVENTARIS"
                        ? inventaris
                        : activeMenu === "PRESTASI"
                        ? prestasiList
                        : activeMenu === "PELANGGARAN"
                        ? pelanggaranList
                        : activeMenu === "PORTOFOLIO"
                        ? portofolios
                        : students
                    )
                  }
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel Export
                </button>
              </div>
            </div>

            {/* IDENTITAS KELAS */}
            {activeMenu === "IDENTITAS" && (
              <form onSubmit={handleSaveIdentitas} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Nama Kelas</label>
                    <input
                      type="text"
                      value={identitas.namaKelas}
                      onChange={(e) => setIdentitas({ ...identitas, namaKelas: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Ruangan Kelas</label>
                    <input
                      type="text"
                      value={identitas.ruangan}
                      onChange={(e) => setIdentitas({ ...identitas, ruangan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Nama Wali Kelas</label>
                    <input
                      type="text"
                      value={identitas.waliKelas}
                      onChange={(e) => setIdentitas({ ...identitas, waliKelas: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">NIP Wali Kelas</label>
                    <input
                      type="text"
                      value={identitas.nip}
                      onChange={(e) => setIdentitas({ ...identitas, nip: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Satuan Pendidikan</label>
                    <input
                      type="text"
                      value={identitas.sekolah}
                      onChange={(e) => setIdentitas({ ...identitas, sekolah: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Tahun Pelajaran</label>
                    <input
                      type="text"
                      value={identitas.tahunPelajaran}
                      onChange={(e) => setIdentitas({ ...identitas, tahunPelajaran: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Identitas
                </button>
              </form>
            )}

            {/* DATA SISWA */}
            {activeMenu === "SISWA" && (
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs"
                    placeholder="Cari berdasarkan nama atau NIS..."
                  />
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4 w-24">NIS</th>
                        <th className="py-2.5 px-4">Nama Lengkap</th>
                        <th className="py-2.5 px-4">Jenis Kelamin</th>
                        <th className="py-2.5 px-4">Alamat</th>
                        <th className="py-2.5 px-4">Gaya Belajar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {students
                        .filter((s) => s.nama.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((s) => (
                          <tr key={s.nis} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{s.nis}</td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">{s.nama}</td>
                            <td className="py-2.5 px-4">{s.jk === "L" ? "Laki-laki" : "Perempuan"}</td>
                            <td className="py-2.5 px-4 max-w-xs truncate">{s.alamat}</td>
                            <td className="py-2.5 px-4 font-bold text-indigo-700">{s.gayaBelajar}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STRUKTUR ORGANISASI */}
            {activeMenu === "STRUKTUR" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Struktur Organisasi Kelas berhasil disimpan!");
                }}
                className="space-y-4 max-w-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Ketua Kelas</label>
                    <input
                      type="text"
                      value={struktur.ketuaKelas}
                      onChange={(e) => setStruktur({ ...struktur, ketuaKelas: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Wakil Ketua Kelas</label>
                    <input
                      type="text"
                      value={struktur.wakilKetua}
                      onChange={(e) => setStruktur({ ...struktur, wakilKetua: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Sekretaris</label>
                    <input
                      type="text"
                      value={struktur.sekretaris}
                      onChange={(e) => setStruktur({ ...struktur, sekretaris: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Bendahara</label>
                    <input
                      type="text"
                      value={struktur.bendahara}
                      onChange={(e) => setStruktur({ ...struktur, bendahara: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Seksi Kebersihan</label>
                    <input
                      type="text"
                      value={struktur.seksiKebersihan}
                      onChange={(e) => setStruktur({ ...struktur, seksiKebersihan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Seksi Keindahan</label>
                    <input
                      type="text"
                      value={struktur.seksiKeindahan}
                      onChange={(e) => setStruktur({ ...struktur, seksiKeindahan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Seksi Keamanan</label>
                    <input
                      type="text"
                      value={struktur.seksiKeamanan}
                      onChange={(e) => setStruktur({ ...struktur, seksiKeamanan: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Struktur Organisasi
                </button>
              </form>
            )}

            {/* JADWAL PELAJARAN */}
            {activeMenu === "JADWAL_PELAJARAN" && (
              <div className="space-y-6">
                <form onSubmit={handleAddJadwal} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Hari</label>
                    <select
                      value={frmHari}
                      onChange={(e) => setFrmHari(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    >
                      {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Waktu / Pukul</label>
                    <input
                      type="text"
                      placeholder="e.g. 07:30 - 09:00"
                      value={frmPukul}
                      onChange={(e) => setFrmPukul(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Mata Pelajaran</label>
                    <input
                      type="text"
                      placeholder="e.g. Matematika"
                      value={frmMapel}
                      onChange={(e) => setFrmMapel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Pengajar / Guru</label>
                      <input
                        type="text"
                        placeholder="e.g. Pak Gunawan, S.Si."
                        value={frmPengajar}
                        onChange={(e) => setFrmPengajar(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Hari</th>
                        <th className="py-2.5 px-4">Waktu</th>
                        <th className="py-2.5 px-4">Mata Pelajaran</th>
                        <th className="py-2.5 px-4">Nama Pengajar</th>
                        <th className="py-2.5 px-4 text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {jadwalPelajaran.map((jp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{jp.hari}</td>
                          <td className="py-2.5 px-4 font-mono">{jp.pukul}</td>
                          <td className="py-2.5 px-4 font-bold text-blue-700">{jp.mapel}</td>
                          <td className="py-2.5 px-4">{jp.pengajar}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setJadwalPelajaran(jadwalPelajaran.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* JADWAL PIKET */}
            {activeMenu === "JADWAL_PIKET" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => {
                    const pickets = students.filter((s) => s.hariPiket === day);
                    return (
                      <div key={day} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col h-56 justify-between">
                        <div className="border-b border-slate-200 pb-1.5 mb-2 flex justify-between items-center">
                          <span className="font-extrabold text-slate-900 text-xs">{day}</span>
                          <span className="text-[9px] bg-white font-bold px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                            {pickets.length}
                          </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none">
                          {pickets.map((m) => (
                            <div key={m.nis} className="p-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-bold">
                              {m.nama}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INVENTARIS */}
            {activeMenu === "INVENTARIS" && (
              <div className="space-y-6">
                <form onSubmit={handleAddInventaris} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Nama Barang</label>
                    <input
                      type="text"
                      placeholder="e.g. Kursi Lipat"
                      value={invNama}
                      onChange={(e) => setInvNama(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Jumlah</label>
                    <input
                      type="number"
                      value={invJumlah}
                      onChange={(e) => setInvJumlah(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Kondisi</label>
                    <select
                      value={invKondisi}
                      onChange={(e) => setInvKondisi(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Keterangan</label>
                      <input
                        type="text"
                        placeholder="e.g. Sumbangan alumni"
                        value={invKet}
                        onChange={(e) => setInvKet(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Nama Barang</th>
                        <th className="py-2.5 px-4">Jumlah</th>
                        <th className="py-2.5 px-4">Kondisi</th>
                        <th className="py-2.5 px-4">Keterangan</th>
                        <th className="py-2.5 px-4 text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {inventaris.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.namaBarang}</td>
                          <td className="py-2.5 px-4 font-bold font-mono text-blue-600">{item.jumlah} unit</td>
                          <td className="py-2.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.kondisi === "Baik"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : item.kondisi === "Rusak Ringan"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                              {item.kondisi}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500">{item.keterangan}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setInventaris(inventaris.filter((x) => x.id !== item.id))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DATA ORANG TUA */}
            {activeMenu === "ORANG_TUA" && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Nama Murid</th>
                        <th className="py-2.5 px-4">Nama Ayah</th>
                        <th className="py-2.5 px-4">Nama Ibu</th>
                        <th className="py-2.5 px-4">Alamat Rumah</th>
                        <th className="py-2.5 px-4">Kondisi Sosial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {students.map((s) => (
                        <tr key={s.nis} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{s.nama}</td>
                          <td className="py-2.5 px-4 font-medium text-slate-800">{s.namaAyah}</td>
                          <td className="py-2.5 px-4 font-medium text-slate-800">{s.namaIbu}</td>
                          <td className="py-2.5 px-4 max-w-xs truncate">{s.alamat}</td>
                          <td className="py-2.5 px-4">{s.kondisiKeluarga}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CATATAN PRESTASI */}
            {activeMenu === "PRESTASI" && (
              <div className="space-y-6">
                <form onSubmit={handleAddPrestasi} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Pilih Murid</label>
                    <select
                      value={prNis}
                      onChange={(e) => setPrNis(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="">-- Pilih --</option>
                      {students.map((s) => (
                        <option key={s.nis} value={s.nis}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Nama Prestasi / Juara</label>
                    <input
                      type="text"
                      placeholder="e.g. Juara 1 Sains"
                      value={prNama}
                      onChange={(e) => setPrNama(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Tingkat</label>
                    <select
                      value={prTingkat}
                      onChange={(e) => setPrTingkat(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="Sekolah">Sekolah</option>
                      <option value="Kecamatan">Kecamatan</option>
                      <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                      <option value="Provinsi">Provinsi</option>
                      <option value="Nasional">Nasional</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Keterangan / Hadiah</label>
                      <input
                        type="text"
                        placeholder="e.g. Sertifikat & piala"
                        value={prDesc}
                        onChange={(e) => setPrDesc(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Nama Murid</th>
                        <th className="py-2.5 px-4">Nama Prestasi</th>
                        <th className="py-2.5 px-4">Tanggal</th>
                        <th className="py-2.5 px-4">Tingkat</th>
                        <th className="py-2.5 px-4">Keterangan</th>
                        <th className="py-2.5 px-4 text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {prestasiList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.namaMurid}</td>
                          <td className="py-2.5 px-4 font-bold text-emerald-700">{item.prestasi}</td>
                          <td className="py-2.5 px-4 font-mono">{item.tanggal}</td>
                          <td className="py-2.5 px-4">
                            <span className="bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2 py-0.5 rounded text-[10px]">
                              {item.tingkat}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500">{item.keterangan}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setPrestasiList(prestasiList.filter((x) => x.id !== item.id))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CATATAN PELANGGARAN */}
            {activeMenu === "PELANGGARAN" && (
              <div className="space-y-6">
                <form onSubmit={handleAddPelanggaran} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Pilih Murid</label>
                    <select
                      value={plNis}
                      onChange={(e) => setPlNis(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="">-- Pilih --</option>
                      {students.map((s) => (
                        <option key={s.nis} value={s.nis}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Nama Pelanggaran</label>
                    <input
                      type="text"
                      placeholder="e.g. Gaduh di kelas"
                      value={plNama}
                      onChange={(e) => setPlNama(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Poin Pelanggaran</label>
                    <input
                      type="number"
                      value={plPoin}
                      onChange={(e) => setPlPoin(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Tindak Lanjut</label>
                      <input
                        type="text"
                        placeholder="e.g. Teguran wali kelas"
                        value={plSolusi}
                        onChange={(e) => setPlSolusi(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Nama Murid</th>
                        <th className="py-2.5 px-4">Pelanggaran</th>
                        <th className="py-2.5 px-4">Tanggal</th>
                        <th className="py-2.5 px-4">Poin</th>
                        <th className="py-2.5 px-4">Tindak Lanjut</th>
                        <th className="py-2.5 px-4 text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {pelanggaranList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.namaMurid}</td>
                          <td className="py-2.5 px-4 font-semibold text-rose-700">{item.pelanggaran}</td>
                          <td className="py-2.5 px-4 font-mono">{item.tanggal}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-red-600">{item.poin} pts</td>
                          <td className="py-2.5 px-4 text-slate-500">{item.tindakLanjut}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setPelanggaranList(pelanggaranList.filter((x) => x.id !== item.id))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* HOME VISIT */}
            {activeMenu === "HOME_VISIT" && (
              <div className="space-y-6">
                <form onSubmit={handleAddHomeVisit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Pilih Murid</label>
                    <select
                      value={hvNis}
                      onChange={(e) => setHvNis(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="">-- Pilih --</option>
                      {students.map((s) => (
                        <option key={s.nis} value={s.nis}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Tujuan Home Visit</label>
                    <input
                      type="text"
                      placeholder="e.g. Kunjungan sakit atau asma"
                      value={hvTujuan}
                      onChange={(e) => setHvTujuan(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Hasil Kesepakatan</label>
                      <input
                        type="text"
                        placeholder="e.g. Orang tua akan pantau inhaler"
                        value={hvHasil}
                        onChange={(e) => setHvHasil(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {homeVisits.map((item) => (
                    <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm relative">
                      <button
                        onClick={() => setHomeVisits(homeVisits.filter((x) => x.id !== item.id))}
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={item.mediaSim}
                        alt="Visit"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover border border-slate-300"
                      />
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] text-slate-400 font-mono block font-bold">{item.tanggal}</span>
                        <h4 className="font-extrabold text-slate-900">{item.namaMurid}</h4>
                        <p className="text-blue-700 font-bold leading-tight">Tujuan: {item.tujuan}</p>
                        <p className="text-slate-600 leading-snug">Hasil: {item.hasil}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PORTOFOLIO */}
            {activeMenu === "PORTOFOLIO" && (
              <div className="space-y-6">
                <form onSubmit={handleAddPortofolio} className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Pilih Murid</label>
                    <select
                      value={pfNis}
                      onChange={(e) => setPfNis(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="">-- Pilih --</option>
                      {students.map((s) => (
                        <option key={s.nis} value={s.nis}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Nama Karya / Proyek</label>
                    <input
                      type="text"
                      placeholder="e.g. Model Paru-paru"
                      value={pfKarya}
                      onChange={(e) => setPfKarya(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Kategori</label>
                    <select
                      value={pfKategori}
                      onChange={(e) => setPfKategori(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="Kriya/Seni">Kriya/Seni</option>
                      <option value="Tulisan/Sastra">Tulisan/Sastra</option>
                      <option value="Proyek Sains">Proyek Sains</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Nilai Portofolio</label>
                    <input
                      type="number"
                      value={pfNilai}
                      onChange={(e) => setPfNilai(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Catatan</label>
                      <input
                        type="text"
                        placeholder="e.g. Sangat kreatif"
                        value={pfCatatan}
                        onChange={(e) => setPfCatatan(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Nama Murid</th>
                        <th className="py-2.5 px-4">Karya Portofolio</th>
                        <th className="py-2.5 px-4">Kategori</th>
                        <th className="py-2.5 px-4">Tanggal</th>
                        <th className="py-2.5 px-4">Skor / Nilai</th>
                        <th className="py-2.5 px-4">Catatan</th>
                        <th className="py-2.5 px-4 text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {portofolios.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.namaMurid}</td>
                          <td className="py-2.5 px-4 font-bold text-blue-700">{item.namaKarya}</td>
                          <td className="py-2.5 px-4 font-medium">{item.kategori}</td>
                          <td className="py-2.5 px-4 font-mono">{item.tanggal}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">{item.nilai} pts</td>
                          <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">{item.catatan}</td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setPortofolios(portofolios.filter((x) => x.id !== item.id))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* JURNAL HARIAN WALI */}
            {activeMenu === "JURNAL_HARIAN" && (
              <div className="space-y-6">
                <form onSubmit={handleAddJurnalWali} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Nama Kegiatan</label>
                    <input
                      type="text"
                      placeholder="e.g. Pertemuan Orang Tua"
                      value={jwKegiatan}
                      onChange={(e) => setJwKegiatan(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Kejadian Penting</label>
                    <input
                      type="text"
                      placeholder="e.g. Sosialisasi kurikulum"
                      value={jwKejadian}
                      onChange={(e) => setJwKejadian(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Penanganan / Catatan</label>
                    <input
                      type="text"
                      placeholder="e.g. Wali menyambut baik"
                      value={jwPenanganan}
                      onChange={(e) => setJwPenanganan(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-500 text-[9px] font-bold uppercase mb-1">Status</label>
                      <select
                        value={jwStatus}
                        onChange={(e) => setJwStatus(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                      >
                        <option value="Selesai">Selesai</option>
                        <option value="Follow-up">Follow-up</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">Tanggal</th>
                        <th className="py-2.5 px-4">Nama Kegiatan</th>
                        <th className="py-2.5 px-4">Kejadian Penting</th>
                        <th className="py-2.5 px-4">Penanganan</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {jurnalsWali.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono">{item.tanggal}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{item.kegiatan}</td>
                          <td className="py-2.5 px-4">{item.kejadianPenting}</td>
                          <td className="py-2.5 px-4 text-slate-500">{item.penanganan}</td>
                          <td className="py-2.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              item.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setJurnalsWali(jurnalsWali.filter((x) => x.id !== item.id))}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
