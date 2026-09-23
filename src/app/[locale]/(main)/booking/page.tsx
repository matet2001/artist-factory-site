'use client'

import { BookingErrorFallback } from '@/components/booking/booking-error-fallback'
import { BookingLegend } from '@/components/booking/booking-legend'
import { BookingRulesInfo } from '@/components/booking/booking-rules-info'
import { BookingSuccessDialog } from '@/components/booking/booking-success-dialog'
import { BookingSummary } from '@/components/booking/booking-summary'
import { BookingTable } from '@/components/booking/booking-table'
import { PriceChangeNotice } from '@/components/booking/price-change-notice'
import { useAnimations } from '@/hooks/use-animation'
import {
    BookingData,
    BookingIntent,
    OPENING_HOURS,
    PLANNED_HOLD_MINUTES,
    getCurrentTimePosition,
    getOpeningHoursArray,
    isWithin24Hours,
    isWithin48Hours,
    toDateKey,
    toLocalDateKey,
} from '@/lib/booking-utils'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function BookingPage() {
    const t = useTranslations('BOOKING')
    const { data: session } = useSession()
    const locale = useLocale()
    const router = useRouter()
    const animations = useAnimations()

    // Default to today
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const today = new Date()
        today.setHours(12, 0, 0, 0)
        return today
    })
    const [allBookings, setAllBookings] = useState<BookingData[]>([]) // Cache all bookings
    const [fetchedDateRange, setFetchedDateRange] = useState<{ start: Date; end: Date } | null>(null)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())
    const [hasError, setHasError] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [bookingsToDelete, setBookingsToDelete] = useState<Set<string>>(new Set()) // Track bookings selected for deletion
    // The cart is whatever the server says this user is holding, on every date.
    // Deriving it from `allBookings` tied it to the 7-day window on screen, so
    // picks made on other weeks quietly fell out of the order.
    const [rawPlannedBookings, setRawPlannedBookings] = useState<BookingData[]>([])
    // Coarse clock, only so lapsed holds drop out of the cart on their own.
    const [clockTick, setClockTick] = useState<number>(() => Date.now())

    const hours = getOpeningHoursArray(OPENING_HOURS)
    const timelinePosition = getCurrentTimePosition(OPENING_HOURS)
    const isToday = selectedDate.toDateString() === new Date().toDateString()

    // Filter bookings for the selected date
    const bookings = useMemo(() => {
        const selectedDateStr = toLocalDateKey(selectedDate)
        return allBookings.filter((b) => toDateKey(b.date) === selectedDateStr)
    }, [allBookings, selectedDate])

    // Expiry is derived from the `expiresAt` the server already sent, rather than
    // re-asked every minute. Polling this per signed-in visitor would keep the
    // database awake continuously — the availability grid is cached precisely so
    // that idle tabs cost nothing.
    const plannedBookings = useMemo(
        () =>
            rawPlannedBookings.filter(
                (b) => !b.expiresAt || new Date(b.expiresAt).getTime() > clockTick
            ),
        [rawPlannedBookings, clockTick]
    )

    const fetchPlannedBookings = useCallback(async () => {
        if (!session?.user?.id) {
            setRawPlannedBookings([])
            return
        }

        try {
            const response = await fetch('/api/bookings/planned')
            if (!response.ok) throw new Error('Failed to load planned bookings')

            const data = await response.json()
            setRawPlannedBookings(data.bookings || [])
        } catch (error) {
            // Keep the previous cart rather than silently emptying it — an empty
            // cart here is exactly the failure mode this endpoint exists to fix.
            console.error('Error fetching planned bookings:', error)
        }
    }, [session?.user?.id])

    useEffect(() => {
        fetchPlannedBookings()
    }, [fetchPlannedBookings])

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

    // Leaving with slots picked but not confirmed is exactly how holds got
    // abandoned in the table, so make it a deliberate choice rather than a slip.
    useEffect(() => {
        if (plannedBookings.length === 0) return

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            // Browsers show their own wording; returning a value is what triggers it.
            event.returnValue = ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [plannedBookings.length])

    // Update the timeline every minute, and advance the clock the cart uses to
    // drop lapsed holds. No request goes out: both are derived from data we hold.
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedDate((d) => new Date(d))
            setClockTick(Date.now())
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

            // Single API call with date range instead of 7 separate calls
            const startDateStr = toLocalDateKey(startDate)
            const endDateStr = toLocalDateKey(endDate)

            const response = await fetch(`/api/bookings?startDate=${startDateStr}&endDate=${endDateStr}`)

            if (!response.ok) {
                throw new Error('Failed to fetch bookings')
            }

            const data = await response.json()
            const combinedBookings = data.bookings || []

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

    const isPlannedByUser = (roomId: string, time: number): boolean => {
        const selectedDateStr = toLocalDateKey(selectedDate)
        return plannedBookings.some(
            (b) =>
                b.roomId === roomId &&
                b.time === time &&
                toDateKey(b.date) === selectedDateStr
        )
    }

    const handleBook = async (intent: BookingIntent) => {
        if (!session) {
            toast.error(t('AUTH_REQUIRED_TITLE'), {
                description: t('AUTH_REQUIRED_DESC'),
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
                    date: toLocalDateKey(selectedDate),
                    time: intent.time,
                    roomId: intent.roomId,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to book')
            }

            const data = await response.json()

            const planned: BookingData = {
                id: data.booking.id,
                roomId: intent.roomId,
                time: intent.time,
                date: toLocalDateKey(selectedDate),
                status: 'PLANNED' as const,
                userId: session.user.id,
                expiresAt: data.booking.expiresAt,
                user: {
                    fullName: session.user.name || '',
                    bandName: ('bandName' in session.user ? session.user.bandName : null) as string | null,
                },
            }

            // Optimistic update - add booking to state immediately with user info
            setAllBookings((prev) => [...prev, planned])
            setRawPlannedBookings((prev) => [...prev, planned])

            toast.success(t('BOOKING_PLANNED'), {
                description: t('BOOKING_PLANNED_DESC'),
            })
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

    const handleToggleDeleteSelection = (bookingId: string) => {
        setBookingsToDelete((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(bookingId)) {
                newSet.delete(bookingId)
            } else {
                newSet.add(bookingId)
            }
            return newSet
        })
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
            setRawPlannedBookings((prev) => prev.filter((b) => b.id !== booking.id))

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

    const handleBatchDeleteVerified = async () => {
        if (bookingsToDelete.size === 0) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/bookings/delete-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingIds: Array.from(bookingsToDelete),
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to cancel bookings')
            }

            const data = await response.json()

            // Optimistic update - remove bookings from state immediately
            setAllBookings((prev) => prev.filter((b) => !bookingsToDelete.has(b.id)))
            setBookingsToDelete(new Set())

            toast.success(t('BOOKINGS_CANCELLED'), {
                description: `${data.deletedCount}`,
            })
        } catch (error: any) {
            toast.error('Error', {
                description: error.message,
            })
        } finally {
            setIsSubmitting(false)
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
            // The cart comes from the server, so this covers every date the visitor
            // picked — not just the week currently rendered in the grid.
            const bookingIds = plannedBookings.map((b) => b.id)

            const response = await fetch('/api/bookings/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingIds,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                // 404 here means every hold in the cart had already been taken.
                if (response.status === 404) {
                    await fetchPlannedBookings()
                    throw new Error(t('ALL_SLOTS_LOST'))
                }
                throw new Error(data.error || 'Failed to confirm bookings')
            }

            const confirmedIds = new Set(
                bookingIds.filter((id) => !(data.missingIds || []).includes(id))
            )

            // Optimistic update - only the slots the server actually confirmed
            setAllBookings((prev) =>
                prev.map((b) =>
                    confirmedIds.has(b.id) ? { ...b, status: 'VERIFIED' as const } : b
                )
            )
            setRawPlannedBookings([])
            await fetchPlannedBookings()

            // Never claim more than was booked: a slot whose hold lapsed before the
            // order went in may have been taken by someone else in the meantime.
            if (data.missingIds?.length) {
                toast.warning(t('SOME_SLOTS_LOST_TITLE'), {
                    description: t('SOME_SLOTS_LOST_DESC', { count: data.missingIds.length }),
                    duration: 12000,
                })
            }

            // Show success dialog instead of redirecting
            setShowSuccessDialog(true)
        } catch (error: any) {
            toast.error('Error', {
                description: error.message,
            })
            // Re-sync: the failure may have been partial or the cart may have lapsed.
            await fetchPlannedBookings()
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
                                {/* Price change announcement + booking rules, above the grid */}
                                <div className="p-2 md:p-4 lg:p-12 pb-0">
                                    <PriceChangeNotice />
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
                                        onToggleDeleteSelection={handleToggleDeleteSelection}
                                        bookingsToDelete={bookingsToDelete}
                                        currentUserId={session?.user?.id}
                                    />
                                </div>

                                <div className="px-2 md:px-4 lg:px-12 pt-3 md:pt-4">
                                    <BookingLegend />
                                </div>

                                <div className="p-4 sm:p-8 lg:p-12">
                                    <BookingSummary
                                        plannedBookings={plannedBookings}
                                        isSubmitting={isSubmitting}
                                        onConfirm={handleConfirmBookings}
                                        animations={animations}
                                        holdMinutes={PLANNED_HOLD_MINUTES}
                                    />

                                    {/* Batch Delete Section */}
                                    {bookingsToDelete.size > 0 && (
                                        <div className="mt-6 p-6 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
                                            <h3 className="text-lg font-semibold text-destructive mb-2">
                                                {t('CANCEL_SELECTED_TITLE')}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {t('CANCEL_SELECTED_DESC', { count: bookingsToDelete.size })}
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleBatchDeleteVerified}
                                                    disabled={isSubmitting}
                                                    className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isSubmitting
                                                        ? t('CANCELLING')
                                                        : t('CANCEL_BUTTON', { count: bookingsToDelete.size })}
                                                </button>
                                                <button
                                                    onClick={() => setBookingsToDelete(new Set())}
                                                    disabled={isSubmitting}
                                                    className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {t('CLEAR_SELECTION')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
