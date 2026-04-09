import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RefundStatus } from '@prisma/client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/refund-requests
 * List all refund requests with filters
 * Query params:
 * - status: filter by status (PENDING, APPROVED, REFUNDED, REJECTED, ALL)
 * - page: page number (default: 1)
 * - limit: items per page (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const statusFilter = searchParams.get('status') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (statusFilter !== 'ALL') {
      where.status = statusFilter
    }

    // Get total count
    const totalCount = await db.refundRequest.count({ where })

    // Get refund requests with relations
    const refundRequests = await db.refundRequest.findMany({
      where,
      include: {
        transaction: {
          include: {
            ticket: true,
            buyer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        processor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: refundRequests,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching refund requests:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch refund requests',
      },
      { status: 500 }
    )
  }
}
