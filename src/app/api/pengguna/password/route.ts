import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pengguna } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, currentPassword, newPassword } = body;

    if (!id || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current user
    const user = await db.select()
      .from(pengguna)
      .where(eq(pengguna.id, id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Password saat ini salah' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.update(pengguna)
      .set({ password: hashedPassword })
      .where(eq(pengguna.id, id));

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Password PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
