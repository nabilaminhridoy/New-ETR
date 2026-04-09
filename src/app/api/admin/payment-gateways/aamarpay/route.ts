import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/payment-gateways/aamarpay
 * Get Aamar Pay gateway configuration
 */
export async function GET() {
  try {
    const gateway = await db.paymentGateway.findUnique({
      where: { name: 'aamarpay' }
    })

    if (!gateway) {
      return NextResponse.json({
        gateway: {
          id: '',
          name: 'aamarpay',
          isEnabled: false,
          isSandbox: true,
          label: 'Aamar Pay',
          description: 'Pay securely using Aamar Pay payment gateway',
          logo: '',
          gatewayType: null,
          minAmount: 0,
          maxAmount: 999999,
          fixedDiscount: 0,
          percentageDiscount: 0,
          fixedCharge: 0,
          percentageCharge: 0,
          credentials: {
            ipnUrl: '',
            storeId: '',
            signatureKey: '',
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
        label: gateway.label || 'Aamar Pay',
        description: gateway.description || 'Pay securely using Aamar Pay payment gateway',
        logo: gateway.logo || '',
        gatewayType: gateway.gatewayType || null,
        minAmount: gateway.minAmount ?? 0,
        maxAmount: gateway.maxAmount ?? 999999,
        fixedDiscount: gateway.fixedDiscount ?? 0,
        percentageDiscount: gateway.percentageDiscount ?? 0,
        fixedCharge: gateway.fixedCharge ?? 0,
        percentageCharge: gateway.percentageCharge ?? 0,
        credentials: {
          ipnUrl: (credentials as any).ipnUrl || '',
          storeId: (credentials as any).storeId || '',
          signatureKey: (credentials as any).signatureKey || '',
        },
      }
    })
  } catch (error) {
    console.error('Error loading Aamar Pay config:', error)
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}

/**
 * POST /api/admin/payment-gateways/aamarpay
 * Save Aamar Pay gateway configuration
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
      if (!credentials?.ipnUrl || !credentials?.storeId || !credentials?.signatureKey) {
        return NextResponse.json({
          error: 'All credentials (IPN URL, Store ID, Signature Key) are required when enabling the gateway'
        }, { status: 400 })
      }
    }

    const gateway = await db.paymentGateway.upsert({
      where: { name: 'aamarpay' },
      update: {
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'Aamar Pay',
        description: description || 'Pay securely using Aamar Pay payment gateway',
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
        name: 'aamarpay',
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'Aamar Pay',
        description: description || 'Pay securely using Aamar Pay payment gateway',
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
    console.error('Error saving Aamar Pay config:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
