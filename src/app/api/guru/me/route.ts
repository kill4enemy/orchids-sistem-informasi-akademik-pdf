import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { guru, pengguna } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const penggunaId = searchParams.get('penggunaId');

    if (!penggunaId) {
      return NextResponse.json({ error: 'Pengguna ID is required' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(guru)
      .where(eq(guru.penggunaId, parseInt(penggunaId)))
      .limit(1);

    if (result.length === 0) {
      // If user has role 'guru' but no record in 'guru' table, create one
      const userResult = await db.select().from(pengguna).where(eq(pengguna.id, parseInt(penggunaId))).limit(1);
      
      if (userResult.length > 0 && userResult[0].role === 'guru') {
        const newGuru = await db.insert(guru).values({
          penggunaId: parseInt(penggunaId),
          nama: userResult[0].nama,
          nip: `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          mataPelajaran: 'Umum', // Default
          createdAt: new Date().toISOString(),
        }).returning();

        return NextResponse.json(newGuru[0]);
      }
      return NextResponse.json({ error: 'Guru not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('GET guru/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
