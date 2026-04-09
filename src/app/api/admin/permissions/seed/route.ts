import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

const defaultPermissions = [
  // User Management
  { name: 'users_view', description: 'View users list', category: 'users' },
  { name: 'users_view_details', description: 'View user details', category: 'users' },
  { name: 'users_create', description: 'Create new users', category: 'users' },
  { name: 'users_update', description: 'Update user information', category: 'users' },
  { name: 'users_delete', description: 'Delete users', category: 'users' },
  { name: 'users_block', description: 'Block users', category: 'users' },
  { name: 'users_unblock', description: 'Unblock users', category: 'users' },
  { name: 'users_change_role', description: 'Change user roles', category: 'users' },

  // Ticket Management
  { name: 'tickets_view', description: 'View tickets list', category: 'tickets' },
  { name: 'tickets_view_details', description: 'View ticket details', category: 'tickets' },
  { name: 'tickets_approve', description: 'Approve tickets', category: 'tickets' },
  { name: 'tickets_reject', description: 'Reject tickets', category: 'tickets' },
  { name: 'tickets_delete', description: 'Delete tickets', category: 'tickets' },

  // Report Management
  { name: 'reports_view', description: 'View reports list', category: 'reports' },
  { name: 'reports_view_details', description: 'View report details', category: 'reports' },
  { name: 'reports_resolve', description: 'Resolve reports', category: 'reports' },
  { name: 'reports_reject', description: 'Reject reports', category: 'reports' },

  // Transaction Management
  { name: 'transactions_view', description: 'View transactions list', category: 'transactions' },
  { name: 'transactions_view_details', description: 'View transaction details', category: 'transactions' },
  { name: 'transactions_cancel', description: 'Cancel transactions', category: 'transactions' },

  // Payout Management
  { name: 'payouts_view', description: 'View payout requests', category: 'payouts' },
  { name: 'payouts_approve', description: 'Approve payouts', category: 'payouts' },
  { name: 'payouts_reject', description: 'Reject payouts', category: 'payouts' },

  // System Settings
  { name: 'settings_view', description: 'View system settings', category: 'settings' },
  { name: 'settings_general', description: 'Manage general settings', category: 'settings' },
  { name: 'settings_environment', description: 'Manage environment settings', category: 'settings' },
  { name: 'settings_payment_gateways', description: 'Manage payment gateways', category: 'settings' },
  { name: 'settings_email', description: 'Manage email settings', category: 'settings' },
  { name: 'settings_sms', description: 'Manage SMS settings', category: 'settings' },
  { name: 'settings_email_templates', description: 'Manage email templates', category: 'settings' },
  { name: 'settings_sms_templates', description: 'Manage SMS templates', category: 'settings' },

  // Permissions Management (SUPER_ADMIN only)
  { name: 'permissions_view', description: 'View permissions', category: 'permissions' },
  { name: 'permissions_manage', description: 'Manage permissions', category: 'permissions' },

  // Audit Logs
  { name: 'audit_logs_view', description: 'View audit logs', category: 'audit' },
  { name: 'audit_logs_export', description: 'Export audit logs', category: 'audit' },
]

const rolePermissions = {
  SUPER_ADMIN: defaultPermissions.map((p) => p.name),
  ADMIN: defaultPermissions
    .filter((p) => !p.category.startsWith('permissions'))
    .map((p) => p.name),
  USER: [],
}

// POST - Seed default permissions
export async function POST(request: NextRequest) {
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

    // Only SUPER_ADMIN can seed permissions
    if (role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admin can seed permissions' },
        { status: 403 }
      )
    }

    // Create permissions
    const createdPermissions = []
    for (const permission of defaultPermissions) {
      const perm = await db.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: permission,
      })
      createdPermissions.push(perm)
    }

    // Assign permissions to roles
    const assignedPermissions: Record<string, number> = {}
    for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
      let count = 0
      for (const permissionName of permissionNames) {
        const permission = await db.permission.findUnique({
          where: { name: permissionName },
        })

        if (permission) {
          await db.rolePermission.upsert({
            where: {
              role_permissionId: {
                role: roleName as UserRole,
                permissionId: permission.id,
              },
            },
            update: {},
            create: {
              role: roleName as UserRole,
              permissionId: permission.id,
            },
          })
          count++
        }
      }
      assignedPermissions[roleName] = count
    }

    return NextResponse.json({
      success: true,
      message: 'Permissions seeded successfully',
      data: {
        createdPermissions: createdPermissions.length,
        assignedPermissions,
      },
    })
  } catch (error) {
    console.error('Error seeding permissions:', error)
    return NextResponse.json(
      { error: 'Failed to seed permissions' },
      { status: 500 }
    )
  }
}
