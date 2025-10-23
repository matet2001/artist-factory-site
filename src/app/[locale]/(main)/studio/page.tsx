// app/[locale]/studio/page.tsx
'use client'

import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { EquipmentItem } from '@/lib/rooms'
import { motion } from 'framer-motion'
import {
    CalendarDays,
    Clock,
    Disc3,
    DollarSign,
    Headphones,
    Mic2,
    Music,
    Radio,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

const services = [
    { key: 'FULL_ALBUM', icon: Disc3 },
    { key: 'EDITING', icon: Headphones },
    { key: 'AUDIOBOOKS', icon: Mic2 },
    { key: 'COMMERCIAL', icon: Radio },
    { key: 'REHEARSAL_RECORDING', icon: Music },
]

const equipment: EquipmentItem[] = [
    { label: 'COMPUTER', type: 'mixer' },
    { label: 'CONVERTERS', type: 'mixer' },
    { label: 'PREAMPS', type: 'amp' },
    { label: 'MICROPHONES', type: 'mic' },
]

// References moved to translation file for i18n support

export default function StudioPage() {
    const t = useTranslations('STUDIO')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    return (
        <div className="mb-20">
            {/* Title Section - Clean, no card */}
            <section className="relative py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        viewport={viewportConfig}
                        className="text-center space-y-4"
                    >
                        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">
                            {t('PRE_TITLE')}
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            {t('TITLE')}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Hero Image Section - Full bleed with subtle border */}
            <section className="relative py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden border border-primary/20 shadow-2xl"
                    >
                        <Image
                            src="/studio/hero.jpg"
                            alt={t('TITLE')}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Subtle gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* Services Section - More visible card */}
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
                                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center"
                                >
                                    {t('SERVICES_TITLE')}
                                </motion.h2>

                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {services.map((service, idx) => {
                                        const Icon = service.icon
                                        return (
                                            <motion.div
                                                key={idx}
                                                variants={animations.scaleIn}
                                                className="group flex items-center gap-4 p-6 rounded-xl bg-card-elevated/60 border border-primary/20 hover:border-primary/50 transition-all hover:bg-card-elevated hover:shadow-lg"
                                            >
                                                <div className="flex-shrink-0">
                                                    <Icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                                                </div>
                                                <p className="text-base font-medium text-foreground">
                                                    {t(service.key)}
                                                </p>
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Equipment Section - Clean with visible borders */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="space-y-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center">
                            {t('EQUIPMENT_TITLE')}
                        </h2>

                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {equipment.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={animations.fadeUp}
                                    className="group flex flex-col items-center gap-4 p-6 rounded-xl border border-primary/20 hover:border-primary/50 transition-all hover:bg-card/30"
                                >
                                    <div className="flex-shrink-0 transition-transform group-hover:scale-110">
                                        <EquipmentIcon type={item.type} size={100}/>
                                    </div>
                                    <p className="text-sm text-center text-foreground/90">
                                        {t(`EQUIPMENT.${item.label}`)}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section - Solid card (important info) */}
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
                                {t('PRICING_TITLE')}
                            </h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                            >
                                {/* Studio Rate */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="flex-1 text-center p-8 rounded-xl bg-card-elevated border border-primary/20"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <DollarSign className="h-6 w-6 text-primary" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {t('STUDIO_RATE')}
                                        </h3>
                                    </div>
                                    <div className="text-4xl font-bold text-foreground mb-2">
                                        10,000 Ft
                                    </div>
                                    <div className="text-sm text-card-muted-foreground mb-4">
                                        / {t('HOUR')}
                                    </div>
                                    <div className="text-xs text-card-muted-foreground italic">
                                        {t('VAT_FREE')}
                                    </div>
                                </motion.div>

                                {/* Rehearsal Recording Rate */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="flex-1 text-center p-8 rounded-xl bg-card-elevated border border-primary/20"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Clock className="h-6 w-6 text-primary" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {t('REHEARSAL_RATE')}
                                        </h3>
                                    </div>
                                    <div className="text-4xl font-bold text-foreground mb-2">
                                        8,000 Ft
                                    </div>
                                    <div className="text-sm text-card-muted-foreground mb-4">
                                        / {t('HOUR')}
                                    </div>
                                    <div className="text-xs text-card-muted-foreground">
                                        {t('REHEARSAL_DESC')}
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={animations.fadeUp}
                                className="text-sm italic max-w-2xl mx-auto bg-card-elevated/50 p-4 rounded-lg border border-primary/10 text-center"
                            >
                                {t('NOTE')}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* References Section - More visible card */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="space-y-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center">
                            {t('REFERENCES_TITLE')}
                        </h2>

                        <motion.div variants={animations.fadeUp} className="max-w-4xl mx-auto">
                            <div className="p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all bg-card/40 hover:bg-card/50">
                                <p className="text-foreground/90 text-base sm:text-lg leading-relaxed text-center whitespace-pre-line">
                                    {t('REFERENCES_TEXT')}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Instruments Note - More visible */}
            <section className="relative py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="text-center p-6 rounded-xl bg-card/40 border border-primary/20"
                    >
                        <p className="text-sm text-foreground/80 italic">{t('INSTRUMENTS_NOTE')}</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section - Palm trees only, no tiki torches */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="relative bg-gradient-to-br from-card to-card-elevated rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-primary/20 shadow-2xl"
                    >
                        {/* Palm Trees in corners - ONLY decoration */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="sm" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>

                        <div className="relative z-10">
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="space-y-8 text-center"
                            >
                                <motion.h2
                                    variants={animations.fadeUp}
                                    className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                                >
                                    {t('CTA_TITLE')}
                                </motion.h2>
                                <motion.p
                                    variants={animations.fadeUp}
                                    className="text-card-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto"
                                >
                                    {t('CTA_DESC')}
                                </motion.p>
                                <motion.div variants={animations.scaleIn}>
                                    <Link
                                        href="/booking"
                                        className="group inline-block w-full max-w-md mx-auto"
                                    >
                                        <Button
                                            size="lg"
                                            className="w-full inline-flex items-center justify-center gap-3 text-lg lg:text-xl px-12 py-8 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
                                        >
                                            <CalendarDays className="w-6 h-6" />
                                            {t('CTA_BUTTON')}
                                        </Button>
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
