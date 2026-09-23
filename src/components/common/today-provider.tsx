'use client'

import { createContext, useContext } from 'react'

const TodayKeyContext = createContext<string | null>(null)

/**
 * Today's date, decided once on the server and handed down to the client.
 *
 * The marketing pages are prerendered, so a date read during render would be
 * frozen at build time on the server while being live on the client — an hourly
 * rate would then hydrate into a different number than it rendered with. Passing
 * the day down as a value keeps both sides agreeing, and the locale layout's
 * `revalidate` is what keeps that value fresh.
 */
export function TodayKeyProvider({
    todayKey,
    children,
}: {
    todayKey: string
    children: React.ReactNode
}) {
    return <TodayKeyContext.Provider value={todayKey}>{children}</TodayKeyContext.Provider>
}

export function useTodayKey(): string {
    const todayKey = useContext(TodayKeyContext)
    if (!todayKey) {
        throw new Error('useTodayKey must be used inside a TodayKeyProvider')
    }
    return todayKey
}
