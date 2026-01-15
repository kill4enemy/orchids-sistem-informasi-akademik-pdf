import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { permintaanKelas, murid, kelas, guru } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const muridId = searchParams.get('muridId');
    const guruId = searchParams.get('guruId');
    const all = searchParams.get('all');

    if (all === 'true' || guruId) {
      // If guruId is provided, we could filter, but let's show all pending requests 
      // to both Admins and Gurus for better visibility as requested.
      // We still use guruId to identify the teacher but return all pending for now.
      const requests = await db
        .select({
          id: permintaanKelas.id,
          status: permintaanKelas.status,
          muridId: permintaanKelas.muridId,
          namaMurid: murid.nama,
          nisn: murid.nisn,
          kelasId: permintaanKelas.kelasId,
          namaKelas: kelas.namaKelas,
          createdAt: permintaanKelas.createdAt,
        })
        .from(permintaanKelas)
        .innerJoin(murid, eq(permintaanKelas.muridId, murid.id))
        .innerJoin(kelas, eq(permintaanKelas.kelasId, kelas.id))
        .where(eq(permintaanKelas.status, 'pending'));
      
      return NextResponse.json(requests);
    }

    return NextResponse.json({ error: 'Missing muridId or guruId' }, { status: 400 });
  } catch (error) {
    console.error('GET permintaan-kelas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { muridId, kelasId } = body;

    if (!muridId || !kelasId) {
      return NextResponse.json({ error: 'Missing muridId or kelasId' }, { status: 400 });
    }

    // Check if request already exists
    const existing = await db
      .select()
      .from(permintaanKelas)
      .where(
        and(
          eq(permintaanKelas.muridId, parseInt(muridId)),
          eq(permintaanKelas.kelasId, parseInt(kelasId)),
          eq(permintaanKelas.status, 'pending')
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
    }

    const newRequest = await db.insert(permintaanKelas).values({
      muridId: parseInt(muridId),
      kelasId: parseInt(kelasId),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(newRequest[0], { status: 201 });
  } catch (error) {
    console.error('POST permintaan-kelas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body; // status: 'disetujui' or 'ditolak'

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const requestData = await db
      .select()
      .from(permintaanKelas)
      .where(eq(permintaanKelas.id, parseInt(id)))
      .limit(1);

    if (requestData.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const currentRequest = requestData[0];

    // If approved, update murid's kelasId
    if (status === 'disetujui') {
      await db
        .update(murid)
        .set({ kelasId: currentRequest.kelasId })
        .where(eq(murid.id, currentRequest.muridId));
      
      // Update class student count
      const currentKelas = await db.select().from(kelas).where(eq(kelas.id, currentRequest.kelasId)).limit(1);
      if (currentKelas.length > 0) {
        await db.update(kelas).set({ jumlahSiswa: (currentKelas[0].jumlahSiswa || 0) + 1 }).where(eq(kelas.id, currentRequest.kelasId));
      }
    }

    const updated = await db
      .update(permintaanKelas)
      .set({ status })
      .where(eq(permintaanKelas.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT permintaan-kelas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
