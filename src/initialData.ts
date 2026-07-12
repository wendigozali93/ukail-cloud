import { Murid, Attendance, Assessment, AppSettings } from "./types";

export const initialStudents: Murid[] = [
  {
    nis: "102401",
    nisn: "0012431201",
    nama: "Ahmad Fauzi",
    jk: "L",
    alamat: "Jl. Merdeka No. 12, Jakarta",
    namaAyah: "Hendra Fauzi",
    namaIbu: "Siti Rahma",
    gayaBelajar: "Visual",
    kondisiKeluarga: "Lengkap (Orang Tua Kandung)",
    riwayatKesehatan: "Sehat (Tidak Ada)",
    minatBakat: "Sains & Sepak Bola",
    hariPiket: "Senin",
    seatRow: 0,
    seatCol: 0,
    bukuKomunikasi: [
      { id: "msg-1", tanggal: "2026-07-01", pengirim: "Guru", pesan: "Ahmad sangat aktif dalam eksperimen sains hari ini." },
      { id: "msg-2", tanggal: "2026-07-01", pengirim: "Orang Tua", pesan: "Terima kasih pak, Ahmad memang senang bercerita di rumah." }
    ]
  },
  {
    nis: "102402",
    nisn: "0012431202",
    nama: "Siti Aminah",
    jk: "P",
    alamat: "Perum Indah B-5, Jakarta",
    namaAyah: "Rahmat Amin",
    namaIbu: "Laila Sari",
    gayaBelajar: "Auditoris",
    kondisiKeluarga: "Lengkap (Orang Tua Kandung)",
    riwayatKesehatan: "Alergi Debu",
    minatBakat: "Seni Musik & Membaca",
    hariPiket: "Selasa",
    seatRow: 0,
    seatCol: 1,
    bukuKomunikasi: [
      { id: "msg-3", tanggal: "2026-07-02", pengirim: "Guru", pesan: "Siti cepat menghafal materi IPA lagu daerah." }
    ]
  },
  {
    nis: "102403",
    nisn: "0012431203",
    nama: "Budi Santoso",
    jk: "L",
    alamat: "Gg. Kelinci III, Jakarta",
    namaAyah: "Slamet Santoso",
    namaIbu: "Dewi Purwati",
    gayaBelajar: "Kinestetik",
    kondisiKeluarga: "Lengkap (Orang Tua Kandung)",
    riwayatKesehatan: "Asma Ringan",
    minatBakat: "Olahraga Basket",
    hariPiket: "Rabu",
    seatRow: 1,
    seatCol: 0,
    bukuKomunikasi: []
  },
  {
    nis: "102404",
    nisn: "0012431204",
    nama: "Dewi Lestari",
    jk: "P",
    alamat: "Jl. Dahlia No. 45, Jakarta",
    namaAyah: "Gunawan Lestari",
    namaIbu: "Yanti Herawati",
    gayaBelajar: "Visual",
    kondisiKeluarga: "Lengkap (Orang Tua Kandung)",
    riwayatKesehatan: "Mata Minus (Kacamata)",
    minatBakat: "Menggambar & Melukis",
    hariPiket: "Kamis",
    seatRow: 1,
    seatCol: 1,
    bukuKomunikasi: []
  },
  {
    nis: "102405",
    nisn: "0012431205",
    nama: "Rian Hidayat",
    jk: "L",
    alamat: "Sunter Agung No. 88, Jakarta",
    namaAyah: "Yusuf Hidayat",
    namaIbu: "Farida",
    gayaBelajar: "Kinestetik",
    kondisiKeluarga: "Tinggal Bersama Nenek",
    riwayatKesehatan: "Sehat",
    minatBakat: "Matematika & Catur",
    hariPiket: "Jumat",
    seatRow: 2,
    seatCol: 0,
    bukuKomunikasi: []
  },
  {
    nis: "102406",
    nisn: "0012431206",
    nama: "Nabila Putri",
    jk: "P",
    alamat: "Jl. Melati Raya No. 17, Jakarta",
    namaAyah: "Irwan Saputra",
    namaIbu: "Ningsih",
    gayaBelajar: "Auditoris",
    kondisiKeluarga: "Lengkap (Orang Tua Kandung)",
    riwayatKesehatan: "Sehat",
    minatBakat: "Puisi & Seni Tari",
    hariPiket: "Senin",
    seatRow: 2,
    seatCol: 1,
    bukuKomunikasi: []
  }
];

