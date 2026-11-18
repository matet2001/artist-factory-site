/**
 * Finds existing customers whose name looks like the one an admin is typing.
 *
 * Phone bookings that don't pick an existing customer create a new placeholder
 * user, so every spelling of a name ("Kovács G", "Kovács G.", "Kovacs Greg ")
 * becomes its own customer and bookings end up under the wrong name. This is
 * deliberately generous: a false positive costs one click in a dialog, a false
 * negative costs a wrongly named booking.
 */

export interface LookupUser {
    id: string
    name: string | null
    email: string
    bandName: string | null
    phone: string | null
    bookingCount: number
}

export type SimilarityTier = 'exact' | 'close' | 'initials'

export interface SimilarUser {
    user: LookupUser
    tier: SimilarityTier
}

/** Lowercase, strip accents and punctuation, collapse whitespace. */
export function normalizeName(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

/** Collapse whitespace and trim, keeping accents and case. Used before storing. */
export function cleanName(value: string): string {
    return value.replace(/\s+/g, ' ').trim()
}

function levenshtein(a: string, b: string): number {
    if (a === b) return 0
    if (!a.length) return b.length
    if (!b.length) return a.length
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
    for (let i = 1; i <= a.length; i++) {
        const curr = [i]
        for (let j = 1; j <= b.length; j++) {
            curr[j] = Math.min(
                prev[j] + 1,
                curr[j - 1] + 1,
                prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            )
        }
        prev = curr
    }
    return prev[b.length]
}

/**
 * Two name parts that are probably the same: an initial and the full name
 * ("g" / "gabor"), a shortened form ("greg" / "gregory"), or a typo of a
 * reasonably long word ("veres" / "veress").
 */
function tokensClose(a: string, b: string): boolean {
    if (a === b) return true
    const [short, long] = a.length <= b.length ? [a, b] : [b, a]
    if (short.length === 1) return long.startsWith(short)
    if (short.length >= 3 && long.startsWith(short)) return true
    if (short.length < 4) return false
    return levenshtein(a, b) <= (short.length >= 8 ? 2 : 1)
}

/**
 * Every token of the shorter name has to pair up with a distinct token of the
 * longer one, in any order (people write "Gergő Kovács" and "Kovács Gergő").
 */
function allTokensPair(a: string[], b: string[], match: (x: string, y: string) => boolean) {
    const [short, long] = a.length <= b.length ? [a, b] : [b, a]
    const used = new Set<number>()
    return short.every((s) => {
        const idx = long.findIndex((l, i) => !used.has(i) && match(s, l))
        if (idx === -1) return false
        used.add(idx)
        return true
    })
}

function compare(typed: string, candidate: string): SimilarityTier | null {
    if (!typed || !candidate) return null
    if (typed === candidate) return 'exact'

    const t = typed.split(' ')
    const c = candidate.split(' ')

    // A single word ("Gergő", "Memento") only counts when it is identical,
    // otherwise every Gergő in the database is "similar".
    if (t.length < 2 || c.length < 2) return null

    // At least one real word has to be the same; initials alone don't count.
    const sharesWord = t.some((x) => x.length >= 3 && c.includes(x))
    if (!sharesWord) {
        // ...unless it is a typo of the whole name ("Marton Veres"). Initials
        // don't count here, or "B.B." matches every Bognár Balázs.
        const typo = (x: string, y: string) => x.length > 1 && y.length > 1 && tokensClose(x, y)
        return t.length === c.length && allTokensPair(t, c, typo) ? 'close' : null
    }

    if (allTokensPair(t, c, tokensClose)) return 'close'

    // Same surname, other parts share an initial: "Kovács Gergő" vs "Kovács
    // Gábor" — exactly the mix-up this exists for. The surname has to be the
    // first word on both sides; a shared first name ("Lengyel Dávid" vs
    // "Lukács Dávid") is just a common first name.
    if (
        t.length === c.length &&
        t[0] === c[0] &&
        t.slice(1).every((x, i) => x[0] === c[i + 1][0])
    ) {
        return 'initials'
    }

    return null
}

const TIER_RANK: Record<SimilarityTier, number> = { exact: 0, close: 1, initials: 2 }

export function findSimilarUsers(name: string, users: LookupUser[], limit = 6): SimilarUser[] {
    const typed = normalizeName(name)
    if (typed.length < 2) return []

    const matches: SimilarUser[] = []
    for (const user of users) {
        const byName = user.name ? compare(typed, normalizeName(user.name)) : null
        // Admins sometimes type the band instead of the person; only trust an
        // exact hit there, band names are too varied for fuzzy matching.
        const byBand =
            user.bandName && normalizeName(user.bandName) === typed ? 'exact' : null
        const best = [byName, byBand]
            .filter((v): v is SimilarityTier => v !== null)
            .sort((a, b) => TIER_RANK[a] - TIER_RANK[b])[0]
        if (best) matches.push({ user, tier: best })
    }

    return matches
        .sort(
            (a, b) =>
                TIER_RANK[a.tier] - TIER_RANK[b.tier] || b.user.bookingCount - a.user.bookingCount
        )
        .slice(0, limit)
}
