import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

/**
 * GET /api/admin/roles
 * Get all roles with their permissions
 */
export async function GET(request: Request) {
  try {
    const roles = await Promise.all(
      Object.values(UserRole).map(async (role) => {
        const rolePermissions = await db.rolePermission.findMany({
          where: { role },
          include: {
            permission: true,
          },
        })

        return {
          role,
          permissions: rolePermissions.map((rp) => rp.permission),
          permissionCount: rolePermissions.length,
        }
      })
    )

    return NextResponse.json({
      success: true,
      roles,
    })
  } catch (error: any) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch roles',
      },
      { status: 500 }
    )
  }
}
