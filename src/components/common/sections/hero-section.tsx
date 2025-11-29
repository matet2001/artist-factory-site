'use client'

import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function HeroSection() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <section className="relative min-h-screen -mt-[var(--header-height)] flex items-center justify-center">
            <div className="w-full text-center relative z-10">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="p-4 sm:p-6 lg:p-8 py-12 sm:py-16 lg:py-20 relative w-full"
                >
                    <div className="relative z-10 space-y-6 sm:space-y-10 lg:space-y-12">
                        <motion.div
                            variants={animations.stagger}
                            className="w-full  text-center flex flex-col items-center justify-center space-y-4 sm:space-y-8"
                        >
                            {/* Title */}
                            <motion.h1
                                variants={animations.fadeUp}
                                className="text-5xl font-bold sm:text-5xl lg:text-6xl xl:text-7xl text-outline-primary"
                            >
                                {t('HERO.TITLE')}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.div
                                variants={animations.fadeUp}
                                className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground"
                            >
                                {t('HERO.DESCRIPTION_INTRO')}
                                <p className="mt-1 italic">{t('HERO.SINCE')}</p>
                            </motion.div>

                            {/* Images Section */}
                            <motion.div variants={animations.stagger} className="mt-8 w-full">
                                {/* Edge-to-edge on mobile, centered on larger screens */}
                                <div className="w-full max-w-7xl mx-auto">
                                    {/* Shared pill container: rounded top+bottom, border only on Y */}
                                    <div className="group relative overflow-hidden rounded-3xl border-y-4 border-primary">
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            {/* Corridor Image (top on mobile, left on desktop) */}
                                            <div className="relative aspect-[3/4] md:aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src="/pictures/corridor.jpg"
                                                    alt={t('HERO.IMAGE_CORRIDOR')}
                                                    fill
                                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>

                                            {/* Chill zone Image (bottom on mobile, right on desktop) */}
                                            <div className="relative aspect-[3/4] md:aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src="/pictures/chill_zone.jpg"
                                                    alt={t('HERO.IMAGE_STUDIO')}
                                                    fill
                                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
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
