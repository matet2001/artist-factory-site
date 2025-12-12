/**
 * Check if a specific slot is actually booked in the database
 */

import prisma from '../src/lib/prisma'

async function checkSlot(dateStr: string, time: number, roomId: string) {
    console.log('\n🔍 Checking slot availability...')
    console.log(`Date: ${dateStr}`)
    console.log(`Time: ${time}:00`)
    console.log(`Room: ${roomId}\n`)

    const bookingDate = new Date(dateStr + 'T00:00:00.000Z')

    const booking = await prisma.booking.findUnique({
        where: {
            date_time_roomId: {
                date: bookingDate,
                time: time,
                roomId: roomId,
            },
        },
        include: {
            user: true,
            room: true,
        },
    })

    if (booking) {
        console.log('❌ SLOT IS BOOKED')
        console.log('\nBooking Details:')
        console.log(`  ID: ${booking.id}`)
        console.log(`  Status: ${booking.status}`)
        console.log(`  User: ${booking.user.name || booking.user.email}`)
        console.log(`  User Email: ${booking.user.email}`)
        console.log(`  Room: ${booking.room.name}`)
        console.log(`  Created: ${booking.createdAt}`)
        console.log(`  Note: ${booking.note || 'None'}`)
    } else {
        console.log('✅ SLOT IS AVAILABLE (not in database)')
    }

    await prisma.$disconnect()
}

// Parse command line args
const args = process.argv.slice(2)
const dateArg = args.find((arg) => arg.startsWith('--date='))
const timeArg = args.find((arg) => arg.startsWith('--time='))
const roomArg = args.find((arg) => arg.startsWith('--room='))

if (!dateArg || !timeArg || !roomArg) {
    console.log('Usage: npm run check:slot -- --date=YYYY-MM-DD --time=HH --room=roomId')
    console.log('Example: npm run check:slot -- --date=2026-01-15 --time=17 --room=room1')
    process.exit(1)
}

const date = dateArg.split('=')[1]
const time = parseInt(timeArg.split('=')[1])
const room = roomArg.split('=')[1]

checkSlot(date, time, room)
