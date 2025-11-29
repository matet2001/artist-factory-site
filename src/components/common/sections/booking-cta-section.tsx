'use client'

import { CONTACT } from '@/lib/constants'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { CalendarDays, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import CtaButton from '../cta-button'

export default function BookingCtaSection() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <section className="relative py-6 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="relative overflow-hidden"
                >
                    {/* Background - hidden on mobile, organic shape on desktop */}
                    <div
                        className="
                            hidden md:block
                            absolute inset-0
                            bg-gradient-to-br from-primary/10 via-primary/5 to-transparent
                            border border-primary/20
                            shadow-2xl
                        "
                        style={{
                            borderRadius: '60% 40% 65% 35% / 55% 45% 55% 45%',
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-6 sm:p-12 lg:p-16">
                        <motion.div
                            variants={animations.stagger}
                            className="space-y-8 sm:space-y-10"
                        >
                            {/* Main CTA Button */}
                            <motion.div variants={animations.scaleIn} className="flex justify-center">
                                <CtaButton />
                            </motion.div>

                            {/* Small CTA cards with organic shapes */}
                            <motion.div
                                variants={animations.stagger}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto"
                            >
                                <motion.div variants={animations.scaleIn}>
                                    <Link href="/booking" className="group h-full block">
                                        <div
                                            className="h-full min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
                                            style={{
                                                borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
                                            }}
                                        >
                                            <CalendarDays
                                                className="w-6 h-6 sm:w-7 sm:h-7 mb-3 text-primary group-hover:scale-110 transition-transform"
                                                aria-hidden="true"
                                            />
                                            <span className="text-base sm:text-lg font-semibold text-center">
                                                {t('HERO.CTA_BOOK')}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div variants={animations.scaleIn}>
                                    <a href={`tel:${CONTACT.phoneRaw}`} className="group h-full block">
                                        <div
                                            className="h-full min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 group-hover:scale-105 hover:shadow-xl"
                                            style={{
                                                borderRadius: '45% 55% 48% 52% / 52% 45% 55% 48%',
                                            }}
                                        >
                                            <Phone
                                                className="w-6 h-6 sm:w-7 sm:h-7 mb-3 text-primary group-hover:scale-110 transition-transform"
                                                aria-hidden="true"
                                            />
                                            <span className="text-sm sm:text-base font-semibold text-center px-2">
                                                {t('HERO.CTA_PHONE')}
                                            </span>
                                        </div>
                                    </a>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
