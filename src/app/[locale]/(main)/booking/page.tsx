'use client'

import { BookingErrorFallback } from '@/components/booking/booking-error-fallback'
import { BookingSummary } from '@/components/booking/booking-summary'
import { BookingTable } from '@/components/booking/booking-table'
import { useAnimations } from '@/hooks/use-animation'
import {
    BookingData,
    BookingIntent,
    OPENING_HOURS,
    getCurrentTimePosition,
    getOpeningHoursArray,
} from '@/lib/booking-utils'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function BookingPage() {
    const t = useTranslations('BOOKING')
    const { data: session } = useSession()
    const locale = useLocale()
    const router = useRouter()
    const animations = useAnimations()

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [bookings, setBookings] = useState<BookingData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())
    const [hasError, setHasError] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const hours = getOpeningHoursArray(OPENING_HOURS)
    const timelinePosition = getCurrentTimePosition(OPENING_HOURS)
    const isToday = selectedDate.toDateString() === new Date().toDateString()

    useEffect(() => {
        fetchBookings(selectedDate)
    }, [selectedDate])

    // Update timeline every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedDate((d) => new Date(d))
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchBookings = async (date: Date) => {
        setIsLoading(true)
        setHasError(false)
        setError(null)
        try {
            const response = await fetch(`/api/bookings?date=${date.toISOString().split('T')[0]}`)

            if (!response.ok) {
                // Check if it's a server error (500)
                if (response.status >= 500) {
                    const err = new Error(`Server error: ${response.status}`)
                    setError(err)
                    setHasError(true)
                    return
                }
                throw new Error('Failed to fetch bookings')
            }

            const data = await response.json()
            setBookings(data.bookings || [])
        } catch (error) {
            // Network errors or other fetch failures
            const err = error instanceof Error ? error : new Error('Failed to load bookings')
            setError(err)
            setHasError(true)

            toast.error('Error', {
                description: 'Failed to load bookings',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getBooking = (roomId: string, time: number): BookingData | undefined => {
        return bookings.find((b) => b.roomId === roomId && b.time === time)
    }

    const plannedBookings = useMemo(() => {
        if (!session?.user?.id) return []
        return bookings.filter((b) => b.userId === session.user.id && b.status === 'PLANNED')
    }, [bookings, session])

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

        const cellKey = `${intent.roomId}-${intent.time}`
        setLoadingCells((prev) => new Set(prev).add(cellKey))

        try {
            const response = await fetch('/api/bookings/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate.toISOString(),
                    time: intent.time,
                    roomId: intent.roomId,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to book')
            }

            const data = await response.json()

            // Optimistic update - add booking to state immediately
            setBookings((prev) => [
                ...prev,
                {
                    id: data.booking.id,
                    roomId: intent.roomId,
                    time: intent.time,
                    date: selectedDate,
                    status: 'PLANNED' as const,
                    userId: session.user.id,
                },
            ])

            toast.success('Success', {
                description: 'Booking added to cart',
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
            setBookings((prev) => prev.filter((b) => b.id !== booking.id))

            toast.success('Success', {
                description: 'Booking removed',
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

    const handleConfirmBookings = async () => {
        if (plannedBookings.length === 0) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/bookings/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate.toISOString(),
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to confirm bookings')
            }

            // Optimistic update - update booking statuses to UNVERIFIED
            setBookings((prev) =>
                prev.map((b) =>
                    b.status === 'PLANNED' && b.userId === session?.user?.id
                        ? { ...b, status: 'UNVERIFIED' as const }
                        : b
                )
            )

            toast.success('Success!', {
                description: 'Verification email sent. Please check your inbox.',
            })
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
                <div className="w-full mx-auto px-4">
                    {hasError ? (
                        <BookingErrorFallback error={error} />
                    ) : (
                        <div className="relative">
                            {/* Background card */}
                            <div className="absolute inset-0 bg-card/80 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-2xl" />

                            <div className="relative z-10 p-4 sm:p-8 lg:p-12">
                                <BookingTable
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                    hours={hours}
                                    bookings={bookings}
                                    isLoading={isLoading}
                                    loadingCells={loadingCells}
                                    timelinePosition={timelinePosition}
                                    isToday={isToday}
                                    getBooking={getBooking}
                                    isPlannedByUser={isPlannedByUser}
                                    onBook={handleBook}
                                    onDeletePlanned={handleDeletePlanned}
                                />

                                <BookingSummary
                                    plannedBookings={plannedBookings}
                                    isSubmitting={isSubmitting}
                                    onConfirm={handleConfirmBookings}
                                    animations={animations}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
