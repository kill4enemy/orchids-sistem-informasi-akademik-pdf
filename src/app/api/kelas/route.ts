import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { kelas } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const tahunAjaran = searchParams.get('tahunAjaran');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(kelas)
        .where(eq(kelas.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Kelas not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(kelas);
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(kelas.namaKelas, `%${search}%`),
          like(kelas.tahunAjaran, `%${search}%`)
        )
      );
    }

    // Tahun ajaran filter
    if (tahunAjaran) {
      conditions.push(eq(kelas.tahunAjaran, tahunAjaran));
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(desc(kelas.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaKelas, tahunAjaran, waliKelasId, jumlahSiswa } = body;

    // Validate required fields
    if (!namaKelas || !tahunAjaran) {
      return NextResponse.json(
        { 
          error: 'namaKelas and tahunAjaran are required fields',
          code: 'MISSING_REQUIRED_FIELDS' 
        },
        { status: 400 }
      );
    }

    // Validate namaKelas is not empty
    if (namaKelas.trim().length === 0) {
      return NextResponse.json(
        { error: 'namaKelas cannot be empty', code: 'INVALID_NAMA_KELAS' },
        { status: 400 }
      );
    }

    // Validate tahunAjaran is not empty
    if (tahunAjaran.trim().length === 0) {
      return NextResponse.json(
        { error: 'tahunAjaran cannot be empty', code: 'INVALID_TAHUN_AJARAN' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData = {
      namaKelas: namaKelas.trim(),
      tahunAjaran: tahunAjaran.trim(),
      waliKelasId: waliKelasId ?? null,
      jumlahSiswa: jumlahSiswa ?? 0,
      createdAt: new Date().toISOString(),
    };

    const newKelas = await db.insert(kelas).values(insertData).returning();

    return NextResponse.json(newKelas[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(kelas)
      .where(eq(kelas.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Kelas not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { namaKelas, tahunAjaran, waliKelasId, jumlahSiswa } = body;

    // Build update object with only provided fields
    const updates = {};

    if (namaKelas !== undefined) {
      if (typeof namaKelas !== 'string' || namaKelas.trim().length === 0) {
        return NextResponse.json(
          { error: 'namaKelas must be a non-empty string', code: 'INVALID_NAMA_KELAS' },
          { status: 400 }
        );
      }
      updates.namaKelas = namaKelas.trim();
    }

    if (tahunAjaran !== undefined) {
      if (typeof tahunAjaran !== 'string' || tahunAjaran.trim().length === 0) {
        return NextResponse.json(
          { error: 'tahunAjaran must be a non-empty string', code: 'INVALID_TAHUN_AJARAN' },
          { status: 400 }
        );
      }
      updates.tahunAjaran = tahunAjaran.trim();
    }

    if (waliKelasId !== undefined) {
      updates.waliKelasId = waliKelasId;
    }

    if (jumlahSiswa !== undefined) {
      if (typeof jumlahSiswa !== 'number' || jumlahSiswa < 0) {
        return NextResponse.json(
          { error: 'jumlahSiswa must be a non-negative number', code: 'INVALID_JUMLAH_SISWA' },
          { status: 400 }
        );
      }
      updates.jumlahSiswa = jumlahSiswa;
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(kelas)
      .set(updates)
      .where(eq(kelas.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(kelas)
      .where(eq(kelas.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Kelas not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(kelas)
      .where(eq(kelas.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Kelas deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}