import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import Papa from 'papaparse'

const prisma = new PrismaClient()

interface CSVUser {
    id: string
    name: string
    email: string
    phone: string
}

interface ImportResult {
    totalUsersInDB: number
    usersWithoutPhone: number
    matchedByEmail: number
    matchedByName: number
    updatedSuccessfully: number
    skippedNoMatch: number
    errors: Array<{ userName: string; error: string }>
    duplicateNames: Array<{ name: string; count: number }>
}

async function importMissingPhones(dryRun: boolean = true) {
    console.log('🔄 Starting phone number import...')
    console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (will update database)'}`)
    console.log('─'.repeat(60))

    const result: ImportResult = {
        totalUsersInDB: 0,
        usersWithoutPhone: 0,
        matchedByEmail: 0,
        matchedByName: 0,
        updatedSuccessfully: 0,
        skippedNoMatch: 0,
        errors: [],
        duplicateNames: [],
    }

    try {
        // Load CSV file
        const csvPath = path.join(process.cwd(), 'data', 'ArtistFactory users.csv')
        console.log(`📁 Loading CSV from: ${csvPath}`)

        const fileContent = fs.readFileSync(csvPath, 'utf-8')
        const parseResult = Papa.parse<CSVUser>(fileContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
        })

        const csvUsers = parseResult.data

        console.log(`✅ Loaded ${csvUsers.length} users from CSV\n`)

        // Create lookup maps for faster searching
        const csvByEmail = new Map<string, CSVUser>()
        const csvByName = new Map<string, CSVUser[]>()

        csvUsers.forEach(csvUser => {
            // Email lookup (lowercase for case-insensitive)
            if (csvUser.email) {
                csvByEmail.set(csvUser.email.toLowerCase().trim(), csvUser)
            }

            // Name lookup (handle multiple users with same name)
            const name = csvUser.name.trim()
            if (!csvByName.has(name)) {
                csvByName.set(name, [])
            }
            csvByName.get(name)!.push(csvUser)
        })

        console.log(`📊 CSV indexed: ${csvByEmail.size} unique emails, ${csvByName.size} unique names\n`)

        // Get all users from database who are missing phone numbers
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        })

        result.totalUsersInDB = allUsers.length
        const usersWithoutPhone = allUsers.filter(u => !u.phone || u.phone.trim() === '')
        result.usersWithoutPhone = usersWithoutPhone.length

        console.log(`📊 Database Stats:`)
        console.log(`   Total users: ${result.totalUsersInDB}`)
        console.log(`   Without phone: ${result.usersWithoutPhone}`)
        console.log(`   With phone: ${result.totalUsersInDB - result.usersWithoutPhone}\n`)

        console.log('🔍 Starting matching process...\n')

        // Process each user without a phone
        for (const dbUser of usersWithoutPhone) {
            let csvUser: CSVUser | undefined
            let matchType: 'email' | 'name' | 'none' = 'none'

            // Strategy 1: Try to match by email (most reliable)
            if (dbUser.email && !dbUser.email.includes('@artistfactory.local')) {
                csvUser = csvByEmail.get(dbUser.email.toLowerCase().trim())
                if (csvUser) {
                    matchType = 'email'
                    result.matchedByEmail++
                }
            }

            // Strategy 2: If no email match, try name (less reliable)
            if (!csvUser && dbUser.name) {
                const nameMatches = csvByName.get(dbUser.name.trim())

                if (nameMatches && nameMatches.length === 1) {
                    // Only match by name if there's exactly ONE match (safe)
                    csvUser = nameMatches[0]
                    matchType = 'name'
                    result.matchedByName++
                } else if (nameMatches && nameMatches.length > 1) {
                    // Multiple users with same name - skip for safety
                    result.duplicateNames.push({
                        name: dbUser.name,
                        count: nameMatches.length,
                    })
                    console.log(`⚠️  Skipped "${dbUser.name}" - ${nameMatches.length} matches in CSV (duplicate name)`)
                    result.skippedNoMatch++
                    continue
                }
            }

            // Update if we found a match
            if (csvUser && csvUser.phone) {
                const phoneToImport = csvUser.phone.trim()

                try {
                    if (!dryRun) {
                        await prisma.user.update({
                            where: { id: dbUser.id },
                            data: { phone: phoneToImport },
                        })
                    }

                    result.updatedSuccessfully++
                    console.log(
                        `✅ [${matchType.toUpperCase()}] ${dbUser.name} → Phone: "${phoneToImport}" ${dryRun ? '(would update)' : '(updated)'}`
                    )
                } catch (error) {
                    result.errors.push({
                        userName: dbUser.name || 'Unknown',
                        error: error instanceof Error ? error.message : String(error),
                    })
                    console.log(`❌ Error updating ${dbUser.name || 'Unknown'}: ${error}`)
                }
            } else {
                // No match found
                result.skippedNoMatch++
                console.log(`⚠️  No match for "${dbUser.name}" (${dbUser.email || 'no email'})`)
            }
        }

        // Print summary
        console.log('\n' + '═'.repeat(60))
        console.log('📊 IMPORT SUMMARY')
        console.log('═'.repeat(60))
        console.log(`Total users in DB:          ${result.totalUsersInDB}`)
        console.log(`Users without phone:        ${result.usersWithoutPhone}`)
        console.log(``)
        console.log(`Matched by email:           ${result.matchedByEmail}`)
        console.log(`Matched by name:            ${result.matchedByName}`)
        console.log(`Skipped (no match):         ${result.skippedNoMatch}`)
        console.log(``)
        console.log(`${dryRun ? 'Would update' : 'Successfully updated'}:     ${result.updatedSuccessfully}`)
        console.log(`Errors:                     ${result.errors.length}`)
        console.log('═'.repeat(60))

        if (result.duplicateNames.length > 0) {
            console.log(`\n⚠️  Found ${result.duplicateNames.length} duplicate names (skipped for safety):`)
            result.duplicateNames.forEach(dup => {
                console.log(`   - "${dup.name}" (${dup.count} matches in CSV)`)
            })
        }

        if (result.errors.length > 0) {
            console.log('\n❌ Errors encountered:')
            result.errors.forEach(err => {
                console.log(`   - ${err.userName}: ${err.error}`)
            })
        }

        if (dryRun) {
            console.log('\n💡 This was a DRY RUN - no changes were made to the database.')
            console.log('   Run with --live flag to actually update the database.')
        } else {
            console.log('\n✅ Import completed! Database has been updated.')
        }

    } catch (error) {
        console.error('❌ Fatal error:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }

    return result
}

// Run the script
const args = process.argv.slice(2)
const dryRun = !args.includes('--live')

if (!dryRun) {
    console.log('⚠️  WARNING: You are about to update the production database!')
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n')

    // Give 5 seconds to cancel
    setTimeout(() => {
        importMissingPhones(false).catch(console.error)
    }, 5000)
} else {
    importMissingPhones(true).catch(console.error)
}
