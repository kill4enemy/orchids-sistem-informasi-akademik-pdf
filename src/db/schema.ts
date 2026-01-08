import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Pengguna (Users) table
export const pengguna = sqliteTable('pengguna', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // 'admin', 'guru', or 'murid'
  nama: text('nama').notNull(),
  foto: text('foto'),
  createdAt: text('created_at').notNull(),
});

// Guru (Teachers) table
export const guru = sqliteTable('guru', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  penggunaId: integer('pengguna_id').unique().references(() => pengguna.id),
  nip: text('nip').notNull().unique(),
  nama: text('nama').notNull(),
  mataPelajaran: text('mata_pelajaran').notNull(),
  noTelp: text('no_telp'),
  createdAt: text('created_at').notNull(),
});

// Kelas (Classes) table
export const kelas = sqliteTable('kelas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  namaKelas: text('nama_kelas').notNull(),
  tahunAjaran: text('tahun_ajaran').notNull(),
  waliKelasId: integer('wali_kelas_id').references(() => guru.id),
  jumlahSiswa: integer('jumlah_siswa').default(0),
  createdAt: text('created_at').notNull(),
});

// Murid (Students) table
export const murid = sqliteTable('murid', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  penggunaId: integer('pengguna_id').unique().references(() => pengguna.id),
  nisn: text('nisn').notNull().unique(),
  nama: text('nama').notNull(),
  jenisKelamin: text('jenis_kelamin').notNull(), // 'L' or 'P'
  tanggalLahir: text('tanggal_lahir'),
  alamat: text('alamat'),
  kelasId: integer('kelas_id').references(() => kelas.id),
  namaOrangTua: text('nama_orang_tua'),
  noTelpOrangTua: text('no_telp_orang_tua'),
  createdAt: text('created_at').notNull(),
});

// Nilai (Grades) table
export const nilai = sqliteTable('nilai', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  muridId: integer('murid_id').notNull().references(() => murid.id),
  mataPelajaran: text('mata_pelajaran').notNull(),
  skor: integer('skor').notNull(),
  tipe: text('tipe').notNull(), // 'Tugas', 'UTS', 'UAS'
  tanggal: text('tanggal').notNull(),
  createdAt: text('created_at').notNull(),
});
