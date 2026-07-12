import React from "react";

interface UkailLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: "light" | "dark";
}

export default function UkailLogo({
  className = "",
  size = 64,
  showText = false,
  textColor = "dark"
}: UkailLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105 duration-300"
      >
        {/* Background Subtle Glow / Aura */}
        <circle cx="100" cy="100" r="85" fill="url(#bg-glow)" opacity="0.1" />

        {/* 1. Large U-Shape Outer Boundary (Primary Color: #2563EB) */}
        <path
          d="M45 40 C45 35 48 30 55 30 H65 C70 30 73 35 73 40 V100 C73 125 90 142 100 142 C110 142 127 125 127 100 V40 C127 35 130 30 135 30 H145 C152 30 155 35 155 40 V100 C155 138 126 165 100 165 C74 165 45 138 45 100 V40 Z"
          fill="url(#primary-blue)"
        />

        {/* 2. Buku Terbuka (Open Book Wing Paths) at the Bottom inside U-Shape */}
        <path
          d="M100 130 C112 118 135 118 150 125 C140 140 120 148 100 142 C80 148 60 140 50 125 C65 118 88 118 100 130 Z"
          fill="url(#primary-blue)"
          opacity="0.8"
        />
        <path
          d="M100 140 C112 130 132 130 145 135 C135 148 118 155 100 150 C82 155 65 148 55 135 C68 130 88 130 100 140 Z"
          fill="url(#primary-blue)"
          opacity="0.9"
        />

        {/* 3. Jaringan Pengetahuan (Knowledge Circle lines and nodes around center) */}
        {/* Connection Circle Line */}
        <circle cx="100" cy="80" r="32" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

        {/* Network Connection Lines inside the Circle */}
        <line x1="100" y1="48" x2="100" y2="112" stroke="#22C55E" strokeWidth="0.8" opacity="0.4" />
        <line x1="68" y1="80" x2="132" y2="80" stroke="#22C55E" strokeWidth="0.8" opacity="0.4" />
        <line x1="77" y1="57" x2="123" y2="103" stroke="#2563EB" strokeWidth="0.8" opacity="0.4" />
        <line x1="77" y1="103" x2="123" y2="57" stroke="#2563EB" strokeWidth="0.8" opacity="0.4" />

        {/* Outer Circle Nodes (8 Green/Blue points) */}
        {/* Node 1: Top (Green) */}
        <circle cx="100" cy="48" r="4.5" fill="#22C55E" stroke="#fff" strokeWidth="1.2" />
        {/* Node 2: Top Right (Blue) */}
        <circle cx="123" cy="57" r="4.5" fill="#2563EB" stroke="#fff" strokeWidth="1.2" />
        {/* Node 3: Right (Green) */}
        <circle cx="132" cy="80" r="4.5" fill="#22C55E" stroke="#fff" strokeWidth="1.2" />
        {/* Node 4: Bottom Right (Blue) */}
        <circle cx="123" cy="103" r="4.5" fill="#2563EB" stroke="#fff" strokeWidth="1.2" />
        {/* Node 5: Bottom (Green) */}
        <circle cx="100" cy="112" r="4.5" fill="#22C55E" stroke="#fff" strokeWidth="1.2" />
        {/* Node 6: Bottom Left (Blue) */}
        <circle cx="77" cy="103" r="4.5" fill="#2563EB" stroke="#fff" strokeWidth="1.2" />
        {/* Node 7: Left (Green) */}
        <circle cx="68" cy="80" r="4.5" fill="#22C55E" stroke="#fff" strokeWidth="1.2" />
        {/* Node 8: Top Left (Blue) */}
        <circle cx="77" cy="57" r="4.5" fill="#2563EB" stroke="#fff" strokeWidth="1.2" />


        {/* 4. Bintang AI (Accent Color: #F59E0B) right in the center */}
        <path
          d="M100 62 C100 73 104 80 118 80 C104 80 100 87 100 98 C100 87 96 80 82 80 C96 80 100 73 100 62 Z"
          fill="url(#accent-gold)"
        />

        {/* Defs for Gradients */}
        <defs>
          <linearGradient id="primary-blue" x1="45" y1="30" x2="155" y2="165" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="accent-gold" x1="82" y1="62" x2="118" y2="98" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <radialGradient id="bg-glow" cx="100" cy="80" r="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <div className="text-center mt-3 select-none">
          <h2
            className={`text-3xl font-extrabold tracking-widest font-sans ${
              textColor === "light" ? "text-white" : "text-slate-900"
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            UKAIL
          </h2>
          <p
            className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
              textColor === "light" ? "text-blue-200" : "text-slate-500"
            }`}
          >
            Unified Knowledge & AI Learning Assistant
          </p>
        </div>
      )}
    </div>
  );
}
