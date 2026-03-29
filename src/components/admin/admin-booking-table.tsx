'use client'

import { BookingTableHeader } from '@/components/booking/booking-table-header'
import { TimelineIndicator } from '@/components/booking/timeline-indicator'
import { BookingData, BookingIntent } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { AdminBookingCell } from './admin-booking-cell'

interface AdminBookingTableProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    hours: number[]
    loadingCells: Set<string>
    timelinePosition: number | null
    isToday: boolean
    customerName: string
    customerBandName: string
    getBooking: (roomId: string, time: number) => BookingData | undefined
    isPlannedByUser: (roomId: string, time: number) => boolean
    onBook: (intent: BookingIntent) => void
    onDeletePlanned: (intent: BookingIntent) => void
    onDeleteBooking: (intent: BookingIntent) => void
    onSelectBooking?: (booking: BookingData) => void
    allowPastDates?: boolean
    onRefresh?: () => void
    isRefreshing?: boolean
}

export function AdminBookingTable({
    selectedDate,
    onDateChange,
    hours,
    loadingCells,
    timelinePosition,
    isToday,
    customerName,
    customerBandName,
    getBooking,
    isPlannedByUser,
    onBook,
    onDeletePlanned,
    onDeleteBooking,
    onSelectBooking,
    allowPastDates = false,
    onRefresh,
    isRefreshing = false,
}: AdminBookingTableProps) {
    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-border rounded-xl shadow-lg relative">
                    <table className="min-w-full divide-y divide-border">
                        <BookingTableHeader
                            selectedDate={selectedDate}
                            onDateChange={onDateChange}
                            allowPastDates={allowPastDates}
                            onRefresh={onRefresh}
                            isRefreshing={isRefreshing}
                        />

                        <tbody className="divide-y divide-border bg-card/50 relative">
                            {/* Current Time Indicator */}
                            {isToday && timelinePosition !== null && (
                                <TimelineIndicator position={timelinePosition} />
                            )}

                            {hours.map((time) => (
                                <tr key={time} className="group">
                                    <td className="px-4 py-3 text-center font-semibold whitespace-nowrap bg-card-elevated">
                                        {time}:00 - {time + 1}:00
                                    </td>
                                    {rooms.map((room) => (
                                        <AdminBookingCell
                                            key={`${room.id}-${time}`}
                                            booking={getBooking(room.id, time)}
                                            roomId={room.id}
                                            time={time}
                                            date={selectedDate}
                                            isPlanned={isPlannedByUser(room.id, time)}
                                            isLoading={loadingCells.has(`${room.id}-${time}`)}
                                            customerName={customerName}
                                            customerBandName={customerBandName}
                                            onBook={onBook}
                                            onDeletePlanned={onDeletePlanned}
                                            onDeleteBooking={onDeleteBooking}
                                            onSelectBooking={onSelectBooking}
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
