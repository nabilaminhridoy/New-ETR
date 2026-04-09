import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Environment settings keys
const ENVIRONMENT_SETTINGS_KEYS = [
  'env_app_name',
  'env_app_url',
  'env_debug_mode',
  'env_maintenance_mode',
  'env_ssl_enabled',
  'env_cache_enabled',
  'env_session_timeout',
  'env_max_login_attempts',
  'env_cache_ttl',
  'env_last_backup',
  'db_host',
  'db_port',
  'db_name',
  'db_username',
  'db_password',
]

// Helper to get database type from Prisma schema
function getDatabaseType(): string {
  return 'PostgreSQL (Supabase)'
}

// Helper to get database connection status
function getDatabaseStatus(): { status: string; color: string } {
  // Since we're using Prisma, the connection is managed automatically
  return {
    status: 'Connected',
    color: 'green'
  }
}

// GET - Fetch all environment settings
export async function GET() {
  try {
    const settings = await db.systemSetting.findMany({
      where: {
        key: {
          in: ENVIRONMENT_SETTINGS_KEYS
        }
      }
    })

    const settingsMap: Record<string, string> = {}
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value || ''
    })

    // Parse DATABASE_URL to extract actual database connection details
    const dbUrl = process.env.DATABASE_URL || ''
    let dbHost = settingsMap['db_host'] || ''
    let dbPort = settingsMap['db_port'] || ''
    let dbName = settingsMap['db_name'] || ''
    let dbUsername = settingsMap['db_username'] || ''

    // Try to parse DATABASE_URL if settings are empty
    if (dbUrl && (!dbHost || !dbPort || !dbName || !dbUsername)) {
      try {
        const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
        if (urlMatch) {
          dbUsername = dbUsername || urlMatch[1]
          dbHost = dbHost || urlMatch[3]
          dbPort = dbPort || urlMatch[4]
          dbName = dbName || urlMatch[5].split('?')[0]
        }
      } catch (e) {
        console.error('Error parsing DATABASE_URL:', e)
      }
    }

    // Build response with defaults
    const response = {
      application: {
        appName: settingsMap['env_app_name'] || 'EidTicketResell',
        appUrl: settingsMap['env_app_url'] || process.env.NEXT_PUBLIC_APP_URL || '',
        appEnv: process.env.NODE_ENV || 'development',
        debugMode: settingsMap['env_debug_mode'] === 'true',
        maintenanceMode: settingsMap['env_maintenance_mode'] === 'true',
      },
      security: {
        sslEnabled: settingsMap['env_ssl_enabled'] !== 'false', // Default true
        sessionTimeout: parseInt(settingsMap['env_session_timeout'] || '60'),
        maxLoginAttempts: parseInt(settingsMap['env_max_login_attempts'] || '5'),
      },
      database: {
        dbConnection: getDatabaseType(),
        dbHost: dbHost,
        dbPort: dbPort,
        dbName: dbName,
        dbUsername: dbUsername,
        dbPassword: settingsMap['db_password'] || '', // Never return actual password
        dbStatus: getDatabaseStatus().status,
        lastBackup: settingsMap['env_last_backup'] || 'Never',
      },
      cache: {
        cacheEnabled: settingsMap['env_cache_enabled'] !== 'false', // Default true
        cacheTTL: parseInt(settingsMap['env_cache_ttl'] || '3600'),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching environment settings:', error)

    // Return default values when database is not available
    // Parse DATABASE_URL to extract actual database connection details
    const dbUrl = process.env.DATABASE_URL || ''
    let dbHost = ''
    let dbPort = ''
    let dbName = ''
    let dbUsername = ''

    // Try to parse DATABASE_URL
    if (dbUrl) {
      try {
        const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
        if (urlMatch) {
          dbUsername = urlMatch[1]
          dbHost = urlMatch[3]
          dbPort = urlMatch[4]
          dbName = urlMatch[5].split('?')[0]
        }
      } catch (e) {
        console.error('Error parsing DATABASE_URL:', e)
      }
    }

    const response = {
      application: {
        appName: 'EidTicketResell',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || '',
        appEnv: process.env.NODE_ENV || 'development',
        debugMode: false,
        maintenanceMode: false,
      },
      security: {
        sslEnabled: true,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
      },
      database: {
        dbConnection: getDatabaseType(),
        dbHost: dbHost,
        dbPort: dbPort,
        dbName: dbName,
        dbUsername: dbUsername,
        dbPassword: '',
        dbStatus: 'Not Connected',
        lastBackup: 'Never',
      },
      cache: {
        cacheEnabled: true,
        cacheTTL: 3600,
      },
    }

    return NextResponse.json(response)
  }
}

// POST - Save all environment settings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { application, security, cache } = data

    // Map form data to database keys
    const settingsToSave: { key: string; value: string }[] = []

    // Application settings - only save editable fields
    if (application) {
      // Skip appName and appUrl as they are read-only
      if (application.debugMode !== undefined) {
        settingsToSave.push({ key: 'env_debug_mode', value: application.debugMode ? 'true' : 'false' })
      }
      if (application.maintenanceMode !== undefined) {
        settingsToSave.push({ key: 'env_maintenance_mode', value: application.maintenanceMode ? 'true' : 'false' })
      }
    }

    // Database settings are read-only - skip saving them

    // Security settings
    if (security) {
      if (security.sslEnabled !== undefined) {
        settingsToSave.push({ key: 'env_ssl_enabled', value: security.sslEnabled ? 'true' : 'false' })
      }
      if (security.sessionTimeout !== undefined) {
        settingsToSave.push({ key: 'env_session_timeout', value: String(security.sessionTimeout) })
      }
      if (security.maxLoginAttempts !== undefined) {
        settingsToSave.push({ key: 'env_max_login_attempts', value: String(security.maxLoginAttempts) })
      }
    }

    // Cache settings
    if (cache) {
      if (cache.cacheEnabled !== undefined) {
        settingsToSave.push({ key: 'env_cache_enabled', value: cache.cacheEnabled ? 'true' : 'false' })
      }
      if (cache.cacheTTL !== undefined) {
        settingsToSave.push({ key: 'env_cache_ttl', value: String(cache.cacheTTL) })
      }
    }

    // Save each setting using upsert
    for (const setting of settingsToSave) {
      await db.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
    }

    return NextResponse.json({ success: true, message: 'Environment settings saved successfully' })
  } catch (error) {
    console.error('Error saving environment settings:', error)
    return NextResponse.json({ error: 'Failed to save environment settings' }, { status: 500 })
  }
}
