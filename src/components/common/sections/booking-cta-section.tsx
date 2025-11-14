'use client'

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
        <section className="relative">
            <div className="w-full text-center relative z-10">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative w-full "
                >
                    <div className="relative z-10 space-y-8 sm:space-y-10">
                        <motion.div
                            variants={animations.stagger}
                            className="mx-auto w-full max-w-4xl text-center flex flex-col justify-center space-y-6 sm:space-y-8"
                        >
                          

                            {/* Main CTA Button */}
                            <motion.div variants={animations.scaleIn} className="px-4">
                                <CtaButton />
                            </motion.div>

                            {/* Small CTA cards */}
                            <motion.div
                                variants={animations.stagger}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-xl mx-auto w-full px-4"
                            >
                                <motion.div variants={animations.scaleIn}>
                                    <Link href="/booking" className="group h-full block">
                                        <div className="h-full min-h-[100px] sm:min-h-[120px] w-full flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-secondary hover:bg-secondary-hover transition-all duration-300 group-hover:scale-110">
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
                                        <div className="h-full min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary bg-secondary hover:bg-secondary-hover">
                                            <Phone
                                                className="w-5 h-5 sm:w-6 sm:h-6 mb-2"
                                                aria-hidden="true"
                                            />
                                            <span className="text-xs sm:text-sm font-medium text-center px-2">
                                                {t('HERO.CTA_PHONE')}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
