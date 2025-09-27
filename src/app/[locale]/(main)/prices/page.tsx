// app/[locale]/prices/page.tsx
'use client'

import PalmLeafDivider from '@/components/common/palm-leaft-divider'
import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import TikiTorch from '@/components/common/TikiTorch'
import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { CalendarClock, CalendarDays, Coffee, DollarSign, Drum, Users, Utensils } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
    const animations = useAnimations()
    const router = useRouter()
    const viewportConfig = { once: true, amount: 0.3 } as const

    const goToRoom = (roomId: string) => router.push(`/rooms/#room-${roomId}`)

    return (
        <div className="mb-20">
            {/* Title Section */}
            <section className="relative">
                <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full max-w-5xl mx-auto"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="md" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="md" />
                            <PalmTreeSilhouette position="bottom-left" size="md" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="md" />
                        </div>

                        <div className="mx-auto w-full max-w-4xl text-center relative z-10">
                            <div className="space-y-4 sm:space-y-6">
                                <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-muted-foreground">
                                    {t('PRE_TITLE')}
                                </p>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-pretty">
                                    {t('TITLE')}
                                </h1>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Room Pricing Section */}
            <section className="relative">
                <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden w-full max-w-7xl mx-auto"
                    >
                        {/* Tiki Torches in corners - hidden on mobile */}
                        <div className="hidden sm:block">
                            <TikiTorch position="top-left" />
                            <TikiTorch position="top-right" />
                            <TikiTorch position="bottom-left" />
                            <TikiTorch position="bottom-right" />
                        </div>

                        <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                            {/* Section Header */}
                            <motion.div
                                variants={animations.fadeUp}
                                className="text-center"
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                                        {t('HOUR_PRICE')}
                                    </h2>
                                </div>
                            </motion.div>

                            {/* Room Cards */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
                            >
                                {rooms.map((room) => (
                                    <motion.div
                                        key={room.id}
                                        variants={animations.scaleIn}
                                        onClick={() => goToRoom(room.id)}
                                        className="relative overflow-hidden rounded-xl bg-background/70 p-3 sm:p-4 transition-all hover:shadow-lg hover:scale-[1.02] hover:bg-background/90 cursor-pointer"
                                    >
                                        <div className="text-center space-y-2">
                                            <h3 className="text-sm sm:text-base font-bold text-foreground">
                                                {tRooms(room.name)}
                                            </h3>
                                            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                                                <Users className="h-3 w-3" />
                                                <span>
                                                    {room.size} {t('PEOPLE', { default: 'fő' })}
                                                </span>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="text-lg sm:text-xl font-bold text-foreground">
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
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Additional Services */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 sm:pb-12 lg:pb-16"
                            >
                                {/* Individual Practice */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="text-center p-6 rounded-xl bg-background/70"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Drum className="h-5 w-5 text-foreground" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {t('INDIVIDUAL_TITLE', {
                                                default: 'Egyéni gyakorlás / 1-1 oktatás',
                                            })}
                                        </h3>
                                    </div>
                                    <div className="text-xl font-bold text-foreground">
                                        3,000 Ft / {t('HOUR', { default: 'óra' })}
                                    </div>
                                </motion.div>

                                {/* Studio Services */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="text-center p-6 rounded-xl bg-background/70"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <CalendarClock className="h-5 w-5 text-foreground" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {t('STUDIO_TITLE', {
                                                default: 'Stúdió szolgáltatások',
                                            })}
                                        </h3>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xl font-bold text-foreground">
                                            10,000 Ft / {t('HOUR', { default: 'óra' })}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t('STUDIO_VAT_NOTE', {
                                                default: 'A szolgáltatás 0% ÁFA-s.',
                                            })}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Equipment and Services Section */}
            <section className="relative">
                <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden w-full max-w-7xl mx-auto"
                    >
                        {/* Tiki Torches in corners - hidden on mobile */}
                        <div className="hidden sm:block">
                            <TikiTorch position="top-left" />
                            <TikiTorch position="top-right" />
                            <TikiTorch position="bottom-left" />
                            <TikiTorch position="bottom-right" />
                        </div>

                        <div className="relative z-10">
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                {/* Rentable Equipment */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="rounded-2xl p-6 sm:p-8"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
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
                                            <motion.div
                                                key={idx}
                                                variants={animations.fadeUp}
                                                className="flex items-center justify-between p-4 rounded-lg bg-background/70"
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
                                                    <span className="font-medium text-foreground">{item.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-foreground">
                                                        {item.price.toLocaleString('hu-HU')} Ft
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        / {t('HOUR', { default: 'óra' })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Food and Drinks */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="rounded-2xl p-6 sm:p-8"
                                >
                                    <div className="text-center mb-8">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Coffee className="h-5 w-5 text-foreground" />
                                            <Utensils className="h-5 w-5 text-foreground" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
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
                                            <motion.div
                                                key={idx}
                                                variants={animations.fadeUp}
                                                className="flex items-center justify-between p-4 rounded-lg bg-background/70"
                                            >
                                                <span className="font-medium text-foreground">{item.name}</span>
                                                {item.price && (
                                                    <span className="font-bold text-foreground">
                                                        {item.price.toLocaleString('hu-HU')} Ft
                                                    </span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Call to Action Section */}
            <section className="relative">
                <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden w-full max-w-5xl mx-auto"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="md" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="md" />
                            <PalmTreeSilhouette position="bottom-left" size="md" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="md" />
                        </div>

                        <div className="relative z-10 py-8 sm:py-10 lg:py-12">
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="space-y-6"
                            >
                                <motion.h2
                                    variants={animations.fadeUp}
                                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground"
                                >
                                    {t('CTA_TITLE', { default: 'Készen állsz a próbára?' })}
                                </motion.h2>
                                <motion.p
                                    variants={animations.fadeUp}
                                    className="text-muted-foreground text-sm sm:text-base lg:text-lg"
                                >
                                    {t('CTA_DESC', {
                                        default: 'Foglalj időpontot most és kezdd el a zenélést!',
                                    })}
                                </motion.p>
                                <motion.div variants={animations.scaleIn} className="px-4">
                                    <Link
                                        href="/booking"
                                        className="group inline-block w-full max-w-xl mx-auto"
                                    >
                                        <div className="relative group w-full">
                                            <div className="neon-glow inline-flex w-full items-center justify-center gap-3 text-base sm:text-lg lg:text-xl p-4 sm:p-5 rounded-2xl bg-primary font-semibold shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                                <CalendarDays
                                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                                    aria-hidden="true"
                                                />
                                                {t('CTA_BUTTON', { default: 'Foglalás most' })}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
