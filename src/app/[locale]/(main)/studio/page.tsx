// app/[locale]/studio/page.tsx
'use client'

import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import CtaSection from '@/components/common/sections/cta-section'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { Disc3, DollarSign, Headphones, Mic2, Music, Radio } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const services = [
    { key: 'FULL_ALBUM', icon: Disc3 },
    { key: 'EDITING', icon: Headphones },
    { key: 'AUDIOBOOKS', icon: Mic2 },
    { key: 'COMMERCIAL', icon: Radio },
    { key: 'REHEARSAL_RECORDING', icon: Music },
]

// Detailed equipment with translation keys
const equipmentDetails = [
    {
        titleKey: 'EQUIPMENT.COMPUTER.TITLE',
        type: 'mixer' as const,
        itemKeys: ['EQUIPMENT.COMPUTER.ITEM_1', 'EQUIPMENT.COMPUTER.ITEM_2'],
    },
    {
        titleKey: 'EQUIPMENT.CONVERTERS.TITLE',
        type: 'mixer' as const,
        itemKeys: ['EQUIPMENT.CONVERTERS.ITEM_1'],
    },
    {
        titleKey: 'EQUIPMENT.PREAMPS.TITLE',
        type: 'amp' as const,
        itemKeys: ['EQUIPMENT.PREAMPS.ITEM_1', 'EQUIPMENT.PREAMPS.ITEM_2'],
    },
    {
        titleKey: 'EQUIPMENT.MICROPHONES.TITLE',
        type: 'mic' as const,
        itemKeys: [
            'EQUIPMENT.MICROPHONES.ITEM_1',
            'EQUIPMENT.MICROPHONES.ITEM_2',
            'EQUIPMENT.MICROPHONES.ITEM_3',
            'EQUIPMENT.MICROPHONES.ITEM_4',
            'EQUIPMENT.MICROPHONES.ITEM_5',
        ],
    },
]

export default function StudioPage() {
    const t = useTranslations('STUDIO')
    const tGeneral = useTranslations('GENERAL')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    // Organic shapes for equipment cards
    const equipmentShapes = [
        '45% 55% 60% 40% / 55% 50% 50% 45%', // Computer
        '55% 45% 50% 50% / 45% 60% 100% 55%', // Converters
        '50% 50% 55% 45% / 60% 45% 55% 40%', // Preamps
        '48% 52% 45% 55% / 52% 55% 100% 48%', // Microphones
    ]

    // Organic shapes for reference cards
    const referenceShapes = [
        '50% 50% 45% 55% / 55% 50% 50% 45%',
        '55% 45% 52% 48% / 48% 55% 45% 52%',
        '48% 52% 50% 50% / 52% 48% 52% 48%',
        '52% 48% 55% 45% / 50% 52% 48% 52%',
        '45% 55% 48% 52% / 55% 45% 55% 45%',
    ]

    // Reference keys
    const referenceKeys = [
        'REFERENCES.ITEM_1',
        'REFERENCES.ITEM_2',
        'REFERENCES.ITEM_3',
        'REFERENCES.ITEM_4',
        'REFERENCES.ITEM_5',
    ]

    return (
        <div>
            {/* Title Section - Clean, no card */}
            <section className="relative">
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

            {/* Hero Image Section - Organic shape */}
            <section className="relative  mt-20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden"
                        style={{
                            borderRadius: '65% 35% 70% 30% / 60% 40% 60% 40%',
                        }}
                    >
                        <div
                            className="relative h-full border border-primary/20 shadow-2xl overflow-hidden"
                            style={{
                                borderRadius: '65% 35% 70% 30% / 60% 40% 60% 40%',
                            }}
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
                        </div>
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

            {/* Equipment Section - More height for microphones card */}
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
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                        >
                            {equipmentDetails.map((equipment, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={animations.scaleIn}
                                    className="flex flex-col gap-4 p-6 bg-card/80 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                                    style={{
                                        borderRadius: equipmentShapes[idx],
                                        minHeight: '260px',
                                    }}
                                >
                                    {/* Icon and Title */}
                                    <div className="flex flex-col items-center gap-2 pb-3 border-b border-primary/20">
                                        <EquipmentIcon type={equipment.type} size={40} />
                                        <h3 className="text-base font-bold text-center text-foreground">
                                            {t(equipment.titleKey)}
                                        </h3>
                                    </div>

                                    {/* Equipment List */}
                                    <ul className="space-y-2 text-sm text-foreground/80 flex-1">
                                        {equipment.itemKeys.map((itemKey, itemIdx) => (
                                            <li key={itemIdx} className="flex items-start gap-2">
                                                <span className="text-primary mt-1 flex-shrink-0">
                                                    •
                                                </span>
                                                <span className="leading-relaxed">
                                                    {t(itemKey)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
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
                        className=" p-8 sm:p-12 lg:p-16 "
                    >
                        <div className="space-y-12">
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="max-w-4xl mx-auto"
                            >
                                {/* Studio Rate */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="flex-1 text-center p-8 rounded-xl bg-card-elevated border border-primary/20"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-10">
                                        <DollarSign className="h-8 w-8 text-primary" />
                                        <h2 className="text-3xl sm:text-4xl font-bold text-center">
                                            {t('PRICING_TITLE')}
                                        </h2>
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
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* References Section - Bigger cards with centered text */}
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

                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                        >
                            {referenceKeys.map((refKey, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={animations.scaleIn}
                                    className="p-8 border border-primary/20 hover:border-primary/40 transition-all bg-card/80 hover:bg-card/50 hover:shadow-lg flex items-center justify-center min-h-[150px]"
                                    style={{
                                        borderRadius: referenceShapes[idx % referenceShapes.length],
                                    }}
                                >
                                    <p className="text-foreground/90 text-base sm:text-lg leading-relaxed text-center">
                                        {t(refKey)}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Instruments Note - Reduced top padding to show they belong together */}
            <section className="relative pt-4 pb-8">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="text-center p-6 rounded-xl bg-card/80 border border-primary/20"
                    >
                        <p className="text-sm text-foreground/80 italic">{t('INSTRUMENTS_NOTE')}</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </div>
    )
}
