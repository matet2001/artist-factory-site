'use client'

import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { BadgeDollarSign, Headphones, LayoutDashboard, Snowflake } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import TikiTorch from '@/components/common/TikiTorch'

export default function FeaturesSection() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.2 } as const

    const features = [
        {
            icon: LayoutDashboard,
            title: 'FEATURES.ROOMS_SPACIOUS',
            desc: 'FEATURES.ROOMS_SPACIOUS_DESC',
        },
        {
            icon: Headphones,
            title: 'FEATURES.PREMIUM_EQUIPMENT',
            desc: 'FEATURES.PREMIUM_EQUIPMENT_DESC',
        },
        {
            icon: BadgeDollarSign,
            title: 'FEATURES.AFFORDABLE',
            desc: 'FEATURES.AFFORDABLE_DESC',
        },
        {
            icon: Snowflake,
            title: 'FEATURES.AIR_CONDITIONED',
            desc: 'FEATURES.AIR_CONDITIONED_DESC',
        },
    ]

    return (
        <section className="relative">
            <div className="w-full h-full text-center relative z-10">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="bg-muted/30 rounded-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-15 relative w-full"
                >
                    {/* Tiki Torches in all corners - hidden on mobile */}
                    <div>
                        <TikiTorch position="top-left" />
                        <TikiTorch position="top-right" />
                        <TikiTorch position="bottom-left" />
                        <TikiTorch position="bottom-right" />
                    </div>

                    <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                        {/* Features Header */}
                        <motion.div
                            variants={animations.fadeUp}
                            className="text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-8 sm:mb-12">
                                {t('FEATURES.TITLE')}
                            </h2>

                            {/* Features List - 2x2 Grid Layout */}
                            <motion.div
                                variants={animations.stagger}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12"
                            >
                                {features.map((feature) => {
                                    const IconComponent = feature.icon
                                    return (
                                        <motion.div
                                            key={feature.title}
                                            variants={animations.fadeUp}
                                            className="flex items-start gap-3 sm:gap-4 lg:gap-6 text-left"
                                        >
                                            <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                                                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">
                                                    {t(feature.title)}
                                                </h3>
                                                <p className="text-sm sm:text-base lg:text-lg text-foreground/80 leading-relaxed">
                                                    {t(feature.desc)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        </motion.div>

                        {/* Two Images Section */}
                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12"
                        >
                            {/* First Image */}
                            <motion.div variants={animations.slideIn} className="relative">
                                <div className="relative h-48 sm:h-64 lg:h-80 rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/pictures/IMG_1466.jpg"
                                        alt={t('FEATURES.IMAGE_ALT', {
                                            defaultValue: 'Rehearsal space interior',
                                        })}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Left-anchored backdrop blur with text as child */}
                                    <div className="absolute bottom-0 left-0">
                                        <div className="bg-gradient-to-t from-black/60 to-black/10 backdrop-blur-sm rounded-tr-xl px-4 py-3">
                                            <h4 className="text-white font-semibold text-lg sm:text-xl mb-1 drop-shadow-md whitespace-nowrap">
                                                {t('FEATURES.IMAGE1_TITLE', {
                                                    defaultValue: 'Professional Setup',
                                                })}
                                            </h4>
                                            <p className="text-white/90 text-sm sm:text-base drop-shadow-md whitespace-nowrap">
                                                {t('FEATURES.IMAGE1_DESC', {
                                                    defaultValue: 'State-of-the-art equipment',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Second Image */}
                            <motion.div variants={animations.slideInRight} className="relative">
                                <div className="relative h-48 sm:h-64 lg:h-80 rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/pictures/IMG_1468.jpg"
                                        alt={t('FEATURES.IMAGE2_ALT', {
                                            defaultValue: 'Studio environment',
                                        })}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Left-anchored backdrop blur with text as child */}
                                    <div className="absolute bottom-0 left-0">
                                        <div className="bg-gradient-to-t from-black/60 to-black/10 backdrop-blur-sm rounded-tr-xl px-4 py-3">
                                            <h4 className="text-white font-semibold text-lg sm:text-xl mb-1 drop-shadow-md whitespace-nowrap">
                                                {t('FEATURES.IMAGE2_TITLE', {
                                                    defaultValue: 'Comfortable Space',
                                                })}
                                            </h4>
                                            <p className="text-white/90 text-sm sm:text-base drop-shadow-md whitespace-nowrap">
                                                {t('FEATURES.IMAGE2_DESC', {
                                                    defaultValue: 'Perfect for creativity',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
