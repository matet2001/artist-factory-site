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
                    <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                        <motion.div
                            variants={animations.stagger}
                            className="mx-auto w-full max-w-7xl text-center flex flex-col justify-center space-y-6 sm:space-y-8"
                        >
                            {/* Title */}
                            <motion.h1
                                variants={animations.fadeUp}
                                className="text-3xl font-bold sm:text-5xl lg:text-6xl xl:text-7xl"
                            >
                                {t('HERO.TITLE')}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                variants={animations.fadeUp}
                                className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground"
                            >
                                {t('HERO.DESCRIPTION_INTRO')}
                            </motion.p>

                            {/* 3 Images Section */}
                            <motion.div
                                variants={animations.stagger}
                                className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-8"
                            >
                                {/* Corridor Image - Left with rounded left corners */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="relative group"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-l-2xl">
                                        <Image
                                            src="/pictures/corridor.jpg"
                                            alt={t('HERO.IMAGE_CORRIDOR')}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </motion.div>

                                {/* Reception Image - Middle with text at bottom */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="relative group"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <Image
                                            src="/pictures/lobby.jpg"
                                            alt={t('HERO.IMAGE_RECEPTION')}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                </motion.div>

                                {/* Studio Image - Right with rounded right corners */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="relative group"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-r-2xl">
                                        <Image
                                            src="/pictures/studio.jpg"
                                            alt={t('HERO.IMAGE_STUDIO')}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        {/* Dark overlay */}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
