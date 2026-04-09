import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

// GET - Get permissions for a specific role
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const roleName = searchParams.get('role') as UserRole | null

    if (!roleName || !Object.values(UserRole).includes(roleName)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Get permissions for the role
    const rolePermissions = await db.rolePermission.findMany({
      where: { role: roleName },
      include: {
        permission: true,
      },
    })

    return NextResponse.json({
      role: roleName,
      permissions: rolePermissions.map((rp) => rp.permission),
    })
  } catch (error) {
    console.error('Error fetching role permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch role permissions' },
      { status: 500 }
    )
  }
}

// POST - Grant permission to a role
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

    // Only SUPER_ADMIN can manage permissions
    if (role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can manage permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { roleName, permissionId } = body

    // Validate role
    if (!roleName || !Object.values(UserRole).includes(roleName)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if permission exists
    const permission = await db.permission.findUnique({
      where: { id: permissionId },
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Check if role already has this permission
    const existing = await db.rolePermission.findUnique({
      where: {
        role_permissionId: {
          role: roleName as UserRole,
          permissionId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Role already has this permission' },
        { status: 400 }
      )
    }

    // Grant permission to role
    const rolePermission = await db.rolePermission.create({
      data: {
        role: roleName as UserRole,
        permissionId,
      },
      include: {
        permission: true,
      },
    })

    return NextResponse.json({
      success: true,
      rolePermission,
      message: `Permission granted to ${roleName}`,
    })
  } catch (error) {
    console.error('Error granting permission:', error)
    return NextResponse.json(
      { error: 'Failed to grant permission' },
      { status: 500 }
    )
  }
}

// DELETE - Revoke permission from a role
export async function DELETE(request: NextRequest) {
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

    // Only SUPER_ADMIN can manage permissions
    if (role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can manage permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roleName = searchParams.get('role') as UserRole | null
    const permissionId = searchParams.get('permissionId') as string | null

    // Validate role
    if (!roleName || !Object.values(UserRole).includes(roleName)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    if (!permissionId) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      )
    }

    // Revoke permission from role
    await db.rolePermission.deleteMany({
      where: {
        role: roleName as UserRole,
        permissionId,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Permission revoked from ${roleName}`,
    })
  } catch (error) {
    console.error('Error revoking permission:', error)
    return NextResponse.json(
      { error: 'Failed to revoke permission' },
      { status: 500 }
    )
  }
}
