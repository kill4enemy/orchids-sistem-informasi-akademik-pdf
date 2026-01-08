import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { guru } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single guru by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const result = await db
        .select()
        .from(guru)
        .where(eq(guru.id, parseInt(id)))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Guru not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List with search and pagination
    let query = db.select().from(guru);

    if (search) {
      const searchCondition = or(
        like(guru.nama, `%${search}%`),
        like(guru.nip, `%${search}%`),
        like(guru.mataPelajaran, `%${search}%`)
      );
      query = query.where(searchCondition);
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { penggunaId, nip, nama, mataPelajaran, noTelp } = body;

    // Validate required fields
    if (!nip || !nama || !mataPelajaran) {
      return NextResponse.json(
        {
          error: 'Required fields are missing: nip, nama, mataPelajaran',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate nip is not empty string
    if (nip.trim() === '') {
      return NextResponse.json(
        { error: 'NIP cannot be empty', code: 'INVALID_NIP' },
        { status: 400 }
      );
    }

    // Validate nama is not empty string
    if (nama.trim() === '') {
      return NextResponse.json(
        { error: 'Nama cannot be empty', code: 'INVALID_NAMA' },
        { status: 400 }
      );
    }

    // Validate mataPelajaran is not empty string
    if (mataPelajaran.trim() === '') {
      return NextResponse.json(
        { error: 'Mata pelajaran cannot be empty', code: 'INVALID_MATA_PELAJARAN' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      nip: nip.trim(),
      nama: nama.trim(),
      mataPelajaran: mataPelajaran.trim(),
      createdAt: new Date().toISOString(),
    };

    if (penggunaId !== undefined && penggunaId !== null) {
      insertData.penggunaId = penggunaId;
    }

    if (noTelp !== undefined && noTelp !== null && noTelp.trim() !== '') {
      insertData.noTelp = noTelp.trim();
    }

    const newGuru = await db.insert(guru).values(insertData).returning();

    return NextResponse.json(newGuru[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);

    // Handle unique constraint violation
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('UNIQUE constraint failed') && errorMessage.includes('nip')) {
      return NextResponse.json(
        { error: 'NIP already exists', code: 'DUPLICATE_NIP' },
        { status: 400 }
      );
    }

    if (errorMessage.includes('UNIQUE constraint failed') && errorMessage.includes('pengguna_id')) {
      return NextResponse.json(
        { error: 'Pengguna ID already assigned to another guru', code: 'DUPLICATE_PENGGUNA_ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if guru exists
    const existingGuru = await db
      .select()
      .from(guru)
      .where(eq(guru.id, parseInt(id)))
      .limit(1);

    if (existingGuru.length === 0) {
      return NextResponse.json(
        { error: 'Guru not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { penggunaId, nip, nama, mataPelajaran, noTelp } = body;

    // Prepare update data
    const updateData: any = {};

    if (penggunaId !== undefined) {
      updateData.penggunaId = penggunaId;
    }

    if (nip !== undefined) {
      if (nip.trim() === '') {
        return NextResponse.json(
          { error: 'NIP cannot be empty', code: 'INVALID_NIP' },
          { status: 400 }
        );
      }
      updateData.nip = nip.trim();
    }

    if (nama !== undefined) {
      if (nama.trim() === '') {
        return NextResponse.json(
          { error: 'Nama cannot be empty', code: 'INVALID_NAMA' },
          { status: 400 }
        );
      }
      updateData.nama = nama.trim();
    }

    if (mataPelajaran !== undefined) {
      if (mataPelajaran.trim() === '') {
        return NextResponse.json(
          { error: 'Mata pelajaran cannot be empty', code: 'INVALID_MATA_PELAJARAN' },
          { status: 400 }
        );
      }
      updateData.mataPelajaran = mataPelajaran.trim();
    }

    if (noTelp !== undefined) {
      updateData.noTelp = noTelp === null || noTelp.trim() === '' ? null : noTelp.trim();
    }

    const updatedGuru = await db
      .update(guru)
      .set(updateData)
      .where(eq(guru.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedGuru[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);

    // Handle unique constraint violation
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('UNIQUE constraint failed') && errorMessage.includes('nip')) {
      return NextResponse.json(
        { error: 'NIP already exists', code: 'DUPLICATE_NIP' },
        { status: 400 }
      );
    }

    if (errorMessage.includes('UNIQUE constraint failed') && errorMessage.includes('pengguna_id')) {
      return NextResponse.json(
        { error: 'Pengguna ID already assigned to another guru', code: 'DUPLICATE_PENGGUNA_ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if guru exists
    const existingGuru = await db
      .select()
      .from(guru)
      .where(eq(guru.id, parseInt(id)))
      .limit(1);

    if (existingGuru.length === 0) {
      return NextResponse.json(
        { error: 'Guru not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(guru)
      .where(eq(guru.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Guru deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}