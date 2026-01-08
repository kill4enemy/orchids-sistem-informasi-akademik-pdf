import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pengguna, guru, kelas, murid } from '@/db/schema';
import { sql } from 'drizzle-orm';

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

    // Combine results into single response object
    const stats = {
      penggunaCount: Number(penggunaResult.count),
      guruCount: Number(guruResult.count),
      kelasCount: Number(kelasResult.count),
      muridCount: Number(muridResult.count),
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