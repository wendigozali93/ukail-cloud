export interface BukuKomunikasiItem {
  id: string;
  tanggal: string;
  pengirim: "Guru" | "Orang Tua";
  pesan: string;
  attachment?: {
    name: string;
    type: "photo" | "file";
    url: string;
  };
  isRead?: boolean;
}

export interface Murid {
  nis: string;
  nisn: string;
  nama: string;
  jk: "L" | "P";
  alamat: string;
  namaAyah: string;
  namaIbu: string;
  gayaBelajar: string;
  kondisiKeluarga: string;
  riwayatKesehatan: string;
  minatBakat: string;
  hariPiket?: string; // Senin, Selasa, Rabu, Kamis, Jumat, Sabtu
  seatRow?: number; // baris kursi 0-3
  seatCol?: number; // kolom kursi 0-3
  bukuKomunikasi?: BukuKomunikasiItem[];
}

export interface Attendance {
  id: string;
  tanggal: string;
  nis: string;
  nama: string; // denormalized for easy rendering
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
}

export interface Assessment {
  id: string;
  nis: string;
  nama: string;
  subjek: string; // e.g. Matematika, IPA, Bahasa Indonesia, dll
  nilai: number; // 0 - 100
  tanggal: string;
}

export interface AppSettings {
  appName: string;
  version: string;
  teacherName: string;
  semester: number;
  year: string;
}

export interface VbaModule {
  name: string;
  type: "Standard" | "Form" | "Class";
  description: string;
  code: string;
}

// 12 sub-menus in Buku Kerja Wali Kelas
export interface InventarisItem {
  id: string;
  namaBarang: string;
  jumlah: number;
  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat";
  keterangan: string;
}

export interface StrukturOrganisasi {
  waliKelas: string;
  ketuaKelas: string;
  wakilKetua: string;
  sekretaris: string;
  bendahara: string;
  seksiKebersihan: string;
  seksiKeindahan: string;
  seksiKeamanan: string;
}

export interface JadwalPelajaranItem {
  hari: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu";
  pukul: string; // e.g. "07:00 - 08:15"
  mapel: string;
  pengajar: string;
}

export interface CatatanPrestasi {
  id: string;
  nis: string;
  namaMurid: string;
  prestasi: string;
  tanggal: string;
  tingkat: "Sekolah" | "Kecamatan" | "Kabupaten/Kota" | "Provinsi" | "Nasional";
  keterangan: string;
}

export interface CatatanPelanggaran {
  id: string;
  nis: string;
  namaMurid: string;
  pelanggaran: string;
  tanggal: string;
  tindakLanjut: string;
  poin: number;
}

export interface HomeVisit {
  id: string;
  nis: string;
  namaMurid: string;
  tanggal: string;
  tujuan: string;
  hasil: string;
  mediaSim?: string; // Base64 or image mockup url
}

export interface PortofolioItem {
  id: string;
  nis: string;
  namaMurid: string;
  namaKarya: string;
  tanggal: string;
  kategori: "Kriya/Seni" | "Tulisan/Sastra" | "Proyek Sains" | "Lainnya";
  nilai: number; // 1 - 100
  catatan: string;
}

export interface JurnalHarianWali {
  id: string;
  tanggal: string;
  kegiatan: string;
  kejadianPenting: string;
  penanganan: string;
  status: "Selesai" | "Follow-up";
}

// Asesmen Diagnostik
export interface AsesmenDiagnostikItem {
  id: string;
  nis: string;
  namaMurid: string;
  tipe: "Literasi" | "Numerasi" | "Karakter";
  nilai: number; // 0 - 100
  interpretasi: "Perlu Intervensi Khusus" | "Dasar" | "Cakap" | "Mahir";
  catatan: string;
  tanggal: string;
}

// Observasi Profil Lulusan (8 dimensi)
export interface ObservasiProfilItem {
  id: string;
  nis: string;
  namaMurid: string;
  tanggal: string;
  dimensi: "Beriman & Bertakwa" | "Kebinekaan Global" | "Gotong Royong" | "Mandiri" | "Bernalar Kritis" | "Kreatif" | "Cinta Tanah Air" | "Komunikatif";
  skor: number; // 1, 2, 3, 4
  catatan: string;
  mediaSim?: string;
}

// Program Unggulan Kelas
export interface ProgramUnggulanItem {
  id: string;
  namaProgram: string;
  kategori: "Literasi" | "Numerasi" | "Karakter" | "STEAM" | "Deep Learning" | "Lingkungan" | "Parenting";
  perencanaan: string;
  pelaksanaan: string;
  dokumentasiSim?: string;
  evaluasi: string;
  refleksi: string;
  status: "Rencana" | "Aktif" | "Selesai";
  tanggalMulai: string;
  tanggalSelesai: string;
}

