// Database Types
export interface Pengguna {
  id: number;
  username: string;
  password: string;
    role: 'admin' | 'guru' | 'murid';
  nama: string;
  createdAt: string;
}

export interface Guru {
  id: number;
  penggunaId: number | null;
  nip: string;
  nama: string;
  mataPelajaran: string;
  noTelp: string | null;
  createdAt: string;
}

export interface Kelas {
  id: number;
  namaKelas: string;
  tahunAjaran: string;
  waliKelasId: number | null;
  jumlahSiswa: number;
  createdAt: string;
}

export interface Murid {
  id: number;
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string | null;
  alamat: string | null;
  kelasId: number | null;
  namaOrangTua: string | null;
  noTelpOrangTua: string | null;
  createdAt: string;
}

export interface Stats {
  penggunaCount: number;
  guruCount: number;
  kelasCount: number;
  muridCount: number;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface MuridForm {
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  alamat: string;
  kelasId: number | null;
  namaOrangTua: string;
  noTelpOrangTua: string;
}

export interface KelasForm {
  namaKelas: string;
  tahunAjaran: string;
  waliKelasId: number | null;
  jumlahSiswa: number;
}
