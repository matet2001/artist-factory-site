'use client'

import { useTodayKey } from '@/components/common/today-provider'
import { PRICE_CHANGE_DATE, rooms } from '@/lib/rooms'
import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * The announcement stops showing on its own once the new rate is old news, so
 * nobody has to remember to delete it. A month of October is enough for the
 * regulars to have seen it at least once.
 */
const NOTICE_UNTIL = '2026-11-01'

export function PriceChangeNotice() {
    const t = useTranslations('BOOKING.PRICE_CHANGE')
    const today = useTodayKey()

    if (today >= NOTICE_UNTIL) return null

    // Every room lands on the same rate, so the highest one is the new rate.
    const newPrice = Math.max(...rooms.map((room) => room.price))

    return (
        <div className="bg-amber-500/10 border border-amber-400/30 rounded-none md:rounded-xl p-2 md:p-4 lg:p-6 mb-3 md:mb-6">
            <div className="flex items-start gap-2 md:gap-3">
                <div className="shrink-0 mt-0.5 md:mt-1">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-amber-300" />
                </div>
                <div className="flex-1 space-y-1.5 md:space-y-2">
                    <h3 className="font-semibold text-amber-100 text-xs md:text-sm lg:text-base">
                        {t('TITLE')}
                    </h3>
                    <div className="space-y-1 md:space-y-2 text-[10px] md:text-sm lg:text-base text-muted-foreground">
                        <p>{t('DESC', { price: newPrice })}</p>
                        <p>{t('INDIVIDUAL_UNCHANGED')}</p>
                        {today < PRICE_CHANGE_DATE && <p>{t('BEFORE_CHANGE')}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
