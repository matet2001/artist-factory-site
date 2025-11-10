import { BookingStatus } from '@prisma/client'

export type { BookingStatus }

export interface BookingIntent {
    roomId: string
    time: number
}

export interface OpeningHours {
    opening: number
    closing: number
}

export interface BookingData {
    id: string
    date: Date
    time: number
    status: BookingStatus
    roomId: string
    userId: string
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
    UNVERIFIED = 'UNVERIFIED',
    VERIFIED = 'VERIFIED',
    PAST = 'PAST',
}

export const OPENING_HOURS: OpeningHours = {
    opening: 10,
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