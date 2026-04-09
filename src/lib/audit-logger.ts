import { db } from '@/lib/db'
import { headers } from 'next/headers'

/**
 * Audit Log Entry Interface
 */
export interface AuditLogEntry {
  userId: string
  action: string
  entityType?: string
  entityId?: string
  changes?: Record<string, any>
  status?: 'success' | 'failure'
  errorMessage?: string
  metadata?: Record<string, any>
}

/**
 * Log an audit entry
 * This function should be called from the server side
 */
export async function logAudit(entry: AuditLogEntry) {
  try {
    // Get request metadata if available
    let ipAddress: string | undefined
    let userAgent: string | undefined

    try {
      const headersList = headers()
      ipAddress = headersList.get('x-forwarded-for') ||
                  headersList.get('x-real-ip') ||
                  headersList.get('cf-connecting-ip') ||
                  undefined
      userAgent = headersList.get('user-agent') || undefined
    } catch (e) {
      // Headers might not be available in all contexts
    }

    // Create audit log entry
    await db.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        changes: entry.changes ? JSON.stringify(entry.changes) : undefined,
        status: entry.status || 'success',
        errorMessage: entry.errorMessage,
        ipAddress,
        userAgent,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to log audit entry:', error)
    // Don't throw - audit logging failures shouldn't break the main flow
    return { success: false, error: error.message }
  }
}

/**
 * Log a successful action
 */
export async function logSuccess(
  userId: string,
  action: string,
  options?: {
    entityType?: string
    entityId?: string
    changes?: Record<string, any>
    metadata?: Record<string, any>
  }
) {
  return logAudit({
    userId,
    action,
    ...options,
    status: 'success',
  })
}

/**
 * Log a failed action
 */
export async function logFailure(
  userId: string,
  action: string,
  errorMessage: string,
  options?: {
    entityType?: string
    entityId?: string
    changes?: Record<string, any>
    metadata?: Record<string, any>
  }
) {
  return logAudit({
    userId,
    action,
    errorMessage,
    ...options,
    status: 'failure',
  })
}
