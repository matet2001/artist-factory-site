/**
 * Verify backup file integrity and compare with current database
 * Run with: npx tsx scripts/verify-backup.ts <backup-file-path>
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function verifyBackup(backupFilePath: string) {
  console.log('🔍 Starting backup verification...\n')

  try {
    // Read backup file
    console.log(`📖 Reading backup file: ${backupFilePath}`)
    const fileContent = fs.readFileSync(backupFilePath, 'utf-8')
    const backup = JSON.parse(fileContent)

    console.log(`   Export date: ${backup.exportDate}`)
    console.log(`   File size: ${(fs.statSync(backupFilePath).size / 1024).toFixed(2)} KB`)

    // Verify backup structure
    console.log('\n✅ Verifying backup structure...')
    const requiredFields = ['exportDate', 'counts', 'data']
    const requiredDataTables = ['users', 'rooms', 'bookings', 'verificationTokens', 'bookingVerifications']

    for (const field of requiredFields) {
      if (!backup[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    for (const table of requiredDataTables) {
      if (!backup.data[table]) {
        throw new Error(`Missing required data table: ${table}`)
      }
    }

    console.log('   ✅ Backup structure is valid')

    // Verify counts match data
    console.log('\n✅ Verifying data integrity...')
    const actualCounts = {
      users: backup.data.users.length,
      rooms: backup.data.rooms.length,
      bookings: backup.data.bookings.length,
      verificationTokens: backup.data.verificationTokens.length,
      bookingVerifications: backup.data.bookingVerifications.length,
    }

    let countsMatch = true
    for (const [key, value] of Object.entries(actualCounts)) {
      const expectedCount = backup.counts[key]
      if (value !== expectedCount) {
        console.log(`   ❌ ${key}: Expected ${expectedCount}, found ${value}`)
        countsMatch = false
      } else {
        console.log(`   ✅ ${key}: ${value} records`)
      }
    }

    if (!countsMatch) {
      throw new Error('Data counts do not match!')
    }

    // Compare with current database
    console.log('\n🔄 Comparing with current database...')
    const [currentUsers, currentRooms, currentBookings, currentTokens, currentVerifications] = await Promise.all([
      prisma.user.count(),
      prisma.room.count(),
      prisma.booking.count(),
      prisma.verificationToken.count(),
      prisma.bookingVerification.count(),
    ])

    console.log('\n📊 Comparison:')
    console.log(`   Users:        Backup: ${backup.counts.users}  |  Current DB: ${currentUsers}`)
    console.log(`   Rooms:        Backup: ${backup.counts.rooms}  |  Current DB: ${currentRooms}`)
    console.log(`   Bookings:     Backup: ${backup.counts.bookings}  |  Current DB: ${currentBookings}`)
    console.log(`   Tokens:       Backup: ${backup.counts.verificationTokens}  |  Current DB: ${currentTokens}`)
    console.log(`   Verifications: Backup: ${backup.counts.bookingVerifications}  |  Current DB: ${currentVerifications}`)

    // Check for data consistency
    console.log('\n✅ Checking data consistency...')

    // Verify all bookings reference valid users and rooms
    let invalidBookings = 0
    const userIds = new Set(backup.data.users.map((u: any) => u.id))
    const roomIds = new Set(backup.data.rooms.map((r: any) => r.id))

    for (const booking of backup.data.bookings) {
      if (!userIds.has(booking.userId)) {
        console.log(`   ⚠️  Booking ${booking.id} references non-existent user: ${booking.userId}`)
        invalidBookings++
      }
      if (!roomIds.has(booking.roomId)) {
        console.log(`   ⚠️  Booking ${booking.id} references non-existent room: ${booking.roomId}`)
        invalidBookings++
      }
    }

    if (invalidBookings === 0) {
      console.log('   ✅ All bookings reference valid users and rooms')
    } else {
      console.log(`   ⚠️  Found ${invalidBookings} invalid references`)
    }

    // Verify all verification tokens reference valid users
    let invalidTokens = 0
    for (const token of backup.data.verificationTokens) {
      const userExists = backup.data.users.some((u: any) => u.email === token.email)
      if (!userExists) {
        console.log(`   ⚠️  Token ${token.id} references non-existent user: ${token.email}`)
        invalidTokens++
      }
    }

    if (invalidTokens === 0) {
      console.log('   ✅ All verification tokens reference valid users')
    } else {
      console.log(`   ⚠️  Found ${invalidTokens} invalid token references`)
    }

    console.log('\n✅ Backup verification completed!')

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📋 VERIFICATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Backup file is valid and complete`)
    console.log(`✅ All data structures are correct`)
    console.log(`✅ Total records in backup: ${Object.values(actualCounts).reduce((a, b) => a + b, 0)}`)

    if (invalidBookings > 0 || invalidTokens > 0) {
      console.log(`⚠️  Found ${invalidBookings + invalidTokens} data consistency issues`)
      console.log(`   (These will be skipped during import)`)
    } else {
      console.log(`✅ No data consistency issues found`)
    }

    console.log('\n✨ This backup is ready for import!')

  } catch (error) {
    console.error('\n❌ Verification failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Get backup file path from command line argument
const backupFilePath = process.argv[2]

if (!backupFilePath) {
  console.error('❌ Error: Please provide backup file path')
  console.log('Usage: npx tsx scripts/verify-backup.ts <backup-file-path>')
  console.log('Example: npx tsx scripts/verify-backup.ts backups/database-backup-2024-12-10.json')
  process.exit(1)
}

if (!fs.existsSync(backupFilePath)) {
  console.error(`❌ Error: Backup file not found: ${backupFilePath}`)
  process.exit(1)
}

verifyBackup(backupFilePath)
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
