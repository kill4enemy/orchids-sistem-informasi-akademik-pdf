import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pengguna, guru, kelas, murid, nilai } from '@/db/schema';
import { sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Execute count queries for all tables
    const [penggunaResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(pengguna);

    const [guruResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(guru);

    const [kelasResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(kelas);

    const [muridResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(murid);

    // Average grade
    const [avgGradeResult] = await db
      .select({ avg: sql<number>`avg(skor)` })
      .from(nilai);

    // Recent activities
    const recentMurid = await db
      .select()
      .from(murid)
      .orderBy(desc(murid.createdAt))
      .limit(3);

    const recentKelas = await db
      .select()
      .from(kelas)
      .orderBy(desc(kelas.createdAt))
      .limit(2);

    const recentActivities = [
      ...recentMurid.map(m => ({
        type: 'murid',
        title: 'Murid Baru',
        description: `${m.nama} baru saja didaftarkan`,
        time: m.createdAt,
        id: m.id
      })),
      ...recentKelas.map(k => ({
        type: 'kelas',
        title: 'Kelas Baru',
        description: `Kelas ${k.namaKelas} telah dibuat`,
        time: k.createdAt,
        id: k.id
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Combine results into single response object
    const stats = {
      penggunaCount: Number(penggunaResult.count),
      guruCount: Number(guruResult.count),
      kelasCount: Number(kelasResult.count),
      muridCount: Number(muridResult.count),
      avgGrade: avgGradeResult?.avg ? Number(avgGradeResult.avg).toFixed(1) : null,
      recentActivities: recentActivities.slice(0, 5)
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
