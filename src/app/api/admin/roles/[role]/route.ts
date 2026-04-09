import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

/**
 * GET /api/admin/roles/[role]
 * Get permissions for a specific role
 */
export async function GET(
  request: Request,
  { params }: { params: { role: string } }
) {
  try {
    const role = params.role as UserRole

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role',
        },
        { status: 400 }
      )
    }

    const rolePermissions = await db.rolePermission.findMany({
      where: { role },
      include: {
        permission: true,
      },
    })

    return NextResponse.json({
      success: true,
      role,
      permissions: rolePermissions.map((rp) => rp.permission),
    })
  } catch (error: any) {
    console.error('Error fetching role permissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch role permissions',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/roles/[role]
 * Assign permissions to a role
 * This will replace all existing permissions for the role
 */
export async function POST(
  request: Request,
  { params }: { params: { role: string } }
) {
  try {
    const body = await request.json()
    const { permissionIds } = body

    const role = params.role as UserRole

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role',
        },
        { status: 400 }
      )
    }

    // Validate permissionIds
    if (!Array.isArray(permissionIds)) {
      return NextResponse.json(
        {
          success: false,
          error: 'permissionIds must be an array',
        },
        { status: 400 }
      )
    }

    // Verify all permissions exist
    const permissions = await db.permission.findMany({
      where: { id: { in: permissionIds } },
    })

    if (permissions.length !== permissionIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'One or more permissions not found',
        },
        { status: 404 }
      )
    }

    // Delete existing role permissions
    await db.rolePermission.deleteMany({
      where: { role },
    })

    // Create new role permissions
    if (permissionIds.length > 0) {
      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId: string) => ({
          role,
          permissionId,
        })),
      })
    }

    // Return updated role permissions
    const updatedRolePermissions = await db.rolePermission.findMany({
      where: { role },
      include: {
        permission: true,
      },
    })

    return NextResponse.json({
      success: true,
      role,
      permissions: updatedRolePermissions.map((rp) => rp.permission),
      message: 'Role permissions updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating role permissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update role permissions',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/roles/[role]
 * Remove all permissions from a role
 */
export async function DELETE(
  request: Request,
  { params }: { params: { role: string } }
) {
  try {
    const role = params.role as UserRole

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role',
        },
        { status: 400 }
      )
    }

    // Delete all role permissions
    await db.rolePermission.deleteMany({
      where: { role },
    })

    return NextResponse.json({
      success: true,
      role,
      message: 'All permissions removed from role successfully',
    })
  } catch (error: any) {
    console.error('Error removing role permissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove role permissions',
      },
      { status: 500 }
    )
  }
}
