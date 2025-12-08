import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST, before any other imports
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

// NOW import after env vars are loaded
import { sendMigrationWelcomeEmail } from '@/lib/email'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Parse command-line arguments
const args = process.argv.slice(2)
const testMode = args.includes('--test')
const liveMode = args.includes('--live')
const testEmail = 'matet2001@gmail.com' // Test email address

async function sendMigrationEmails() {
    const mode = testMode ? 'TEST' : liveMode ? 'LIVE' : 'DRY RUN'

    console.log('🔄 Starting migration password reset campaign...')
    console.log(`Mode: ${mode}`)
    console.log('─'.repeat(60))

    // Get all users who need migration emails:
    // - emailVerified is null (old imported users)
    // - email does NOT contain @artistfactory.local (valid email only)
    const whereClause = {
        emailVerified: null,
        NOT: {
            email: {
                contains: '@artistfactory.local',
            },
        },
        ...(testMode && { email: testEmail }), // In test mode, only select the test email
    }

    const users = await prisma.user.findMany({
        where: whereClause,
        select: {
            id: true,
            email: true,
            name: true,
            isOldUser: true,
            lastVerificationEmailSent: true,
        },
    })

    console.log(`📊 Found ${users.length} users to process\n`)

    if (testMode) {
        console.log(`🧪 TEST MODE: Will only send to ${testEmail}\n`)
    } else if (!liveMode) {
        console.log(`💡 DRY RUN MODE: No emails will be sent\n`)
        console.log(`   Run with --test to send test email to ${testEmail}`)
        console.log(`   Run with --live to actually send emails\n`)
    }

    let sent = 0
    let failed = 0
    let skipped = 0

    for (const user of users) {
        try {
            // Skip if already marked as old user and already sent verification email
            if (user.isOldUser && user.lastVerificationEmailSent) {
                console.log(`⏭️  Skipped (already sent): ${user.email}`)
                skipped++
                continue
            }

            if (!liveMode && !testMode) {
                // Dry run - just log what would happen
                console.log(`📧 Would send to: ${user.email} (${user.name || 'No name'})`)
                sent++
                continue
            }

            // Delete old password reset tokens for this user
            await prisma.verificationToken.deleteMany({
                where: {
                    email: user.email,
                    type: 'PASSWORD_RESET',
                },
            })

            // Generate new password reset token (7 days expiry for migration)
            const token = crypto.randomBytes(32).toString('hex')
            await prisma.verificationToken.create({
                data: {
                    email: user.email,
                    token,
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    type: 'PASSWORD_RESET',
                },
            })

            // Mark user as old user and update last verification email sent
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isOldUser: true,
                    lastVerificationEmailSent: new Date(),
                },
            })

            // Send bilingual migration welcome email (password reset)
            await sendMigrationWelcomeEmail(user.email, token, user.name || undefined)
            console.log(`✅ Sent to: ${user.email} (${user.name || 'No name'})`)
            sent++

            // Rate limit: wait 200ms between emails to avoid spam filters
            await new Promise((resolve) => setTimeout(resolve, 200))
        } catch (error) {
            console.error(`❌ Failed to send to ${user.email}:`, error)
            failed++
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 MIGRATION EMAIL SUMMARY')
    console.log('='.repeat(60))
    console.log(`Mode:           ${mode}`)
    console.log(`Total users:    ${users.length}`)
    console.log(`✅ Sent:        ${sent}`)
    console.log(`❌ Failed:      ${failed}`)
    console.log(`⏭️  Skipped:     ${skipped}`)
    console.log('='.repeat(60))

    if (!liveMode && !testMode) {
        console.log('\n💡 This was a DRY RUN - no emails were sent')
        console.log(`   Run with --test to send test email to ${testEmail}`)
        console.log('   Run with --live to actually send emails\n')
    }

    await prisma.$disconnect()
}

sendMigrationEmails().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
})
