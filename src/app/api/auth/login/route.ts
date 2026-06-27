import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, createToken, initializeDefaultAdmin } from '@/lib/auth';
import { createRateLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }); // 5 attempts per 15 min

export async function POST(request: NextRequest) {
  try {
    const { success } = loginLimiter.check(request);
    if (!success) {
      return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
    }

    await initializeDefaultAdmin();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const user = await verifyUser(username, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createToken(user);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (err) {
    logger.error('api/auth/login', 'POST failed', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
