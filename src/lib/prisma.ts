import { PrismaClient } from '@prisma/client'

// Configure Prisma for optimal Neon.tech usage
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
        // Optimize connection pool for Neon
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma