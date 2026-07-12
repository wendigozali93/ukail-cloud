import React, { useState, useEffect } from "react";
import {
  Send,
  User,
  MessageSquare,
  Paperclip,
  Check,
  CheckCheck,
  Megaphone,
  Bell,
  Search,
  Users,
  FileText
} from "lucide-react";
import { motion } from "motion/react";
import { Murid, BukuKomunikasiItem } from "../types";

interface CommunicationBookProps {
  students: Murid[];
  onUpdateStudent: (student: Murid) => void;
}

export default function CommunicationBook({ students, onUpdateStudent }: CommunicationBookProps) {
  const [selectedStudent, setSelectedStudent] = useState<Murid | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // Set first student as default if none selected
  useEffect(() => {
    if (!selectedStudent && students.length > 0) {
      setSelectedStudent(students[0]);
    }
  }, [students, selectedStudent]);

  const activeChatList = selectedStudent?.bukuKomunikasi || [
    { id: "msg-1", tanggal: "2026-07-11 08:30", pengirim: "Guru", pesan: "Selamat pagi Bapak/Ibu, hari ini anak-anak akan belajar eksperimen tanaman.", isRead: true },
    { id: "msg-2", tanggal: "2026-07-11 08:35", pengirim: "Orang Tua", pesan: "Selamat pagi Pak Guru. Wah menarik sekali, anak saya sangat bersemangat harian.", isRead: true }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !inputMessage.trim()) return;

    const newMsg: BukuKomunikasiItem = {
      id: "msg-" + Date.now(),
      tanggal: new Date().toISOString().replace("T", " ").substring(0, 16),
      pengirim: "Guru",
      pesan: inputMessage,
      isRead: false
    };

    const updatedStudent: Murid = {
      ...selectedStudent,
      bukuKomunikasi: [...(selectedStudent.bukuKomunikasi || []), newMsg]
    };

    onUpdateStudent(updatedStudent);
    setSelectedStudent(updatedStudent);
    setInputMessage("");

    // Simulate parental reply after 2 seconds
    setTimeout(() => {
      const parentReplies = [
        "Baik Pak Guru, terima kasih banyak atas infonya harian.",
        "Siap dilaksanakan Pak Guru, akan kami dampingi belajarnya di rumah.",
        "Terima kasih atas bimbingannya, anak saya terlihat senang sekali sepulang sekolah.",
        "Baik Pak, nanti sepulang kerja akan kami cek tugas tambahannya.",
        "Apakah ada materi khusus yang perlu kami print mandiri dari rumah?"
      ];
      const randomReply = parentReplies[Math.floor(Math.random() * parentReplies.length)];

      const replyMsg: BukuKomunikasiItem = {
        id: "msg-" + (Date.now() + 1),
        tanggal: new Date().toISOString().replace("T", " ").substring(0, 16),
        pengirim: "Orang Tua",
        pesan: randomReply,
        isRead: true
      };

      const finalStudent: Murid = {
        ...updatedStudent,
        bukuKomunikasi: [...(updatedStudent.bukuKomunikasi || []), replyMsg]
      };

      onUpdateStudent(finalStudent);
      if (selectedStudent.nis === updatedStudent.nis) {
        setSelectedStudent(finalStudent);
      }
    }, 2000);
  };

  // Broadcast announcement
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    students.forEach((stud) => {
      const newMsg: BukuKomunikasiItem = {
        id: "msg-bc-" + Date.now(),
        tanggal: new Date().toISOString().replace("T", " ").substring(0, 16),
        pengirim: "Guru",
        pesan: `📢 PENGUMUMAN KELAS: ${broadcastMessage}`,
        isRead: false
      };

      const updatedStud: Murid = {
        ...stud,
        bukuKomunikasi: [...(stud.bukuKomunikasi || []), newMsg]
      };
      onUpdateStudent(updatedStud);
    });

    // Update state for selected too if active
    if (selectedStudent) {
      const freshSelected = students.find((s) => s.nis === selectedStudent.nis);
      if (freshSelected) {
        setSelectedStudent(freshSelected);
      }
    }

    setBroadcastMessage("");
    alert("Pengumuman berhasil disebarkan ke seluruh orang tua murid!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans text-slate-800 items-stretch h-[600px]">
      {/* Student List Sidebar (Left) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-full overflow-hidden">
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              Kontak Orang Tua Murid
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Buku Penghubung Guru & Wali Murid</p>
          </div>

          <div className="relative shrink-0 select-none">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-4 text-xs"
              placeholder="Cari berdasarkan nama murid..."
            />
          </div>

          {/* Contact scroll view */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {students
              .filter((s) => s.nama.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((s) => {
                const isSelected = selectedStudent?.nis === s.nis;
                const lastMsg = s.bukuKomunikasi && s.bukuKomunikasi.length > 0
                  ? s.bukuKomunikasi[s.bukuKomunikasi.length - 1]
                  : null;

                return (
                  <button
                    key={s.nis}
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100"
                        : "bg-transparent border-transparent hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"}`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-xs truncate">{s.nama}</h4>
                        <span className={`text-[8px] font-semibold ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          Orang tua: {s.namaIbu || s.namaAyah}
                        </span>
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {lastMsg ? lastMsg.pesan : "Belum ada percakapan harian"}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Broadcast input panel */}
        <form onSubmit={handleBroadcast} className="border-t border-slate-100 pt-4 mt-4 shrink-0 select-none">
          <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
            <Megaphone className="w-3.5 h-3.5 text-blue-600" />
            Kirim Pengumuman Massal
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Ketik pengumuman kelas..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Chat Pane (Right) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-full overflow-hidden">
        {selectedStudent ? (
          <div className="flex flex-col h-full justify-between overflow-hidden">
            {/* Header info bar */}
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{selectedStudent.nama}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">
                    Ayah: {selectedStudent.namaAyah} | Ibu: {selectedStudent.namaIbu}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Koneksi Wali Aktif
                </span>
              </div>
            </div>

            {/* Chat message threads */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin">
              {activeChatList.map((msg, index) => {
                const isGuru = msg.pengirim === "Guru";
                return (
                  <div
                    key={index}
                    className={`flex ${isGuru ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-sm ${
                        isGuru
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-baseline gap-4 mb-1">
                        <span className="font-extrabold text-[9px] uppercase tracking-wider opacity-85">
                          {isGuru ? "Guru (Anda)" : `Orang Tua ${selectedStudent.nama}`}
                        </span>
                        <span className="text-[8px] font-medium opacity-75 font-mono">{msg.tanggal}</span>
                      </div>
                      <p className="leading-relaxed font-semibold">{msg.pesan}</p>

                      {/* Tick marks for reads */}
                      {isGuru && (
                        <div className="flex justify-end mt-1 text-[9px] opacity-75 select-none">
                          <CheckCheck className="w-3.5 h-3.5 text-blue-100" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat bottom input bar */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-100 pt-3 flex gap-2 shrink-0 select-none">
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer shrink-0">
                <Paperclip className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Kirim pesan penghubung kepada orang tua ${selectedStudent.nama}...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 select-none">
            <MessageSquare className="w-12 h-12 text-slate-300" />
            <p className="text-xs font-bold">Silakan pilih murid di samping untuk membuka percakapan harian.</p>
          </div>
        )}
      </div>
    </div>
  );
}
