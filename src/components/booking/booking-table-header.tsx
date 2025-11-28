'use client'

import { DateSelector } from '@/components/booking/date-selector'
import { rooms } from '@/lib/rooms'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface BookingTableHeaderProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
}

export function BookingTableHeader({ selectedDate, onDateChange }: BookingTableHeaderProps) {
    const tRooms = useTranslations('ROOMS')

    return (
        <thead className="bg-card-elevated">
            <tr>
                <th>
                    <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
                </th>
                {rooms.map((room) => (
                    <th key={room.id} className="px-1 py-1 md:px-4 md:py-4 text-center">
                        <Link
                            href={`/rooms/${room.id}`}
                            className="hover:text-primary transition-colors block"
                        >
                            <h3 className="text-[11px] md:text-lg lg:text-xl font-bold break-words hyphens-auto">
                                {tRooms(room.name)}
                            </h3>
                        </Link>
                        <p className="text-[8px] md:text-sm text-muted-foreground mt-0.5 md:mt-1 hidden sm:block">
                            {room.size} fő
                        </p>
                        <p className="text-[7px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 hidden sm:block">
                            {room.price.toLocaleString()} Ft/óra
                        </p>
                    </th>
                ))}
            </tr>
        </thead>
    )
}
