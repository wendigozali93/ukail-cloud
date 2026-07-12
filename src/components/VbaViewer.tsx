import React, { useState } from "react";
import { FolderCode, Code2, Copy, Check, Download, Search, FileCode2, Terminal, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { vbaModules } from "../vbaModules";
import { VbaModule } from "../types";

export default function VbaViewer() {
  const [selectedModule, setSelectedModule] = useState<VbaModule>(vbaModules[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredModules = vbaModules.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedModule.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([selectedModule.code], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedModule.name}.bas`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Basic custom syntax highlighting for VBA
  const highlightVba = (code: string) => {
    const lines = code.split("\n");
    return lines.map((line, idx) => {
      // Comments
      if (line.trim().startsWith("'")) {
        return (
          <span key={idx} className="text-emerald-500 font-mono block select-none">
            {line}
          </span>
        );
      }
      
      // Inline comments split
      const commentIndex = line.indexOf("'");
      let mainText = commentIndex !== -1 ? line.substring(0, commentIndex) : line;
      const commentText = commentIndex !== -1 ? line.substring(commentIndex) : "";

      // Highlighting key keywords
      const keywords = [
        "Sub ", "Function ", "End Sub", "End Function", "Dim ", "As ", "Public ", "Private ", 
        "Const ", "String", "Integer", "Long", "Double", "Boolean", "Worksheet", "Workbook", 
        "Set ", "If ", "Then", "Else", "End If", "For ", "To ", "Next", "Exit ", "On Error ", 
        "GoTo ", "Call ", "Option Explicit", "Resume ", "MsgBox", "Date", "Now", "CStr", "CDbl"
      ];

      // Temporary replacement logic for visual rendering
      let formattedText = mainText;
      
      // Replace quotes/strings
      const stringRegex = /"([^"]*)"/g;
      formattedText = formattedText.replace(stringRegex, `<span class="text-amber-400">"$1"</span>`);

      return (
        <span key={idx} className="font-mono block min-h-[1.2rem]">
          <span 
            className="text-slate-300"
            dangerouslySetInnerHTML={{
              __html: formattedText
            }}
          />
          {commentText && <span className="text-emerald-500">{commentText}</span>}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">VBA Module Explorer</h3>
          <p className="text-xs text-slate-500">Akses dan ekspor modul VBA Macro siap pakai untuk Workbook Excel Anda.</p>
        </div>
        <button
          onClick={() => {
            // Download all modules as a consolidated zip or guidance file is cool
            const allCode = vbaModules.map(m => `' === MODULE: ${m.name} ===\n${m.code}\n`).join("\n\n");
            const element = document.createElement("a");
            const file = new Blob([allCode], { type: "text/plain;charset=utf-8" });
            element.href = URL.createObjectURL(file);
            element.download = "UKAIL_Complete_VBA_Source.txt";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Ekspor Semua Kode (.txt)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left column: Module List & Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm lg:col-span-4 flex flex-col justify-between max-h-[600px]">
          <div>
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-slate-800 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                placeholder="Cari modul VBA..."
              />
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
              {filteredModules.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModule(m)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                    selectedModule.name === m.name
                      ? "bg-blue-50 border-blue-200 text-blue-800 font-semibold"
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <FileCode2 className={`w-4 h-4 mt-0.5 ${selectedModule.name === m.name ? "text-blue-600" : "text-slate-400"}`} />
                  <div>
                    <span className={`block text-xs font-bold font-mono ${selectedModule.name === m.name ? "text-blue-900" : "text-slate-800"}`}>{m.name}.bas</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 leading-relaxed truncate max-w-[200px]">
                      {m.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-500 flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 shadow-sm">
            <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              Modul VBA dirancang modular. Klik tombol download dan pilih <strong>"Import File..."</strong> pada editor VBA Excel (Alt+F11) untuk memuat modul ini langsung ke Workbook Anda.
            </p>
          </div>
        </div>

        {/* Right column: Source Code Viewer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between lg:col-span-8 min-h-[450px] max-h-[600px] overflow-hidden shadow-lg">
          {/* Code Viewer Header Toolbar */}
          <div className="p-4 border-b border-slate-900 bg-slate-900 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold font-mono text-slate-200">
                {selectedModule.name}.bas
              </span>
              <span className="inline-flex px-1.5 py-0.5 bg-slate-800 text-[8px] uppercase tracking-wider text-slate-400 border border-slate-700 rounded font-semibold font-mono">
                {selectedModule.type} Module
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700 font-semibold cursor-pointer"
                title="Salin Kode ke Clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin" : "Salin"}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors shadow shadow-indigo-950/20 font-semibold cursor-pointer"
                title="Download file .bas"
              >
                <Download className="w-3.5 h-3.5" />
                Download .bas
              </button>
            </div>
          </div>

          {/* Code Canvas */}
          <div className="p-5 overflow-y-auto flex-grow text-xs leading-relaxed max-h-[480px]">
            <pre className="font-mono text-[11px] whitespace-pre select-text">
              {highlightVba(selectedModule.code)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
