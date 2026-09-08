'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface BookingLegendProps {
    /** The admin table also shows the operator's own unsaved selection. */
    variant?: 'customer' | 'admin'
    className?: string
}

/**
 * Spells out what each cell colour means.
 *
 * The hold and the confirmed states used to be the same yellow block, which is
 * how abandoned carts were read as bookings and real bookings were deleted as
 * junk. A legend makes the distinction checkable instead of tribal knowledge.
 */
export function BookingLegend({ variant = 'customer', className }: BookingLegendProps) {
    const t = useTranslations('BOOKING.LEGEND')

    const items = [
        {
            key: 'free',
            swatch: 'bg-card/30 border-border',
            label: t('FREE'),
        },
        {
            key: 'hold',
            swatch:
                'bg-muted/50 booking-hold-stripes border-dashed border-muted-foreground/50',
            label: variant === 'admin' ? t('HOLD_ADMIN') : t('HOLD'),
        },
        ...(variant === 'admin'
            ? [
                  {
                      key: 'draft',
                      swatch: 'bg-yellow-500/60 border-yellow-500/60',
                      label: t('DRAFT_ADMIN'),
                  },
              ]
            : []),
        {
            key: 'booked',
            swatch: 'bg-green-500/60 border-green-500/60',
            label: t('BOOKED'),
        },
    ]

    return (
        <ul
            className={cn(
                'flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs text-muted-foreground',
                className
            )}
        >
            {items.map((item) => (
                <li key={item.key} className="flex items-center gap-1.5">
                    <span
                        aria-hidden
                        className={cn('h-3 w-5 rounded-sm border shrink-0', item.swatch)}
                    />
                    <span>{item.label}</span>
                </li>
            ))}
        </ul>
    )
}
