'use client'

import TikiTorch from '@/components/common/TikiTorch'
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
        <section className="relative px-4 sm:px-6 lg:px-8">
            <div className="w-full h-full text-center relative z-10">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className={`
            relative w-full text-left
            /* mobile: flat layout */
            bg-transparent border-0 shadow-none rounded-none p-0
            /* md+: card look */
            md:bg-gradient-to-br md:from-card md:to-card-elevated
            md:rounded-3xl md:border md:border-primary/20 md:shadow-2xl
            md:px-8 md:pt-10 md:pb-12
          `}
                >
                    {/* Tiki Torches - only on md+ */}
                    <div className="hidden md:block">
                        <TikiTorch position="top-left" />
                        <TikiTorch position="top-right" />
                        <TikiTorch position="bottom-left" />
                        <TikiTorch position="bottom-right" />
                    </div>

                    <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                        {/* Features Header + List */}
                        <motion.div variants={animations.fadeUp} className="text-center">
                            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 sm:mb-10">
                                {t('FEATURES.TITLE')}
                            </h2>

                            <motion.div
                                variants={animations.stagger}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
                            >
                                {features.map((feature) => {
                                    const IconComponent = feature.icon
                                    return (
                                        <motion.div
                                            key={feature.title}
                                            variants={animations.fadeUp}
                                            className="flex items-start gap-3 sm:gap-4 text-left"
                                        >
                                            <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-primary/10">
                                                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1">
                                                    {t(feature.title)}
                                                </h3>
                                                <p className="text-sm sm:text-base text-card-muted-foreground leading-relaxed">
                                                    {t(feature.desc)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        </motion.div>

                        {/* Images Section */}
                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="w-full"
                        >
                            {/* Full Width Image */}
                            <motion.div variants={animations.slideIn} className="relative w-full">
                                <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/pictures/lobby.jpg"
                                        alt={t('FEATURES.IMAGE_ALT', {
                                            defaultValue: 'Rehearsal space interior',
                                        })}
                                        fill
                                        className="object-cover"
                                    />

                                    <div className="absolute bottom-0 left-0">
                                        <div className="bg-gradient-to-t from-black/70 to-black/10 backdrop-blur-sm rounded-tr-xl px-4 py-3">
                                            <h4 className="text-white font-semibold text-base sm:text-lg mb-1 drop-shadow-md">
                                                {t('FEATURES.IMAGE1_TITLE', {
                                                    defaultValue: 'Professional Setup',
                                                })}
                                            </h4>
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
