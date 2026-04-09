import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/payment-gateways/zinipay
 * Get ZiniPay gateway configuration
 */
export async function GET() {
  try {
    const gateway = await db.paymentGateway.findUnique({
      where: { name: 'zinipay' }
    })

    if (!gateway) {
      return NextResponse.json({
        gateway: {
          id: '',
          name: 'zinipay',
          isEnabled: false,
          isSandbox: true,
          label: 'ZiniPay',
          description: 'Pay securely using ZiniPay payment gateway',
          logo: '',
          gatewayType: null,
          minAmount: 0,
          maxAmount: 999999,
          fixedDiscount: 0,
          percentageDiscount: 0,
          fixedCharge: 0,
          percentageCharge: 0,
          credentials: {
            apiKey: '',
            baseUrl: '',
          },
        }
      })
    }

    // Parse credentials
    let credentials = {}
    if (gateway.credentials) {
      try {
        credentials = JSON.parse(gateway.credentials)
      } catch (e) {
        credentials = {}
      }
    }

    return NextResponse.json({
      gateway: {
        id: gateway.id,
        name: gateway.name,
        isEnabled: gateway.isEnabled,
        isSandbox: gateway.isSandbox,
        label: gateway.label || 'ZiniPay',
        description: gateway.description || 'Pay securely using ZiniPay payment gateway',
        logo: gateway.logo || '',
        gatewayType: gateway.gatewayType || null,
        minAmount: gateway.minAmount ?? 0,
        maxAmount: gateway.maxAmount ?? 999999,
        fixedDiscount: gateway.fixedDiscount ?? 0,
        percentageDiscount: gateway.percentageDiscount ?? 0,
        fixedCharge: gateway.fixedCharge ?? 0,
        percentageCharge: gateway.percentageCharge ?? 0,
        credentials: {
          apiKey: (credentials as any).apiKey || '',
          baseUrl: (credentials as any).baseUrl || '',
        },
      }
    })
  } catch (error) {
    console.error('Error loading ZiniPay config:', error)
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}

/**
 * POST /api/admin/payment-gateways/zinipay
 * Save ZiniPay gateway configuration
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      isEnabled,
      isSandbox,
      label,
      description,
      logo,
      minAmount,
      maxAmount,
      fixedDiscount,
      percentageDiscount,
      fixedCharge,
      percentageCharge,
      credentials
    } = data

    // Validate required fields when enabling
    if (isEnabled) {
      if (!credentials?.apiKey || !credentials?.baseUrl) {
        return NextResponse.json({
          error: 'API Key and Base URL are required when enabling the gateway'
        }, { status: 400 })
      }
    }

    const gateway = await db.paymentGateway.upsert({
      where: { name: 'zinipay' },
      update: {
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'ZiniPay',
        description: description || 'Pay securely using ZiniPay payment gateway',
        logo: logo || '',
        minAmount: minAmount ?? 0,
        maxAmount: maxAmount ?? 999999,
        fixedDiscount: fixedDiscount ?? 0,
        percentageDiscount: percentageDiscount ?? 0,
        fixedCharge: fixedCharge ?? 0,
        percentageCharge: percentageCharge ?? 0,
        credentials: JSON.stringify(credentials),
      },
      create: {
        name: 'zinipay',
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'ZiniPay',
        description: description || 'Pay securely using ZiniPay payment gateway',
        logo: logo || '',
        minAmount: minAmount ?? 0,
        maxAmount: maxAmount ?? 999999,
        fixedDiscount: fixedDiscount ?? 0,
        percentageDiscount: percentageDiscount ?? 0,
        fixedCharge: fixedCharge ?? 0,
        percentageCharge: percentageCharge ?? 0,
        credentials: JSON.stringify(credentials),
      },
    })

    return NextResponse.json({
      success: true,
      gateway: {
        id: gateway.id,
        name: gateway.name,
        isEnabled: gateway.isEnabled,
        isSandbox: gateway.isSandbox,
      }
    })
  } catch (error) {
    console.error('Error saving ZiniPay config:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
