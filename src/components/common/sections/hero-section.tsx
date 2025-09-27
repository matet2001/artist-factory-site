'use client'

import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { CalendarDays, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function HeroSection() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <>
            <section className="absolute left-0 right-0 min-h-screen flex items-center justify-center -mt-[var(--header-height)] overflow-hidden z-10">
                {/* Full-screen fixed background image - Desktop */}
                <div
                    className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-fixed hidden sm:block"
                    style={{
                        backgroundImage: "url('/decorations/AF01.png')",
                        backgroundSize: 'contain',
                    }}
                    aria-hidden="true"
                />

                {/* Full-screen fixed background image - Mobile (rotated version) */}
                <div
                    className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-fixed block sm:hidden"
                    style={{
                        backgroundImage: "url('/decorations/AF01-mobile.png')",
                        backgroundSize: 'contain',
                    }}
                    aria-hidden="true"
                />

                {/* Optional overlay for readability */}
                <div
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    aria-hidden="true"
                />

                {/* Foreground content with padding */}
                <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={animations.stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="mx-auto w-full max-w-4xl text-center flex flex-col justify-center space-y-6 sm:space-y-8"
                    >
                        {/* Title */}
                        <motion.h1
                            variants={animations.fadeUp}
                            className="text-3xl font-bold sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            {t('HERO.TITLE')}
                        </motion.h1>

                        {/* First paragraph */}
                        <motion.p
                            variants={animations.fadeUpDelay}
                            className="text-base sm:text-lg lg:text-xl xl:text-2xl text-foreground/80 px-4"
                        >
                            {t('HERO.DESCRIPTION_INTRO')}
                        </motion.p>

                        {/* Main CTA */}
                        <motion.div variants={animations.scaleIn} className="px-4">
                            <Link
                                href="/booking"
                                className="group inline-block w-full max-w-xl mx-auto"
                            >
                                <div className="relative group w-full">
                                    <div className="neon-glow inline-flex w-full items-center justify-center gap-3 text-base sm:text-lg lg:text-xl p-4 sm:p-5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                        <CalendarDays
                                            className="w-5 h-5 sm:w-6 sm:h-6"
                                            aria-hidden="true"
                                        />
                                        {t('HERO.CTA')}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Small CTA cards */}
                        <motion.div
                            variants={animations.stagger}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-xl mx-auto w-full px-4"
                        >
                            <motion.div variants={animations.scaleIn}>
                                <Link href="/booking" className="group h-full block">
                                    <div className="h-full min-h-[100px] sm:min-h-[120px] w-full flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                                        <CalendarDays
                                            className="w-5 h-5 sm:w-6 sm:h-6 mb-2"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm sm:text-base font-medium text-center">
                                            {t('HERO.CTA_BOOK')}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div variants={animations.scaleIn}>
                                <Link href="/contact" className="group h-full block">
                                    <div className="h-full min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                                        <Phone
                                            className="w-5 h-5 sm:w-6 sm:h-6 mb-2"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm sm:text-base font-medium text-center">
                                            {t('HERO.CTA_PHONE')}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Spacer for first section */}
            <section className="section-height"></section>
        </>
    )
}
