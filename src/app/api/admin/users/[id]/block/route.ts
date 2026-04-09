import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

// POST - Block or unblock user
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

    // Check if role is admin
    if (requesterRole !== UserRole.ADMIN && requesterRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { block } = body

    // Validate block parameter
    if (typeof block !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid block parameter' },
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

    // Prevent blocking SUPER_ADMIN accounts (only SUPER_ADMIN can block other admins)
    if (existingUser.role === UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Cannot block Super Admin account' },
        { status: 403 }
      )
    }

    // Prevent blocking yourself
    if (existingUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot block your own account' },
        { status: 400 }
      )
    }

    // ADMIN cannot block other ADMINs (only SUPER_ADMIN can)
    if (existingUser.role === UserRole.ADMIN && requesterRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can block Admin accounts' },
        { status: 403 }
      )
    }

    // Update user status
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: { isActive: !block },
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
      message: block ? 'User blocked successfully' : 'User unblocked successfully',
    })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}
