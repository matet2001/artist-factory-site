// app/[locale]/prices/page.tsx
'use client'

import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { rooms } from '@/lib/rooms'
import { CalendarClock, DollarSign, Drum, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

type RentableItem = {
    icon: 'cymbal' | 'pedal' | 'drum'
    name: string
    price: number // Ft / hour
}

const rentable: RentableItem[] = [
    { icon: 'cymbal', name: 'Gémes cintányér állvány', price: 300 },
    { icon: 'cymbal', name: 'Egyenes cintányér állvány', price: 300 },
    { icon: 'cymbal', name: 'Cintányér (Paiste PST7/PST8, 16"-17"-18" Crash)', price: 300 },
    { icon: 'pedal', name: 'Duplázó', price: 300 },
]

export default function PricesPage() {
    const t = useTranslations('PRICES')
    const tRooms = useTranslations('ROOMS')

    return (
        <main className="w-full">
            {/* Header */}
            <section className="w-full">
                <div className="mx-auto w-full max-w-7xl px-4 text-center">
                    <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                        {t('PRE_TITLE')}
                    </h2>
                    <h1 className="mt-3 text-4xl sm:text-5xl font-semibold">{t('TITLE')}</h1>
                </div>
            </section>

            <section className="w-full pb-16 mt-10">
                <div className="mx-auto w-full max-w-7xl px-4 grid gap-6 lg:grid-cols-3">
                    {/* Rooms & hourly prices */}
                    <Card className="bg-card border border-border rounded-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                {t('HOUR_PRICE')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="flex items-center justify-between gap-3 border-b last:border-b-0 py-3"
                                >
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">
                                            {tRooms(room.name)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <Users className="inline-block mr-1 h-4 w-4 align-middle" />
                                            {t('SIZE_LABEL', { default: 'Férőhely' })}: {room.size}{' '}
                                            {t('PEOPLE', { default: 'fő' })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">
                                            {room.price.toLocaleString('hu-HU')} Ft
                                            <span className="text-muted-foreground">
                                                {' '}
                                                / {t('HOUR', { default: 'óra' })}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="mt-1 text-xs">
                                            {t('AC', { default: 'Légkondis' })}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Individual practice */}
                    <Card className="bg-card border border-border rounded-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Drum className="h-5 w-5 text-primary" />
                                {t('INDIVIDUAL_TITLE', {
                                    default: 'Egyéni gyakorlás / 1-1 oktatás',
                                })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-muted-foreground">
                                    {t('INDIVIDUAL_LABEL', { default: 'Óradíj' })}
                                </span>
                                <span className="font-semibold">
                                    {t('INDIVIDUAL_PRICE', { default: 3000 }).toLocaleString()} Ft /{' '}
                                    {t('HOUR', { default: 'óra' })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Studio services */}
                    <Card className="bg-card border border-border rounded-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5 text-primary" />
                                {t('STUDIO_TITLE', { default: 'Stúdió' })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between py-1">
                                <span className="text-muted-foreground">
                                    {t('STUDIO_RECORDING', {
                                        default: 'Felvétel, utómunka és keverés',
                                    })}
                                </span>
                                <span className="font-semibold">
                                    10 000 Ft / {t('HOUR', { default: 'óra' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-muted-foreground">
                                    {t('STUDIO_LIVE', { default: 'Egybe feljátszott számok' })}
                                </span>
                                <span className="font-semibold">
                                    10 000 Ft / {t('HOUR', { default: 'óra' })}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('STUDIO_VAT_NOTE', { default: 'A szolgáltatás 0% ÁFA-s.' })}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Rentables & Drinks */}
            <section className="w-full pb-24">
                <div className="mx-auto w-full max-w-7xl px-4 grid gap-6 lg:grid-cols-2">
                    {/* Rentable equipment */}
                    <Card className="bg-card border border-border rounded-lg">
                        <CardHeader className="pb-2">
                            <CardTitle>
                                {t('RENTABLE_TITLE', { default: 'Bérelhető cuccok' })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rentable.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Map icons to EquipmentIcon types */}
                                        {item.icon === 'cymbal' && (
                                            <EquipmentIcon
                                                type="cymbal"
                                                size={28}
                                                alt={item.name}
                                            />
                                        )}
                                        {item.icon === 'pedal' && (
                                            <EquipmentIcon type="pedal" size={28} alt={item.name} />
                                        )}
                                        {item.icon === 'drum' && (
                                            <EquipmentIcon type="drum" size={28} alt={item.name} />
                                        )}
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="text-right font-semibold">
                                        {item.price.toLocaleString('hu-HU')} Ft{' '}
                                        <span className="text-muted-foreground text-sm">
                                            / {t('HOUR', { default: 'óra' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Drinks / snacks */}
                    <Card className="bg-card border border-border rounded-lg">
                        <CardHeader className="pb-2">
                            <CardTitle>{t('DRINKS_TITLE', { default: 'Hűtött italok' })}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ul className="space-y-2">
                                <li>• {t('DRINK_BEER', { default: 'Sör 0,5 l' })}</li>
                                <li>• {t('DRINK_WATER', { default: 'Ásványvíz 0,5 l' })}</li>
                                <li>
                                    • {t('DRINK_SODA', { default: 'Cola – Fanta – Traubi 0,5 l' })}
                                </li>
                                <li>• {t('DRINK_COFFEE', { default: 'Kávéautomata' })}</li>
                            </ul>
                            {/* If you later have pricing, we can turn these into rows with right-aligned prices like above */}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
