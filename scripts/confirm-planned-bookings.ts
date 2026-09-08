/**
 * Promotes a customer's stuck cart holds to real bookings.
 *
 * Some visitors confirmed an order that the old booking page only partly saved:
 * slots picked outside the rendered week never reached /confirm, so they stayed
 * PLANNED while the customer got a success dialog and a confirmation email. Those
 * rows are genuine bookings that were never recorded as such.
 *
 * Scoped to one customer at a time and dry-run by default, because the office has
 * to confirm with each of them first — a stuck booking and an abandoned cart look
 * exactly the same in the data.
 *
 * Usage:
 *   npm run confirm:planned -- --email=someone@example.com
 *   npm run confirm:planned -- --email=someone@example.com --confirm --allow-production
 *
 *   --include-past   also promote holds whose date has already passed (off by default)
 */

import { PrismaClient } from '@prisma/client'
import { assertWritable, countdown, printTarget } from './db-guard'

const prisma = new PrismaClient()

async function main() {
    const args = process.argv.slice(2)
    const apply = args.includes('--confirm')
    const includePast = args.includes('--include-past')
    const email = args.find((a) => a.startsWith('--email='))?.split('=')[1]

    if (!email) {
        throw new Error(
            'An --email is required. Promoting every stuck hold at once would sweep up ' +
                'abandoned carts along with the real bookings.'
        )
    }

    console.log('\n📌 Promote stuck cart holds to bookings\n' + '='.repeat(50))

    const target = apply ? assertWritable() : printTarget(`list stuck holds for ${email}`)
    if (apply) {
        printTarget(`PROMOTE holds to VERIFIED for ${email}`)
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new Error(`No user with email ${email}`)
    }

    const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z')

    const holds = await prisma.booking.findMany({
        where: {
            userId: user.id,
            status: 'PLANNED',
            ...(includePast ? {} : { date: { gte: today } }),
        },
        include: { room: { select: { name: true } } },
        orderBy: [{ date: 'asc' }, { roomId: 'asc' }, { time: 'asc' }],
    })

    console.log(`Customer: ${user.name || '(no name)'} <${user.email}>`)
    console.log(`Holds to promote: ${holds.length}${includePast ? '' : ' (future dates only)'}\n`)

    if (holds.length === 0) {
        console.log('✅ Nothing to do.')
        return
    }

    let lastDate = ''
    for (const booking of holds) {
        const date = booking.date.toISOString().split('T')[0]
        if (date !== lastDate) {
            console.log(`  ${date}`)
            lastDate = date
        }
        console.log(
            `     ${String(booking.time).padStart(2)}:00-${String(booking.time + 1).padStart(2)}:00  ` +
                `${booking.roomId}   created ${booking.createdAt.toISOString().slice(0, 16)}`
        )
    }

    const days = new Set(holds.map((b) => b.date.toISOString().split('T')[0])).size
    console.log(`\n  → ${holds.length} hour(s) across ${days} day(s)\n`)

    if (!apply) {
        console.log('🔒 Dry run — nothing was changed.')
        console.log('   Re-run with --confirm (and --allow-production on prod) to apply.\n')
        return
    }

    if (target.environment === 'production') {
        await countdown()
    }

    const result = await prisma.booking.updateMany({
        where: { id: { in: holds.map((b) => b.id) } },
        data: { status: 'VERIFIED', verifiedAt: new Date() },
    })

    console.log(`✅ Promoted ${result.count} hold(s) to VERIFIED.\n`)
    console.log('   No email was sent — the office confirms these by phone, and a')
    console.log('   confirmation listing hundreds of hours would be unreadable anyway.')
    console.log('   If the app is already running the cached build, redeploy (or wait for')
    console.log('   the next booking write) so the availability grid picks this up.\n')
}

main()
    .catch((error) => {
        console.error(`\n❌ ${error instanceof Error ? error.message : error}\n`)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
