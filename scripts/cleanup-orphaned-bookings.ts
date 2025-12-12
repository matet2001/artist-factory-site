/**
 * Script to identify and clean up orphaned bookings
 *
 * Orphaned bookings are bookings that:
 * 1. Were created as part of a failed batch operation (before transaction fix)
 * 2. May have invalid or missing user data
 * 3. Are blocking legitimate bookings
 *
 * Usage:
 *   npm run cleanup:bookings -- --dry-run    # See what would be deleted
 *   npm run cleanup:bookings -- --confirm    # Actually delete them
 *   npm run cleanup:bookings -- --date=2026-01-15  # Check specific date
 */

import prisma from '../src/lib/prisma'

interface CleanupOptions {
    dryRun: boolean
    date?: string
}

async function findOrphanedBookings(date?: string) {
    console.log('🔍 Searching for potentially orphaned bookings...\n')

    const whereClause: any = {}

    if (date) {
        const targetDate = new Date(date + 'T00:00:00.000Z')
        whereClause.date = targetDate
        console.log(`Filtering by date: ${date}\n`)
    }

    // Get all bookings with their user information
    const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bandName: true,
                },
            },
            room: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: [
            { date: 'asc' },
            { roomId: 'asc' },
            { time: 'asc' },
        ],
    })

    console.log(`📊 Total bookings found: ${bookings.length}\n`)

    if (bookings.length === 0) {
        console.log('✅ No bookings found to analyze.')
        return []
    }

    // Display all bookings for review
    console.log('📋 Booking Details:\n')
    console.log('ID                          | Date       | Time | Room   | Status   | User Name       | User Email')
    console.log('-'.repeat(120))

    bookings.forEach((booking) => {
        const dateStr = booking.date.toISOString().split('T')[0]
        const userName = booking.user?.name || 'N/A'
        const userEmail = booking.user?.email || 'N/A'

        console.log(
            `${booking.id.padEnd(28)} | ${dateStr} | ${String(booking.time).padStart(2)}:00 | ${booking.room.name.padEnd(6)} | ${booking.status.padEnd(8)} | ${userName.padEnd(15)} | ${userEmail}`
        )
    })

    console.log('\n')

    return bookings
}

async function deleteBookings(bookingIds: string[]) {
    console.log(`🗑️  Deleting ${bookingIds.length} booking(s)...\n`)

    const result = await prisma.booking.deleteMany({
        where: {
            id: {
                in: bookingIds,
            },
        },
    })

    console.log(`✅ Deleted ${result.count} booking(s)`)
    return result.count
}

async function promptForConfirmation(bookings: any[]): Promise<string[]> {
    console.log('\n⚠️  Please review the bookings above.')
    console.log('\nWhich bookings would you like to delete?')
    console.log('Enter booking IDs separated by commas, or "all" to delete all, or "none" to cancel:\n')

    // In a real interactive script, you'd use readline here
    // For now, return empty array to prevent accidental deletion
    console.log('❌ Interactive mode not implemented. Use --ids flag to specify booking IDs to delete.\n')
    return []
}

async function main() {
    const args = process.argv.slice(2)

    const options: CleanupOptions = {
        dryRun: true,
    }

    let bookingIdsToDelete: string[] = []

    // Parse command line arguments
    for (const arg of args) {
        if (arg === '--confirm') {
            options.dryRun = false
        } else if (arg.startsWith('--date=')) {
            options.date = arg.split('=')[1]
        } else if (arg.startsWith('--ids=')) {
            bookingIdsToDelete = arg.split('=')[1].split(',').map(id => id.trim())
        }
    }

    console.log('\n🧹 Orphaned Bookings Cleanup Script\n')
    console.log('=' .repeat(50) + '\n')

    if (options.dryRun && bookingIdsToDelete.length === 0) {
        console.log('🔒 DRY RUN MODE - No changes will be made\n')
    }

    try {
        const bookings = await findOrphanedBookings(options.date)

        if (bookings.length === 0) {
            return
        }

        if (bookingIdsToDelete.length > 0) {
            // Validate that all IDs exist in the found bookings
            const validIds = bookingIdsToDelete.filter(id =>
                bookings.some(b => b.id === id)
            )

            if (validIds.length === 0) {
                console.log('❌ None of the provided booking IDs were found.')
                return
            }

            if (validIds.length !== bookingIdsToDelete.length) {
                console.log(`⚠️  Warning: ${bookingIdsToDelete.length - validIds.length} invalid ID(s) were ignored.\n`)
            }

            if (options.dryRun) {
                console.log(`\n🔍 DRY RUN: Would delete ${validIds.length} booking(s)`)
                console.log('Run with --confirm to actually delete these bookings.\n')
            } else {
                await deleteBookings(validIds)
            }
        } else {
            console.log('\n💡 To delete specific bookings, run:')
            console.log('   npm run cleanup:bookings -- --ids=<booking-id-1>,<booking-id-2> --confirm\n')
            console.log('Example:')
            console.log(`   npm run cleanup:bookings -- --ids=${bookings[0].id} --confirm\n`)
        }
    } catch (error) {
        console.error('\n❌ Error:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
