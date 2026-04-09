import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/payment-gateways/upay
 * Get Upay gateway configuration
 */
export async function GET() {
  try {
    const gateway = await db.paymentGateway.findUnique({
      where: { name: 'upay' }
    })

    if (!gateway) {
      return NextResponse.json({
        gateway: {
          id: '',
          name: 'upay',
          isEnabled: false,
          isSandbox: true,
          label: 'Upay',
          description: 'Pay securely using Upay mobile wallet',
          logo: '',
          gatewayType: null,
          minAmount: 0,
          maxAmount: 999999,
          fixedDiscount: 0,
          percentageDiscount: 0,
          fixedCharge: 0,
          percentageCharge: 0,
          credentials: {
            merchantId: '',
            merchantKey: '',
            merchantName: '',
            merchantCode: '',
            merchantCity: 'Dhaka',
            merchantMobile: '',
            merchantCountryCode: 'BD',
            merchantCategoryCode: '',
            transactionCurrencyCode: 'BDT',
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
        label: gateway.label || (credentials as any).label || 'Upay',
        description: gateway.description || (credentials as any).description || 'Pay securely using Upay mobile wallet',
        logo: gateway.logo || '',
        gatewayType: gateway.gatewayType || null,
        minAmount: gateway.minAmount ?? 0,
        maxAmount: gateway.maxAmount ?? 999999,
        fixedDiscount: gateway.fixedDiscount ?? 0,
        percentageDiscount: gateway.percentageDiscount ?? 0,
        fixedCharge: gateway.fixedCharge ?? 0,
        percentageCharge: gateway.percentageCharge ?? 0,
        credentials: {
          merchantId: (credentials as any).merchantId || '',
          merchantKey: (credentials as any).merchantKey || '',
          merchantName: (credentials as any).merchantName || '',
          merchantCode: (credentials as any).merchantCode || '',
          merchantCity: (credentials as any).merchantCity || 'Dhaka',
          merchantMobile: (credentials as any).merchantMobile || '',
          merchantCountryCode: (credentials as any).merchantCountryCode || 'BD',
          merchantCategoryCode: (credentials as any).merchantCategoryCode || '',
          transactionCurrencyCode: (credentials as any).transactionCurrencyCode || 'BDT',
        },
      }
    })
  } catch (error) {
    console.error('Error loading Upay config:', error)
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}

/**
 * POST /api/admin/payment-gateways/upay
 * Save Upay gateway configuration
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

    // Validate required credentials when enabling
    if (isEnabled) {
      if (!credentials?.merchantId || !credentials?.merchantKey) {
        return NextResponse.json({
          error: 'Merchant ID and Merchant Key are required when enabling the gateway'
        }, { status: 400 })
      }
      if (!credentials?.merchantCode) {
        return NextResponse.json({
          error: 'Merchant Code is required when enabling the gateway'
        }, { status: 400 })
      }
      if (!credentials?.merchantMobile) {
        return NextResponse.json({
          error: 'Merchant Mobile is required when enabling the gateway'
        }, { status: 400 })
      }
    }

    const gateway = await db.paymentGateway.upsert({
      where: { name: 'upay' },
      update: {
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'Upay',
        description: description || 'Pay securely using Upay mobile wallet',
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
        name: 'upay',
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'Upay',
        description: description || 'Pay securely using Upay mobile wallet',
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
    console.error('Error saving Upay config:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
