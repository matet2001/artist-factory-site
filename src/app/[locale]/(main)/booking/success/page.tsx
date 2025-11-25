'use client'

import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function BookingSuccessPage() {
    const t = useTranslations('BOOKING')
    const router = useRouter()
    const animations = useAnimations()

    return (
        <>
            {/* Success Message Section */}
            <section className="relative py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="relative"
                    >
                        {/* Background card */}
                        <div className="absolute inset-0 bg-card/80 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-2xl" />

                        <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center text-center">
                            {/* Success Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, type: 'spring', delay: 0.3 }}
                                className="mb-8"
                            >
                                <CheckCircle2 className="w-24 h-24 text-green-500" />
                            </motion.div>

                            {/* Main Description - Emphasized */}
                            <div className="mb-6 max-w-lg">
                                <p className="text-xl font-medium text-foreground leading-relaxed">
                                    {t('BOOKING_SUCCESS_DESC')}
                                </p>
                            </div>

                            {/* Secondary Message - Subtle */}
                            <div className="mb-10 max-w-md">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t('BOOKING_SUCCESS_EMAIL_NOTICE')}
                                </p>
                            </div>

                            <Button size="lg" className="px-12" onClick={() => router.push('/')}>
                                Foglalás Megtekintése
                            </Button>
                            <Button size="lg" className="px-12" onClick={() => router.push('/')}>
                                {t('BACK_TO_HOME')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
