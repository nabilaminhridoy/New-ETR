import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const roleFilter = searchParams.get('role') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status === 'ACTIVE') {
      where.isActive = true
    } else if (status === 'BLOCKED') {
      where.isActive = false
    }

    if (roleFilter !== 'all') {
      where.role = roleFilter
    }

    // Get total count
    const total = await db.user.count({ where })

    // Get users with pagination
    const users = await db.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        isEmailVerified: true,
        profileImage: true,
        createdAt: true,
        // Include counts for sales and purchases
        _count: {
          select: {
            tickets: true,
            purchases: true,
            sales: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate wallet balance for each user
    const usersWithBalance = await Promise.all(
      users.map(async (user) => {
        const wallet = await db.wallet.findUnique({
          where: { userId: user.id },
          select: { availableBalance: true },
        })

        return {
          ...user,
          totalSales: user._count.tickets,
          totalPurchases: user._count.purchases,
          balance: wallet?.availableBalance || 0,
        }
      })
    )

    return NextResponse.json({
      users: usersWithBalance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
