import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch admin profile
export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth token
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string | null = null;

    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');

      // Try to parse as JSON first (old user login format)
      try {
        const tokenData = JSON.parse(decoded);
        if (tokenData.userId) {
          userId = tokenData.userId;
        }
      } catch {
        // If not JSON, try colon-separated format (admin login format)
        const parts = decoded.split(':');
        userId = parts[0];
      }
    } catch (error) {
      console.log('Failed to decode token:', error);
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token format. Please log in again.' },
        { status: 401 }
      );
    }

    // Fetch user from database
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please log in again.' },
        { status: 404 }
      );
    }

    // Check if user is admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string | null = null;

    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');

      // Try to parse as JSON first (old user login format)
      try {
        const tokenData = JSON.parse(decoded);
        if (tokenData.userId) {
          userId = tokenData.userId;
        }
      } catch {
        // If not JSON, try colon-separated format (admin login format)
        const parts = decoded.split(':');
        userId = parts[0];
      }
    } catch (error) {
      console.log('Failed to decode token:', error);
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token format. Please log in again.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone } = body;

    // Validate inputs
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
