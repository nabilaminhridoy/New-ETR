/**
 * Database Import Script
 * Imports data from JSON files to the database
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const IMPORT_DIR = path.join(__dirname, '../db-exports');

// Models to import with their Prisma client property names
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

// Import order - models with no dependencies first
const IMPORT_ORDER = [
  'SystemSetting',
  'Permission',
  'RolePermission',
  'City',
  'PopularRoute',
  'EmailTemplate',
  'PaymentGateway',
  'SMSGateway',
  'SMSTemplate',
  'TicketCounter',
  'User',
  'OtpCode',
  'IdVerification',
  'Wallet',
  'WalletAccount',
  'WithdrawRequest',
  'Ticket',
  'Transaction',
  'Report',
  'AuditLog',
];

async function importModel(modelName) {
  try {
    const modelInfo = MODELS.find(m => m.name === modelName);
    if (!modelInfo) {
      throw new Error(`Model ${modelName} not found in MODELS array`);
    }

    const { name, prismaKey } = modelInfo;
    const filePath = path.join(IMPORT_DIR, `${name.toLowerCase()}.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  No data file found for ${name}, skipping...`);
      return { modelName: name, count: 0, success: true, skipped: true };
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.length === 0) {
      console.log(`⚠️  No data to import for ${name}, skipping...`);
      return { modelName: name, count: 0, success: true, skipped: true };
    }

    // Clear existing data
    await prisma[prismaKey].deleteMany({});
    console.log(`🧹 Cleared existing data from ${name}`);

    // Import new data in batches
    const batchSize = 100;
    let importedCount = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await prisma[prismaKey].createMany({
        data: batch,
        skipDuplicates: true,
      });
      importedCount += batch.length;
      console.log(`   Imported batch ${Math.floor(i / batchSize) + 1} (${importedCount}/${data.length})`);
    }

    console.log(`✅ Imported ${name}: ${importedCount} records`);
    return { modelName: name, count: importedCount, success: true };
  } catch (error) {
    console.error(`❌ Error importing ${modelName}:`, error.message);
    return { modelName, count: 0, success: false, error: error.message };
  }
}

async function importAll() {
  console.log('🚀 Starting database import...\n');

  const results = [];

  for (const modelName of IMPORT_ORDER) {
    console.log(`\n📥 Importing ${modelName}...`);
    const result = await importModel(modelName);
    results.push(result);
  }

  // Write summary
  const summary = {
    importDate: new Date().toISOString(),
    totalModels: IMPORT_ORDER.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    skipped: results.filter(r => r.skipped).length,
    totalRecords: results.reduce((sum, r) => sum + (r.count || 0), 0),
    details: results,
  };

  fs.writeFileSync(
    path.join(IMPORT_DIR, 'import-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );

  console.log('\n📊 Import Summary:');
  console.log(`   Total Models: ${summary.totalModels}`);
  console.log(`   Successful: ${summary.successful}`);
  console.log(`   Failed: ${summary.failed}`);
  console.log(`   Skipped: ${summary.skipped}`);
  console.log(`   Total Records: ${summary.totalRecords}`);
  console.log(`\n💾 Import completed!`);
}

importAll()
  .catch((error) => {
    console.error('💥 Fatal error during import:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
