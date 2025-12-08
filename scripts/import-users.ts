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
    const csvFile = fs.readFileSync('./data/ArtistFactory users.csv', 'utf8')

    const { data } = Papa.parse<OldUser>(csvFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    })

    console.log(`Found ${data.length} users to import`)

    let imported = 0
    let skipped = 0
    let failed = 0
    const seenEmails = new Set<string>() // Track emails we've seen in the CSV

    for (const row of data) {
        try {
            // Skip if no email or if it's the admin user
            if (!row.email || row.email === 'info@artistfactory.hu') {
                console.log(`Skipped: ${row.email || 'no email'} (admin or invalid)`)
                skipped++
                continue
            }

            // Skip if we've already seen this email in the CSV (duplicate in CSV)
            if (seenEmails.has(row.email)) {
                console.log(`Skipped: ${row.email} (duplicate in CSV)`)
                skipped++
                continue
            }
            seenEmails.add(row.email)

            // Check if user already exists in database
            const existingUser = await prisma.user.findUnique({
                where: { email: row.email },
            })

            if (existingUser) {
                console.log(`Skipped: ${row.email} (already exists in DB)`)
                skipped++
                continue
            }

            // Create user with a temporary random password (they won't know it)
            const tempPassword = crypto.randomBytes(32).toString('hex')

            // Accept ANY phone number as-is (convert to string if needed)
            let phoneValue = null
            if (row.phone !== null && row.phone !== undefined && row.phone !== '') {
                phoneValue = String(row.phone).trim()
                // Only set if there's actually a value after trimming
                if (phoneValue.length === 0) {
                    phoneValue = null
                }
            }

            await prisma.user.create({
                data: {
                    email: row.email,
                    name: row.name || row.email,
                    phone: phoneValue,
                    bandName: row.bandName || null,
                    password: tempPassword, // They'll reset this via email
                    emailVerified: null, // Not verified yet
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
        } catch (error: any) {
            const errorMsg = error?.message || String(error)
            console.error(`✗ Failed: ${row.email} - ${errorMsg}`)
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
