/**
 * Reports — and optionally deletes — abandoned cart holds.
 *
 * A PLANNED booking is created the moment a visitor clicks a cell. If they never
 * confirm, the row stays behind and shows up in the table looking like a real
 * booking. This lists them so the office can tell a genuine stuck booking from
 * an abandoned one before anything is removed.
 *
 * Usage:
 *   npm run cleanup:planned                 # dry run, shows what would go
 *   npm run cleanup:planned -- --confirm    # actually delete them
 *   npm run cleanup:planned -- --older-than=1440   # minutes, default 1440 (24h)
 */

import { PrismaClient } from '@prisma/client'
import { PLANNED_DELETE_AFTER_MINUTES } from '../src/lib/booking-utils'
import { assertWritable, countdown, printTarget } from './db-guard'

const prisma = new PrismaClient()

async function main() {
    const args = process.argv.slice(2)
    const confirm = args.includes('--confirm')
    const olderThanArg = args.find((a) => a.startsWith('--older-than='))
    const olderThanMinutes = olderThanArg
        ? Number(olderThanArg.split('=')[1])
        : PLANNED_DELETE_AFTER_MINUTES

    if (!Number.isFinite(olderThanMinutes) || olderThanMinutes <= 0) {
        throw new Error('--older-than must be a positive number of minutes')
    }

    console.log('\n🧹 Abandoned cart hold cleanup\n' + '='.repeat(50))

    const target = confirm ? assertWritable() : printTarget('list abandoned cart holds')
    if (confirm) {
        printTarget(`DELETE cart holds older than ${olderThanMinutes} minutes`)
    }

    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000)

    const stale = await prisma.booking.findMany({
        where: { status: 'PLANNED', createdAt: { lte: cutoff } },
        include: {
            user: { select: { name: true, email: true } },
            room: { select: { name: true } },
        },
        orderBy: [{ createdAt: 'asc' }],
    })

    console.log(`Found ${stale.length} cart hold(s) created before ${cutoff.toISOString()}\n`)

    if (stale.length === 0) {
        console.log('✅ Nothing to clean up.')
        return
    }

    console.log(
        'ID'.padEnd(28) +
            ' | Date       | Time  | Room   | Created             | Customer'
    )
    console.log('-'.repeat(120))

    for (const booking of stale) {
        console.log(
            `${booking.id.padEnd(28)} | ${booking.date.toISOString().split('T')[0]} | ` +
                `${String(booking.time).padStart(2)}:00 | ${booking.roomId.padEnd(6)} | ` +
                `${booking.createdAt.toISOString().slice(0, 19)} | ` +
                `${booking.name || booking.user.name || booking.user.email}`
        )
    }

    console.log('')

    if (!confirm) {
        console.log('🔒 Dry run — nothing was deleted.')
        console.log('   Re-run with --confirm to delete the rows listed above.\n')
        return
    }

    if (target.environment === 'production') {
        await countdown()
    }

    const result = await prisma.booking.deleteMany({
        where: { id: { in: stale.map((b) => b.id) } },
    })

    console.log(`✅ Deleted ${result.count} cart hold(s).\n`)
}

main()
    .catch((error) => {
        console.error(`\n❌ ${error instanceof Error ? error.message : error}\n`)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
