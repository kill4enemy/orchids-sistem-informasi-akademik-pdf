import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { murid } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const nisn = searchParams.get('nisn');
    const kelasId = searchParams.get('kelasId');
    const jenisKelamin = searchParams.get('jenisKelamin');
    const search = searchParams.get('search');
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

      const result = await db
        .select()
        .from(murid)
        .where(eq(murid.id, parseInt(id)))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Murid not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // Single record by NISN
    if (nisn) {
      const result = await db
        .select()
        .from(murid)
        .where(eq(murid.nisn, nisn))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Murid not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(murid);
    const conditions = [];

    // Filter by kelasId
    if (kelasId) {
      if (isNaN(parseInt(kelasId))) {
        return NextResponse.json(
          { error: 'Valid kelasId is required', code: 'INVALID_KELAS_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(murid.kelasId, parseInt(kelasId)));
    }

    // Filter by jenisKelamin
    if (jenisKelamin) {
      if (jenisKelamin !== 'L' && jenisKelamin !== 'P') {
        return NextResponse.json(
          { error: 'jenisKelamin must be either "L" or "P"', code: 'INVALID_GENDER' },
          { status: 400 }
        );
      }
      conditions.push(eq(murid.jenisKelamin, jenisKelamin));
    }

    // Search across multiple fields
    if (search) {
      const searchCondition = or(
        like(murid.nama, `%${search}%`),
        like(murid.nisn, `%${search}%`),
        like(murid.namaOrangTua, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(murid.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { nisn, nama, jenisKelamin, tanggalLahir, alamat, kelasId, namaOrangTua, noTelpOrangTua } = body;

    // Validate required fields
    if (!nisn || !nama || !jenisKelamin) {
      return NextResponse.json(
        { 
          error: 'Required fields are missing: nisn, nama, jenisKelamin',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate nisn is not empty string
    if (typeof nisn !== 'string' || nisn.trim() === '') {
      return NextResponse.json(
        { error: 'nisn must be a non-empty string', code: 'INVALID_NISN' },
        { status: 400 }
      );
    }

    // Validate nama is not empty string
    if (typeof nama !== 'string' || nama.trim() === '') {
      return NextResponse.json(
        { error: 'nama must be a non-empty string', code: 'INVALID_NAMA' },
        { status: 400 }
      );
    }

    // Validate jenisKelamin
    if (jenisKelamin !== 'L' && jenisKelamin !== 'P') {
      return NextResponse.json(
        { 
          error: 'jenisKelamin must be either "L" or "P"',
          code: 'INVALID_GENDER'
        },
        { status: 400 }
      );
    }

    // Validate kelasId if provided
    if (kelasId !== undefined && kelasId !== null && isNaN(parseInt(kelasId))) {
      return NextResponse.json(
        { error: 'kelasId must be a valid integer', code: 'INVALID_KELAS_ID' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      nisn: nisn.trim(),
      nama: nama.trim(),
      jenisKelamin,
      createdAt: new Date().toISOString(),
    };

    if (tanggalLahir) insertData.tanggalLahir = tanggalLahir;
    if (alamat) insertData.alamat = alamat.trim();
    if (kelasId) insertData.kelasId = parseInt(kelasId);
    if (namaOrangTua) insertData.namaOrangTua = namaOrangTua.trim();
    if (noTelpOrangTua) insertData.noTelpOrangTua = noTelpOrangTua.trim();

    // Insert into database
    const newMurid = await db
      .insert(murid)
      .values(insertData)
      .returning();

    return NextResponse.json(newMurid[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    // Handle unique constraint violation for nisn
    if ((error as Error).message.includes('UNIQUE constraint failed: murid.nisn')) {
      return NextResponse.json(
        { 
          error: 'NISN already exists',
          code: 'NISN_ALREADY_EXISTS'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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
      .from(murid)
      .where(eq(murid.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Murid not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { nisn, nama, jenisKelamin, tanggalLahir, alamat, kelasId, namaOrangTua, noTelpOrangTua } = body;

    // Validate jenisKelamin if provided
    if (jenisKelamin && jenisKelamin !== 'L' && jenisKelamin !== 'P') {
      return NextResponse.json(
        { 
          error: 'jenisKelamin must be either "L" or "P"',
          code: 'INVALID_GENDER'
        },
        { status: 400 }
      );
    }

    // Validate kelasId if provided
    if (kelasId !== undefined && kelasId !== null && isNaN(parseInt(kelasId))) {
      return NextResponse.json(
        { error: 'kelasId must be a valid integer', code: 'INVALID_KELAS_ID' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (nisn !== undefined) updateData.nisn = nisn.trim();
    if (nama !== undefined) updateData.nama = nama.trim();
    if (jenisKelamin !== undefined) updateData.jenisKelamin = jenisKelamin;
    if (tanggalLahir !== undefined) updateData.tanggalLahir = tanggalLahir;
    if (alamat !== undefined) updateData.alamat = alamat ? alamat.trim() : alamat;
    if (kelasId !== undefined) updateData.kelasId = kelasId ? parseInt(kelasId) : kelasId;
    if (namaOrangTua !== undefined) updateData.namaOrangTua = namaOrangTua ? namaOrangTua.trim() : namaOrangTua;
    if (noTelpOrangTua !== undefined) updateData.noTelpOrangTua = noTelpOrangTua ? noTelpOrangTua.trim() : noTelpOrangTua;

    // Update record
    const updated = await db
      .update(murid)
      .set(updateData)
      .where(eq(murid.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);

    // Handle unique constraint violation for nisn
    if ((error as Error).message.includes('UNIQUE constraint failed: murid.nisn')) {
      return NextResponse.json(
        { 
          error: 'NISN already exists',
          code: 'NISN_ALREADY_EXISTS'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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
      .from(murid)
      .where(eq(murid.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Murid not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete record
    const deleted = await db
      .delete(murid)
      .where(eq(murid.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Murid deleted successfully',
        deleted: deleted[0]
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