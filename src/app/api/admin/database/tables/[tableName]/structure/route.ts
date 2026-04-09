import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/database/tables/[tableName]/structure
 * Get table structure (columns, types, etc.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> }
) {
  try {
    const { tableName } = await params

    // Sanitize table name to prevent SQL injection
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      return NextResponse.json({ 
        error: 'Invalid table name' 
      }, { status: 400 })
    }

    // Query to get column information using template literal
    const columns = await db.$queryRaw`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
      ORDER BY ordinal_position ASC
    ` as Array<any>

    // Get primary key information
    const primaryKeys = await db.$queryRaw`
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name = ${tableName}
    ` as Array<{ column_name: string }>

    // Get foreign key information
    const foreignKeys = await db.$queryRaw`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name = ${tableName}
    ` as Array<any>

    // Get index information
    const indexes = await db.$queryRaw`
      SELECT
        i.relname as index_name,
        a.attname as column_name,
        am.amname as index_type
      FROM pg_class t
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_am am ON i.relam = am.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      WHERE t.relname = ${tableName}
      AND NOT ix.indisprimary
      ORDER BY i.relname, a.attnum
    ` as Array<any>

    const primaryKeyColumns = primaryKeys.map(pk => pk.column_name)

    const formattedColumns = columns.map(col => ({
      name: col.column_name,
      type: col.data_type,
      nullable: col.is_nullable === 'YES',
      default: col.column_default,
      maxLength: col.character_maximum_length,
      precision: col.numeric_precision,
      scale: col.numeric_scale,
      isPrimaryKey: primaryKeyColumns.includes(col.column_name),
      position: col.ordinal_position,
    }))

    return NextResponse.json({ 
      success: true,
      table: {
        name: tableName,
        columns: formattedColumns,
        primaryKeys: primaryKeyColumns,
        foreignKeys: foreignKeys,
        indexes: indexes,
      }
    })
  } catch (error) {
    console.error('Error fetching table structure:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch table structure',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
