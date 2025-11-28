'use client'

import { BookingTableHeader } from '@/components/booking/booking-table-header'
import { TimelineIndicator } from '@/components/booking/timeline-indicator'
import { BookingData, BookingIntent } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { BookingCell } from './booking-cell'

interface BookingTableProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    hours: number[]
    bookings: BookingData[]
    loadingCells: Set<string>
    timelinePosition: number | null
    isToday: boolean
    getBooking: (roomId: string, time: number) => BookingData | undefined
    isPlannedByUser: (roomId: string, time: number) => boolean
    onBook: (intent: BookingIntent) => void
    onDeletePlanned: (intent: BookingIntent) => void
    onCancelVerified?: (intent: BookingIntent) => void
    currentUserId?: string
}

export function BookingTable({
    selectedDate,
    onDateChange,
    hours,
    loadingCells,
    timelinePosition,
    isToday,
    getBooking,
    isPlannedByUser,
    onBook,
    onDeletePlanned,
    onCancelVerified,
    currentUserId,
}: BookingTableProps) {
    return (
        <div className="w-full overflow-x-auto ">
            <div className="min-w-full">
                <div className="overflow-hidden border border-border rounded-none md:rounded-xl shadow-lg relative">
                    <table className="w-full divide-y divide-border">
                        <BookingTableHeader
                            selectedDate={selectedDate}
                            onDateChange={onDateChange}
                        />

                        <tbody className="divide-y divide-border bg-card/50 relative">
                            {/* Current Time Indicator */}
                            {isToday && timelinePosition !== null && (
                                <TimelineIndicator position={timelinePosition} />
                            )}

                            {hours.map((time) => (
                                <tr key={time} className="group">
                                    <td className="px-1 py-1 md:px-4 md:py-3 text-center font-semibold whitespace-nowrap bg-card-elevated text-[11px] md:text-base">
                                        <span className="md:hidden">{time}:00</span>
                                        <span className="hidden md:inline">{time}:00 - {time + 1}:00</span>
                                    </td>
                                    {rooms.map((room) => (
                                        <BookingCell
                                            key={`${room.id}-${time}`}
                                            booking={getBooking(room.id, time)}
                                            roomId={room.id}
                                            time={time}
                                            date={selectedDate}
                                            isPlannedByUser={isPlannedByUser(room.id, time)}
                                            isLoading={loadingCells.has(`${room.id}-${time}`)}
                                            onBook={onBook}
                                            onDeletePlanned={onDeletePlanned}
                                            onCancelVerified={onCancelVerified}
                                            currentUserId={currentUserId}
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
