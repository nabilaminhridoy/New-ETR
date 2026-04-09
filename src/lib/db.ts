import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const dbUrl = process.env.DATABASE_URL || "postgresql://postgres.mvrkegwrotdnqzmkanre:AvYsJ1SM6Qr7s8Sh@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

    globalForPrisma.prisma = new PrismaClient({
      log: ['query'],
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    })
  }
  return globalForPrisma.prisma
}

const db = getPrismaClient()

export { db }
export default db
export type { EmailTemplate } from '@prisma/client'