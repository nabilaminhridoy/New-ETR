import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/database/tables/[tableName]/data
 * Get table data with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> }
) {
  try {
    const { tableName } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const sortColumn = searchParams.get('sortColumn') || ''
    const sortOrder = searchParams.get('sortOrder') || 'ASC'

    // Sanitize table name to prevent SQL injection
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      return NextResponse.json({ 
        error: 'Invalid table name' 
      }, { status: 400 })
    }

    // Get column names
    const columnsResult = await db.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
      ORDER BY ordinal_position ASC
    ` as Array<{ column_name: string }>

    const columnNames = columnsResult.map(c => c.column_name)

    if (columnNames.length === 0) {
      return NextResponse.json({ 
        error: 'Table not found or has no columns' 
      }, { status: 404 })
    }

    // Build query dynamically using template literals
    const quotedTableName = `"${tableName}"`
    const quotedColumns = columnNames.map(col => `"${col}"`).join(', ')
    
    let query = `SELECT ${quotedColumns} FROM public.${quotedTableName}`
    let countQuery = `SELECT COUNT(*) as count FROM public.${quotedTableName}`

    // Add search filter
    if (search) {
      const searchConditions = columnNames.map(col => `"${col}"::text ILIKE '%${search}%'`).join(' OR ')
      query += ` WHERE ${searchConditions}`
      countQuery += ` WHERE ${searchConditions}`
    }

    // Add sorting
    if (sortColumn && columnNames.includes(sortColumn)) {
      query += ` ORDER BY "${sortColumn}" ${sortOrder.toUpperCase()}`
    } else {
      // Default sort by first column
      query += ` ORDER BY "${columnNames[0]}" ASC`
    }

    // Add pagination
    query += ` LIMIT ${limit} OFFSET ${offset}`

    // Get total count
    const countResult = await db.$queryRawUnsafe(countQuery) as Array<{ count: bigint }>
    const total = countResult.length > 0 
      ? Number(countResult[0].count) 
      : 0

    // Get data
    const data = await db.$queryRawUnsafe(query)

    return NextResponse.json({ 
      success: true,
      data: {
        tableName,
        columns: columnNames,
        rows: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    })
  } catch (error) {
    console.error('Error fetching table data:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch table data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
