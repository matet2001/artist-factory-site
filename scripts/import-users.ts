import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { config } from 'dotenv'
import * as fs from 'fs'
import Papa from 'papaparse'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

interface OldUser {
    email: string
    name?: string
    phone?: string
    bandName?: string
    // Add other fields from your CSV
}

async function importUsers() {
    const csvFile = fs.readFileSync('./data/old-users.csv', 'utf8')

    const { data } = Papa.parse<OldUser>(csvFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    })

    console.log(`Found ${data.length} users to import`)

    let imported = 0
    let skipped = 0
    let failed = 0

    for (const row of data) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: row.email },
            })

            if (existingUser) {
                console.log(`Skipped: ${row.email} (already exists)`)
                skipped++
                continue
            }

            // Create user with a temporary random password (they won't know it)
            const tempPassword = crypto.randomBytes(32).toString('hex')

            await prisma.user.create({
                data: {
                    email: row.email,
                    name: row.name || row.email,
                    password: tempPassword, // They'll reset this via email
                    emailVerified: null, // Not verified yet
                    // Add other fields as needed
                },
            })

            // Create a password reset token for them
            const resetToken = crypto.randomBytes(32).toString('hex')
            await prisma.verificationToken.create({
                data: {
                    email: row.email,
                    token: resetToken,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    type: 'PASSWORD_RESET',
                },
            })

            console.log(`✓ Imported: ${row.email}`)
            imported++
        } catch (error) {
            console.error(`✗ Failed: ${row.email}`, error)
            failed++
        }
    }

    console.log('\n=== Import Summary ===')
    console.log(`✓ Imported: ${imported}`)
    console.log(`⊘ Skipped: ${skipped}`)
    console.log(`✗ Failed: ${failed}`)
    console.log(`Total: ${data.length}`)

    await prisma.$disconnect()
}

importUsers().catch((error) => {
    console.error('Import failed:', error)
    process.exit(1)
})
