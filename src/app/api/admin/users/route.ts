import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Check if user is admin
        const session = await getServerSession(authOptions)
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('perPage') || '30')
        const search = searchParams.get('search') || ''

        // Build where clause for search
        const where = search
            ? {
                  OR: [
                      { name: { contains: search, mode: 'insensitive' as const } },
                      { email: { contains: search, mode: 'insensitive' as const } },
                      { bandName: { contains: search, mode: 'insensitive' as const } },
                  ],
              }
            : {}

        // Get total count for pagination
        const totalUsers = await prisma.user.count({ where })

        // Fetch users with pagination
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                bandName: true,
                isAdmin: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        bookings: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (page - 1) * perPage,
            take: perPage,
        })

        const totalPages = Math.ceil(totalUsers / perPage)

        return NextResponse.json({
            success: true,
            users,
            pagination: {
                page,
                perPage,
                totalUsers,
                totalPages,
            },
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}
