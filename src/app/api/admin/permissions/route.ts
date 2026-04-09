import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/admin/permissions
 * Get all permissions with optional filtering by category
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const permissions = await db.permission.findMany({
      where: category ? { category } : undefined,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      permissions,
    })
  } catch (error: any) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch permissions',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/permissions
 * Create a new permission
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, category } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and category are required',
        },
        { status: 400 }
      )
    }

    // Check if permission already exists
    const existingPermission = await db.permission.findUnique({
      where: { name },
    })

    if (existingPermission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permission with this name already exists',
        },
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
    })
  } catch (error: any) {
    console.error('Error creating permission:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create permission',
      },
      { status: 500 }
    )
  }
}
