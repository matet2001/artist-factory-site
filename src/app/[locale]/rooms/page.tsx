'use client'

import RoomSection from '@/components/common/rooms/room-section'
import { rooms } from '@/lib/rooms'
import { useTranslations } from 'next-intl'

export default function RoomsPage() {
    const t = useTranslations('ROOMS')

    return (
        <main>
            <div className="mx-auto max-w-4xl lg:text-center mb-5">
                <h2 className="text-sm uppercase text-muted-foreground tracking-[0.25em]">
                    {t('PRE_TITLE')}
                </h2>

                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
                    {t('TITLE')}
                </h1>

                <p className="mt-6 text-lg text-muted-foreground">{t('DESCRIPTION')}</p>
            </div>
            {rooms.map((room, ) => (
                <RoomSection
                    key={room.id}
                    room={room}
                />
            ))}
        </main>
    )
}
