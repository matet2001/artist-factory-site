import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST, before any other imports
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

// NOW import after env vars are loaded
import { sendMigrationWelcomeEmail } from '@/lib/email'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function sendMigrationEmails() {
    // Debug: Check if env vars are loaded
    console.log('Email config:', {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        user: process.env.EMAIL_SERVER_USER,
        from: process.env.EMAIL_FROM,
    })

    // Get locale before sending any emails

    // Get all users without emailVerified (imported users)
    const users = await prisma.user.findMany({
        where: {
            emailVerified: null,
        },
        include: {
            verificationTokens: {
                where: {
                    type: 'PASSWORD_RESET',
                },
            },
        },
    })

    console.log(`Found ${users.length} users to email`)

    let sent = 0
    let failed = 0

    for (const user of users) {
        try {
            const token = user.verificationTokens[0]?.token

            if (!token) {
                console.error(`No token for ${user.email}`)
                failed++
                continue
            }

            await sendMigrationWelcomeEmail(user.email, token, user.name || undefined)
            console.log(`✓ Sent to: ${user.email}`)
            sent++

            // Rate limit: wait 100ms between emails to avoid spam filters
            await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
            console.error(`✗ Failed to send to ${user.email}:`, error)
            failed++
        }
    }

    console.log('\n=== Email Summary ===')
    console.log(`✓ Sent: ${sent}`)
    console.log(`✗ Failed: ${failed}`)

    await prisma.$disconnect()
}

sendMigrationEmails()
