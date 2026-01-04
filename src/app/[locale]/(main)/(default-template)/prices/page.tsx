// app/[locale]/prices/page.tsx
'use client'

import CtaSection from '@/components/common/sections/cta-section'
import { useAnimations } from '@/hooks/use-animation'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { CalendarClock, Clock, Coffee, Drum, Users } from 'lucide-react'
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
    { translationKey: 'RENTABLE_CYMBAL', price: 500 },
    { translationKey: 'RENTABLE_DOUBLE_PEDAL', price: 300 },
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
            <section className="relative py-12 md:py-16 lg:py-24">
                <div className="w-full md:max-w-7xl md:mx-auto md:px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="relative"
                    >
                        {/* Background card - full width on mobile, contained on desktop */}
                        <div className="absolute inset-0 bg-card md:bg-card/80 md:backdrop-blur-xl rounded-none md:rounded-3xl border-0 md:border md:border-primary/20 md:shadow-xl" />

                        <div className="relative z-10 p-6 py-10 md:p-8 lg:p-12">
                            <div className="space-y-12">
                                <motion.h2
                                    variants={animations.fadeUp}
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center flex items-center justify-center gap-3"
                                >
                                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                                    {t('HOUR_PRICE')}
                                </motion.h2>

                                {/* Room Cards - Horizontal on mobile, Grid on desktop */}
                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="flex flex-col lg:grid lg:grid-cols-5 gap-3 lg:gap-6"
                                >
                                    {rooms.map((room) => (
                                        <motion.div
                                            key={room.id}
                                            variants={animations.scaleIn}
                                            onClick={() => goToRoom(room.id)}
                                            className="group relative cursor-pointer"
                                        >
                                            {/* Mobile: Horizontal layout */}
                                            <div className="flex lg:hidden items-center justify-between p-4 hover:bg-card-elevated/50 transition-all border-b-2 border-primary/20 last:border-b-0">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-base text-foreground">
                                                        {tRooms(room.name)}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                                        <Users className="h-3 w-3" />
                                                        <span>{room.size}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg font-bold text-foreground">
                                                        {room.price.toLocaleString('hu-HU')}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Ft/{t('HOUR')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Desktop: Card layout with oval shapes */}
                                            <div
                                                className="hidden lg:flex flex-col items-center justify-center bg-card-elevated border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl p-6 rounded-2xl"
                                                style={{
                                                    minHeight: '240px',
                                                }}
                                            >
                                                {/* Desktop only: oval shape overlay */}
                                                <div
                                                    className="absolute inset-0 pointer-events-none -z-10 bg-card-elevated border border-primary/20"
                                                    style={{
                                                        borderRadius:
                                                            '48% 52% 46% 54% / 54% 48% 52% 46%',
                                                    }}
                                                />
                                                <div className="flex flex-col items-center text-center space-y-3">
                                                    <h3 className="font-bold text-lg text-foreground">
                                                        {tRooms(room.name)}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-foreground/80 text-sm">
                                                        <Users className="h-4 w-4" />
                                                        <span>
                                                            {room.size} {t('PEOPLE')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 text-foreground">
                                                        <span className="text-3xl font-bold">
                                                            {room.price.toLocaleString('hu-HU')}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            Ft
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        / {t('HOUR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Individual Practice & Studio Services - Horizontal on mobile, Cards on desktop */}
                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6"
                                >
                                    {/* Individual Practice */}
                                    <motion.div
                                        variants={animations.scaleIn}
                                        className="group relative"
                                    >
                                        {/* Mobile: Simple bordered section */}
                                        <div className="lg:hidden p-6 border-b-2 border-primary/20">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-full bg-primary/10 shrink-0">
                                                    <Drum className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-foreground mb-2">
                                                        {t('INDIVIDUAL_TITLE')}
                                                    </h3>
                                                    <div className="flex items-baseline gap-2 mb-2">
                                                        <span className="text-2xl font-bold text-foreground">
                                                            3,000 Ft
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            / {t('HOUR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {t('INDIVIDUAL_DESC')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop: Card with oval shape */}
                                        <div
                                            className="hidden lg:flex flex-col items-center justify-center bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all p-10 rounded-2xl"
                                            style={{
                                                minHeight: '280px',
                                            }}
                                        >
                                            {/* Desktop only: oval shape overlay */}
                                            <div
                                                className="absolute inset-0 pointer-events-none -z-10 bg-card-elevated border border-primary/20"
                                                style={{
                                                    borderRadius:
                                                        '50% 50% 48% 52% / 52% 50% 50% 48%',
                                                }}
                                            />
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className="p-4 rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                                    <Drum className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="font-bold text-xl text-foreground">
                                                    {t('INDIVIDUAL_TITLE')}
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="text-3xl font-bold text-foreground">
                                                        3,500 Ft
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        / {t('HOUR')}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground max-w-xs">
                                                    {t('INDIVIDUAL_DESC')}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Studio Services */}
                                    <motion.div
                                        variants={animations.scaleIn}
                                        className="group relative"
                                    >
                                        {/* Mobile: Simple bordered section */}
                                        <Link href="/studio" className="lg:hidden block">
                                            <div className="p-6 md:border-b-2 border-none border-primary/20 hover:bg-card-elevated/50 transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 rounded-full bg-primary/10 shrink-0">
                                                        <CalendarClock className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-foreground mb-2">
                                                            {t('STUDIO_TITLE')}
                                                        </h3>
                                                        <div className="flex items-baseline gap-2 mb-2">
                                                            <span className="text-2xl font-bold text-foreground">
                                                                10,000 Ft
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">
                                                                / {t('HOUR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground italic">
                                                            {t('STUDIO_VAT_NOTE')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Desktop: Card with oval shape */}
                                        <div
                                            className="hidden lg:flex flex-col items-center justify-center bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer p-10 rounded-2xl"
                                            style={{
                                                minHeight: '280px',
                                            }}
                                        >
                                            {/* Desktop only: oval shape overlay */}
                                            <div
                                                className="absolute inset-0 pointer-events-none -z-10 bg-card-elevated border border-primary/20"
                                                style={{
                                                    borderRadius:
                                                        '52% 48% 50% 50% / 48% 52% 48% 52%',
                                                }}
                                            />
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
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Rentable & Drinks Section - Full width card on mobile */}
            <section className="relative py-16 md:py-24">
                <div className="w-full md:max-w-7xl md:mx-auto md:px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card md:bg-card rounded-none md:rounded-3xl p-6 py-10 md:p-8 lg:p-12 border-0 md:border md:border-primary/20 md:shadow-2xl"
                    >
                        <div className="space-y-12">
                            {/* <h2 className="text-3xl sm:text-4xl font-bold text-center">
                                {t('EXTRAS_TITLE')}
                            </h2> */}

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col gap-12 max-w-5xl mx-auto"
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

                                    <div className="space-y-0">
                                        {rentable.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={animations.fadeUp}
                                                className="flex items-center justify-between p-3 md:p-4 border-b-2 border-primary/20 last:border-b-0"
                                            >
                                                <span className="font-medium text-foreground text-left">
                                                    {t(item.translationKey)}
                                                </span>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-muted-foreground text-sm">
                                                        {item.price.toLocaleString('hu-HU')} Ft /{' '}
                                                        {t('HOUR')}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Drinks */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="space-y-6 self-center mt-6 mb-6"
                                >
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
