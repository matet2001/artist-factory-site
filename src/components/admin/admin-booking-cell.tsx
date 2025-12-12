'use client'

import {
    BookingData,
    BookingIntent,
    CellState,
} from '@/lib/booking-utils'
import { cn } from '@/lib/utils'
import { BookingStatus } from '@prisma/client'
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react'

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
    onSelectBooking?: (booking: BookingData) => void
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
    onSelectBooking,
}: AdminBookingCellProps) {
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

    const getUserName = () => {
        if (!booking?.user?.fullName) return ''
        const parts = booking.user.fullName.split(' ')
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1].charAt(0)}.`
        }
        return parts[0]
    }

    // Check if this is a half-hour booking (doesn't start at :00 or doesn't end at :00)
    const isHalfHourStart = booking?.startMinute === 30
    const isHalfHourEnd = booking?.endMinute === 30

    // Check if this booking has any half-hour settings
    const hasHalfHourSettings = isHalfHourStart || isHalfHourEnd

    const cellClasses = cn('h-16 relative transition-all duration-200 border border-border/50 overflow-hidden', {
        'bg-card/30 hover:bg-yellow-500/20 cursor-pointer':
            cellState === CellState.OPEN && !isPlanned,
        'bg-yellow-500/60 backdrop-blur-sm': cellState === CellState.PLANNED_CANCELABLE && !hasHalfHourSettings,
        'bg-primary/50 backdrop-blur-sm': cellState === CellState.UNVERIFIED && !hasHalfHourSettings,
        'bg-green-500/60 backdrop-blur-sm': cellState === CellState.VERIFIED_CANCELABLE && !hasHalfHourSettings,
    })

    const handleClick = () => {
        if (isLoading) return

        const intent: BookingIntent = {
            roomId,
            date,
            time,
        }

        // Only allow clicking on open cells to book
        if (cellState === CellState.OPEN) {
            onBook(intent)
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLoading || !booking || !onSelectBooking) return
        onSelectBooking(booking)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLoading) return

        const intent: BookingIntent = {
            roomId,
            date,
            time,
        }

        if (cellState === CellState.PLANNED_CANCELABLE && isPlanned) {
            onDeletePlanned(intent)
        } else if (
            cellState === CellState.UNVERIFIED ||
            cellState === CellState.VERIFIED_CANCELABLE ||
            cellState === CellState.PLANNED_CANCELABLE
        ) {
            onDeleteBooking(intent)
        }
    }

    // Get background color and positioning for half-hour bookings
    const getHalfHourBackgroundProps = () => {
        if (!hasHalfHourSettings) return null

        let bgColor = ''
        if (cellState === CellState.PLANNED_CANCELABLE) {
            bgColor = 'bg-yellow-500/60'
        } else if (cellState === CellState.UNVERIFIED) {
            bgColor = 'bg-primary/50'
        } else if (cellState === CellState.VERIFIED_CANCELABLE) {
            bgColor = 'bg-green-500/60'
        }

        let positionClass = ''
        if (isHalfHourStart && isHalfHourEnd) {
            // Middle 50% (25% from top, 25% from bottom)
            positionClass = 'top-1/4 bottom-1/4'
        } else if (isHalfHourStart) {
            // Bottom 50%
            positionClass = 'top-1/2 bottom-0'
        } else if (isHalfHourEnd) {
            // Top 50%
            positionClass = 'top-0 bottom-1/2'
        }

        return { bgColor, positionClass }
    }

    const halfHourBg = getHalfHourBackgroundProps()

    return (
        <td
            className={cn(cellClasses, 'group/cell')}
            onClick={handleClick}
        >
            {/* Background div for half-hour bookings */}
            {halfHourBg && (
                <div
                    className={cn(
                        'absolute left-0 right-0 backdrop-blur-sm',
                        halfHourBg.bgColor,
                        halfHourBg.positionClass
                    )}
                />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 z-10">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        {cellState === CellState.OPEN && !isPlanned && (
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        )}
                        {cellState === CellState.PLANNED_CANCELABLE && (
                            <>
                                <div className="absolute top-1 right-1 flex gap-1">
                                    <button
                                        onClick={handleDelete}
                                        className="p-1 rounded bg-red-500/80 hover:bg-red-500 opacity-0 group-hover/cell:opacity-100 transition-opacity cursor-pointer"
                                        title="Delete booking"
                                    >
                                        <Trash2 className="h-3 w-3 text-white" />
                                    </button>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center">
                                    {isPlanned && !booking ? (
                                        <>
                                            <div className="text-xs font-medium text-white truncate max-w-full">
                                                {customerName}
                                            </div>
                                            {customerBandName && (
                                                <div className="text-[10px] text-white/70 truncate max-w-full mt-0.5">
                                                    {customerBandName}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-xs font-medium text-white truncate max-w-full">
                                                {getUserName()}
                                            </div>
                                            {booking?.user?.bandName && (
                                                <div className="text-[10px] text-white/70 truncate max-w-full mt-0.5">
                                                    {booking.user.bandName}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        {(cellState === CellState.UNVERIFIED ||
                            cellState === CellState.VERIFIED_CANCELABLE) && (
                            <>
                                <div className="absolute top-1 right-1 flex gap-1">
                                    <button
                                        onClick={handleEdit}
                                        className="p-1 rounded bg-blue-500/80 hover:bg-blue-500 opacity-0 group-hover/cell:opacity-100 transition-opacity cursor-pointer"
                                        title="Edit booking"
                                    >
                                        <Edit className="h-3 w-3 text-white" />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-1 rounded bg-red-500/80 hover:bg-red-500 opacity-0 group-hover/cell:opacity-100 transition-opacity cursor-pointer"
                                        title="Delete booking"
                                    >
                                        <Trash2 className="h-3 w-3 text-white" />
                                    </button>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="text-xs font-medium text-white truncate max-w-full">
                                        {getUserName()}
                                    </div>
                                    {booking?.user?.bandName && (
                                        <div className="text-[10px] text-white/70 truncate max-w-full mt-0.5">
                                            {booking.user.bandName}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </td>
    )
}
