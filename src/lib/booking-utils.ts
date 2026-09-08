import { BookingStatus } from '@prisma/client'

export type { BookingStatus }

export interface BookingIntent {
    roomId: string
    time: number
    date: Date
}

export interface OpeningHours {
    opening: number
    closing: number
}

export interface BookingData {
    id: string
    /** UTC-midnight ISO string over the wire, a Date when read straight from Prisma. */
    date: Date | string
    time: number
    startMinute?: number
    endMinute?: number
    status: BookingStatus
    roomId: string
    userId: string
    note?: string | null
    createdAt?: string
    /** Only set on PLANNED bookings: when the slot hold lapses. */
    expiresAt?: string
    user?: {
        fullName: string
        bandName?: string | null
    }
}

export interface BookingsResponse {
    date: string
    bookings: BookingData[]
}

export enum CellState {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    PLANNED = 'PLANNED',
    PLANNED_CANCELABLE = 'PLANNED_CANCELABLE',
    /** A cart hold that lives in the database but is not a confirmed booking yet. */
    PLANNED_HOLD = 'PLANNED_HOLD',
    UNVERIFIED = 'UNVERIFIED',
    VERIFIED = 'VERIFIED',
    VERIFIED_CANCELABLE = 'VERIFIED_CANCELABLE',
    PAST = 'PAST',
    TOO_SOON = 'TOO_SOON',
}

/**
 * How long a PLANNED (cart) booking keeps other customers out of the slot.
 * A PLANNED row is a real database row created the moment a cell is clicked, so
 * without this it would block the slot forever if the visitor never confirms.
 */
export const PLANNED_HOLD_MINUTES = 30

/**
 * How long a lapsed PLANNED row is kept before the cleanup job deletes it.
 * The gap between the two gives support a window to see what happened.
 */
export const PLANNED_DELETE_AFTER_MINUTES = 24 * 60

/** Oldest `createdAt` a PLANNED booking may have and still hold its slot. */
export function plannedHoldCutoff(now: Date = new Date()): Date {
    return new Date(now.getTime() - PLANNED_HOLD_MINUTES * 60 * 1000)
}

/** Rows created before this are safe to delete outright. */
export function plannedDeleteCutoff(now: Date = new Date()): Date {
    return new Date(now.getTime() - PLANNED_DELETE_AFTER_MINUTES * 60 * 1000)
}

export function plannedHoldExpiresAt(createdAt: Date | string): Date {
    return new Date(new Date(createdAt).getTime() + PLANNED_HOLD_MINUTES * 60 * 1000)
}

export function isPlannedHoldExpired(createdAt: Date | string, now: Date = new Date()): boolean {
    return plannedHoldExpiresAt(createdAt).getTime() <= now.getTime()
}

/**
 * Calendar-day key (YYYY-MM-DD) for a booking date coming from the API.
 *
 * Booking dates are stored as `@db.Date` and serialised as UTC midnight, so they
 * have to be read back in UTC. Running them through the browser's local timezone
 * shifts the whole grid by a day for anyone on a negative UTC offset.
 */
export function toDateKey(value: Date | string): string {
    if (typeof value === 'string') {
        return value.includes('T') ? value.split('T')[0] : value
    }
    return value.toISOString().split('T')[0]
}

/**
 * Calendar-day key for a date the visitor picked in the calendar UI. That Date
 * is local wall-clock time, so it must be read back in local time.
 */
export function toLocalDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const OPENING_HOURS: OpeningHours = {
    opening: 9,
    closing: 22,
}

export function getOpeningHoursArray(openingHours: OpeningHours = OPENING_HOURS): number[] {
    return Array.from(
        { length: openingHours.closing - openingHours.opening },
        (_, i) => i + openingHours.opening
    )
}

export function formatDisplayName(user: { fullName: string; bandName?: string | null }): string {
    if (user.bandName) return user.bandName
    const parts = user.fullName.split(' ')
    if (parts.length >= 2) {
        return `${parts[0]} ${parts[1].charAt(0)}.`
    }
    return parts[0]
}

export function isTimeInPast(date: Date, time: number): boolean {
    const now = new Date()
    const bookingDateTime = new Date(date)
    bookingDateTime.setHours(time + 1, 0, 0, 0) // End of the hour slot

    // Check if the booking date is before today (not including today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const bookingDay = new Date(date)
    bookingDay.setHours(0, 0, 0, 0)

    // Only mark as past if it's before today, not on today
    if (bookingDay >= today) {
        return false
    }

    return bookingDateTime < now
}

export function getCurrentTimePosition(openingHours: OpeningHours = OPENING_HOURS): number | null {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()

    if (currentHour < openingHours.opening || currentHour >= openingHours.closing) {
        return null
    }

    // Calculate position as percentage through the day
    const totalHours = openingHours.closing - openingHours.opening
    const hoursFromOpen = currentHour - openingHours.opening
    const minutesFraction = currentMinutes / 60

    return ((hoursFromOpen + minutesFraction) / totalHours) * 100
}

export function isWithin24Hours(date: Date, time: number): boolean {
    const now = new Date()
    const bookingDateTime = new Date(date)
    bookingDateTime.setHours(time, 0, 0, 0) // Start of the hour slot

    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return hoursUntilBooking < 24
}

export function isWithin48Hours(date: Date, time: number): boolean {
    const now = new Date()
    const bookingDateTime = new Date(date)
    bookingDateTime.setHours(time, 0, 0, 0) // Start of the hour slot

    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return hoursUntilBooking < 48
}