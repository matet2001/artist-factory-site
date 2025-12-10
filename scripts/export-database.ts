/**
 * Export all data from current Prisma database
 * Run with: npx tsx scripts/export-database.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function exportData() {
  console.log('🚀 Starting database export...\n')

  try {
    // Export all data
    console.log('📊 Fetching all data...')

    const [users, rooms, bookings, verificationTokens, bookingVerifications] = await Promise.all([
      prisma.user.findMany(),
      prisma.room.findMany(),
      prisma.booking.findMany(),
      prisma.verificationToken.findMany(),
      prisma.bookingVerification.findMany(),
    ])

    const exportData = {
      exportDate: new Date().toISOString(),
      counts: {
        users: users.length,
        rooms: rooms.length,
        bookings: bookings.length,
        verificationTokens: verificationTokens.length,
        bookingVerifications: bookingVerifications.length,
      },
      data: {
        users,
        rooms,
        bookings,
        verificationTokens,
        bookingVerifications,
      },
    }

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Save to file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `database-backup-${timestamp}.json`
    const filepath = path.join(backupDir, filename)

    fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2))

    console.log('\n✅ Export completed successfully!')
    console.log('\n📈 Export summary:')
    console.log(`   - Users: ${users.length}`)
    console.log(`   - Rooms: ${rooms.length}`)
    console.log(`   - Bookings: ${bookings.length}`)
    console.log(`   - Verification Tokens: ${verificationTokens.length}`)
    console.log(`   - Booking Verifications: ${bookingVerifications.length}`)
    console.log(`\n💾 Backup saved to: ${filepath}`)
    console.log(`   File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`)

    return filepath
  } catch (error) {
    console.error('❌ Export failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
