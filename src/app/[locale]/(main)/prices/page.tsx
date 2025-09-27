// app/[locale]/prices/page.tsx
'use client'

import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { rooms } from '@/lib/rooms'
import { CalendarClock, Coffee, DollarSign, Drum, Users, Utensils } from 'lucide-react'
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

type DrinkItem = {
    name: string
    price?: number
}

const drinks: DrinkItem[] = [
    { name: 'Sör 0,5 l', price: 800 },
    { name: 'Ásványvíz 0,5 l', price: 400 },
    { name: 'Cola – Fanta – Traubi 0,5 l', price: 500 },
    { name: 'Kávéautomata', price: 300 },
]

export default function PricesPage() {
    const t = useTranslations('PRICES')
    const tRooms = useTranslations('ROOMS')

    return (
        <main className="w-full space-y-10">
            {/* Hero Section with Title */}
            <section className="w-full px-4">
                <div className="mx-auto w-full max-w-6xl text-center">
                    <h2 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-2">
                        {t('PRE_TITLE')}
                    </h2>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                        {t('TITLE')}
                    </h1>
                </div>
            </section>

            {/* Main Pricing Section */}
            <section className="w-full pb-10">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl bg-card">
                        {/* Room Pricing Table */}
                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <DollarSign className="h-5 w-5 text-foreground" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                                        {t('HOUR_PRICE')}
                                    </h2>
                                </div>
                            </div>

                            {/* Responsive Room Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="relative overflow-hidden rounded-lg bg-muted/20 p-3 transition-all hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        <div className="text-center space-y-2">
                                            <h3 className="text-sm font-bold text-foreground">
                                                {tRooms(room.name)}
                                            </h3>
                                            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                                                <Users className="h-3 w-3" />
                                                <span>
                                                    {room.size} {t('PEOPLE', { default: 'fő' })}
                                                </span>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="text-lg font-bold text-primary">
                                                    {room.price.toLocaleString('hu-HU')} Ft
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    / {t('HOUR', { default: 'óra' })}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                {t('AC', { default: 'Légkondis' })}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Services */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Individual Practice */}
                                <div className="text-center p-6 rounded-lg bg-muted/20">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Drum className="h-5 w-5 text-foreground" />
                                        <h3 className="text-lg font-bold">
                                            {t('INDIVIDUAL_TITLE', {
                                                default: 'Egyéni gyakorlás / 1-1 oktatás',
                                            })}
                                        </h3>
                                    </div>
                                    <div className="text-xl font-bold text-primary">
                                        3,000 Ft / {t('HOUR', { default: 'óra' })}
                                    </div>
                                </div>

                                {/* Studio Services */}
                                <div className="text-center p-6 rounded-lg bg-muted/20">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <CalendarClock className="h-5 w-5 text-foreground" />
                                        <h3 className="text-lg font-bold">
                                            {t('STUDIO_TITLE', {
                                                default: 'Stúdió szolgáltatások',
                                            })}
                                        </h3>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold text-primary">
                                            10,000 Ft / {t('HOUR', { default: 'óra' })}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t('STUDIO_VAT_NOTE', {
                                                default: 'A szolgáltatás 0% ÁFA-s.',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Equipment and Services Section */}
            <section className="w-full pb-16">
                <div className="mx-auto w-full max-w-6xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Rentable Equipment */}
                        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-card">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        {t('RENTABLE_TITLE', {
                                            default: 'Bérelhető felszerelések',
                                        })}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t('RENTABLE_DESC', {
                                            default: 'Kiegészítő eszközök óradíjas alapon',
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {rentable.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/20"
                                        >
                                            <div className="flex items-center gap-4">
                                                {item.icon === 'cymbal' && (
                                                    <EquipmentIcon
                                                        type="cymbal"
                                                        size={24}
                                                        alt={item.name}
                                                    />
                                                )}
                                                {item.icon === 'pedal' && (
                                                    <EquipmentIcon
                                                        type="pedal"
                                                        size={24}
                                                        alt={item.name}
                                                    />
                                                )}
                                                {item.icon === 'drum' && (
                                                    <EquipmentIcon
                                                        type="drum"
                                                        size={24}
                                                        alt={item.name}
                                                    />
                                                )}
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-primary">
                                                    {item.price.toLocaleString('hu-HU')} Ft
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    / {t('HOUR', { default: 'óra' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Food and Drinks */}
                        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-card">
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Coffee className="h-5 w-5 text-primary" />
                                        <Utensils className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        {t('DRINKS_TITLE', { default: 'Italok és snackek' })}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t('DRINKS_DESC', {
                                            default: 'Friss italok és harapnivalók',
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {drinks.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/20"
                                        >
                                            <span className="font-medium">{item.name}</span>
                                            {item.price && (
                                                <span className="font-bold text-primary">
                                                    {item.price.toLocaleString('hu-HU')} Ft
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="w-full pb-16">
                <div className="mx-auto w-full max-w-4xl px-4 text-center">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl bg-card p-8">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                {t('CTA_TITLE', { default: 'Készen állsz a próbára?' })}
                            </h2>
                            <p className="text-muted-foreground mb-6 text-base">
                                {t('CTA_DESC', {
                                    default: 'Foglalj időpontot most és kezdd el a zenélést!',
                                })}
                            </p>
                            <Button
                                size="lg"
                                className="px-8 py-4 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                {t('CTA_BUTTON', { default: 'Foglalás most' })}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
