'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function TermsOfBookingPage() {
    const t = useTranslations('BOOKING.TERMS')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    return (
        <>
            {/* Title Section */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        viewport={viewportConfig}
                        className="text-center space-y-4"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            {t('TITLE')}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative py-10">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="space-y-6"
                    >
                        {/* Advance Booking */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('ADVANCE_BOOKING_TITLE')}
                                </h2>
                                <p className=" leading-relaxed">
                                    {t('ADVANCE_BOOKING')}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Cancellation */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('CANCELLATION_TITLE')}
                                </h2>
                                <p className=" leading-relaxed">
                                    {t('CANCELLATION')}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Same Day Changes */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('SAME_DAY_CHANGES_TITLE')}
                                </h2>
                                <p className=" leading-relaxed">
                                    {t('SAME_DAY_CHANGES')}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('CONTACT_TITLE')}
                                </h2>
                                <p className="text-foreground leading-relaxed">{t('CONTACT')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
