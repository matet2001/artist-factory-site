/**
 * Import data to new Neon database
 * Run with: npx tsx scripts/import-database.ts <backup-file-path>
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function importData(backupFilePath: string) {
  console.log('🚀 Starting database import...\n')

  try {
    // Read backup file
    console.log(`📖 Reading backup file: ${backupFilePath}`)
    const fileContent = fs.readFileSync(backupFilePath, 'utf-8')
    const backup = JSON.parse(fileContent)

    console.log(`   Export date: ${backup.exportDate}`)
    console.log('\n📊 Data to import:')
    console.log(`   - Users: ${backup.counts.users}`)
    console.log(`   - Rooms: ${backup.counts.rooms}`)
    console.log(`   - Bookings: ${backup.counts.bookings}`)
    console.log(`   - Verification Tokens: ${backup.counts.verificationTokens}`)
    console.log(`   - Booking Verifications: ${backup.counts.bookingVerifications}`)

    // Check if database is empty
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      console.log('\n⚠️  WARNING: Database is not empty!')
      console.log(`   Found ${existingUsers} existing users.`)
      console.log('   This script will skip existing records and only import new ones.')
      console.log('   Press Ctrl+C to cancel or wait 5 seconds to continue...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    console.log('\n🔄 Importing data...')

    // Import in correct order (respecting foreign keys)

    // 1. Import Users
    console.log('\n1️⃣  Importing users...')
    let usersImported = 0
    for (const user of backup.data.users) {
      try {
        await prisma.user.create({
          data: user,
        })
        usersImported++
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`   ⏭️  Skipping existing user: ${user.email}`)
        } else {
          console.error(`   ❌ Error importing user ${user.email}:`, error.message)
        }
      }
    }
    console.log(`   ✅ Imported ${usersImported}/${backup.counts.users} users`)

    // 2. Import Rooms
    console.log('\n2️⃣  Importing rooms...')
    let roomsImported = 0
    for (const room of backup.data.rooms) {
      try {
        await prisma.room.create({
          data: room,
        })
        roomsImported++
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`   ⏭️  Skipping existing room: ${room.name}`)
        } else {
          console.error(`   ❌ Error importing room ${room.name}:`, error.message)
        }
      }
    }
    console.log(`   ✅ Imported ${roomsImported}/${backup.counts.rooms} rooms`)

    // 3. Import Bookings
    console.log('\n3️⃣  Importing bookings...')
    let bookingsImported = 0
    for (const booking of backup.data.bookings) {
      try {
        await prisma.booking.create({
          data: booking,
        })
        bookingsImported++
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`   ⏭️  Skipping existing booking: ${booking.id}`)
        } else {
          console.error(`   ❌ Error importing booking ${booking.id}:`, error.message)
        }
      }
    }
    console.log(`   ✅ Imported ${bookingsImported}/${backup.counts.bookings} bookings`)

    // 4. Import Verification Tokens
    console.log('\n4️⃣  Importing verification tokens...')
    let tokensImported = 0
    for (const token of backup.data.verificationTokens) {
      try {
        await prisma.verificationToken.create({
          data: token,
        })
        tokensImported++
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`   ⏭️  Skipping existing token: ${token.id}`)
        } else {
          console.error(`   ❌ Error importing token ${token.id}:`, error.message)
        }
      }
    }
    console.log(`   ✅ Imported ${tokensImported}/${backup.counts.verificationTokens} tokens`)

    // 5. Import Booking Verifications
    console.log('\n5️⃣  Importing booking verifications...')
    let verificationsImported = 0
    for (const verification of backup.data.bookingVerifications) {
      try {
        await prisma.bookingVerification.create({
          data: verification,
        })
        verificationsImported++
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`   ⏭️  Skipping existing verification: ${verification.id}`)
        } else {
          console.error(`   ❌ Error importing verification ${verification.id}:`, error.message)
        }
      }
    }
    console.log(`   ✅ Imported ${verificationsImported}/${backup.counts.bookingVerifications} verifications`)

    console.log('\n✅ Import completed successfully!')
    console.log('\n📈 Import summary:')
    console.log(`   - Users: ${usersImported}/${backup.counts.users}`)
    console.log(`   - Rooms: ${roomsImported}/${backup.counts.rooms}`)
    console.log(`   - Bookings: ${bookingsImported}/${backup.counts.bookings}`)
    console.log(`   - Verification Tokens: ${tokensImported}/${backup.counts.verificationTokens}`)
    console.log(`   - Booking Verifications: ${verificationsImported}/${backup.counts.bookingVerifications}`)

  } catch (error) {
    console.error('❌ Import failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Get backup file path from command line argument
const backupFilePath = process.argv[2]

if (!backupFilePath) {
  console.error('❌ Error: Please provide backup file path')
  console.log('Usage: npx tsx scripts/import-database.ts <backup-file-path>')
  console.log('Example: npx tsx scripts/import-database.ts backups/database-backup-2024-12-10.json')
  process.exit(1)
}

if (!fs.existsSync(backupFilePath)) {
  console.error(`❌ Error: Backup file not found: ${backupFilePath}`)
  process.exit(1)
}

importData(backupFilePath)
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
