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
                <th className="px-4 py-4 text-center min-w-[120px]">
                    <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
                </th>
                {rooms.map((room) => (
                    <th key={room.id} className="px-4 py-4 text-center min-w-[180px]">
                        <Link
                            href={`/rooms/${room.id}`}
                            className="hover:text-primary transition-colors"
                        >
                            <h3 className="text-lg sm:text-xl font-bold">{tRooms(room.name)}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{room.size} fő</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {room.price.toLocaleString()} Ft/óra
                        </p>
                    </th>
                ))}
            </tr>
        </thead>
    )
}
