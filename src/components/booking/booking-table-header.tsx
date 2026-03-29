'use client'

import { DateSelector } from '@/components/booking/date-selector'
import { Button } from '@/components/ui/button'
import { rooms } from '@/lib/rooms'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface BookingTableHeaderProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    allowPastDates?: boolean
    onRefresh?: () => void
    isRefreshing?: boolean
}

export function BookingTableHeader({
    selectedDate,
    onDateChange,
    allowPastDates = false,
    onRefresh,
    isRefreshing = false,
}: BookingTableHeaderProps) {
    const tRooms = useTranslations('ROOMS')

    return (
        <thead className="bg-card-elevated">
            <tr>
                <th className="max-w-[220px]">
                    <div className={`flex items-center ${onRefresh ? 'justify-between gap-2 px-2' : 'justify-center'}`}>
                        {onRefresh && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                                className="h-10 w-10 shrink-0 bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                                title="Refresh"
                            >
                                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                        <DateSelector
                            selectedDate={selectedDate}
                            onDateChange={onDateChange}
                            allowPastDates={allowPastDates}
                        />
                    </div>
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
