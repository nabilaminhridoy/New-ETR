import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RefundStatus } from '@prisma/client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/refund-requests/[id]
 * Update a refund request status
 * Body: { status: 'PENDING' | 'APPROVED' | 'REFUNDED' | 'REJECTED', adminNotes?: string, rejectionReason?: string, processedBy: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, adminNotes, rejectionReason, processedBy } = body

    // Validate status
    if (!status || !Object.values(RefundStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status',
        },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (adminNotes) {
      updateData.adminNotes = adminNotes
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    if (processedBy) {
      updateData.processedBy = processedBy
    }

    // Set timestamps based on status
    if (status === RefundStatus.APPROVED && !updateData.approvedAt) {
      updateData.approvedAt = new Date()
    }

    if (status === RefundStatus.REFUNDED && !updateData.refundedAt) {
      updateData.refundedAt = new Date()
    }

    // Update refund request
    const refundRequest = await db.refundRequest.update({
      where: { id },
      data: updateData,
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
    })

    return NextResponse.json({
      success: true,
      data: refundRequest,
    })
  } catch (error) {
    console.error('Error updating refund request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update refund request',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/refund-requests/[id]
 * Delete a refund request
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete refund request
    await db.refundRequest.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Refund request deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting refund request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete refund request',
      },
      { status: 500 }
    )
  }
}
