import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

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

// Default permissions for each role
const rolePermissions = {
  SUPER_ADMIN: defaultPermissions.map((p) => p.name),
  ADMIN: defaultPermissions
    .filter((p) => !p.category.startsWith('permissions'))
    .map((p) => p.name),
  USER: [],
}

async function main() {
  console.log('🌱 Starting permission seeding...')

  // Create permissions
  console.log('Creating permissions...')
  for (const permission of defaultPermissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    })
  }
  console.log(`✅ Created ${defaultPermissions.length} permissions`)

  // Assign permissions to roles
  console.log('Assigning permissions to roles...')
  for (const [role, permissionNames] of Object.entries(rolePermissions)) {
    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName },
      })

      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            role_permissionId: {
              role: role as UserRole,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            role: role as UserRole,
            permissionId: permission.id,
          },
        })
      }
    }
    console.log(`✅ Assigned ${permissionNames.length} permissions to ${role}`)
  }

  console.log('🎉 Permission seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding permissions:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
