import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/database/tables
 * Get all database tables
 */
export async function GET() {
  try {
    // Query to get all table names from the database
    const result = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name ASC
    ` as Array<{ table_name: string }>

    // Get row counts for each table
    const tablesWithCounts = await Promise.all(
      result.map(async (table) => {
        const countQuery = `SELECT COUNT(*) as count FROM public."${table.table_name}"`
        const countResult = await db.$queryRawUnsafe(countQuery) as Array<{ count: bigint }>
        
        const count = countResult.length > 0 
          ? Number(countResult[0].count) 
          : 0

        return {
          name: table.table_name,
          rowCount: count,
        }
      })
    )

    return NextResponse.json({ 
      success: true,
      tables: tablesWithCounts 
    })
  } catch (error) {
    console.error('Error fetching database tables:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch database tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
