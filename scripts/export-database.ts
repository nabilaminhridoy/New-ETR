/**
 * Database Export Script
 * Exports all data from the current database to JSON files
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres.mvrkegwrotdnqzmkanre:AvYsJ1SM6Qr7s8Sh@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
    },
  },
});

const EXPORT_DIR = path.join(__dirname, '../db-exports');

// Ensure export directory exists
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

// Models to export with their Prisma client property names
const MODELS = [
  { name: 'User', prismaKey: 'user' },
  { name: 'OtpCode', prismaKey: 'otpCode' },
  { name: 'IdVerification', prismaKey: 'idVerification' },
  { name: 'Ticket', prismaKey: 'ticket' },
  { name: 'Transaction', prismaKey: 'transaction' },
  { name: 'Report', prismaKey: 'report' },
  { name: 'Wallet', prismaKey: 'wallet' },
  { name: 'WalletAccount', prismaKey: 'walletAccount' },
  { name: 'WithdrawRequest', prismaKey: 'withdrawRequest' },
  { name: 'SystemSetting', prismaKey: 'systemSetting' },
  { name: 'City', prismaKey: 'city' },
  { name: 'PopularRoute', prismaKey: 'popularRoute' },
  { name: 'EmailTemplate', prismaKey: 'emailTemplate' },
  { name: 'PaymentGateway', prismaKey: 'paymentGateway' },
  { name: 'SMSGateway', prismaKey: 'sMSGateway' },
  { name: 'SMSTemplate', prismaKey: 'sMSTemplate' },
  { name: 'TicketCounter', prismaKey: 'ticketCounter' },
  { name: 'Permission', prismaKey: 'permission' },
  { name: 'RolePermission', prismaKey: 'rolePermission' },
  { name: 'AuditLog', prismaKey: 'auditLog' },
];

async function exportModel(modelInfo) {
  try {
    const { name, prismaKey } = modelInfo;

    if (!prisma[prismaKey]) {
      console.error(`❌ Prisma client does not have model: ${name} (${prismaKey})`);
      return { modelName: name, count: 0, success: false, error: 'Model not found' };
    }

    const data = await prisma[prismaKey].findMany();

    // Write data to JSON file
    fs.writeFileSync(
      path.join(EXPORT_DIR, `${name.toLowerCase()}.json`),
      JSON.stringify(data, null, 2),
      'utf8'
    );

    console.log(`✅ Exported ${name}: ${data.length} records`);
    return { modelName: name, count: data.length, success: true };
  } catch (error) {
    console.error(`❌ Error exporting ${modelInfo.name}:`, error.message);
    return { modelName: modelInfo.name, count: 0, success: false, error: error.message };
  }
}

async function exportAll() {
  console.log('🚀 Starting database export...\n');

  const results = [];

  for (const model of MODELS) {
    const result = await exportModel(model);
    results.push(result);
  }

  // Write summary
  const summary = {
    exportDate: new Date().toISOString(),
    totalModels: MODELS.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    details: results,
  };

  fs.writeFileSync(
    path.join(EXPORT_DIR, 'export-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );

  console.log('\n📊 Export Summary:');
  console.log(`   Total Models: ${summary.totalModels}`);
  console.log(`   Successful: ${summary.successful}`);
  console.log(`   Failed: ${summary.failed}`);
  console.log(`\n💾 Data exported to: ${EXPORT_DIR}`);
}

exportAll()
  .catch((error) => {
    console.error('💥 Fatal error during export:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
