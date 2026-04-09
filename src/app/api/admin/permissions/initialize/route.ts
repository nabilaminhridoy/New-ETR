import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

/**
 * Default permissions for the system
 */
const DEFAULT_PERMISSIONS = [
  // User Management
  { name: 'view_users', description: 'View user list and details', category: 'users' },
  { name: 'manage_users', description: 'Create, edit, and delete users', category: 'users' },
  { name: 'block_users', description: 'Block and unblock users', category: 'users' },
  { name: 'change_user_roles', description: 'Change user roles', category: 'users' },

  // Ticket Management
  { name: 'view_tickets', description: 'View ticket listings', category: 'tickets' },
  { name: 'manage_tickets', description: 'Create, edit, and delete tickets', category: 'tickets' },
  { name: 'approve_tickets', description: 'Approve pending tickets', category: 'tickets' },
  { name: 'reject_tickets', description: 'Reject tickets', category: 'tickets' },

  // Transaction Management
  { name: 'view_transactions', description: 'View transaction history', category: 'transactions' },
  { name: 'manage_transactions', description: 'Manage and modify transactions', category: 'transactions' },
  { name: 'process_refunds', description: 'Process refunds', category: 'transactions' },
  { name: 'approve_seller_payouts', description: 'Approve seller payouts', category: 'transactions' },

  // Reports Management
  { name: 'view_reports', description: 'View reported issues', category: 'reports' },
  { name: 'manage_reports', description: 'Resolve and manage reports', category: 'reports' },

  // Wallet & Withdrawals
  { name: 'view_wallets', description: 'View wallet balances', category: 'wallet' },
  { name: 'manage_withdrawals', description: 'Approve or reject withdrawal requests', category: 'wallet' },

  // Permissions & Roles
  { name: 'manage_permissions', description: 'Manage system permissions', category: 'permissions' },
  { name: 'manage_roles', description: 'Assign and manage role permissions', category: 'permissions' },
  { name: 'view_audit_logs', description: 'View audit logs', category: 'permissions' },

  // Settings
  { name: 'view_settings', description: 'View system settings', category: 'settings' },
  { name: 'manage_settings', description: 'Modify system settings', category: 'settings' },
  { name: 'manage_payment_gateways', description: 'Configure payment gateways', category: 'settings' },
  { name: 'manage_sms_gateways', description: 'Configure SMS gateways', category: 'settings' },
  { name: 'manage_email_templates', description: 'Manage email templates', category: 'settings' },
  { name: 'manage_sms_templates', description: 'Manage SMS templates', category: 'settings' },
  { name: 'manage_cities', description: 'Manage cities and routes', category: 'settings' },

  // ID Verification
  { name: 'view_verifications', description: 'View ID verification requests', category: 'verifications' },
  { name: 'approve_verifications', description: 'Approve ID verifications', category: 'verifications' },
  { name: 'reject_verifications', description: 'Reject ID verifications', category: 'verifications' },
]

/**
 * Default role permissions
 * SUPER_ADMIN gets all permissions
 * ADMIN gets most permissions except role/permission management
 * USER gets limited permissions (mostly for viewing)
 */
const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: '*', // All permissions
  ADMIN: [
    'view_users',
    'view_tickets',
    'manage_tickets',
    'approve_tickets',
    'reject_tickets',
    'view_transactions',
    'view_reports',
    'manage_reports',
    'view_wallets',
    'manage_withdrawals',
    'view_settings',
    'view_verifications',
    'approve_verifications',
    'reject_verifications',
  ],
  USER: [
    'view_tickets',
    'view_transactions',
    'view_reports',
    'view_wallets',
  ],
}

/**
 * POST /api/admin/permissions/initialize
 * Initialize default permissions and role permissions
 */
export async function POST(request: Request) {
  try {
    // Check if permissions already exist
    const existingPermissions = await db.permission.count()
    if (existingPermissions > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Permissions already initialized. Use the API to manage permissions instead.',
        },
        { status: 400 }
      )
    }

    // Create all default permissions
    const createdPermissions = await Promise.all(
      DEFAULT_PERMISSIONS.map((perm) =>
        db.permission.create({
          data: perm,
        })
      )
    )

    // Create role permissions for each role
    const rolePermissions: any[] = []

    for (const [role, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
      if (permissions === '*') {
        // SUPER_ADMIN gets all permissions
        for (const permission of createdPermissions) {
          await db.rolePermission.create({
            data: {
              role: role as UserRole,
              permissionId: permission.id,
            },
          })
          rolePermissions.push({ role: role, permission: permission.name })
        }
      } else {
        // Other roles get specific permissions
        for (const permName of permissions as string[]) {
          const permission = createdPermissions.find((p) => p.name === permName)
          if (permission) {
            await db.rolePermission.create({
              data: {
                role: role as UserRole,
                permissionId: permission.id,
              },
            })
            rolePermissions.push({ role: role, permission: permName })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Default permissions and role permissions initialized successfully',
      data: {
        permissionsCreated: createdPermissions.length,
        rolePermissionsCreated: rolePermissions.length,
      },
    })
  } catch (error: any) {
    console.error('Error initializing permissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initialize permissions',
      },
      { status: 500 }
    )
  }
}
