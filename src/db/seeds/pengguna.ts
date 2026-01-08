import { db } from '@/db';
import { pengguna } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const currentTimestamp = new Date().toISOString();

    const samplePengguna = [
        {
            username: 'admin',
            password: bcrypt.hashSync('admin123', 10),
            role: 'admin',
            nama: 'Administrator',
            createdAt: currentTimestamp,
        },
        {
            username: 'guru1',
            password: bcrypt.hashSync('guru123', 10),
            role: 'guru',
            nama: 'Budi Santoso',
            createdAt: currentTimestamp,
        },
        {
            username: 'guru2',
            password: bcrypt.hashSync('guru123', 10),
            role: 'guru',
            nama: 'Siti Nurhaliza',
            createdAt: currentTimestamp,
        },
        {
            username: 'guru3',
            password: bcrypt.hashSync('guru123', 10),
            role: 'guru',
            nama: 'Ahmad Wijaya',
            createdAt: currentTimestamp,
        },
        {
            username: '0051234567',
            password: bcrypt.hashSync('murid123', 10),
            role: 'murid',
            nama: 'Andi Pratama',
            createdAt: currentTimestamp,
        },
    ];

    await db.insert(pengguna).values(samplePengguna);
    
    console.log('✅ Pengguna seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});