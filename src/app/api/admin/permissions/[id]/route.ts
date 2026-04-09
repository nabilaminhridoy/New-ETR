import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/admin/permissions/[id]
 * Get a single permission by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permission = await db.permission.findUnique({
      where: { id: params.id },
      include: {
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!permission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permission not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      permission,
    })
  } catch (error: any) {
    console.error('Error fetching permission:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch permission',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/permissions/[id]
 * Update a permission
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, category } = body

    // Check if permission exists
    const existingPermission = await db.permission.findUnique({
      where: { id: params.id },
    })

    if (!existingPermission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permission not found',
        },
        { status: 404 }
      )
    }

    // If name is being changed, check for duplicates
    if (name && name !== existingPermission.name) {
      const duplicatePermission = await db.permission.findUnique({
        where: { name },
      })

      if (duplicatePermission) {
        return NextResponse.json(
          {
            success: false,
            error: 'Permission with this name already exists',
          },
          { status: 400 }
        )
      }
    }

    // Update permission
    const permission = await db.permission.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
      },
    })

    return NextResponse.json({
      success: true,
      permission,
    })
  } catch (error: any) {
    console.error('Error updating permission:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update permission',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/permissions/[id]
 * Delete a permission
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if permission exists
    const existingPermission = await db.permission.findUnique({
      where: { id: params.id },
      include: {
        rolePermissions: true,
      },
    })

    if (!existingPermission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permission not found',
        },
        { status: 404 }
      )
    }

    // Check if permission is assigned to any roles
    if (existingPermission.rolePermissions.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete permission that is assigned to roles. Remove role assignments first.',
        },
        { status: 400 }
      )
    }

    // Delete permission
    await db.permission.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Permission deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting permission:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete permission',
      },
      { status: 500 }
    )
  }
}
