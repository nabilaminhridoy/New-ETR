import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

// POST - Create a new permission
export async function POST(request: NextRequest) {
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

    // Only SUPER_ADMIN can create permissions
    if (role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can create permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, category } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Check if permission already exists
    const existing = await db.permission.findUnique({
      where: { name },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Permission already exists' },
        { status: 400 }
      )
    }

    // Create permission
    const permission = await db.permission.create({
      data: {
        name,
        description,
        category,
      },
    })

    return NextResponse.json({
      success: true,
      permission,
      message: 'Permission created successfully',
    })
  } catch (error) {
    console.error('Error creating permission:', error)
    return NextResponse.json(
      { error: 'Failed to create permission' },
      { status: 500 }
    )
  }
}
