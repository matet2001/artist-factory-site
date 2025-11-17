'use client'

import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { ArrowRight, Headphones, Mic2, Music } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function StudioHomeSection() {
    const t = useTranslations('HOME.STUDIO_SECTION')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    const features = [
        {
            icon: Music,
            titleKey: 'FEATURE_1',
            descKey: 'FEATURE_1_DESC',
            shape: '55% 45% 52% 48% / 48% 55% 45% 52%',
        },
        {
            icon: Mic2,
            titleKey: 'FEATURE_2',
            descKey: 'FEATURE_2_DESC',
            shape: '48% 52% 55% 45% / 52% 48% 52% 48%',
        },
        {
            icon: Headphones,
            titleKey: 'FEATURE_3',
            descKey: 'FEATURE_3_DESC',
            shape: '52% 48% 45% 55% / 55% 52% 48% 45%',
        },
    ]

    return (
        <section className="relative py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Content Left */}
                        <motion.div variants={animations.stagger} className="space-y-6">
                            {/* Header */}
                            <motion.div variants={animations.fadeUp} className="space-y-4">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                                    {t('TITLE')}
                                </h2>
                                <p className="text-base sm:text-lg text-card-muted-foreground">
                                    {t('DESCRIPTION')}
                                </p>
                            </motion.div>

                            {/* Features in row layout */}
                            <motion.div variants={animations.stagger} className="space-y-4">
                                {features.map((feature, idx) => {
                                    const Icon = feature.icon
                                    return (
                                        <motion.div
                                            key={idx}
                                            variants={animations.scaleIn}
                                            className="group"
                                        >
                                            <div
                                                className="flex items-start justify-start pl-16 gap-4 p-4 bg-card-elevated/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:bg-card-elevated transition-all duration-300 hover:shadow-xl"
                                                style={{
                                                    borderRadius: feature.shape,
                                                }}
                                            >
                                                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors shrink-0">
                                                    <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold mb-1">
                                                        {t(feature.titleKey)}
                                                    </h3>
                                                    <p className="text-sm text-card-muted-foreground">
                                                        {t(feature.descKey)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>

                            {/* CTA & Price - moved up, more compact */}
                            <motion.div
                                variants={animations.fadeUp}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2"
                            >
                                <div
                                    className="px-6 py-4 bg-primary/10 backdrop-blur-sm border border-primary/30"
                                    style={{
                                        borderRadius: '50% 50% 45% 55% / 55% 45% 55% 45%',
                                    }}
                                >
                                    <p className="text-xs sm:text-sm text-card-muted-foreground uppercase tracking-wider mb-1">
                                        {t('PRICE_LABEL')}
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-primary">
                                        {t('PRICE')}
                                    </p>
                                </div>

                                <Link href="/studio">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="group font-bold text-base sm:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                    >
                                        {t('CTA')}
                                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Studio Image */}
                        <motion.div
                            variants={animations.scaleIn}
                            className="relative h-[400px] lg:h-[600px] overflow-hidden"
                            style={{
                                borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
                            }}
                        >
                            <div
                                className="relative h-full border border-primary/30 shadow-xl overflow-hidden"
                                style={{
                                    borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
                                }}
                            >
                                <Image
                                    src="/studio/hero.jpg"
                                    alt={t('TITLE')}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
