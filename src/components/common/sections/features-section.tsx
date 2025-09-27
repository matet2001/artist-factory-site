'use client'

import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { BadgeDollarSign, Headphones, LayoutDashboard, Snowflake } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

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
        <section className="section-height flex flex-col justify-center">
            {/* Palm Leaf Divider */}
            {/* <PalmLeafDivider count={7} spacing="normal" /> */}

            <div className="w-full  px-4 sm:px-6 lg:px-8">
                {/* Features Header */}
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="text-center mb-8 sm:mb-10 lg:mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-8 sm:mb-12">
                        {t('FEATURES.TITLE')}
                    </h2>

                    {/* Features List - 2x2 Grid Layout */}
                    <motion.div
                        variants={animations.stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8  xl:gap-16  mx-auto"
                    >
                        {features.map((feature) => {
                            const IconComponent = feature.icon
                            return (
                                <motion.div
                                    key={feature.title}
                                    variants={animations.fadeUp}
                                    className="flex items-start gap-3 sm:gap-4 lg:gap-6 text-left px-4 sm:px-0"
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

                            {/* Backdrop blur overlay - only at bottom where text is */}
                            <div className="absolute left-0 bottom-0 w-2/3 h-24 bg-gradient-to-t from-black/60 to-black/10 backdrop-blur-sm  rounded-tr-xl" />

                            <div className="absolute bottom-4 left-4 right-4">
                                <h4 className="text-white font-semibold text-lg sm:text-xl mb-1 drop-shadow-md">
                                    {t('FEATURES.IMAGE1_TITLE', {
                                        defaultValue: 'Professional Setup',
                                    })}
                                </h4>
                                <p className="text-white/90 text-sm sm:text-base drop-shadow-md">
                                    {t('FEATURES.IMAGE1_DESC', {
                                        defaultValue: 'State-of-the-art equipment',
                                    })}
                                </p>
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

                            {/* Backdrop blur overlay - only at bottom where text is */}
                            <div className="absolute left-0 bottom-0 w-1/2 h-24 bg-gradient-to-t from-black/20 to-black/10 backdrop-blur-sm rounded-tr-xl" />

                            <div className="absolute bottom-4 left-4 right-4">
                                <h4 className="text-white font-semibold text-lg sm:text-xl mb-1 drop-shadow-md">
                                    {t('FEATURES.IMAGE2_TITLE', {
                                        defaultValue: 'Comfortable Space',
                                    })}
                                </h4>
                                <p className="text-white/90 text-sm sm:text-base drop-shadow-md">
                                    {t('FEATURES.IMAGE2_DESC', {
                                        defaultValue: 'Perfect for creativity',
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