export const initialAttendance: Attendance[] = [
  { id: "att-1", tanggal: "2026-07-10", nis: "102401", nama: "Ahmad Fauzi", status: "Hadir" },
  { id: "att-2", tanggal: "2026-07-10", nis: "102402", nama: "Siti Aminah", status: "Hadir" },
  { id: "att-3", tanggal: "2026-07-10", nis: "102403", nama: "Budi Santoso", status: "Sakit" },
  { id: "att-4", tanggal: "2026-07-10", nis: "102404", nama: "Dewi Lestari", status: "Hadir" },
  { id: "att-5", tanggal: "2026-07-10", nis: "102405", nama: "Rian Hidayat", status: "Izin" },
  { id: "att-6", tanggal: "2026-07-10", nis: "102406", nama: "Nabila Putri", status: "Hadir" },
  
  { id: "att-7", tanggal: "2026-07-11", nis: "102401", nama: "Ahmad Fauzi", status: "Hadir" },
  { id: "att-8", tanggal: "2026-07-11", nis: "102402", nama: "Siti Aminah", status: "Hadir" },
  { id: "att-9", tanggal: "2026-07-11", nis: "102403", nama: "Budi Santoso", status: "Hadir" },
  { id: "att-10", tanggal: "2026-07-11", nis: "102404", nama: "Dewi Lestari", status: "Hadir" },
  { id: "att-11", tanggal: "2026-07-11", nis: "102405", nama: "Rian Hidayat", status: "Hadir" },
  { id: "att-12", tanggal: "2026-07-11", nis: "102406", nama: "Nabila Putri", status: "Alpa" }
];

export const initialAssessments: Assessment[] = [
  { id: "as-1", nis: "102401", nama: "Ahmad Fauzi", subjek: "Matematika", nilai: 85, tanggal: "2026-07-08" },
  { id: "as-2", nis: "102402", nama: "Siti Aminah", subjek: "Matematika", nilai: 92, tanggal: "2026-07-08" },
  { id: "as-3", nis: "102403", nama: "Budi Santoso", subjek: "Matematika", nilai: 70, tanggal: "2026-07-08" },
  { id: "as-4", nis: "102404", nama: "Dewi Lestari", subjek: "Matematika", nilai: 88, tanggal: "2026-07-08" },
  { id: "as-5", nis: "102405", nama: "Rian Hidayat", subjek: "Matematika", nilai: 65, tanggal: "2026-07-08" },
  { id: "as-6", nis: "102406", nama: "Nabila Putri", subjek: "Matematika", nilai: 78, tanggal: "2026-07-08" },
  
  { id: "as-7", nis: "102401", nama: "Ahmad Fauzi", subjek: "IPA", nilai: 90, tanggal: "2026-07-09" },
  { id: "as-8", nis: "102402", nama: "Siti Aminah", subjek: "IPA", nilai: 85, tanggal: "2026-07-09" },
  { id: "as-9", nis: "102403", nama: "Budi Santoso", subjek: "IPA", nilai: 75, tanggal: "2026-07-09" },
  { id: "as-10", nis: "102404", nama: "Dewi Lestari", subjek: "IPA", nilai: 95, tanggal: "2026-07-09" },
  { id: "as-11", nis: "102405", nama: "Rian Hidayat", subjek: "IPA", nilai: 80, tanggal: "2026-07-09" },
  { id: "as-12", nis: "102406", nama: "Nabila Putri", subjek: "IPA", nilai: 82, tanggal: "2026-07-09" }
];

export const defaultSettings: AppSettings = {
  appName: "UKAIL Teacher Assistant",
  version: "1.0",
  teacherName: "Wendi Gozali, S.Pd.",
  semester: 1,
  year: "2026/2027"
};
