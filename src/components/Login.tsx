import React, { useState } from "react";
import { KeyRound, User, Lock, Terminal, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { AppSettings } from "../types";
import UkailLogo from "./UkailLogo";
import { googleSignIn } from "../lib/firebase";

interface LoginProps {
  settings: AppSettings;
  onLoginSuccess: (name: string, email?: string, photoUrl?: string, token?: string) => void;
}

export default function Login({ settings, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [showVbaDebug, setShowVbaDebug] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"google" | "offline">("google");

  const handleOfflineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === "admin" && password === "123456") || (username === "wendi" && password === "guru123")) {
      const displayName = username === "wendi" ? "Wendi Gozali, S.Pd." : "Administrator";
      const demoEmail = username === "wendi" ? "wendigozali93@guru.sd.belajar.id" : "admin@ukail.cloud";
      onLoginSuccess(displayName, demoEmail, "");
    } else {
      setError("Username atau password salah. Coba: admin/123456 atau wendi/guru123");
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError("");
    try {
      const result = await googleSignIn();
      if (result) {
        const { user, accessToken } = result;
        onLoginSuccess(
          user.displayName || "Guru UKAIL",
          user.email || undefined,
          user.photoURL || undefined,
          accessToken
        );
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Gagal masuk menggunakan akun Google Anda.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Decorative blurred background shapes matching logo colors */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative"
      >
        {/* Colorful Gradient Ribbon matching color specs */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2563EB] via-[#22C55E] to-[#F59E0B] rounded-t-2xl" />

        {/* Brand identity logo section */}
        <div className="text-center mb-6">
          <UkailLogo size={90} className="mb-2" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {settings.appName}
          </h1>
          <p className="text-slate-500 text-xs mt-1 px-4 leading-relaxed font-medium">
            Unified Knowledge & AI Learning Assistant • v{settings.version}
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            onClick={() => { setLoginMethod("google"); setError(""); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              loginMethod === "google"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Google Sign-In
          </button>
          <button
            onClick={() => { setLoginMethod("offline"); setError(""); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              loginMethod === "offline"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Database Offline
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2.5 font-semibold"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {loginMethod === "google" ? (
          /* GOOGLE OAUTH INTERACTIVE LOGIN SECTION */
          <div className="space-y-6">
            <div className="text-center px-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Akses asisten AI, kelola database murid, absensi, dan sinkronisasi laporan nilai Anda secara langsung ke **Google Sheets** cloud Anda.
              </p>
            </div>

            {/* Official Material Google Sign-In Button style */}
            <button
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="w-full inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold py-3.5 px-4 border border-slate-200 rounded-xl shadow-md transition-all duration-200 cursor-pointer text-sm disabled:opacity-50"
            >
              {loadingGoogle ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              {loadingGoogle ? "Menghubungkan..." : "Masuk dengan Google"}
            </button>

            <div className="flex items-center justify-center gap-1.5 bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg text-[10px] text-blue-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Koneksi aman terintegrasi dengan Google Cloud Service</span>
            </div>
          </div>
        ) : (
          /* OFFLINE USERNAME/PASSWORD SIMULATOR */
          <form onSubmit={handleOfflineSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Masukkan username..."
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-blue-100 text-xs flex justify-center items-center gap-2 mt-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Sign In Demo Offline
            </button>
          </form>
        )}

        {/* VBA Debug Log section at the bottom */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center">
          <button
            onClick={() => setShowVbaDebug(!showVbaDebug)}
            className="inline-flex items-center gap-1.5 text-[10px] text-blue-600 hover:text-blue-700 transition-colors font-bold font-mono cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            {showVbaDebug ? "Sembunyikan VBA Log" : "Lihat Simulasi VBA Login"}
          </button>

          {showVbaDebug && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 mt-3 text-[9px] text-emerald-400 font-mono overflow-x-auto max-h-36 whitespace-pre shadow-inner"
            >
              {"' VBA: frmLogin - cmdLogin_Click()\n"}
              {"Dim isOK As Boolean\n"}
              {`isOK = modDatabase.Login("${username}", "${password === "123456" ? "123456" : "******"}")\n`}
              {"If isOK Then\n"}
              {"    MsgBox \"Selamat Datang di UKAIL!\", vbInformation\n"}
              {"    Unload Me\n"}
              {"    Call modMain.StartUKAIL\n"}
              {"Else\n"}
              {"    MsgBox \"Login Gagal!\", vbCritical\n"}
              {"End If"}
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="text-center mt-5 text-[10px] text-slate-500 leading-relaxed">
        <p>Gunakan Google Workspace Guru untuk sinkronisasi otomatis.</p>
        <p className="mt-0.5">Didesain khusus untuk meningkatkan akuntabilitas guru sekolah dasar Indonesia.</p>
      </div>
    </div>
  );
}
