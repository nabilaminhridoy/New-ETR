import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

// POST - Change user role
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Decode token to get user ID and role
    const decoded = Buffer.from(sessionToken, 'base64').toString()
    const [userId, requesterRole] = decoded.split(':')

    // Only SUPER_ADMIN can change user roles
    if (requesterRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can change user roles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent modifying SUPER_ADMIN role of other SUPER_ADMINs
    if (existingUser.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Cannot change Super Admin role' },
        { status: 403 }
      )
    }

    // Prevent changing your own role
    if (existingUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      )
    }

    // Update user role
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User role changed to ${role}`,
    })
  } catch (error) {
    console.error('Error changing user role:', error)
    return NextResponse.json(
      { error: 'Failed to change user role' },
      { status: 500 }
    )
  }
}
