import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, phone: true, bandName: true },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, bandName } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
        return NextResponse.json({ error: 'FULL_NAME_REQUIRED' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: name.trim(),
            phone: phone?.trim() || null,
            bandName: bandName?.trim() || null,
        },
        select: { id: true, name: true, email: true, phone: true, bandName: true },
    })

    return NextResponse.json({ user: updatedUser })
}
