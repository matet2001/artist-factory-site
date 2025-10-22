// app/[locale]/studio/page.tsx
'use client'

import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import TikiTorch from '@/components/common/TikiTorch'
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

const references = [
    'Popper Péter - Részemről mondjunk mancsot és Jóga c. hangoskönyvek',
    'Ranschburg Jenő - hangoskönyv',
    'MÁV - hangok felvétele (Szalóczy Pál)',
    'Telefonos ügyfélszolgálati hangok',
    'Reklámszöveg: Advil Ultra forte 24',
]

export default function StudioPage() {
    const t = useTranslations('STUDIO')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    return (
        <div className="mb-20 flex flex-col gap-y-40">
            {/* Title Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="sm" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>

                        <div className="relative z-10 py-8 sm:py-10 lg:py-12">
                            <div className="space-y-4 sm:space-y-6">
                                <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-card-muted-foreground">
                                    {t('PRE_TITLE')}
                                </p>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight">
                                    {t('TITLE')}
                                </h1>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Hero Image Section */}
            <section className="relative">
                <div className="w-full mx-auto relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden w-full"
                    >
                        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
                            <Image
                                src="/studio/hero.jpg"
                                alt={t('TITLE')}
                                fill
                                className="object-cover rounded-2xl"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Tiki Torches in corners */}
                        <div className="hidden sm:block">
                            <TikiTorch position="top-left" />
                            <TikiTorch position="top-right" />
                            <TikiTorch position="bottom-left" />
                            <TikiTorch position="bottom-right" />
                        </div>

                        <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                            <motion.h2
                                variants={animations.fadeUp}
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground"
                            >
                                {t('SERVICES_TITLE')}
                            </motion.h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            >
                                {services.map((service, idx) => {
                                    const Icon = service.icon
                                    return (
                                        <motion.div
                                            key={idx}
                                            variants={animations.scaleIn}
                                            className="flex items-center gap-3 sm:gap-4 p-6 rounded-xl bg-card-elevated text-left"
                                        >
                                            <div className="flex-shrink-0">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-foreground text-sm sm:text-base">
                                                    {t(service.key)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Equipment Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        <div className="relative z-10 space-y-8">
                            <motion.h2
                                variants={animations.fadeUp}
                                className="text-2xl sm:text-3xl font-bold text-foreground"
                            >
                                {t('EQUIPMENT_TITLE')}
                            </motion.h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                            >
                                {equipment.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={animations.fadeUp}
                                        className="flex items-center gap-3 sm:gap-4 p-4 rounded-lg bg-card-elevated text-left"
                                    >
                                        <div className="flex-shrink-0">
                                            <EquipmentIcon type={item.type} size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-foreground break-words">
                                                {t(`EQUIPMENT.${item.label}`)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Instruments Note */}
                            <motion.div
                                variants={animations.fadeUp}
                                className="text-sm  italic w-full bg-card-elevated p-4 rounded-lg"
                            >
                                {t('INSTRUMENTS_NOTE')}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Tiki Torches in corners */}
                        <div className="hidden sm:block">
                            <TikiTorch position="top-left" />
                            <TikiTorch position="top-right" />
                            <TikiTorch position="bottom-left" />
                            <TikiTorch position="bottom-right" />
                        </div>

                        <div className="relative z-10 space-y-8 sm:space-y-10">
                            <motion.h2
                                variants={animations.fadeUp}
                                className="text-2xl sm:text-3xl font-bold text-foreground mb-6"
                            >
                                {t('PRICING_TITLE')}
                            </motion.h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col sm:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto"
                            >
                                {/* Studio Rate */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="flex-1 text-center p-8 rounded-xl bg-card-elevated"
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
                                    className="flex-1 text-center p-8 rounded-xl bg-card-elevated"
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
                                className="text-sm italic max-w-2xl mx-auto bg-card-elevated p-4 rounded-lg"
                            >
                                {t('NOTE')}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* References Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        <div className="relative z-10 space-y-8">
                            <motion.h2
                                variants={animations.fadeUp}
                                className="text-2xl sm:text-3xl font-bold text-foreground"
                            >
                                {t('REFERENCES_TITLE')}
                            </motion.h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto"
                            >
                                {references.map((reference, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={animations.fadeUp}
                                        className={`p-4 rounded-lg bg-card-elevated text-left ${
                                            idx === references.length - 1 ? 'md:col-span-2' : ''
                                        }`}
                                    >
                                        <div className="text-foreground text-sm sm:text-base">
                                            {reference}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-10 sm:py-12 lg:py-15 relative overflow-hidden w-full"
                    >
                        {/* Palm Trees in corners */}
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
                                className="space-y-6"
                            >
                                <motion.h2
                                    variants={animations.fadeUp}
                                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground"
                                >
                                    {t('CTA_TITLE')}
                                </motion.h2>
                                <motion.p
                                    variants={animations.fadeUp}
                                    className="text-card-muted-foreground text-sm sm:text-base lg:text-lg"
                                >
                                    {t('CTA_DESC')}
                                </motion.p>
                                <motion.div variants={animations.scaleIn} className="px-4">
                                    <Link
                                        href="/booking"
                                        className="group inline-block w-full max-w-xl mx-auto"
                                    >
                                        <Button
                                            size="lg"
                                            className="w-full inline-flex items-center justify-center gap-3 text-base sm:text-lg lg:text-xl px-8 sm:px-12 py-7 sm:py-8 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 hover:-translate-y-0.5"
                                        >
                                            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
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
