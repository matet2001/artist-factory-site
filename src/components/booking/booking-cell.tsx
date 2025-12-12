'use client'

import {
    BookingData,
    BookingIntent,
    CellState,
    formatDisplayName,
    isTimeInPast,
    isWithin24Hours,
    isWithin48Hours,
} from '@/lib/booking-utils'
import { cn } from '@/lib/utils'
import { BookingStatus } from '@prisma/client'
import { Check, Loader2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BookingCellProps {
    booking?: BookingData
    roomId: string
    time: number
    date: Date
    isPlannedByUser: boolean
    isLoading?: boolean
    onBook: (intent: BookingIntent) => void
    onDeletePlanned: (intent: BookingIntent) => void
    onCancelVerified?: (intent: BookingIntent) => void
    onToggleDeleteSelection?: (bookingId: string) => void
    isSelectedForDeletion?: boolean
    currentUserId?: string
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
    onCancelVerified,
    onToggleDeleteSelection,
    isSelectedForDeletion = false,
    currentUserId,
}: BookingCellProps) {
    const t = useTranslations('BOOKING')
    const isPast = isTimeInPast(date, time)
    const isTooSoon = isWithin24Hours(date, time)
    const isVerifiedByUser =
        booking?.status === BookingStatus.VERIFIED && booking?.userId === currentUserId

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
                    return isVerifiedByUser && !isWithin48Hours(date, time)
                        ? CellState.VERIFIED_CANCELABLE
                        : CellState.VERIFIED
            }
        }

        if (isPast) return CellState.CLOSED
        if (isTooSoon && !booking) return CellState.TOO_SOON

        return CellState.OPEN
    }

    const cellState = getCellState()

    const getDisplayName = () => {
        if (!booking?.user) return ''
        // Show name for all bookings (including past ones on current day)
        return formatDisplayName(booking.user)
    }

    const cellClasses = cn(
        'h-10 md:h-16 relative transition-all duration-200 border border-border/50',
        {
            'bg-card/30 hover:bg-yellow-500/20 cursor-pointer': cellState === CellState.OPEN,
            'bg-card/20': cellState === CellState.CLOSED,
            'bg-card/20 opacity-60': cellState === CellState.TOO_SOON,
            'bg-yellow-500/60 backdrop-blur-sm': cellState === CellState.PLANNED,
            'bg-yellow-500/60 hover:bg-red-500/60 cursor-pointer backdrop-blur-sm':
                cellState === CellState.PLANNED_CANCELABLE,
            'bg-primary/50 backdrop-blur-sm': cellState === CellState.UNVERIFIED,
            'bg-green-500/60 backdrop-blur-sm': cellState === CellState.VERIFIED,
            'bg-green-500/60 hover:bg-blue-500/60 cursor-pointer backdrop-blur-sm':
                cellState === CellState.VERIFIED_CANCELABLE,
            'bg-blue-500/80 backdrop-blur-sm ring-2 ring-blue-400': isSelectedForDeletion,
            'bg-card/10 opacity-50': cellState === CellState.PAST,
        }
    )

    const handleClick = () => {
        if (isLoading) return

        const intent: BookingIntent = {
            roomId,
            time,
            date,
        }

        // If it's verified and cancelable, toggle selection instead of immediate cancel
        if (cellState === CellState.VERIFIED_CANCELABLE && onToggleDeleteSelection && booking) {
            onToggleDeleteSelection(booking.id)
        } else if (cellState === CellState.OPEN) {
            onBook(intent)
        } else if (cellState === CellState.PLANNED_CANCELABLE) {
            onDeletePlanned(intent)
        }
    }

    const displayName = getDisplayName()

    return (
        <td className={cellClasses} onClick={handleClick}>
            <div className="absolute inset-0 flex items-center justify-center">
                {isLoading ? (
                    <Loader2 className="h-3 w-3 md:h-5 md:w-5 animate-spin text-foreground/70" />
                ) : cellState === CellState.OPEN ? (
                    <Plus className="h-4 w-4 md:h-6 md:w-6 text-foreground/50 group-hover:text-foreground transition-colors" />
                ) : cellState === CellState.VERIFIED_CANCELABLE ? (
                    <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1">
                        {displayName && (
                            <span className="text-[9px] md:text-xs font-medium text-foreground px-1 md:px-2 text-center">
                                {displayName}
                            </span>
                        )}
                        {isSelectedForDeletion ? (
                            <Check className="h-3 w-3 md:h-5 md:w-5 text-white font-bold" />
                        ) : (
                            <span className="text-[8px] md:text-xs text-foreground/70">
                                {t('CLICK_TO_SELECT')}
                            </span>
                        )}
                    </div>
                ) : displayName ? (
                    <span className="text-[9px] md:text-sm font-medium text-foreground px-1 md:px-2 text-center">
                        {displayName}
                    </span>
                ) : null}
            </div>
        </td>
    )
}
