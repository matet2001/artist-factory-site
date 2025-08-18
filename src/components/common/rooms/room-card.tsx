'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Room } from '@/lib/rooms'
import { DollarSign, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import router from 'next/router'

type Props = {
    room: Room
}

export default function RoomCard({ room }: Props) {
    const t = useTranslations('ROOMS')
    const imagePath = room.image ? `/rooms/${room.image}` : '/rooms/Room1.jpg'
    const goToRoom = () => router.push(`/room/${room.id}`)

    return (
        <Card
            onClick={goToRoom}
            className="flex flex-col w-full overflow-hidden cursor-pointer"
        >
            <div className="relative w-full h-64">
                <Image
                    src={imagePath}
                    alt={`${room.name} image`}
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            <CardHeader>
                <CardTitle className="text-lg sm:text-2xl font-semibold capitalize">
                    {t(room.name)}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <ul className="space-y-4">
                    <li className="flex items-center gap-x-3">
                        <DollarSign className="text-primary w-5 h-5" />
                        {t('BASE_PRICE')}: {room.price} Ft / óra
                    </li>
                    <li className="flex items-center gap-x-3">
                        <Users className="text-primary w-5 h-5" />
                        {t('SIZE')}: {room.size} fő
                    </li>
                </ul>
            </CardContent>

            <CardFooter>
                <Link href={`/room/${room.id}`} className="w-full px-4">
                    <Button
                        variant="default"
                        className="w-full uppercase font-semibold shadow-lg transition-transform hover:scale-105"
                    >
                        {t('CTA')}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
