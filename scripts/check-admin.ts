/**
 * Find admin users and verified users
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdmins() {
  console.log('🔍 Checking for admin and verified users...\n')

  try {
    // Find admin users
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: {
        email: true,
        name: true,
        emailVerified: true,
        isAdmin: true,
      }
    })

    console.log(`👑 Admin users (${admins.length}):`)
    admins.forEach((admin, i) => {
      console.log(`\n   ${i + 1}. ${admin.name || 'No name'}`)
      console.log(`      Email: ${admin.email}`)
      console.log(`      Verified: ${admin.emailVerified ? '✅ Yes' : '❌ No'}`)
      console.log(`      ${admin.emailVerified ? '✅ CAN LOGIN' : '❌ CANNOT LOGIN (email not verified)'}`)
    })

    // Find some verified non-admin users
    console.log(`\n\n👤 Some verified users (can login):`)
    const verifiedUsers = await prisma.user.findMany({
      where: {
        emailVerified: { not: null },
        isAdmin: false
      },
      select: {
        email: true,
        name: true,
        emailVerified: true,
      },
      take: 5
    })

    verifiedUsers.forEach((user, i) => {
      console.log(`\n   ${i + 1}. ${user.name || 'No name'}`)
      console.log(`      Email: ${user.email}`)
    })

  } catch (error) {
    console.error('\n❌ Error:')
    console.error(error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmins()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
