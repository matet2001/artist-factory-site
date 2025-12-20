import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

// Old Neon database connection
const oldDb = new PrismaClient({
    datasources: {
        db: {
            url: process.env.OLD_NEON_URL,
        },
    },
})

// New Neon database connection
const newDb = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

async function migrateData() {
    console.log('🚀 Starting data migration from old Neon to new Neon...\n')

    try {
        // 1. Migrate Users (ALREADY DONE - SKIPPING)
        console.log('📋 Users already migrated (skipping)...')
        const users = await oldDb.user.findMany()
        console.log(`   Found ${users.length} users (already migrated)\n`)

        // 2. Migrate Rooms
        console.log('📋 Migrating Rooms...')
        const rooms = await oldDb.room.findMany()
        console.log(`   Found ${rooms.length} rooms`)

        for (const room of rooms) {
            // Map old schema fields to new schema
            // Old schema had: capacity, basePrice, image, airConditioned
            // New schema has: price (using basePrice as default)
            await newDb.room.create({
                data: {
                    id: room.id,
                    name: room.name,
                    slug: room.slug,
                    size: room.size,
                    price: (room as any).basePrice || 5500, // Default to 5500 if missing
                    description: room.description,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt,
                },
            })
        }
        console.log('   ✅ Rooms migrated\n')

        // 3. Migrate Bookings
        console.log('📋 Migrating Bookings...')
        const bookings = await oldDb.booking.findMany()
        console.log(`   Found ${bookings.length} bookings`)

        for (const booking of bookings) {
            await newDb.booking.create({
                data: {
                    id: booking.id,
                    userId: booking.userId,
                    roomId: booking.roomId,
                    date: booking.date,
                    time: booking.time,
                    startMinute: booking.startMinute,
                    endMinute: booking.endMinute,
                    status: booking.status,
                    note: booking.note,
                    verificationToken: booking.verificationToken,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt,
                },
            })
        }
        console.log('   ✅ Bookings migrated\n')

        console.log('🎉 Migration completed successfully!')
        console.log('\n📊 Summary:')
        console.log(`   - Users: ${users.length}`)
        console.log(`   - Rooms: ${rooms.length}`)
        console.log(`   - Bookings: ${bookings.length}`)
    } catch (error) {
        console.error('❌ Migration failed:', error)
        throw error
    } finally {
        await oldDb.$disconnect()
        await newDb.$disconnect()
    }
}

migrateData()
    .then(() => {
        console.log('\n✅ All done! You can now safely use the new Neon database.')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Migration error:', error)
        process.exit(1)
    })
