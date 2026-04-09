import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('Test DB: db value:', db)
  console.log('Test DB: db.systemSetting:', db?.systemSetting)

  try {
    const result = await db.systemSetting.findMany({
      take: 1
    })
    return NextResponse.json({
      success: true,
      dbExists: !!db,
      systemSettingExists: !!db?.systemSetting,
      result
    })
  } catch (error) {
    console.error('Test DB Error:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      dbExists: !!db,
      systemSettingExists: !!db?.systemSetting
    }, { status: 500 })
  }
}
