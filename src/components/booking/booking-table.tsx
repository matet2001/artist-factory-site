'use client'

import { BookingTableHeader } from '@/components/booking/booking-table-header'
import { TimelineIndicator } from '@/components/booking/timeline-indicator'
import { BookingData, BookingIntent } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { Loader2 } from 'lucide-react'
import { BookingCell } from './booking-cell'

interface BookingTableProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    hours: number[]
    bookings: BookingData[]
    isLoading: boolean
    loadingCells: Set<string>
    timelinePosition: number | null
    isToday: boolean
    getBooking: (roomId: string, time: number) => BookingData | undefined
    isPlannedByUser: (roomId: string, time: number) => boolean
    onBook: (intent: BookingIntent) => void
    onDeletePlanned: (intent: BookingIntent) => void
}

export function BookingTable({
    selectedDate,
    onDateChange,
    hours,
    bookings,
    isLoading,
    loadingCells,
    timelinePosition,
    isToday,
    getBooking,
    isPlannedByUser,
    onBook,
    onDeletePlanned,
}: BookingTableProps) {
    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-border rounded-xl shadow-lg relative">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    )}

                    <table className="min-w-full divide-y divide-border">
                        <BookingTableHeader
                            selectedDate={selectedDate}
                            onDateChange={onDateChange}
                        />

                        <tbody className="divide-y divide-border bg-card/50 relative">
                            {/* Current Time Indicator */}
                            {isToday && timelinePosition !== null && !isLoading && (
                                <TimelineIndicator position={timelinePosition} />
                            )}

                            {hours.map((time) => (
                                <tr key={time} className="group">
                                    <td className="px-4 py-3 text-center font-semibold whitespace-nowrap bg-card-elevated">
                                        {time}:00 - {time + 1}:00
                                    </td>
                                    {rooms.map((room) => (
                                        <BookingCell
                                            key={`${room.id}-${time}`}
                                            booking={isLoading ? undefined : getBooking(room.id, time)}
                                            roomId={room.id}
                                            time={time}
                                            date={selectedDate}
                                            isPlannedByUser={
                                                isLoading ? false : isPlannedByUser(room.id, time)
                                            }
                                            isLoading={loadingCells.has(`${room.id}-${time}`)}
                                            onBook={onBook}
                                            onDeletePlanned={onDeletePlanned}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
