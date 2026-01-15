import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { murid, pengguna, kelas, guru } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const penggunaId = searchParams.get('penggunaId');

    if (!penggunaId) {
      return NextResponse.json({ error: 'Pengguna ID is required' }, { status: 400 });
    }

    const result = await db
      .select({
        id: murid.id,
        nama: murid.nama,
        nisn: murid.nisn,
        kelasId: murid.kelasId,
        namaKelas: kelas.namaKelas,
        waliKelas: guru.nama,
        waliKelasFoto: pengguna.foto,
      })
      .from(murid)
      .leftJoin(kelas, eq(murid.kelasId, kelas.id))
      .leftJoin(guru, eq(kelas.waliKelasId, guru.id))
      .leftJoin(pengguna, eq(guru.penggunaId, pengguna.id))
      .where(eq(murid.penggunaId, parseInt(penggunaId)))
      .limit(1);

    if (result.length === 0) {
      // If user has role 'murid' but no record in 'murid' table, create one
      const userResult = await db.select().from(pengguna).where(eq(pengguna.id, parseInt(penggunaId))).limit(1);
      
      if (userResult.length > 0 && userResult[0].role === 'murid') {
        const newMurid = await db.insert(murid).values({
          penggunaId: parseInt(penggunaId),
          nama: userResult[0].nama,
          nisn: `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          jenisKelamin: 'L', // Default
          createdAt: new Date().toISOString(),
        }).returning();

        return NextResponse.json({
          id: newMurid[0].id,
          nama: newMurid[0].nama,
          nisn: newMurid[0].nisn,
          kelasId: null,
          namaKelas: null,
          waliKelas: null,
          waliKelasFoto: null,
        });
      }
      return NextResponse.json({ error: 'Murid not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('GET murid/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
