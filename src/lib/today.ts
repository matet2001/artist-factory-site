/**
 * Today as a 'YYYY-MM-DD' key in the studio's own timezone.
 *
 * Prices change on a calendar day in Budapest, so neither the server's timezone
 * nor the visitor's may decide which day it is. The key format matches
 * `toDateKey` / `toLocalDateKey`, so it compares directly against them.
 */
export function budapestDateKey(now: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Budapest',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now)
}
