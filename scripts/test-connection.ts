/**
 * Test database connection and check user data
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Testing database connection...\n')

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to database!\n')

    // Count users
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)

    // Get a sample user (first one)
    const sampleUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        isAdmin: true,
      }
    })

    if (sampleUser) {
      console.log('\n👤 Sample user:')
      console.log(`   Email: ${sampleUser.email}`)
      console.log(`   Name: ${sampleUser.name}`)
      console.log(`   Email Verified: ${sampleUser.emailVerified ? 'Yes ✅' : 'No ❌'}`)
      console.log(`   Is Admin: ${sampleUser.isAdmin ? 'Yes' : 'No'}`)
    }

    // Count verified vs unverified users
    const verifiedCount = await prisma.user.count({
      where: { emailVerified: { not: null } }
    })
    const unverifiedCount = await prisma.user.count({
      where: { emailVerified: null }
    })

    console.log(`\n📧 Email verification status:`)
    console.log(`   Verified: ${verifiedCount}`)
    console.log(`   Unverified: ${unverifiedCount}`)

    // Check bookings
    const bookingCount = await prisma.booking.count()
    console.log(`\n📅 Total bookings: ${bookingCount}`)

    // Check rooms
    const roomCount = await prisma.room.count()
    console.log(`🚪 Total rooms: ${roomCount}`)

    console.log('\n✅ Database connection test passed!')

  } catch (error) {
    console.error('\n❌ Database connection test failed:')
    console.error(error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
