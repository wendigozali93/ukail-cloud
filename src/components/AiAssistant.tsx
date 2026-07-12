import React, { useState } from "react";
import { Sparkles, Send, Copy, Check, Loader2, BrainCircuit, User, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Murid } from "../types";

interface AiAssistantProps {
  students: Murid[];
}

export default function AiAssistant({ students }: AiAssistantProps) {
  const [activeSubTab, setActiveSubTab] = useState<"RAPORT" | "LESSON">("RAPORT");
  
  // States for Raport Description Writer
  const [selectedNis, setSelectedNis] = useState("");
  const [subject, setSubject] = useState("Matematika");
  const [score, setScore] = useState("80");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // States for Lesson Plan
  const [lessonSubject, setLessonSubject] = useState("IPA");
  const [lessonTopic, setLessonTopic] = useState("");
  
  // API states
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");

    const studentObj = students.find((s) => s.nis === selectedNis);
    const studentName = studentObj ? studentObj.nama : "Murid";

    const prompt = `Nama Murid: ${studentName}
NIS: ${selectedNis || "Tidak ada"}
Materi Evaluasi / Subjek: ${subject}
Nilai Hasil Belajar: ${score}
Catatan Tambahan Perilaku/Karakter: ${additionalNotes || "Murid rajin dan mengikuti pelajaran dengan baik."}

Tolong susun narasi laporan raport perkembangan belajar sesuai instruksi sistem.`;

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "raport" }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.text);
      } else {
        setError(data.error || "Gagal menghubungi asisten AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Kesalahan jaringan atau server tidak merespon. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTopic) {
      alert("Harap masukkan topik pembelajaran!");
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    const prompt = `Subjek Pembelajaran: ${lessonSubject}
Topik Pelajaran: ${lessonTopic}

Tolong susun modul ajar ringkas interaktif harian berbasis Kurikulum Merdeka sekolah dasar.`;

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "lesson" }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.text);
      } else {
        setError(data.error || "Gagal menghubungi asisten AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Kesalahan jaringan atau server tidak merespon. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">UKAIL AI Assistant</h3>
          <p className="text-xs text-slate-500">Hubungkan administrasi sekolah dasar dengan kecerdasan buatan Gemini AI.</p>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl w-full max-w-md shadow-inner">
        <button
          onClick={() => {
            setActiveSubTab("RAPORT");
            setResult("");
            setError("");
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 cursor-pointer ${
            activeSubTab === "RAPORT" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Penyusun Deskripsi Raport
        </button>
        <button
          onClick={() => {
            setActiveSubTab("LESSON");
            setResult("");
            setError("");
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1.5 cursor-pointer ${
            activeSubTab === "LESSON" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />
          Perancang Rencana Belajar
        </button>
      </div>

      {/* Grid: Form inputs and AI Output side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left column: Inputs depending on active sub-tab */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 font-mono">
              {activeSubTab === "RAPORT" ? "VBA modAI.GenerateDescription" : "AI Lesson Planning Suite"}
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1 mb-4">
              {activeSubTab === "RAPORT" ? "Form Generator Deskripsi" : "Form Penyusun Modul Ajar"}
            </h4>

            {activeSubTab === "RAPORT" ? (
              <form onSubmit={handleGenerateComment} className="space-y-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Pilih Murid
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <select
                      value={selectedNis}
                      onChange={(e) => setSelectedNis(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">-- Pilih Murid --</option>
                      {students.map((s) => (
                        <option key={s.nis} value={s.nis}>
                          {s.nama} ({s.nis})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Mata Pelajaran
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="IPA">IPA</option>
                      <option value="IPS">IPS</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="PPKn">PPKn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Nilai Rata-Rata
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Catatan Kualitatif / Observasi Perilaku
                  </label>
                  <textarea
                    rows={4}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Sering aktif membantu kawan sekelas, pemahaman teori konsep air sangat baik, namun kurang teliti dalam hitungan desimal."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Generate Deskripsi Raport
                </button>
              </form>
            ) : (
              <form onSubmit={handleGenerateLessonPlan} className="space-y-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Mata Pelajaran (Subjek)
                  </label>
                  <select
                    value={lessonSubject}
                    onChange={(e) => setLessonSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="IPA (Sains)">IPA (Sains)</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="Sejarah & IPS">Sejarah & IPS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Topik Pembelajaran / Kompetensi Dasar
                  </label>
                  <input
                    type="text"
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Siklus Air Hujan / Pecahan Senilai"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Susun Rencana Belajar
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 leading-relaxed flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
              AI menggunakan data yang aman harian dan bebas bocoran identitas.
            </p>
          </div>
        </div>

        {/* Right column: Results Canvas */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between lg:col-span-7 min-h-[350px] max-h-[500px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold font-mono text-slate-700">AI Assistant Canvas</span>
            </div>

            {result && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs rounded-lg transition-colors border border-slate-200 shadow-sm font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin" : "Salin Hasil"}
              </button>
            )}
          </div>

          <div className="p-5 overflow-y-auto flex-grow text-xs leading-relaxed max-h-[400px]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <div>
                  <p className="text-sm font-bold text-slate-800">UKAIL AI sedang menyusun narasi...</p>
                  <p className="text-slate-400 text-[10px] mt-1 max-w-xs">Menganalisis hasil belajar dan menyusun bahasa edukatif Kurikulum Merdeka.</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Koneksi Gagal
                </div>
                <p>{error}</p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Silakan konfigurasikan API Key Anda di panel <strong>Settings (ikon roda gigi) &gt; Secrets</strong> di AI Studio jika belum terpasang.
                </div>
              </div>
            ) : result ? (
              <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans select-text text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-inner">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 py-10">
                <Sparkles className="w-8 h-8 text-slate-300" />
                <div>
                  <p className="text-xs font-bold text-slate-500">Kanvas Kosong</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Isi data formulir di sebelah kiri dan klik tombol generate untuk menyusun narasi bertenaga AI.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
