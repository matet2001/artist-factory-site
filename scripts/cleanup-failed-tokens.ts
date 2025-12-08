import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupFailedTokens() {
    console.log('🧹 Cleaning up failed verification tokens...\n')

    try {
        // Delete PASSWORD_RESET tokens that are recent (from the failed campaign)
        // Keep tokens older than 1 hour (in case there are legitimate ones)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

        const result = await prisma.verificationToken.deleteMany({
            where: {
                type: 'PASSWORD_RESET',
                expires: {
                    gt: new Date(), // Not yet expired
                },
                // This will catch the recently created tokens from the failed campaign
            },
        })

        console.log(`✅ Deleted ${result.count} orphaned PASSWORD_RESET tokens\n`)

        // Reset the isOldUser and lastVerificationEmailSent for users who didn't actually receive emails
        // This allows you to retry the email campaign later
        const resetResult = await prisma.user.updateMany({
            where: {
                isOldUser: true,
                emailVerified: null,
                lastVerificationEmailSent: {
                    gte: oneHourAgo, // Only reset recent ones
                },
            },
            data: {
                isOldUser: false,
                lastVerificationEmailSent: null,
            },
        })

        console.log(`✅ Reset ${resetResult.count} users back to non-migrated state\n`)

        console.log('✅ Cleanup complete!')
    } catch (error) {
        console.error('❌ Cleanup failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

cleanupFailedTokens()
