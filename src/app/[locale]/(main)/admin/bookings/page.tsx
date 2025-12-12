'use client'

import { AdminBookingSummary } from '@/components/admin/admin-booking-summary'
import { AdminBookingTable } from '@/components/admin/admin-booking-table'
import { PhoneBookingForm } from '@/components/admin/phone-booking-form'
import {
    BookingData,
    BookingIntent,
    getCurrentTimePosition,
    getOpeningHoursArray,
    OPENING_HOURS,
} from '@/lib/booking-utils'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// Helper to format date as YYYY-MM-DD in UTC for backend
function formatUTCDate(date: Date): string {
    return date.toISOString().split('T')[0]
}

// Helper to format date as YYYY-MM-DD in local timezone for comparison
function formatLocalDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export default function AdminBookingsPage() {
    const t = useTranslations('ADMIN_BOOKINGS')
    const { data: session, status } = useSession()
    const router = useRouter()

    // Redirect non-admin users
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated' && !session?.user?.isAdmin) {
            router.push('/')
        }
    }, [session, status, router])

    // Start with today's date (admin can see past dates)
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const today = new Date()
        today.setHours(12, 0, 0, 0)
        return today
    })

    const [allBookings, setAllBookings] = useState<BookingData[]>([])
    const [fetchedDateRange, setFetchedDateRange] = useState<{ start: Date; end: Date } | null>(
        null
    )
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())
    const [plannedBookings, setPlannedBookings] = useState<BookingIntent[]>([])
    const [customerName, setCustomerName] = useState('')
    const [customerBandName, setCustomerBandName] = useState('')
    const [bookingNote, setBookingNote] = useState('')
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
    const [editMode, setEditMode] = useState(false)

    const hours = getOpeningHoursArray(OPENING_HOURS)
    const timelinePosition = getCurrentTimePosition(OPENING_HOURS)
    const isToday = selectedDate.toDateString() === new Date().toDateString()

    // Filter bookings for the selected date
    const bookings = useMemo(() => {
        const selectedDateStr = formatLocalDate(selectedDate)
        return allBookings.filter((b) => {
            const bookingDate = new Date(b.date)
            const bookingDateStr = formatLocalDate(bookingDate)
            return bookingDateStr === selectedDateStr
        })
    }, [allBookings, selectedDate])

    // Check if we need to fetch data for the selected date
    const needsToFetch = useMemo(() => {
        if (!fetchedDateRange) return true

        const selectedTime = selectedDate.getTime()
        const startTime = fetchedDateRange.start.getTime()
        const endTime = fetchedDateRange.end.getTime()

        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000
        return (
            selectedTime < startTime ||
            selectedTime > endTime ||
            selectedTime < startTime + twoDaysInMs ||
            selectedTime > endTime - twoDaysInMs
        )
    }, [selectedDate, fetchedDateRange])

    const fetchBookingsWeek = useCallback(
        async (centerDate: Date) => {
            try {
                // Calculate date range: 7 days before and 14 days after center date
                const startDate = new Date(centerDate)
                startDate.setDate(startDate.getDate() - 7)
                startDate.setHours(0, 0, 0, 0)

                const endDate = new Date(centerDate)
                endDate.setDate(endDate.getDate() + 14)
                endDate.setHours(23, 59, 59, 999)

                // Single API call with date range
                const params = new URLSearchParams({
                    startDate: formatUTCDate(startDate),
                    endDate: formatUTCDate(endDate),
                })

                const res = await fetch(`/api/bookings?${params}`)
                if (!res.ok) throw new Error('Failed to fetch bookings')

                const data = await res.json()
                setAllBookings(data.bookings || [])
                setFetchedDateRange({ start: startDate, end: endDate })
            } catch (error) {
                console.error('Error fetching bookings:', error)
                toast.error(t('ERROR_LOAD_FAILED'))
            } finally {
                setIsInitialLoading(false)
            }
        },
        [t]
    )

    useEffect(() => {
        if (needsToFetch) {
            fetchBookingsWeek(selectedDate)
        }
    }, [selectedDate, needsToFetch, fetchBookingsWeek])

    // Update timeline and refresh bookings every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedDate((d) => new Date(d))
            // Refresh bookings to see new ones made by users
            fetchBookingsWeek(selectedDate)
        }, 10000)
        return () => clearInterval(interval)
    }, [selectedDate, fetchBookingsWeek])

    const getBooking = (roomId: string, time: number): BookingData | undefined => {
        return bookings.find((b) => b.roomId === roomId && b.time === time)
    }

    const isPlannedByUser = (roomId: string, time: number): boolean => {
        const selectedDateStr = formatLocalDate(selectedDate)
        return plannedBookings.some((b) => {
            const bookingDateStr = formatLocalDate(b.date)
            return b.roomId === roomId && b.time === time && bookingDateStr === selectedDateStr
        })
    }

    const handleBook = (intent: BookingIntent) => {
        if (!customerName.trim()) {
            toast.error(t('ERROR_NAME_REQUIRED'))
            return
        }

        // Check if this slot is already planned (including date check)
        const alreadyPlanned = plannedBookings.some((b) => {
            const existingDateStr = formatLocalDate(b.date)
            const intentDateStr = formatLocalDate(intent.date)
            return (
                b.roomId === intent.roomId &&
                b.time === intent.time &&
                existingDateStr === intentDateStr
            )
        })

        if (alreadyPlanned) {
            return // Don't add duplicate
        }

        setPlannedBookings((prev) => [...prev, intent])
    }

    const handleDeletePlanned = (intent: BookingIntent) => {
        setPlannedBookings((prev) =>
            prev.filter((b) => {
                const existingDateStr = formatLocalDate(b.date)
                const intentDateStr = formatLocalDate(intent.date)
                return !(
                    b.roomId === intent.roomId &&
                    b.time === intent.time &&
                    existingDateStr === intentDateStr
                )
            })
        )
    }

    const handleDeleteBooking = async (intent: BookingIntent) => {
        // Clear planned bookings to prevent issues
        setPlannedBookings([])

        const cellKey = `${intent.roomId}-${intent.time}`
        setLoadingCells((prev) => new Set(prev).add(cellKey))

        try {
            const res = await fetch('/api/admin/bookings/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: intent.roomId,
                    date: formatUTCDate(intent.date),
                    time: intent.time,
                }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to delete booking')
            }

            toast.success(t('SUCCESS_DELETED'))

            // If we're deleting a booking that's currently in edit mode, clear the form
            if (editMode && selectedBooking) {
                handleCancelEdit()
            }

            await fetchBookingsWeek(selectedDate)
        } catch (error) {
            console.error('Error deleting booking:', error)
            toast.error(error instanceof Error ? error.message : t('ERROR_LOAD_FAILED'))
        } finally {
            setLoadingCells((prev) => {
                const next = new Set(prev)
                next.delete(cellKey)
                return next
            })
        }
    }

    const handleCustomerInfoChange = (data: {
        name: string
        bandName?: string
        note?: string
        userId?: string
    }) => {
        setCustomerName(data.name)
        setCustomerBandName(data.bandName || '')
        setBookingNote(data.note || '')
        setSelectedUserId(data.userId)
    }

    const handleSelectBooking = (booking: BookingData) => {
        setSelectedBooking(booking)
        setEditMode(true)
        setCustomerName(booking.user?.fullName || '')
        setCustomerBandName(booking.user?.bandName || '')
        setBookingNote(booking.note || '')
        setPlannedBookings([])
    }

    const handleCancelEdit = () => {
        setSelectedBooking(null)
        setEditMode(false)
        setCustomerName('')
        setCustomerBandName('')
        setBookingNote('')
        setSelectedUserId(undefined)
    }

    const handleUpdateBooking = async (startMinute?: number, endMinute?: number) => {
        if (!selectedBooking || !editMode) return
        if (!customerName.trim()) {
            toast.error(t('ERROR_NAME_MISSING'))
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch('/api/admin/bookings/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedBooking.id,
                    name: customerName,
                    bandName: customerBandName || undefined,
                    note: bookingNote || undefined,
                    startMinute,
                    endMinute,
                }),
            })

            if (!res.ok) {
                const error = await res.json()
                // Handle specific error cases
                if (error.error === 'Booking not found') {
                    throw new Error(t('ERROR_BOOKING_NOT_FOUND'))
                }
                throw new Error(error.error || t('ERROR_LOAD_FAILED'))
            }

            toast.success(t('SUCCESS_UPDATED', { name: customerName }))
            handleCancelEdit()
            await fetchBookingsWeek(selectedDate)
        } catch (error) {
            console.error('Error updating booking:', error)
            toast.error(error instanceof Error ? error.message : t('ERROR_LOAD_FAILED'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePhoneBooking = async () => {
        if (!customerName.trim()) {
            toast.error(t('ERROR_NAME_MISSING'))
            return
        }

        if (plannedBookings.length === 0) {
            toast.error(t('ERROR_NO_BOOKINGS'))
            return
        }

        setIsSubmitting(true)

        try {
            const bookingsData = plannedBookings.map((b) => ({
                roomId: b.roomId,
                date: formatUTCDate(b.date),
                time: b.time,
            }))

            const res = await fetch('/api/admin/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerName,
                    bandName: customerBandName || undefined,
                    note: bookingNote || undefined,
                    userId: selectedUserId,
                    bookings: bookingsData,
                }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to create booking')
            }

            toast.success(t('SUCCESS_CREATED', { name: customerName }))
            setPlannedBookings([])
            setCustomerName('')
            setCustomerBandName('')
            setBookingNote('')
            setSelectedUserId(undefined)
            await fetchBookingsWeek(selectedDate)
        } catch (error) {
            console.error('Error creating phone booking:', error)
            toast.error(error instanceof Error ? error.message : t('ERROR_LOAD_FAILED'))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!session?.user?.isAdmin && status !== 'loading') {
        return null
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{t('PAGE_TITLE')}</h1>
                    <p className="text-muted-foreground">{t('PAGE_SUBTITLE')}</p>
                </div>

                <div className="space-y-8">
                    {/* Phone Booking Form - First */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <PhoneBookingForm
                                onCustomerInfoChange={handleCustomerInfoChange}
                                onSubmit={handlePhoneBooking}
                                onUpdate={handleUpdateBooking}
                                onCancelEdit={handleCancelEdit}
                                onDelete={
                                    selectedBooking
                                        ? () =>
                                              handleDeleteBooking({
                                                  roomId: selectedBooking.roomId,
                                                  date: new Date(selectedBooking.date),
                                                  time: selectedBooking.time,
                                              })
                                        : undefined
                                }
                                isSubmitting={isSubmitting}
                                customerName={customerName}
                                customerBandName={customerBandName}
                                bookingNote={bookingNote}
                                hasSelectedBookings={plannedBookings.length > 0}
                                editMode={editMode}
                                selectedBookingId={selectedBooking?.id}
                                selectedUserId={selectedUserId}
                                bookingStartMinute={selectedBooking?.startMinute}
                                bookingEndMinute={selectedBooking?.endMinute}
                                selectedBookingTime={selectedBooking?.time}
                                selectedBookingDate={selectedBooking ? new Date(selectedBooking.date) : undefined}
                            />
                        </div>

                        <div>
                            {plannedBookings.length > 0 && !editMode && (
                                <AdminBookingSummary
                                    plannedBookings={plannedBookings}
                                    onClearAll={() => setPlannedBookings([])}
                                />
                            )}
                        </div>
                    </div>

                    {/* Booking Table - Second */}
                    <div>
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold">{t('TABLE_TITLE')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {customerName.trim()
                                    ? t('TABLE_DESC_WITH_NAME', { name: customerName })
                                    : t('TABLE_DESC_NO_NAME')}
                            </p>
                        </div>

                        {/* Table with loading overlay */}
                        <div className="relative">
                            {/* Loading overlay */}
                            {isInitialLoading && (
                                <div className="absolute inset-0 bg-background/50 backdrop-blur-md z-50 flex items-center justify-center rounded-xl min-h-[400px]">
                                    <div className="text-center space-y-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                                        <p className="text-muted-foreground font-medium">
                                            {t('LOADING')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <AdminBookingTable
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                hours={hours}
                                loadingCells={loadingCells}
                                timelinePosition={timelinePosition}
                                isToday={isToday}
                                customerName={customerName}
                                customerBandName={customerBandName}
                                getBooking={getBooking}
                                isPlannedByUser={isPlannedByUser}
                                onBook={handleBook}
                                onDeletePlanned={handleDeletePlanned}
                                onDeleteBooking={handleDeleteBooking}
                                onSelectBooking={handleSelectBooking}
                                allowPastDates={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
