// app/[locale]/prices/page.tsx
'use client'

import CtaSection from '@/components/common/sections/cta-section'
import { Badge } from '@/components/ui/badge'
import { useAnimations } from '@/hooks/use-animation'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { CalendarClock, Coffee, Drum, Snowflake, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type RentableItem = {
    translationKey: string
    price: number // Ft / hour
}

const rentable: RentableItem[] = [
    { translationKey: 'RENTABLE_BOOM_STAND', price: 300 },
    { translationKey: 'RENTABLE_STRAIGHT_STAND', price: 300 },
    { translationKey: 'RENTABLE_CYMBAL', price: 300 },
    { translationKey: 'RENTABLE_DOUBLE_PEDAL', price: 300 },
]

type DrinkItem = {
    translationKey: string
    price?: number
}

const drinks: DrinkItem[] = [
    { translationKey: 'DRINK_BEER', price: 800 },
    { translationKey: 'DRINK_WATER', price: 400 },
    { translationKey: 'DRINK_SODA', price: 500 },
    { translationKey: 'DRINK_COFFEE', price: 300 },
]

export default function PricesPage() {
    const t = useTranslations('PRICES')
    const tRooms = useTranslations('ROOMS')
    const tGeneral = useTranslations('GENERAL')
    const animations = useAnimations()
    const router = useRouter()
    const viewportConfig = { once: true, amount: 0.1 } as const

    const goToRoom = (roomId: string) => router.push(`/rooms/${roomId}`)

    return (
        <>
            {/* Title Section - Better hierarchy */}
            <section className="relative ">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        viewport={viewportConfig}
                        className="text-center space-y-6"
                    >
                        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">
                            {t('PRE_TITLE')}
                        </p>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                            {t('TITLE')}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Room Pricing Section - Oval shaped cards */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="relative"
                    >
                        {/* Background card - more visible */}
                        <div className="absolute inset-0 bg-card/80 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-xl" />

                        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
                            <div className="space-y-12">
                                <motion.h2
                                    variants={animations.fadeUp}
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
                                >
                                    {t('HOUR_PRICE')}
                                </motion.h2>

                                {/* Room Cards Grid - Oval shapes */}
                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
                                >
                                    {rooms.map((room) => (
                                        <motion.div
                                            key={room.id}
                                            variants={animations.scaleIn}
                                            onClick={() => goToRoom(room.id)}
                                            className="group flex flex-col items-center justify-center bg-card-elevated border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer p-6"
                                            style={{
                                                borderRadius: '48% 52% 46% 54% / 54% 48% 52% 46%',
                                                minHeight: '240px',
                                            }}
                                        >
                                            <div className="flex flex-col items-center text-center space-y-3">
                                                <h3 className="font-bold text-base sm:text-lg text-foreground">
                                                    {tRooms(room.name)}
                                                </h3>
                                                <div className="flex items-center gap-1 text-foreground/80 text-sm">
                                                    <Users className="h-4 w-4" />
                                                    <span>
                                                        {room.size} {t('PEOPLE')}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline gap-1 text-foreground">
                                                    <span className="text-2xl sm:text-3xl font-bold">
                                                        {room.price.toLocaleString('hu-HU')}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        Ft
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    / {t('HOUR')}
                                                </p>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs gap-1 px-1.5"
                                                >
                                                    <Snowflake className="h-3 w-3" />
                                                    {t('AC')}
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Individual Practice & Studio Services - Oval shapes */}
                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 "
                                >
                                    {/* Individual Practice */}
                                    <motion.div
                                        variants={animations.scaleIn}
                                        className="group flex flex-col items-center justify-center bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all p-10"
                                        style={{
                                            borderRadius: '50% 50% 48% 52% / 52% 50% 50% 48%',
                                            minHeight: '280px',
                                        }}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-4 rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                                <Drum className="h-8 w-8 text-primary" />
                                            </div>
                                            <h3 className="font-bold text-xl text-foreground">
                                                {t('INDIVIDUAL_TITLE')}
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="text-3xl font-bold text-foreground">
                                                    3,000 Ft
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    / {t('HOUR')}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground max-w-xs">
                                                {t('INDIVIDUAL_DESC')}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Studio Services */}
                                    <motion.div
                                        variants={animations.scaleIn}
                                        className="group flex flex-col items-center justify-center bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer p-10"
                                        style={{
                                            borderRadius: '52% 48% 50% 50% / 48% 52% 48% 52%',
                                            minHeight: '280px',
                                        }}
                                    >
                                        <Link href="/studio" className="w-full">
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                                                    <CalendarClock className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="font-bold text-xl text-foreground">
                                                    {t('STUDIO_TITLE')}
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="text-3xl font-bold text-foreground">
                                                        10,000 Ft
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        / {t('HOUR')}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground italic max-w-xs">
                                                    {t('STUDIO_VAT_NOTE')}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Rentable & Drinks Section - Matching studio pricing style */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-8 sm:p-12 lg:p-16 border border-primary/20 shadow-2xl"
                    >
                        <div className="space-y-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center">
                                {t('EXTRAS_TITLE')}
                            </h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
                            >
                                {/* Rentable Equipment */}
                                <motion.div variants={animations.scaleIn} className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <Drum className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">
                                            {t('RENTABLE_TITLE')}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {t('RENTABLE_DESC')}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {rentable.map((item, idx) => {
                                            const isCymbal = item.translationKey.includes('CYMBAL')
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    variants={animations.fadeUp}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-card-elevated border border-primary/10 hover:border-primary/20 transition-all"
                                                >
                                                    <span className="font-medium text-foreground text-left flex-1 pr-4">
                                                        {t(item.translationKey)}
                                                    </span>
                                                    <div className="text-right flex-shrink-0">
                                                        {isCymbal ? (
                                                            <>
                                                                <div className="font-bold text-foreground whitespace-nowrap">
                                                                    {item.price.toLocaleString(
                                                                        'hu-HU'
                                                                    )}{' '}
                                                                    Ft
                                                                </div>
                                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    / {t('HOUR')}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="font-bold text-foreground whitespace-nowrap">
                                                                {item.price.toLocaleString('hu-HU')}{' '}
                                                                Ft / {t('HOUR')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.div>

                                {/* Drinks */}
                                <motion.div variants={animations.scaleIn} className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <Coffee className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">
                                            {t('DRINKS_TITLE')}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {t('DRINKS_DESC')}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {drinks.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={animations.fadeUp}
                                                className="flex items-center justify-between p-4 rounded-xl bg-card-elevated border border-primary/10 hover:border-primary/20 transition-all"
                                            >
                                                <span className="font-medium text-foreground text-left flex-1 pr-4">
                                                    {t(item.translationKey)}
                                                </span>
                                                {item.price && (
                                                    <span className="font-bold text-foreground whitespace-nowrap flex-shrink-0">
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

            {/* CTA Section */}
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </>
    )
}
