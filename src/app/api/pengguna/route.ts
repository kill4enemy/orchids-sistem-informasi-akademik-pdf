import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pengguna } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const username = searchParams.get('username');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single user by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const user = await db.select()
        .from(pengguna)
        .where(eq(pengguna.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(user[0], { status: 200 });
    }

    // Single user by username (for authentication lookup)
    if (username) {
      const user = await db.select()
        .from(pengguna)
        .where(eq(pengguna.username, username))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(user[0], { status: 200 });
    }

    // List with optional search and pagination
    let query = db.select().from(pengguna);

    if (search) {
      query = query.where(
        or(
          like(pengguna.username, `%${search}%`),
          like(pengguna.nama, `%${search}%`)
        )
      );
    }

    const users = await query
      .orderBy(desc(pengguna.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nama, foto } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (nama !== undefined) updateData.nama = nama;
    if (foto !== undefined) updateData.foto = foto;

    const result = await db.update(pengguna)
      .set(updateData)
      .where(eq(pengguna.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}