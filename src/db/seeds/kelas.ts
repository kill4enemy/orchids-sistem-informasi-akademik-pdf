import { db } from '@/db';
import { kelas } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleKelas = [
        {
            namaKelas: 'X-A',
            tahunAjaran: '2024/2025',
            waliKelasId: 1,
            jumlahSiswa: 0,
            createdAt: currentTimestamp,
        },
        {
            namaKelas: 'X-B',
            tahunAjaran: '2024/2025',
            waliKelasId: 2,
            jumlahSiswa: 0,
            createdAt: currentTimestamp,
        },
        {
            namaKelas: 'XI-IPA-1',
            tahunAjaran: '2024/2025',
            waliKelasId: 3,
            jumlahSiswa: 0,
            createdAt: currentTimestamp,
        },
        {
            namaKelas: 'XI-IPA-2',
            tahunAjaran: '2024/2025',
            waliKelasId: 1,
            jumlahSiswa: 0,
            createdAt: currentTimestamp,
        },
        {
            namaKelas: 'XII-IPA-1',
            tahunAjaran: '2024/2025',
            waliKelasId: 2,
            jumlahSiswa: 0,
            createdAt: currentTimestamp,
        },
        {
            namaKelas: 'XII-IPA-2',
            tahunAjaran: '2024/2025',
            waliKelasId: 3,
            jumlahSiswa: 0,
            createdAt: currentTimestamp,
        },
    ];

    await db.insert(kelas).values(sampleKelas);
    
    console.log(`✅ Kelas seeder completed successfully - ${sampleKelas.length} records inserted`);
}

main().catch((error) => {
    console.error('❌ Kelas seeder failed:', error);
    process.exit(1);
});