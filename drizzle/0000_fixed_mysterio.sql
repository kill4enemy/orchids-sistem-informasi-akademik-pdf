CREATE TABLE `guru` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pengguna_id` integer,
	`nip` text NOT NULL,
	`nama` text NOT NULL,
	`mata_pelajaran` text NOT NULL,
	`no_telp` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guru_pengguna_id_unique` ON `guru` (`pengguna_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `guru_nip_unique` ON `guru` (`nip`);--> statement-breakpoint
CREATE TABLE `kelas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama_kelas` text NOT NULL,
	`tahun_ajaran` text NOT NULL,
	`wali_kelas_id` integer,
	`jumlah_siswa` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`wali_kelas_id`) REFERENCES `guru`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `murid` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nisn` text NOT NULL,
	`nama` text NOT NULL,
	`jenis_kelamin` text NOT NULL,
	`tanggal_lahir` text,
	`alamat` text,
	`kelas_id` integer,
	`nama_orang_tua` text,
	`no_telp_orang_tua` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `murid_nisn_unique` ON `murid` (`nisn`);--> statement-breakpoint
CREATE TABLE `pengguna` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`nama` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pengguna_username_unique` ON `pengguna` (`username`);