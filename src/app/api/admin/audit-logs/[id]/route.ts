import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/admin/audit-logs/[id]
 * Get a single audit log by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auditLog = await db.auditLog.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
          },
        },
      },
    })

    if (!auditLog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Audit log not found',
        },
        { status: 404 }
      )
    }

    // Parse changes and metadata if they exist
    let parsedChanges = null
    let parsedMetadata = null

    try {
      parsedChanges = auditLog.changes ? JSON.parse(auditLog.changes) : null
    } catch (e) {
      parsedChanges = auditLog.changes
    }

    try {
      parsedMetadata = auditLog.metadata ? JSON.parse(auditLog.metadata) : null
    } catch (e) {
      parsedMetadata = auditLog.metadata
    }

    return NextResponse.json({
      success: true,
      auditLog: {
        ...auditLog,
        changes: parsedChanges,
        metadata: parsedMetadata,
      },
    })
  } catch (error: any) {
    console.error('Error fetching audit log:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch audit log',
      },
      { status: 500 }
    )
  }
}
