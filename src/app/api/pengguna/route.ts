import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pengguna, guru, murid } from '@/db/schema';
import { eq, like, or, desc, and, ne } from 'drizzle-orm';

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
    const { id, nama, username, foto } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await db.select()
        .from(pengguna)
        .where(and(eq(pengguna.username, username), ne(pengguna.id, id)))
        .limit(1);
      
      if (existingUser.length > 0) {
        return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (nama !== undefined) updateData.nama = nama;
    if (username !== undefined) updateData.username = username;
    if (foto !== undefined) updateData.foto = foto;

    // Use transaction to update both pengguna and guru/murid if needed
    const result = await db.transaction(async (tx) => {
      const [updatedUser] = await tx.update(pengguna)
        .set(updateData)
        .where(eq(pengguna.id, id))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Update related records if name changed
      if (nama !== undefined) {
        if (updatedUser.role === 'guru') {
          await tx.update(guru)
            .set({ nama })
            .where(eq(guru.penggunaId, id));
        } else if (updatedUser.role === 'murid') {
          await tx.update(murid)
            .set({ nama })
            .where(eq(murid.penggunaId, id));
        }
      }

      return updatedUser;
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
