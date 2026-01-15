import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pengguna } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password diperlukan' }, { status: 400 });
    }

    // Find user
    const user = await db.select()
      .from(pengguna)
      .where(eq(pengguna.username, username))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user[0];
    
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    console.error('Login POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
