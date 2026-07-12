import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarRange,
  BookOpen,
  Terminal,
  Cpu,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Brain,
  Activity,
  Award,
  FileText,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Murid, Attendance, Assessment, AppSettings } from "./types";
import {
  initialStudents,
  initialAttendance,
  initialAssessments,
  defaultSettings
} from "./initialData";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import StudentDatabase from "./components/StudentDatabase";
import AttendanceComponent from "./components/Attendance";
import AssessmentComponent from "./components/Assessment";
import AdminSuite from "./components/AdminSuite";
import VbaViewer from "./components/VbaViewer";
import AiAssistant from "./components/AiAssistant";
import SettingsComponent from "./components/Settings";

// UKAIL Expanded Modules
import BukuKerjaWali from "./components/BukuKerjaWali";
import AsesmenDiagnostik from "./components/AsesmenDiagnostik";
import ObservasiProfil from "./components/ObservasiProfil";
import CommunicationBook from "./components/CommunicationBook";
import RaporKarakter from "./components/RaporKarakter";
import ProgramUnggulan from "./components/ProgramUnggulan";


// Google Cloud Auth & Sync imports
import { googleSignIn, logout } from "./lib/firebase";
import { syncDataToGoogleSheets } from "./lib/cloudSync";

export default function App() {
  // 1. Authentication State
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("ukail_current_user") || null;
  });

  const [googleToken, setGoogleToken] = useState<string | null>(null);
  
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("ukail_user_email") || null;
  });
  
  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    return localStorage.getItem("ukail_user_photo") || null;
  });

  // 2. Database States
  const [students, setStudents] = useState<Murid[]>(() => {
    const saved = localStorage.getItem("ukail_students");
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem("ukail_attendance");
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem("ukail_assessments");
    return saved ? JSON.parse(saved) : initialAssessments;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("ukail_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 3. Google Sheet Cloud Sync States
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncUrl, setSyncUrl] = useState<string | null>(() => {
    return localStorage.getItem("ukail_sync_url") || null;
  });
  const [syncError, setSyncError] = useState<string | null>(null);

  // 4. UI Navigation States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("ukail_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("ukail_attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("ukail_assessments", JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem("ukail_settings", JSON.stringify(settings));
  }, [settings]);

  const handleLoginSuccess = (
    name: string,
    email?: string,
    photoUrl?: string,
    token?: string
  ) => {
    setCurrentUser(name);
    localStorage.setItem("ukail_current_user", name);
    if (email) {
      setUserEmail(email);
      localStorage.setItem("ukail_user_email", email);
    }
    if (photoUrl) {
      setUserPhoto(photoUrl);
      localStorage.setItem("ukail_user_photo", photoUrl);
    } else {
      setUserPhoto(null);
      localStorage.removeItem("ukail_user_photo");
    }
    if (token) {
      setGoogleToken(token);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Firebase logout error:", e);
    }
    setCurrentUser(null);
    setUserEmail(null);
    setUserPhoto(null);
    setGoogleToken(null);
    setSyncUrl(null);
    setSyncError(null);
    localStorage.removeItem("ukail_current_user");
    localStorage.removeItem("ukail_user_email");
    localStorage.removeItem("ukail_user_photo");
    localStorage.removeItem("ukail_sync_url");
    setActiveTab("dashboard");
  };

  // Re-authorize or reconnect Google account manually to restore memory token
  const handleConnectGoogle = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        handleLoginSuccess(
          result.user.displayName || "Guru UKAIL",
          result.user.email || undefined,
          result.user.photoURL || undefined,
          result.accessToken
        );
      }
    } catch (err: any) {
      console.error("Gagal menghubungkan Google:", err);
      alert("Gagal menghubungkan Google: " + err.message);
    }
  };

  // Perform Cloud synchronization to Google Sheets
  const handleSyncToCloud = async () => {
    if (!googleToken) {
      // Prompt user to quickly reconnect to obtain Google Token in memory
      await handleConnectGoogle();
      return;
    }
    setSyncLoading(true);
    setSyncError(null);
    try {
      const result = await syncDataToGoogleSheets(
        googleToken,
        students,
        attendance,
        assessments
      );
      if (result.success && result.spreadsheetUrl) {
        setSyncUrl(result.spreadsheetUrl);
        localStorage.setItem("ukail_sync_url", result.spreadsheetUrl);
      } else {
        setSyncError(result.error || "Gagal melakukan sinkronisasi cloud.");
      }
    } catch (err: any) {
      setSyncError(err.message || "Gagal melakukan sinkronisasi cloud.");
    } finally {
      setSyncLoading(false);
    }
  };

  // CRUD Handler - Students
  const handleAddStudent = (newStudent: Murid) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Murid) => {
    setStudents((prev) =>
      prev.map((s) => (s.nis === updatedStudent.nis ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (nis: string) => {
    setStudents((prev) => prev.filter((s) => s.nis !== nis));
    setAttendance((prev) => prev.filter((a) => a.nis !== nis));
    setAssessments((prev) => prev.filter((a) => a.nis !== nis));
  };

  // CRUD Handler - Attendance
  const handleAddAttendance = (newRecord: Attendance) => {
    setAttendance((prev) => [...prev, newRecord]);
  };

  const handleDeleteAttendance = (id: string) => {
    setAttendance((prev) => prev.filter((a) => a.id !== id));
  };

  // CRUD Handler - Assessment
  const handleAddAssessment = (newRecord: Assessment) => {
    setAssessments((prev) => [...prev, newRecord]);
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  // Render Login if no authenticated session
  if (!currentUser) {
    return <Login settings={settings} onLoginSuccess={handleLoginSuccess} />;
  }

  // Navigation Items Mapping
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Core Admin" },
    { id: "students", label: "Database Murid", icon: Users, section: "Core Admin" },
    { id: "buku_kerja_wali", label: "Buku Wali Kelas", icon: BookOpen, section: "Core Admin" },
    { id: "admin_suite", label: "Suite Administrasi", icon: GraduationCap, section: "Core Admin" },
    
    { id: "attendance", label: "Absensi Harian", icon: CalendarRange, section: "Asesmen & Karakter" },
    { id: "assessments", label: "Asesmen Kelas", icon: BookOpen, section: "Asesmen & Karakter" },
    { id: "asesmen_diagnostik", label: "Asesmen Diagnostik", icon: Brain, section: "Asesmen & Karakter" },
    { id: "observasi_profil", label: "Observasi Karakter", icon: Activity, section: "Asesmen & Karakter" },
    { id: "rapor_karakter", label: "Rapor Karakter", icon: FileText, section: "Asesmen & Karakter" },
    
    { id: "buku_komunikasi", label: "Wali & Orang Tua", icon: MessageSquare, section: "Komunikasi & Inovasi" },
    { id: "program_unggulan", label: "Program Inovasi", icon: Award, section: "Komunikasi & Inovasi" },
    
    { id: "vba", label: "VBA Explorer", icon: Terminal, section: "Automasi & Sistem" },
    { id: "ai", label: "UKAIL AI", icon: Cpu, section: "Automasi & Sistem" },
    { id: "settings", label: "Settings Sheet", icon: Settings, section: "Automasi & Sistem" }
  ];

  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            students={students}
            attendance={attendance}
            assessments={assessments}
            settings={{
              ...settings,
              teacherName: userEmail ? currentUser : settings.teacherName
            }}
            setActiveTab={setActiveTab}
            googleToken={googleToken}
            onConnectGoogle={handleConnectGoogle}
            syncLoading={syncLoading}
            syncUrl={syncUrl}
            syncError={syncError}
            onSync={handleSyncToCloud}
          />
        );
      case "students":
        return (
          <StudentDatabase
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case "buku_kerja_wali":
        return (
          <BukuKerjaWali
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        );
      case "admin_suite":
        return <AdminSuite students={students} />;
      case "attendance":
        return (
          <AttendanceComponent
            students={students}
            attendance={attendance}
            onAddAttendance={handleAddAttendance}
            onDeleteAttendance={handleDeleteAttendance}
          />
        );
      case "assessments":
        return (
          <AssessmentComponent
            students={students}
            assessments={assessments}
            onAddAssessment={handleAddAssessment}
            onDeleteAssessment={handleDeleteAssessment}
          />
        );
      case "asesmen_diagnostik":
        return <AsesmenDiagnostik students={students} />;
      case "observasi_profil":
        return <ObservasiProfil students={students} />;
      case "rapor_karakter":
        return <RaporKarakter students={students} />;
      case "buku_komunikasi":
        return (
          <CommunicationBook
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        );
      case "program_unggulan":
        return <ProgramUnggulan />;
      case "vba":
        return <VbaViewer />;
      case "ai":
        return <AiAssistant students={students} />;
      case "settings":
        return (
          <SettingsComponent
            settings={{
              ...settings,
              teacherName: userEmail ? currentUser : settings.teacherName
            }}
            onUpdateSettings={handleUpdateSettings}
            onLogout={handleLogout}
          />
        );
      default:
        return <div className="text-white">Under Construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden h-screen">
      {/* 1. Top Ribbon Bar (VBA/Access ERP style) */}
      <div className="h-10 bg-slate-800 text-slate-300 flex items-center px-4 text-xs gap-6 border-b border-slate-950/80 shrink-0 select-none">
        <span className="font-extrabold text-white tracking-wider text-sm flex items-center gap-1.5 mr-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          UKAIL
        </span>
        {["File", "Edit", "View", "Database", "Automation", "AI Tools", "Help"].map((item) => (
          <div
            key={item}
            className="cursor-pointer hover:text-white transition-colors py-1.5 px-2.5 rounded hover:bg-slate-700/60 font-medium"
            onClick={() => alert(`Menu ${item} siap diintegrasikan dengan macro VBA.`)}
          >
            {item}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900/40 px-2 py-0.5 rounded font-mono">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${googleToken ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
          {googleToken ? "Cloud Connected (Google Sheet)" : "Connected Local XLS File"}
        </div>
      </div>

      {/* 2. Main Header (Teacher profile & App name) */}
      <header className="h-[70px] bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {settings.appName}
              <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0">
                v{settings.version}-Stable
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Unified Knowledge & AI Learning Assistant • Sistem Admin Guru Terpadu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Re-authenticate quick widget */}
          {googleToken ? (
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Google Sheets Terhubung
            </div>
          ) : userEmail ? (
            <button
              onClick={handleConnectGoogle}
              className="hidden md:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200 text-xs font-bold transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Otorisasi Ulang Google Drive
            </button>
          ) : null}

          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800">
              {userEmail ? currentUser : settings.teacherName}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
              {userEmail ? userEmail : `Wali Kelas • Semester ${settings.semester} • TP ${settings.year}`}
            </div>
          </div>
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={currentUser}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border border-slate-200 shadow-sm object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm tracking-wider shadow-inner select-none uppercase">
              {currentUser.slice(0, 2)}
            </div>
          )}
        </div>
      </header>

      {/* 3. Core Sidebar + Content view split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 w-[240px] bg-[#0f172a] text-slate-400 z-50 transform lg:transform-none lg:opacity-100 transition-all duration-300 flex flex-col justify-between shrink-0 border-r border-[#1e293b] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <nav className="p-3 space-y-4 flex-1">
              {["Core Admin", "Asesmen & Karakter", "Komunikasi & Inovasi", "Automasi & Sistem"].map((sec) => {
                const itemsInSec = menuItems.filter((m) => m.section === sec);
                return (
                  <div key={sec} className="space-y-1">
                    <div className="px-3 py-1.5 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider select-none border-b border-slate-800/10 mb-1">
                      {sec}
                    </div>
                    {itemsInSec.map((item) => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all border-l-3 ${
                            isActive
                              ? "bg-[#1e293b] text-white border-blue-500 font-bold"
                              : "border-transparent hover:bg-[#1e293b]/50 hover:text-slate-100"
                          }`}
                        >
                          <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            {/* Sidebar Footer User Card */}
            <div className="p-4 border-t border-slate-800/60 bg-[#070b13] shrink-0">
              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={currentUser}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center font-bold uppercase text-[9px] shrink-0">
                      {currentUser.charAt(0)}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="block text-[10px] font-bold text-white truncate">
                      {currentUser}
                    </span>
                    <span className="block text-[8px] text-slate-500 font-mono">
                      Logged In
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-slate-700/50 cursor-pointer"
                  title="Keluar Sesi"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel Content Viewport */}
        <main className="flex-1 bg-slate-50 overflow-y-auto flex flex-col">
          <div className="p-6 max-w-7xl w-full mx-auto flex-1">
            {renderActiveContent()}
          </div>
        </main>
      </div>

      {/* 4. bottom Excel ERP Status Bar */}
      <footer className="h-7 bg-[#3b82f6] text-white flex items-center px-4 text-[11px] font-semibold justify-between select-none shrink-0 z-10 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="font-bold flex items-center gap-1.5 uppercase tracking-wide text-[9px] bg-white/20 px-1.5 py-0.5 rounded">
            Ready
          </span>
          <span className="opacity-90 font-mono">
            {googleToken ? "Database: Cloud Sheets Sync Enabled" : "Module: modDashboard.Dashboard_Load"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="opacity-80">Environment: Google Workspace (SD Belajar)</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:inline opacity-85">ScreenUpdating: True</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="font-mono text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-bold">Cloud Connected</span>
        </div>
      </footer>
    </div>
  );
}
