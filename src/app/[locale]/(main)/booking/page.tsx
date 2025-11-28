'use client'

import { BookingErrorFallback } from '@/components/booking/booking-error-fallback'
import { BookingRulesInfo } from '@/components/booking/booking-rules-info'
import { BookingSuccessDialog } from '@/components/booking/booking-success-dialog'
import { BookingSummary } from '@/components/booking/booking-summary'
import { BookingTable } from '@/components/booking/booking-table'
import { useAnimations } from '@/hooks/use-animation'
import {
    BookingData,
    BookingIntent,
    OPENING_HOURS,
    getCurrentTimePosition,
    getOpeningHoursArray,
    isWithin24Hours,
    isWithin48Hours,
} from '@/lib/booking-utils'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
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

export default function BookingPage() {
    const t = useTranslations('BOOKING')
    const { data: session } = useSession()
    const locale = useLocale()
    const router = useRouter()
    const animations = useAnimations()

    // Default to tomorrow since bookings must be made 24 hours in advance
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(12, 0, 0, 0)
        return tomorrow
    })
    const [allBookings, setAllBookings] = useState<BookingData[]>([]) // Cache all bookings
    const [fetchedDateRange, setFetchedDateRange] = useState<{ start: Date; end: Date } | null>(null)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())
    const [hasError, setHasError] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)

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

        // Fetch if selected date is outside cached range or within 2 days of the edge
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000
        return selectedTime < startTime || selectedTime > endTime ||
               selectedTime < startTime + twoDaysInMs || selectedTime > endTime - twoDaysInMs
    }, [selectedDate, fetchedDateRange])

    useEffect(() => {
        if (needsToFetch) {
            fetchBookingsWeek(selectedDate)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, needsToFetch])

    // Update timeline every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedDate((d) => new Date(d))
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchBookingsWeek = async (centerDate: Date) => {
        setHasError(false)
        setError(null)

        try {
            // Calculate date range: center date + 6 days ahead
            const startDate = new Date(centerDate)
            startDate.setHours(0, 0, 0, 0)

            const endDate = new Date(centerDate)
            endDate.setDate(endDate.getDate() + 6)
            endDate.setHours(23, 59, 59, 999)

            // Fetch all dates in range
            const promises = []
            const currentDate = new Date(startDate)

            while (currentDate <= endDate) {
                const dateStr = formatUTCDate(currentDate)
                promises.push(
                    fetch(`/api/bookings?date=${dateStr}`)
                        .then(res => res.ok ? res.json() : { bookings: [] })
                        .then(data => data.bookings || [])
                )
                currentDate.setDate(currentDate.getDate() + 1)
            }

            const results = await Promise.all(promises)
            const combinedBookings = results.flat()

            setAllBookings(combinedBookings)
            setFetchedDateRange({ start: startDate, end: endDate })
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Failed to load bookings')
            setError(err)
            setHasError(true)

            // Only show error toast if we have no data to show
            if (allBookings.length === 0) {
                toast.error('Error', {
                    description: 'Failed to load bookings',
                })
            }
        } finally {
            setIsInitialLoading(false)
        }
    }

    const getBooking = (roomId: string, time: number): BookingData | undefined => {
        return bookings.find((b) => b.roomId === roomId && b.time === time)
    }

    const plannedBookings = useMemo(() => {
        if (!session?.user?.id) return []
        return allBookings.filter((b) => b.userId === session.user.id && b.status === 'PLANNED')
    }, [allBookings, session])

    const isPlannedByUser = (roomId: string, time: number): boolean => {
        return plannedBookings.some((b) => b.roomId === roomId && b.time === time)
    }

    const handleBook = async (intent: BookingIntent) => {
        if (!session) {
            toast.error('Authentication Required', {
                description: 'Please sign in to make a booking',
            })
            // Redirect to register page after showing the alert
            setTimeout(() => {
                router.push(`/${locale}/register`)
            }, 1500)
            return
        }

        // Check if booking is within 24 hours
        if (isWithin24Hours(selectedDate, intent.time)) {
            toast.error(t('BOOKING_TOO_SOON'))
            return
        }

        const cellKey = `${intent.roomId}-${intent.time}`
        setLoadingCells((prev) => new Set(prev).add(cellKey))

        try {
            const response = await fetch('/api/bookings/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: formatUTCDate(selectedDate),
                    time: intent.time,
                    roomId: intent.roomId,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to book')
            }

            const data = await response.json()

            // Optimistic update - add booking to state immediately with user info
            setAllBookings((prev) => [
                ...prev,
                {
                    id: data.booking.id,
                    roomId: intent.roomId,
                    time: intent.time,
                    date: selectedDate,
                    status: 'PLANNED' as const,
                    userId: session.user.id,
                    user: {
                        fullName: session.user.name || '',
                        bandName: ('bandName' in session.user ? session.user.bandName : null) as string | null,
                    },
                },
            ])

            toast.success(t('BOOKING_PLANNED'))
        } catch (error: any) {
            toast.error('Error', {
                description: error.message,
            })
        } finally {
            setLoadingCells((prev) => {
                const newSet = new Set(prev)
                newSet.delete(cellKey)
                return newSet
            })
        }
    }

    const handleDeletePlanned = async (intent: BookingIntent) => {
        const booking = getBooking(intent.roomId, intent.time)
        if (!booking) return

        const cellKey = `${intent.roomId}-${intent.time}`
        setLoadingCells((prev) => new Set(prev).add(cellKey))

        try {
            const response = await fetch(`/api/bookings/plan?id=${booking.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete booking')
            }

            // Optimistic update - remove booking from state immediately
            setAllBookings((prev) => prev.filter((b) => b.id !== booking.id))

            toast.success(t('BOOKING_REMOVED'))
        } catch (error: any) {
            toast.error('Error', {
                description: error.message,
            })
        } finally {
            setLoadingCells((prev) => {
                const newSet = new Set(prev)
                newSet.delete(cellKey)
                return newSet
            })
        }
    }

    const handleCancelVerified = async (intent: BookingIntent) => {
        const booking = getBooking(intent.roomId, intent.time)
        if (!booking) return

        // Check if booking is within 48 hours
        if (isWithin48Hours(selectedDate, intent.time)) {
            toast.error(t('CANCEL_TOO_LATE'))
            return
        }

        const cellKey = `${intent.roomId}-${intent.time}`
        setLoadingCells((prev) => new Set(prev).add(cellKey))

        try {
            const response = await fetch(`/api/bookings/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: booking.id,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to cancel booking')
            }

            // Optimistic update - remove booking from state immediately
            setAllBookings((prev) => prev.filter((b) => b.id !== booking.id))

            toast.success(t('BOOKING_CANCELLED'))
        } catch (error: any) {
            toast.error('Error', {
                description: error.message,
            })
        } finally {
            setLoadingCells((prev) => {
                const newSet = new Set(prev)
                newSet.delete(cellKey)
                return newSet
            })
        }
    }

    const handleConfirmBookings = async () => {
        if (plannedBookings.length === 0) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/bookings/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: formatUTCDate(selectedDate),
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to confirm bookings')
            }

            // Optimistic update - update booking statuses to VERIFIED
            setAllBookings((prev) =>
                prev.map((b) =>
                    b.status === 'PLANNED' && b.userId === session?.user?.id
                        ? { ...b, status: 'VERIFIED' as const }
                        : b
                )
            )

            // Show success dialog instead of redirecting
            setShowSuccessDialog(true)
        } catch (error: any) {
            toast.error('Error', {
                description: error.message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Title Section */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center space-y-4">
                        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">
                            {t('PRE_TITLE')}
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            {t('TITLE')}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Booking Table Section */}
            <section className="relative py-10">
                <div className="w-full mx-auto px-0 md:px-4">
                    {hasError && isInitialLoading ? (
                        <BookingErrorFallback error={error} />
                    ) : (
                        <div className="relative">
                            {/* Background card */}
                            <div className="absolute inset-0 bg-card/80 backdrop-blur-xl rounded-none md:rounded-3xl border-0 md:border md:border-primary/20 md:shadow-2xl" />

                            <div className="relative z-10 py-5">
                                {/* Booking Rules Info - Always visible */}
                                <div className="p-2 md:p-4 lg:p-12 pb-0">
                                    <BookingRulesInfo />
                                </div>

                                {/* Always show the table */}
                                <div className="relative">
                                    {/* Loading overlay */}
                                    {isInitialLoading && (
                                        <div className="absolute inset-0 bg-background/50 backdrop-blur-md z-50 flex items-center justify-center rounded-xl">
                                            <div className="text-center space-y-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                                                <p className="text-muted-foreground font-medium">{t('LOADING')}</p>
                                            </div>
                                        </div>
                                    )}

                                    <BookingTable
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                        hours={hours}
                                        bookings={bookings}
                                        loadingCells={loadingCells}
                                        timelinePosition={timelinePosition}
                                        isToday={isToday}
                                        getBooking={getBooking}
                                        isPlannedByUser={isPlannedByUser}
                                        onBook={handleBook}
                                        onDeletePlanned={handleDeletePlanned}
                                        onCancelVerified={handleCancelVerified}
                                        currentUserId={session?.user?.id}
                                    />
                                </div>

                                <div className="p-4 sm:p-8 lg:p-12">
                                    <BookingSummary
                                        plannedBookings={plannedBookings}
                                        isSubmitting={isSubmitting}
                                        onConfirm={handleConfirmBookings}
                                        animations={animations}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Success Dialog */}
            <BookingSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
        </>
    )
}
