import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET - Load UddoktaPay configuration
export async function GET() {
  try {
    const gateway = await db.paymentGateway.findUnique({
      where: { name: 'uddoktapay' }
    })

    if (!gateway) {
      return NextResponse.json({
        gateway: {
          id: '',
          name: 'uddoktapay',
          isEnabled: false,
          isSandbox: true,
          label: 'UddoktaPay',
          description: 'Pay using multiple payment methods via UddoktaPay',
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
            apiType: 'checkout-v2',
            redirectUrl: '',
            cancelUrl: '',
            webhookUrl: '',
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
        label: gateway.label || (credentials as any).label || 'UddoktaPay',
        description: gateway.description || (credentials as any).description || 'Pay using multiple payment methods via UddoktaPay',
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
          apiType: (credentials as any).apiType || 'checkout-v2',
          redirectUrl: (credentials as any).redirectUrl || '',
          cancelUrl: (credentials as any).cancelUrl || '',
          webhookUrl: (credentials as any).webhookUrl || '',
        },
      }
    })
  } catch (error) {
    console.error('Error loading UddoktaPay config:', error)
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}

// POST - Save UddoktaPay configuration
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

    // Save to PaymentGateway table
    const gateway = await db.paymentGateway.upsert({
      where: { name: 'uddoktapay' },
      update: {
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'UddoktaPay',
        description: description || 'Pay using multiple payment methods via UddoktaPay',
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
        name: 'uddoktapay',
        isEnabled: isEnabled || false,
        isSandbox: isSandbox !== false,
        label: label || 'UddoktaPay',
        description: description || 'Pay using multiple payment methods via UddoktaPay',
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
    console.error('Error saving UddoktaPay config:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
