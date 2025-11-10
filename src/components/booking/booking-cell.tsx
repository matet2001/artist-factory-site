'use client'

import { BookingStatus } from '@prisma/client'
import { Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BookingData, BookingIntent, CellState, formatDisplayName, isTimeInPast } from '@/lib/booking-utils'

interface BookingCellProps {
    booking?: BookingData
    roomId: string
    time: number
    date: Date
    isPlannedByUser: boolean
    isLoading?: boolean
    onBook: (intent: BookingIntent) => void
    onDeletePlanned: (intent: BookingIntent) => void
}

export function BookingCell({
    booking,
    roomId,
    time,
    date,
    isPlannedByUser,
    isLoading = false,
    onBook,
    onDeletePlanned,
}: BookingCellProps) {
    const isPast = isTimeInPast(date, time)

    const getCellState = (): CellState => {
        if (isPast && booking) {
            return CellState.PAST
        }

        if (booking) {
            switch (booking.status) {
                case BookingStatus.PLANNED:
                    return isPlannedByUser ? CellState.PLANNED_CANCELABLE : CellState.PLANNED
                case BookingStatus.UNVERIFIED:
                    return CellState.UNVERIFIED
                case BookingStatus.VERIFIED:
                    return CellState.VERIFIED
            }
        }

        return isPast ? CellState.CLOSED : CellState.OPEN
    }

    const cellState = getCellState()

    const getDisplayName = () => {
        if (!booking?.user) return ''
        if (isPast) return '' // Hide name for past bookings
        return formatDisplayName(booking.user)
    }

    const cellClasses = cn('h-16 relative transition-all duration-200 border border-border/50', {
        'bg-card/30 hover:bg-yellow-500/20 cursor-pointer': cellState === CellState.OPEN,
        'bg-card/20': cellState === CellState.CLOSED,
        'bg-yellow-500/60 backdrop-blur-sm': cellState === CellState.PLANNED,
        'bg-yellow-500/60 hover:bg-red-500/60 cursor-pointer backdrop-blur-sm':
            cellState === CellState.PLANNED_CANCELABLE,
        'bg-primary/50 backdrop-blur-sm': cellState === CellState.UNVERIFIED,
        'bg-green-500/60 backdrop-blur-sm': cellState === CellState.VERIFIED,
        'bg-card/10 opacity-50': cellState === CellState.PAST,
    })

    const handleClick = () => {
        if (isLoading) return

        if (cellState === CellState.OPEN) {
            onBook({ roomId, time })
        } else if (cellState === CellState.PLANNED_CANCELABLE) {
            onDeletePlanned({ roomId, time })
        }
    }

    const displayName = getDisplayName()

    return (
        <td className={cellClasses} onClick={handleClick}>
            <div className="absolute inset-0 flex items-center justify-center">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-foreground/70" />
                ) : cellState === CellState.OPEN ? (
                    <Plus className="h-6 w-6 text-foreground/50 group-hover:text-foreground transition-colors" />
                ) : displayName ? (
                    <span className="text-sm font-medium text-foreground px-2 text-center">
                        {displayName}
                    </span>
                ) : null}
            </div>
        </td>
    )
}
