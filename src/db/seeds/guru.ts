import { db } from '@/db';
import { guru } from '@/db/schema';

async function main() {
    const sampleGuru = [
        {
            penggunaId: 2,
            nip: '197501012000031001',
            nama: 'Budi Santoso',
            mataPelajaran: 'Matematika',
            noTelp: '081234567890',
            createdAt: new Date().toISOString(),
        },
        {
            penggunaId: 3,
            nip: '198203152005012002',
            nama: 'Siti Nurhaliza',
            mataPelajaran: 'Bahasa Indonesia',
            noTelp: '081234567891',
            createdAt: new Date().toISOString(),
        },
        {
            penggunaId: 4,
            nip: '199008252010011003',
            nama: 'Ahmad Wijaya',
            mataPelajaran: 'Fisika',
            noTelp: '081234567892',
            createdAt: new Date().toISOString(),
        },
    ];

    try {
        const result = await db.insert(guru).values(sampleGuru);
        console.log(`✅ Guru seeder completed successfully - ${sampleGuru.length} records inserted`);
    } catch (error) {
        console.error('❌ Seeder failed:', error);
        throw error;
    }
}

main().catch((error) => {
    console.error('❌ Seeder execution failed:', error);
    process.exit(1);
});