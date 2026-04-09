import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

// GET - Get user details
export async function GET(
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
    const [userId, role] = decoded.split(':')

    // Check if role is admin
    if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        isVerified: true,
        isEmailVerified: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        // Include related data
        _count: {
          select: {
            tickets: true,
            purchases: true,
            sales: true,
            idVerifications: true,
            reports: true,
            withdrawRequests: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get wallet balance
    const wallet = await db.wallet.findUnique({
      where: { userId: user.id },
      select: {
        availableBalance: true,
        pendingBalance: true,
      },
    })

    return NextResponse.json({
      user: {
        ...user,
        wallet: wallet || { availableBalance: 0, pendingBalance: 0 },
        totalSales: user._count.tickets,
        totalPurchases: user._count.purchases,
        totalReports: user._count.reports,
        totalWithdrawRequests: user._count.withdrawRequests,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH - Update user
export async function PATCH(
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
    const { name, email, phone, address, role, isActive, isVerified, isEmailVerified } = body

    // Check if trying to update role (only SUPER_ADMIN can do this)
    if (role && requesterRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can change user roles' },
        { status: 403 }
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

    // Prevent SUPER_ADMIN from being modified by ADMIN
    if (existingUser.role === UserRole.SUPER_ADMIN && requesterRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Cannot modify Super Admin account' },
        { status: 403 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (isVerified !== undefined) updateData.isVerified = isVerified
    if (isEmailVerified !== undefined) updateData.isEmailVerified = isEmailVerified

    // Update user
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        isVerified: true,
        isEmailVerified: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(
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
    const [userId, role] = decoded.split(':')

    // Only SUPER_ADMIN can delete users
    if (role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can delete users' },
        { status: 403 }
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

    // Prevent deleting SUPER_ADMIN accounts
    if (existingUser.role === UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Cannot delete Super Admin account' },
        { status: 403 }
      )
    }

    // Prevent deleting yourself
    if (existingUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete user (cascade delete will handle related records)
    await db.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
