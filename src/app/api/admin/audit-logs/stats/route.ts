import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

// GET - Get audit log statistics
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Decode token to get user ID and role
    const decoded = Buffer.from(sessionToken, 'base64').toString()
    const [userId, role] = decoded.split(':')

    // Check if role is admin
    if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total logs in period
    const totalLogs = await db.auditLog.count({
      where: {
        createdAt: { gte: startDate },
      },
    })

    // Get success/failure counts
    const successCount = await db.auditLog.count({
      where: {
        createdAt: { gte: startDate },
        status: 'success',
      },
    })

    const failureCount = await db.auditLog.count({
      where: {
        createdAt: { gte: startDate },
        status: 'failure',
      },
    })

    // Get logs by action type
    const logsByAction = await db.auditLog.groupBy({
      by: ['action'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: true,
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
      take: 10,
    })

    // Get logs by entity type
    const logsByEntity = await db.auditLog.groupBy({
      by: ['entityType'],
      where: {
        createdAt: { gte: startDate },
        entityType: { not: null },
      },
      _count: true,
      orderBy: {
        _count: {
          entityType: 'desc',
        },
      },
      take: 10,
    })

    // Get logs by user (top 10 most active)
    const logsByUser = await db.auditLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: true,
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 10,
    })

    // Get user details for top users
    const userIds = logsByUser.map((log) => log.userId)
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    // Combine user data with log counts
    const topUsers = logsByUser.map((log) => {
      const user = users.find((u) => u.id === log.userId)
      return {
        ...log,
        user,
      }
    })

    // Get daily logs for chart
    const dailyLogs = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayCount = await db.auditLog.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      })

      dailyLogs.push({
        date: dayStart.toISOString().split('T')[0],
        count: dayCount,
      })
    }

    return NextResponse.json({
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      summary: {
        total: totalLogs,
        success: successCount,
        failure: failureCount,
        successRate: totalLogs > 0 ? (successCount / totalLogs * 100).toFixed(2) : 0,
      },
      byAction: logsByAction.map((log) => ({
        action: log.action,
        count: log._count,
      })),
      byEntity: logsByEntity.map((log) => ({
        entityType: log.entityType,
        count: log._count,
      })),
      topUsers,
      dailyLogs,
    })
  } catch (error) {
    console.error('Error fetching audit log stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit log stats' },
      { status: 500 }
    )
  }
}
