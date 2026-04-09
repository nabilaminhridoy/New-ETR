import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch reCAPTCHA settings
export async function GET() {
  try {
    const settings = await db.systemSetting.findMany({
      where: {
        key: {
          in: [
            'recaptcha_v2_enabled',
            'recaptcha_v2_site_key',
            'recaptcha_v2_secret_key',
            'recaptcha_v3_enabled',
            'recaptcha_v3_site_key',
            'recaptcha_v3_secret_key',
            'recaptcha_v3_min_score',
            'cloudflare_enabled',
            'cloudflare_site_key',
            'cloudflare_secret_key',
            'hcaptcha_enabled',
            'hcaptcha_site_key',
            'hcaptcha_secret_key',
          ]
        }
      }
    })

    // Default values
    const recaptchaSettings: Record<string, any> = {
      recaptchaV2: {
        enabled: false,
        siteKey: '',
        secretKey: '',
      },
      recaptchaV3: {
        enabled: false,
        siteKey: '',
        secretKey: '',
        minScore: '0.5',
      },
      cloudflare: {
        enabled: false,
        siteKey: '',
        secretKey: '',
      },
      hcaptcha: {
        enabled: false,
        siteKey: '',
        secretKey: '',
      },
    }

    settings.forEach((setting) => {
      switch (setting.key) {
        case 'recaptcha_v2_enabled':
          recaptchaSettings.recaptchaV2.enabled = setting.value === 'true'
          break
        case 'recaptcha_v2_site_key':
          recaptchaSettings.recaptchaV2.siteKey = setting.value
          break
        case 'recaptcha_v2_secret_key':
          recaptchaSettings.recaptchaV2.secretKey = setting.value
          break
        case 'recaptcha_v3_enabled':
          recaptchaSettings.recaptchaV3.enabled = setting.value === 'true'
          break
        case 'recaptcha_v3_site_key':
          recaptchaSettings.recaptchaV3.siteKey = setting.value
          break
        case 'recaptcha_v3_secret_key':
          recaptchaSettings.recaptchaV3.secretKey = setting.value
          break
        case 'recaptcha_v3_min_score':
          recaptchaSettings.recaptchaV3.minScore = setting.value
          break
        case 'cloudflare_enabled':
          recaptchaSettings.cloudflare.enabled = setting.value === 'true'
          break
        case 'cloudflare_site_key':
          recaptchaSettings.cloudflare.siteKey = setting.value
          break
        case 'cloudflare_secret_key':
          recaptchaSettings.cloudflare.secretKey = setting.value
          break
        case 'hcaptcha_enabled':
          recaptchaSettings.hcaptcha.enabled = setting.value === 'true'
          break
        case 'hcaptcha_site_key':
          recaptchaSettings.hcaptcha.siteKey = setting.value
          break
        case 'hcaptcha_secret_key':
          recaptchaSettings.hcaptcha.secretKey = setting.value
          break
      }
    })

    return NextResponse.json({ settings: recaptchaSettings })
  } catch (error) {
    console.error('Error fetching reCAPTCHA settings:', error)
    return NextResponse.json({ error: 'Failed to fetch reCAPTCHA settings' }, { status: 500 })
  }
}

// POST - Save reCAPTCHA settings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const settingsMap: Record<string, string> = {
      recaptchaV2Enabled: 'recaptcha_v2_enabled',
      recaptchaV2SiteKey: 'recaptcha_v2_site_key',
      recaptchaV2SecretKey: 'recaptcha_v2_secret_key',
      recaptchaV3Enabled: 'recaptcha_v3_enabled',
      recaptchaV3SiteKey: 'recaptcha_v3_site_key',
      recaptchaV3SecretKey: 'recaptcha_v3_secret_key',
      recaptchaV3MinScore: 'recaptcha_v3_min_score',
      cloudflareEnabled: 'cloudflare_enabled',
      cloudflareSiteKey: 'cloudflare_site_key',
      cloudflareSecretKey: 'cloudflare_secret_key',
      hcaptchaEnabled: 'hcaptcha_enabled',
      hcaptchaSiteKey: 'hcaptcha_site_key',
      hcaptchaSecretKey: 'hcaptcha_secret_key',
    }

    // Map nested object to flat structure
    const flatData: Record<string, any> = {
      recaptchaV2Enabled: data.recaptchaV2?.enabled,
      recaptchaV2SiteKey: data.recaptchaV2?.siteKey,
      recaptchaV2SecretKey: data.recaptchaV2?.secretKey,
      recaptchaV3Enabled: data.recaptchaV3?.enabled,
      recaptchaV3SiteKey: data.recaptchaV3?.siteKey,
      recaptchaV3SecretKey: data.recaptchaV3?.secretKey,
      recaptchaV3MinScore: data.recaptchaV3?.minScore,
      cloudflareEnabled: data.cloudflare?.enabled,
      cloudflareSiteKey: data.cloudflare?.siteKey,
      cloudflareSecretKey: data.cloudflare?.secretKey,
      hcaptchaEnabled: data.hcaptcha?.enabled,
      hcaptchaSiteKey: data.hcaptcha?.siteKey,
      hcaptchaSecretKey: data.hcaptcha?.secretKey,
    }

    for (const [key, dbKey] of Object.entries(settingsMap)) {
      if (flatData[key] !== undefined) {
        // Convert boolean to string for storage
        const value = typeof flatData[key] === 'boolean' ? String(flatData[key]) : String(flatData[key] || '')
        
        await db.systemSetting.upsert({
          where: { key: dbKey },
          update: { value },
          create: { key: dbKey, value },
        })
      }
    }

    return NextResponse.json({ success: true, message: 'reCAPTCHA settings saved successfully' })
  } catch (error) {
    console.error('Error saving reCAPTCHA settings:', error)
    return NextResponse.json({ error: 'Failed to save reCAPTCHA settings' }, { status: 500 })
  }
}
