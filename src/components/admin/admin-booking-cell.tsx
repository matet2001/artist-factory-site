'use client'

import { BookingStatus } from '@prisma/client'
import { Plus, Loader2, X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    BookingData,
    BookingIntent,
    CellState,
    formatDisplayName,
    isTimeInPast,
} from '@/lib/booking-utils'

interface AdminBookingCellProps {
    booking?: BookingData
    roomId: string
    time: number
    date: Date
    isPlanned: boolean
    isLoading?: boolean
    customerName?: string
    customerBandName?: string
    onBook: (intent: BookingIntent) => void
    onDeletePlanned: (intent: BookingIntent) => void
    onDeleteBooking: (intent: BookingIntent) => void
}

export function AdminBookingCell({
    booking,
    roomId,
    time,
    date,
    isPlanned,
    isLoading = false,
    customerName,
    customerBandName,
    onBook,
    onDeletePlanned,
    onDeleteBooking,
}: AdminBookingCellProps) {
    const isPast = isTimeInPast(date, time)

    const getCellState = (): CellState => {
        // Check if this slot is planned by admin (not yet saved to database)
        if (isPlanned && !booking) {
            return CellState.PLANNED_CANCELABLE
        }

        if (booking) {
            switch (booking.status) {
                case BookingStatus.PLANNED:
                    return CellState.PLANNED_CANCELABLE
                case BookingStatus.UNVERIFIED:
                    return CellState.UNVERIFIED
                case BookingStatus.VERIFIED:
                    return CellState.VERIFIED_CANCELABLE
            }
        }

        return CellState.OPEN
    }

    const cellState = getCellState()

    const getDisplayName = () => {
        if (!booking?.user) return ''
        return formatDisplayName(booking.user)
    }

    const cellClasses = cn('h-16 relative transition-all duration-200 border border-border/50', {
        'bg-card/30 hover:bg-yellow-500/20 cursor-pointer':
            cellState === CellState.OPEN && !isPlanned,
        'bg-yellow-500/60 hover:bg-red-500/60 cursor-pointer backdrop-blur-sm':
            cellState === CellState.PLANNED_CANCELABLE,
        'bg-primary/50 hover:bg-red-500/60 cursor-pointer backdrop-blur-sm':
            cellState === CellState.UNVERIFIED,
        'bg-green-500/60 hover:bg-red-500/60 cursor-pointer backdrop-blur-sm':
            cellState === CellState.VERIFIED_CANCELABLE,
    })

    const handleClick = () => {
        if (isLoading) return

        const intent: BookingIntent = {
            roomId,
            date,
            time,
        }

        if (cellState === CellState.OPEN) {
            onBook(intent)
        } else if (cellState === CellState.PLANNED_CANCELABLE && isPlanned) {
            onDeletePlanned(intent)
        } else if (
            cellState === CellState.UNVERIFIED ||
            cellState === CellState.VERIFIED_CANCELABLE ||
            cellState === CellState.PLANNED_CANCELABLE
        ) {
            onDeleteBooking(intent)
        }
    }

    return (
        <td className={cn(cellClasses, 'group/cell')} onClick={handleClick}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        {cellState === CellState.OPEN && !isPlanned && (
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        )}
                        {cellState === CellState.PLANNED_CANCELABLE && (
                            <>
                                <X className="absolute top-1 right-1 h-4 w-4 text-white opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                <div className="flex flex-col items-center justify-center text-center">
                                    {isPlanned && !booking ? (
                                        <>
                                            {customerBandName ? (
                                                <>
                                                    <div className="text-xs font-medium text-white truncate max-w-full">
                                                        {customerBandName}
                                                    </div>
                                                    <div className="text-[10px] text-white/70 truncate max-w-full mt-0.5">
                                                        {customerName}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-xs font-medium text-white truncate max-w-full">
                                                    {customerName}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-xs font-medium text-white truncate max-w-full">
                                            {getDisplayName()}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {(cellState === CellState.UNVERIFIED ||
                            cellState === CellState.VERIFIED_CANCELABLE) && (
                            <>
                                <Trash2 className="absolute top-1 right-1 h-4 w-4 text-white opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                <div className="flex flex-col items-center justify-center text-center">
                                    {booking?.user?.bandName ? (
                                        <>
                                            <div className="text-xs font-medium text-white truncate max-w-full">
                                                {booking.user.bandName}
                                            </div>
                                            <div className="text-[10px] text-white/70 truncate max-w-full mt-0.5">
                                                {getDisplayName()}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-xs font-medium text-white truncate max-w-full">
                                            {getDisplayName()}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {isPast && booking && (
                            <div className="text-xs font-medium text-muted-foreground truncate max-w-full">
                                {getDisplayName()}
                            </div>
                        )}
                    </>
                )}
            </div>
        </td>
    )
}
