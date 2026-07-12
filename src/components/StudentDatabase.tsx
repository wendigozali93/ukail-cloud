import React, { useState } from "react";
import {
  Plus,
  Search,
  User,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  HelpCircle,
  UserCheck,
  Calendar,
  Grid,
  MessageSquare,
  Clipboard,
  Heart,
  Users,
  Smile,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Murid, BukuKomunikasiItem } from "../types";

interface StudentDatabaseProps {
  students: Murid[];
  onAddStudent: (student: Murid) => void;
  onUpdateStudent: (student: Murid) => void;
  onDeleteStudent: (nis: string) => void;
}

export default function StudentDatabase({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}: StudentDatabaseProps) {
  // Navigation tabs inside Murid Database
  const [activeSubTab, setActiveSubTab] = useState<"LIST" | "PIKET" | "SEATING" | "COMMUNICATION">("LIST");
  const [search, setSearch] = useState("");
  const [jkFilter, setJkFilter] = useState("ALL");
  
  // Detail & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [selectedMurid, setSelectedMurid] = useState<Murid | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form fields (frmStudent fields)
  const [txtNIS, setTxtNIS] = useState("");
  const [txtNISN, setTxtNISN] = useState("");
  const [txtNama, setTxtNama] = useState("");
  const [cboJK, setCboJK] = useState<"L" | "P">("L");
  const [txtAlamat, setTxtAlamat] = useState("");
  const [txtNamaAyah, setTxtNamaAyah] = useState("");
  const [txtNamaIbu, setTxtNamaIbu] = useState("");
  const [txtGayaBelajar, setTxtGayaBelajar] = useState("Visual");
  const [txtKondisiKeluarga, setTxtKondisiKeluarga] = useState("");
  const [txtRiwayatKesehatan, setTxtRiwayatKesehatan] = useState("");
  const [txtMinatBakat, setTxtMinatBakat] = useState("");
  const [txtHariPiket, setTxtHariPiket] = useState("Senin");

  // Seating drag-drop/assignment state
  const [selectedSeatCell, setSelectedSeatCell] = useState<{ row: number; col: number } | null>(null);

  // Communication state
  const [activeCommNis, setActiveCommNis] = useState<string>(students[0]?.nis || "");
  const [txtMessage, setTxtMessage] = useState("");
  const [msgSender, setMsgSender] = useState<"Guru" | "Orang Tua">("Guru");

  const [vbaCodeSnippet, setVbaCodeSnippet] = useState("");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      (s.nisn && s.nisn.includes(search));
    const matchesJk = jkFilter === "ALL" || s.jk === jkFilter;
    return matchesSearch && matchesJk;
  });

  const handleOpenAdd = () => {
    setModalMode("ADD");
    setTxtNIS("");
    setTxtNISN("");
    setTxtNama("");
    setCboJK("L");
    setTxtAlamat("");
    setTxtNamaAyah("");
    setTxtNamaIbu("");
    setTxtGayaBelajar("Visual");
    setTxtKondisiKeluarga("Lengkap (Orang Tua Kandung)");
    setTxtRiwayatKesehatan("Sehat (Tidak Ada)");
    setTxtMinatBakat("");
    setTxtHariPiket("Senin");
    
    setVbaCodeSnippet(
      `' VBA: AddMurid() - Menulis data ke sheet DATABASE MURID\n` +
      `Dim ws As Worksheet\n` +
      `Set ws = Sheets("DATABASE MURID")\n` +
      `r = ws.Cells(Rows.Count, 1).End(xlUp).Row + 1\n` +
      `ws.Cells(r, 1) = frmMurid.txtNIS.Value\n` +
      `ws.Cells(r, 2) = frmMurid.txtNISN.Value\n` +
      `ws.Cells(r, 3) = frmMurid.txtNama.Value\n` +
      `ws.Cells(r, 4) = frmMurid.cboJK.Value\n` +
      `ws.Cells(r, 5) = frmMurid.txtAlamat.Value\n` +
      `ws.Cells(r, 6) = frmMurid.txtNamaAyah.Value\n` +
      `ws.Cells(r, 7) = frmMurid.txtNamaIbu.Value\n` +
      `MsgBox "Data Murid berhasil disimpan!"`
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Murid) => {
    setModalMode("EDIT");
    setTxtNIS(student.nis);
    setTxtNISN(student.nisn || "");
    setTxtNama(student.nama);
    setCboJK(student.jk);
    setTxtAlamat(student.alamat);
    setTxtNamaAyah(student.namaAyah || "");
    setTxtNamaIbu(student.namaIbu || "");
    setTxtGayaBelajar(student.gayaBelajar || "Visual");
    setTxtKondisiKeluarga(student.kondisiKeluarga || "Lengkap (Orang Tua Kandung)");
    setTxtRiwayatKesehatan(student.riwayatKesehatan || "Sehat (Tidak Ada)");
    setTxtMinatBakat(student.minatBakat || "");
    setTxtHariPiket(student.hariPiket || "Senin");
    
    setVbaCodeSnippet(
      `' VBA: UpdateMurid()\n` +
      `' Mencari baris dengan NIS: ${student.nis} dan mengganti nilainya\n` +
      `For i = 2 To lastRow\n` +
      `    If ws.Cells(i, 1) = "${student.nis}" Then\n` +
      `        ws.Cells(i, 2) = "${student.nisn || ""}"\n` +
      `        ws.Cells(i, 3) = "${student.nama}"\n` +
      `        ws.Cells(i, 4) = "${student.jk}"\n` +
      `        ws.Cells(i, 5) = "${student.alamat}"\n` +
      `        ws.Cells(i, 6) = "${student.namaAyah || ""}"\n` +
      `        ws.Cells(i, 7) = "${student.namaIbu || ""}"\n` +
      `    End If\n` +
      `Next`
    );
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txtNIS || !txtNama || !txtAlamat) {
      alert("Harap isi NIS, Nama, dan Alamat!");
      return;
    }

    const payload: Murid = {
      nis: txtNIS,
      nisn: txtNISN || "0000000000",
      nama: txtNama,
      jk: cboJK,
      alamat: txtAlamat,
      namaAyah: txtNamaAyah || "-",
      namaIbu: txtNamaIbu || "-",
      gayaBelajar: txtGayaBelajar,
      kondisiKeluarga: txtKondisiKeluarga || "Lengkap",
      riwayatKesehatan: txtRiwayatKesehatan || "Sehat",
      minatBakat: txtMinatBakat || "-",
      hariPiket: txtHariPiket,
      bukuKomunikasi: modalMode === "EDIT" ? (students.find(s => s.nis === txtNIS)?.bukuKomunikasi || []) : []
    };

    if (modalMode === "ADD") {
      if (students.some((s) => s.nis === txtNIS)) {
        alert(`NIS ${txtNIS} sudah terdaftar!`);
        return;
      }
      onAddStudent(payload);
    } else {
      onUpdateStudent(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (nis: string, nama: string) => {
    const confirm = window.confirm(`Apakah Anda yakin ingin menghapus murid ${nama} (${nis})?`);
    if (confirm) {
      onDeleteStudent(nis);
    }
  };

  const handleViewDetail = (student: Murid) => {
    setSelectedMurid(student);
    setIsDetailOpen(true);
  };

  // Piket Assignment
  const handlePiketChange = (nis: string, day: string) => {
    const s = students.find((x) => x.nis === nis);
    if (s) {
      onUpdateStudent({ ...s, hariPiket: day });
    }
  };

  // Seating grid sizing (4 rows x 4 cols = 16 desks)
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  const getStudentAtSeat = (r: number, c: number) => {
    return students.find((s) => s.seatRow === r && s.seatCol === c);
  };

  const handleSeatClick = (r: number, c: number) => {
    setSelectedSeatCell({ row: r, col: c });
  };

  const handleAssignSeat = (nis: string) => {
    if (!selectedSeatCell) return;
    
    // Find if the student was previously placed somewhere else, clear that seat
    const studentToSeat = students.find((s) => s.nis === nis);
    const existingAtSeat = getStudentAtSeat(selectedSeatCell.row, selectedSeatCell.col);

    if (existingAtSeat) {
      // Clear seat of old student
      onUpdateStudent({ ...existingAtSeat, seatRow: undefined, seatCol: undefined });
    }

    if (studentToSeat) {
      onUpdateStudent({
        ...studentToSeat,
        seatRow: selectedSeatCell.row,
        seatCol: selectedSeatCell.col
      });
    }

    setSelectedSeatCell(null);
  };

  const handleUnseat = (student: Murid) => {
    onUpdateStudent({ ...student, seatRow: undefined, seatCol: undefined });
  };

  // Send Communication message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txtMessage.trim()) return;

    const s = students.find((x) => x.nis === activeCommNis);
    if (!s) return;

    const newMsg: BukuKomunikasiItem = {
      id: "msg-" + Date.now(),
      tanggal: new Date().toISOString().split("T")[0],
      pengirim: msgSender,
      pesan: txtMessage.trim()
    };

    const updatedComms = s.bukuKomunikasi ? [...s.bukuKomunikasi, newMsg] : [newMsg];
    onUpdateStudent({ ...s, bukuKomunikasi: updatedComms });
    setTxtMessage("");
  };

  const activeCommStudent = students.find((s) => s.nis === activeCommNis) || students[0];

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Database Murid</h3>
          <p className="text-xs text-slate-500">
            Kelola data murid terintegrasi: piket, tempat duduk, dan buku komunikasi orang tua.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Murid Baru
        </button>
      </div>

      {/* Internal Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setActiveSubTab("LIST")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === "LIST"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          Daftar Murid & Profil
        </button>
        <button
          onClick={() => setActiveSubTab("PIKET")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === "PIKET"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Jadwal Piket Kelas
        </button>
        <button
          onClick={() => setActiveSubTab("SEATING")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === "SEATING"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Grid className="w-4 h-4" />
          Denah Tempat Duduk
        </button>
        <button
          onClick={() => setActiveSubTab("COMMUNICATION")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === "COMMUNICATION"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Buku Komunikasi Orang Tua
        </button>
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}
      {activeSubTab === "LIST" && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-xs focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm font-semibold"
                placeholder="Cari berdasarkan Nama, NIS, atau NISN..."
              />
            </div>

            <div className="sm:col-span-4 flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
              {["ALL", "L", "P"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setJkFilter(mode)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer ${
                    jkFilter === mode ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {mode === "ALL" ? "Semua" : mode === "L" ? "Laki-laki (L)" : "Perempuan (P)"}
                </button>
              ))}
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3.5 px-4 w-28">NIS / NISN</th>
                    <th className="py-3.5 px-4">Nama Murid</th>
                    <th className="py-3.5 px-4 w-32">Jenis Kelamin</th>
                    <th className="py-3.5 px-4">Gaya Belajar</th>
                    <th className="py-3.5 px-4">Kontak Orang Tua</th>
                    <th className="py-3.5 px-4 w-32 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.nis} className="hover:bg-slate-50 text-slate-700 text-xs transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          <span className="text-blue-600 block">{student.nis}</span>
                          <span className="text-[10px] text-slate-400">{student.nisn || "-"}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase text-xs">
                              {student.nama.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{student.nama}</span>
                              <span className="text-[10px] text-slate-400 font-medium block">
                                Piket: {student.hariPiket || "-"} • Seat: {student.seatRow !== undefined ? `B${student.seatRow + 1}-K${student.seatCol! + 1}` : "Belum diatur"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.jk === "L"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-pink-50 text-pink-700 border border-pink-100"
                          }`}>
                            {student.jk === "L" ? "Laki-laki" : "Perempuan"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px]">
                            {student.gayaBelajar || "Visual"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          <div className="text-[10px] leading-tight">
                            <div>Ayah: <span className="font-bold text-slate-700">{student.namaAyah}</span></div>
                            <div>Ibu: <span className="font-bold text-slate-700">{student.namaIbu}</span></div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleViewDetail(student)}
                              className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-emerald-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="Lihat Detail Profil"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(student)}
                              className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="Edit Profil"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.nis, student.nama)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 transition-colors cursor-pointer"
                              title="Hapus Murid"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center text-slate-400 text-xs">
                        Tidak ada data murid yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "PIKET" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800">
            <Clipboard className="w-4 h-4 text-blue-600 mt-0.5" />
            <p>
              <strong>Informasi Jadwal Piket:</strong> Anda dapat mengklik murid pada daftar di bawah ini untuk memindahkan hari tugas piket harian mereka secara instan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => {
              const pickets = students.filter((s) => s.hariPiket === day);
              return (
                <div key={day} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[280px]">
                  <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{day}</span>
                    <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">
                      {pickets.length} Murid
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {pickets.map((m) => (
                      <div
                        key={m.nis}
                        className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate">{m.nama}</span>
                          <span className="text-[9px] text-slate-400 font-mono">NIS: {m.nis}</span>
                        </div>
                        <select
                          value={day}
                          onChange={(e) => handlePiketChange(m.nis, e.target.value)}
                          className="text-[10px] bg-white border border-slate-200 rounded p-1 font-bold cursor-pointer focus:outline-none"
                        >
                          <option value="Senin">Senin</option>
                          <option value="Selasa">Selasa</option>
                          <option value="Rabu">Rabu</option>
                          <option value="Kamis">Kamis</option>
                          <option value="Jumat">Jumat</option>
                          <option value="Sabtu">Sabtu</option>
                        </select>
                      </div>
                    ))}
                    {pickets.length === 0 && (
                      <div className="h-full flex items-center justify-center text-center text-[10px] text-slate-400 py-10 italic">
                        Kosong
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === "SEATING" && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900">
            <Smile className="w-4 h-4 text-indigo-600 mt-0.5" />
            <p>
              <strong>Pengaturan Denah Kelas:</strong> Klik pada salah satu kotak meja di bawah ini untuk mendudukkan murid yang belum mendapat tempat duduk, atau untuk memindahkan murid.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Seating Grid */}
            <div className="lg:col-span-8 bg-slate-100 border border-slate-200 rounded-2xl p-6 shadow-inner flex flex-col items-center">
              {/* Whiteboard Indicator */}
              <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-10 shadow-sm">
                Papan Tulis Depan Kelas
              </div>

              {/* Classroom Seat Map */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full max-w-xl">
                {rows.map((r) => (
                  <React.Fragment key={r}>
                    {/* Left desk cluster (Col 0 and Col 1) */}
                    <div className="grid grid-cols-2 gap-2 bg-white/60 p-2.5 border border-slate-200 rounded-xl">
                      {[0, 1].map((c) => {
                        const m = getStudentAtSeat(r, c);
                        return (
                          <div
                            key={c}
                            onClick={() => handleSeatClick(r, c)}
                            className={`h-24 rounded-lg border flex flex-col justify-between p-2 cursor-pointer transition-all ${
                              m
                                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : "bg-white border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center text-slate-400"
                            }`}
                          >
                            {m ? (
                              <>
                                <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center">
                                  <span>R{r+1}-C{c+1}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnseat(m);
                                    }}
                                    className="text-[9px] text-red-500 hover:underline cursor-pointer"
                                  >
                                    Lepas
                                  </button>
                                </div>
                                <div className="text-center font-bold text-slate-900 text-xs truncate max-w-[85px] self-center">
                                  {m.nama}
                                </div>
                                <span className={`self-center text-[8px] font-bold px-1 rounded ${
                                  m.jk === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                }`}>
                                  {m.jk === "L" ? "Laki-laki" : "Perempuan"}
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 flex flex-col items-center">
                                <Plus className="w-3.5 h-3.5 mb-1 text-slate-300" />
                                Baris {r+1} Kolom {c+1}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right desk cluster (Col 2 and Col 3) */}
                    <div className="grid grid-cols-2 gap-2 bg-white/60 p-2.5 border border-slate-200 rounded-xl">
                      {[2, 3].map((c) => {
                        const m = getStudentAtSeat(r, c);
                        return (
                          <div
                            key={c}
                            onClick={() => handleSeatClick(r, c)}
                            className={`h-24 rounded-lg border flex flex-col justify-between p-2 cursor-pointer transition-all ${
                              m
                                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : "bg-white border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center text-slate-400"
                            }`}
                          >
                            {m ? (
                              <>
                                <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center">
                                  <span>R{r+1}-C{c+1}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnseat(m);
                                    }}
                                    className="text-[9px] text-red-500 hover:underline cursor-pointer"
                                  >
                                    Lepas
                                  </button>
                                </div>
                                <div className="text-center font-bold text-slate-900 text-xs truncate max-w-[85px] self-center">
                                  {m.nama}
                                </div>
                                <span className={`self-center text-[8px] font-bold px-1 rounded ${
                                  m.jk === "L" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                }`}>
                                  {m.jk === "L" ? "Laki-laki" : "Perempuan"}
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 flex flex-col items-center">
                                <Plus className="w-3.5 h-3.5 mb-1 text-slate-300" />
                                Baris {r+1} Kolom {c+1}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* List of unseated students */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[480px]">
              <div className="border-b border-slate-100 pb-2.5 mb-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Murid Belum Duduk</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Daftar murid yang belum dipetakan ke kursi.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {students.filter((s) => s.seatRow === undefined).length > 0 ? (
                  students
                    .filter((s) => s.seatRow === undefined)
                    .map((s) => (
                      <div
                        key={s.nis}
                        className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex justify-between items-center hover:bg-slate-100/80 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{s.nama}</div>
                          <div className="text-[10px] text-slate-500 font-mono">NIS: {s.nis}</div>
                        </div>
                        {selectedSeatCell ? (
                          <button
                            onClick={() => handleAssignSeat(s.nis)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            Dudukkan di R{selectedSeatCell.row+1}-C{selectedSeatCell.col+1}
                          </button>
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">Pilih kursi dahulu</span>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
                    <Smile className="w-8 h-8 text-slate-200 mb-1" />
                    <span className="text-xs font-bold text-slate-500">Semua Terpetakan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Seluruh murid sudah memiliki kursi harian.</span>
                  </div>
                )}
              </div>

              {selectedSeatCell && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 flex justify-between items-center">
                  <span>Sedang memilih kursi: <strong>Baris {selectedSeatCell.row+1} - Kolom {selectedSeatCell.col+1}</strong></span>
                  <button onClick={() => setSelectedSeatCell(null)} className="text-red-500 hover:underline font-bold cursor-pointer">Batal</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "COMMUNICATION" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Student Selector list */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-[500px] flex flex-col">
            <div className="border-b border-slate-100 pb-2.5 mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pilih Buku Murid</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Pilih buku penghubung murid yang ingin dikelola.</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {students.map((s) => (
                <button
                  key={s.nis}
                  onClick={() => setActiveCommNis(s.nis)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex justify-between items-center cursor-pointer ${
                    activeCommNis === s.nis
                      ? "bg-blue-50 border-blue-200 text-blue-900 font-bold"
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div>
                    <span className="block font-bold">{s.nama}</span>
                    <span className="block text-[9px] text-slate-400 font-mono">NIS: {s.nis}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {(s.bukuKomunikasi || []).length} pesan
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Log Chat Timeline */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm h-[500px] flex flex-col overflow-hidden">
            {activeCommStudent ? (
              <>
                {/* Active Student Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{activeCommStudent.nama}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Buku Hubungan Orang Tua • Ayah: {activeCommStudent.namaAyah} | Ibu: {activeCommStudent.namaIbu}
                    </p>
                  </div>
                  <div className="flex bg-white border border-slate-200 p-0.5 rounded-lg text-[9px]">
                    <button
                      onClick={() => setMsgSender("Guru")}
                      className={`px-2 py-1 rounded font-bold cursor-pointer ${
                        msgSender === "Guru" ? "bg-blue-600 text-white shadow" : "text-slate-500"
                      }`}
                    >
                      Kirim Sebagai Guru
                    </button>
                    <button
                      onClick={() => setMsgSender("Orang Tua")}
                      className={`px-2 py-1 rounded font-bold cursor-pointer ${
                        msgSender === "Orang Tua" ? "bg-amber-600 text-white shadow" : "text-slate-500"
                      }`}
                    >
                      Kirim Sebagai Orang Tua (Simulasi)
                    </button>
                  </div>
                </div>

                {/* Timeline Messages List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  {(activeCommStudent.bukuKomunikasi || []).length > 0 ? (
                    (activeCommStudent.bukuKomunikasi || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${
                          msg.pengirim === "Guru" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            msg.pengirim === "Guru" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {msg.pengirim}
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono">{msg.tanggal}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs shadow-sm leading-relaxed ${
                          msg.pengirim === "Guru"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                        }`}>
                          {msg.pesan}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
                      <MessageSquare className="w-10 h-10 text-slate-200 mb-2" />
                      <span className="text-xs font-bold text-slate-500">Komunikasi Kosong</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Belum ada catatan pesan antara guru dan orang tua di buku penghubung ini.
                      </span>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2 bg-white">
                  <input
                    type="text"
                    value={txtMessage}
                    onChange={(e) => setTxtMessage(e.target.value)}
                    placeholder={`Tulis pesan komunikasi selaku ${msgSender}...`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 px-4 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Silakan pilih murid terlebih dahulu di daftar kiri.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL PANEL */}
      <AnimatePresence>
        {isDetailOpen && selectedMurid && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 font-mono">
                    Profil Lengkap Murid • NIS {selectedMurid.nis}
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedMurid.nama}</h4>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto bg-slate-50/50">
                {/* 1. Identitas Primer */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Identitas Lengkap
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Nomor Induk Murid (NIS)</span>
                      <span className="font-mono font-bold text-slate-800">{selectedMurid.nis}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Nomor Induk Nasional (NISN)</span>
                      <span className="font-mono font-bold text-slate-800">{selectedMurid.nisn || "-"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Jenis Kelamin</span>
                      <span className="font-bold text-slate-800">{selectedMurid.jk === "L" ? "Laki-laki" : "Perempuan"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Lengkap</span>
                      <span className="font-bold text-slate-800 flex items-start gap-1"><MapPin className="w-3.5 h-3.5 text-red-500 inline shrink-0 mt-0.5" />{selectedMurid.alamat}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Orang Tua & Keluarga */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> Kontak & Kondisi Keluarga
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Ayah Kandung</span>
                      <span className="font-bold text-slate-800">{selectedMurid.namaAyah}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Ibu Kandung</span>
                      <span className="font-bold text-slate-800">{selectedMurid.namaIbu}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Kondisi Sosial Keluarga</span>
                      <span className="font-bold text-slate-800">{selectedMurid.kondisiKeluarga}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Gaya Belajar, Kesehatan, Minat & Bakat */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-blue-600" /> Profil Pendukung Belajar
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Gaya Belajar Dominan</span>
                      <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px] inline-block mt-1">
                        {selectedMurid.gayaBelajar || "Visual"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Riwayat Kesehatan</span>
                      <span className="font-bold text-slate-800">{selectedMurid.riwayatKesehatan}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Minat & Bakat Bakat Khusus</span>
                      <span className="font-bold text-slate-800">{selectedMurid.minatBakat || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VBA FORM ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            {/* Ribbon Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 font-mono">UserForm: frmMurid</span>
                <h4 className="text-base font-bold text-slate-950 mt-0.5">
                  {modalMode === "ADD" ? "Formulir Tambah Murid" : "Edit Formulir Murid"}
                </h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 bg-white">
              {/* Form Input fields */}
              <form onSubmit={handleSave} className="p-5 space-y-4 md:col-span-7 border-r border-slate-100 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      NIS - <code className="text-blue-600 font-mono text-[9px]">txtNIS</code>
                    </label>
                    <input
                      type="text"
                      value={txtNIS}
                      onChange={(e) => setTxtNIS(e.target.value)}
                      disabled={modalMode === "EDIT"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold"
                      placeholder="Contoh: 102407"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      NISN - <code className="text-blue-600 font-mono text-[9px]">txtNISN</code>
                    </label>
                    <input
                      type="text"
                      value={txtNISN}
                      onChange={(e) => setTxtNISN(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
                      placeholder="Contoh: 0012431207"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Nama Lengkap Murid - <code className="text-blue-600 font-mono text-[10px]">txtNama</code>
                  </label>
                  <input
                    type="text"
                    value={txtNama}
                    onChange={(e) => setTxtNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                    placeholder="Contoh: Muhammad Rafli"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Jenis Kelamin - <code className="text-blue-600 font-mono text-[10px]">cboJK</code>
                    </label>
                    <select
                      value={cboJK}
                      onChange={(e) => setCboJK(e.target.value as "L" | "P")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-bold"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Gaya Belajar - <code className="text-blue-600 font-mono text-[10px]">cboGayaBelajar</code>
                    </label>
                    <select
                      value={txtGayaBelajar}
                      onChange={(e) => setTxtGayaBelajar(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-bold"
                    >
                      <option value="Visual">Visual</option>
                      <option value="Auditoris">Auditoris</option>
                      <option value="Kinestetik">Kinestetik</option>
                      <option value="Verbal">Verbal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Nama Ayah Kandung
                    </label>
                    <input
                      type="text"
                      value={txtNamaAyah}
                      onChange={(e) => setTxtNamaAyah(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Nama ayah..."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Nama Ibu Kandung
                    </label>
                    <input
                      type="text"
                      value={txtNamaIbu}
                      onChange={(e) => setTxtNamaIbu(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Nama ibu..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Kondisi Keluarga
                    </label>
                    <input
                      type="text"
                      value={txtKondisiKeluarga}
                      onChange={(e) => setTxtKondisiKeluarga(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Contoh: Lengkap / Tinggal dengan Nenek"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Riwayat Kesehatan
                    </label>
                    <input
                      type="text"
                      value={txtRiwayatKesehatan}
                      onChange={(e) => setTxtRiwayatKesehatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Contoh: Sehat / Asma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Minat & Bakat Khusus
                    </label>
                    <input
                      type="text"
                      value={txtMinatBakat}
                      onChange={(e) => setTxtMinatBakat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      placeholder="Contoh: Sepak Bola / Menggambar"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Hari Tugas Piket
                    </label>
                    <select
                      value={txtHariPiket}
                      onChange={(e) => setTxtHariPiket(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Alamat Tempat Tinggal - <code className="text-blue-600 font-mono text-[10px]">txtAlamat</code>
                  </label>
                  <textarea
                    rows={2}
                    value={txtAlamat}
                    onChange={(e) => setTxtAlamat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                    placeholder="Masukkan alamat tinggal..."
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-100 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Simpan Murid
                  </button>
                </div>
              </form>

              {/* VBA Mapping Explanation */}
              <div className="p-5 md:col-span-5 bg-slate-900 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                    Macro VBA Terikat
                  </h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                    Formulir web terintegrasi langsung dengan kode VBA. Saat disimpan, data akan dipetakan ke baris Excel melalui modul berikut:
                  </p>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[9px] text-emerald-400 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    {vbaCodeSnippet}
                  </pre>
                </div>

                <div className="text-[9px] text-slate-500 italic mt-4">
                  *Mempertahankan integritas relasi tabel DATABASE MURID.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
