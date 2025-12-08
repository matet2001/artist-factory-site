import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function cleanup() {
    const result = await prisma.user.deleteMany({
        where: { isAdmin: false }
    })

    console.log(`Deleted ${result.count} non-admin users`)

    await prisma.$disconnect()
}

cleanup()
