import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { name, phone, bandName } = body

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { id } })
        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: name.trim(),
                phone: phone?.trim() || null,
                bandName: bandName?.trim() || null,
            },
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
                _count: { select: { bookings: true } },
            },
        })

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}
