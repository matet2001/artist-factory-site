'use client'

import RoomsHero from '@/components/common/rooms/room-hero'
import type { Variants } from 'framer-motion'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import {
    BadgeDollarSign,
    CalendarDays,
    Headphones,
    LayoutDashboard,
    Phone,
    Snowflake,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function HomeHeroSection() {
    const t = useTranslations('HOME')
    const prefersReduced = useReducedMotion()

    // Animation variants
    const stagger: Variants = {
        initial: {},
        whileInView: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
    }

    const fadeUp: Variants = {
        initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: easeOut },
        },
    }

    const fadeUpDelay: Variants = {
        initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: easeOut, delay: 0.2 },
        },
    }

    const scaleIn: Variants = {
        initial: { opacity: 0, scale: prefersReduced ? 1 : 0.9 },
        whileInView: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: easeOut },
        },
    }

    const slideIn: Variants = {
        initial: { opacity: 0, x: prefersReduced ? 0 : -20 },
        whileInView: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: easeOut },
        },
    }

    return (
        <>
            {/* Hero Section - Full screen height */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mx-auto w-full max-w-4xl text-center flex flex-col justify-center space-y-8"
                >
                    {/* Title */}
                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl font-bold sm:text-6xl lg:text-7xl"
                    >
                        {t('HERO.TITLE')}
                    </motion.h1>

                    {/* First paragraph */}
                    <motion.p
                        variants={fadeUpDelay}
                        className="text-lg sm:text-xl lg:text-2xl text-foreground/80"
                    >
                        {t('HERO.DESCRIPTION_INTRO')}
                    </motion.p>

                    {/* Main CTA */}
                    <motion.div variants={scaleIn}>
                        <Link
                            href="/booking"
                            className="group inline-block w-full max-w-md mx-auto"
                        >
                            <div className="inline-flex w-full items-center justify-center gap-3 text-lg sm:text-xl p-5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                <CalendarDays className="w-6 h-6" aria-hidden="true" />
                                {t('HERO.CTA')}
                            </div>
                        </Link>
                    </motion.div>

                    {/* Small CTA cards */}
                    <motion.div
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto"
                    >
                        <motion.div variants={scaleIn}>
                            <Link href="/booking" className="group h-full block">
                                <div className="h-full min-h-[120px] flex flex-col items-center justify-center p-6 rounded-2xl bg-card border transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                                    <CalendarDays className="w-6 h-6 mb-2" aria-hidden="true" />
                                    <span className="text-base font-medium">
                                        {t('HERO.CTA_BOOK')}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        <motion.div variants={scaleIn}>
                            <Link href="/contact" className="group h-full block">
                                <div className="h-full min-h-[120px] flex flex-col items-center justify-center p-6 rounded-2xl bg-card border transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                                    <Phone className="w-6 h-6 mb-2" aria-hidden="true" />
                                    <span className="text-base font-medium">
                                        {t('HERO.CTA_PHONE')}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Description Section - Full screen height */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/30">
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mx-auto w-full max-w-4xl text-center flex items-center justify-center"
                >
                    <p className="text-xl sm:text-2xl lg:text-3xl text-foreground/90 leading-relaxed">
                        {t('HERO.DESCRIPTION_DETAILS')}
                    </p>
                </motion.div>
            </section>

            {/* Features Section - Full screen height */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mx-auto w-full max-w-4xl"
                >
                    {/* Features Header */}
                    <motion.div variants={fadeUp} className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                            {t('FEATURES.TITLE')}
                        </h2>
                    </motion.div>

                    {/* Features List */}
                    <motion.dl variants={stagger} className="space-y-8 lg:space-y-10">
                        <motion.div variants={slideIn} className="flex items-start gap-4 lg:gap-6">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                                <LayoutDashboard className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <dt className="text-lg lg:text-xl font-semibold mb-2">
                                    {t('FEATURES.ROOMS_SPACIOUS')}
                                </dt>
                                <dd className="text-base lg:text-lg text-foreground/80">
                                    {t('FEATURES.ROOMS_SPACIOUS_DESC')}
                                </dd>
                            </div>
                        </motion.div>

                        <motion.div variants={slideIn} className="flex items-start gap-4 lg:gap-6">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                                <BadgeDollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <dt className="text-lg lg:text-xl font-semibold mb-2">
                                    {t('FEATURES.AFFORDABLE')}
                                </dt>
                                <dd className="text-base lg:text-lg text-foreground/80">
                                    {t('FEATURES.AFFORDABLE_DESC')}
                                </dd>
                            </div>
                        </motion.div>

                        <motion.div variants={slideIn} className="flex items-start gap-4 lg:gap-6">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                                <Headphones className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <dt className="text-lg lg:text-xl font-semibold mb-2">
                                    {t('FEATURES.PREMIUM_EQUIPMENT')}
                                </dt>
                                <dd className="text-base lg:text-lg text-foreground/80">
                                    {t('FEATURES.PREMIUM_EQUIPMENT_DESC')}
                                </dd>
                            </div>
                        </motion.div>

                        <motion.div variants={slideIn} className="flex items-start gap-4 lg:gap-6">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                                <Snowflake className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <dt className="text-lg lg:text-xl font-semibold mb-2">
                                    {t('FEATURES.AIR_CONDITIONED')}
                                </dt>
                                <dd className="text-base lg:text-lg text-foreground/80">
                                    {t('FEATURES.AIR_CONDITIONED_DESC')}
                                </dd>
                            </div>
                        </motion.div>
                    </motion.dl>
                </motion.div>
            </section>

            <RoomsHero />
        </>
    )
}
