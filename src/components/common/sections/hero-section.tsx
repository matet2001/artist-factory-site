'use client'

import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { CONTACT } from '@/lib/constants'
import { motion } from 'framer-motion'
import { CalendarDays, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
    const t = useTranslations('HOME')
    const tGeneral = useTranslations('GENERAL')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.2 } as const

    return (
        <section className="relative -mt-[var(--header-height)] py-10 md:py-16 lg:py-24">
            <div className="w-full md:mx-auto md:px-4">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="bg-card/60 backdrop-blur-lg md:rounded-3xl overflow-hidden border-0 md:border md:border-primary/20 md:shadow-2xl"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                        {/* Left: Hero image */}
                        <div className="relative lg:order-1">
                            <div className="relative h-[400px] sm:h-[500px] lg:h-full lg:min-h-[600px]">
                                <Image
                                    src="/pictures/hero.jpg"
                                    alt="Artist Factory rehearsal rooms and studio"
                                    fill
                                    priority
                                    className="object-cover"
                                    quality={95}
                                />

                                {/* Gradient overlay between image and content - desktop only */}
                                <div className="hidden md:block absolute inset-y-0 right-0 w-3 z-10 pointer-events-none bg-gradient-to-l from-card to-card/0 backdrop-blur-md" />
                            </div>
                        </div>

                        {/* Right: Content card */}
                        <div className="lg:order-2 p-4 md:p-6 lg:p-8 flex flex-col justify-start space-y-6 md:space-y-8 py-8 md:py-10 lg:py-12">
                            {/* AF outlined logo - full width */}
                            <motion.div variants={animations.fadeUp} className="w-full">
                                <Image
                                    src="/decorations/AF01_outlined.png"
                                    alt="Artist Factory"
                                    width={1000}
                                    height={300}
                                    className="w-full h-auto drop-shadow-2xl"
                                    priority
                                />
                            </motion.div>

                            {/* Text info: próbaterem és stúdió + since 2007 */}
                            <motion.div
                                variants={animations.fadeUp}
                                className="space-y-2 md:space-y-3 text-center"
                            >
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                                    {t('HERO.DESCRIPTION_INTRO')}
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl text-muted-foreground uppercase tracking-[0.2em] font-semibold">
                                    {t('HERO.SINCE')}
                                </p>
                            </motion.div>

                            {/* CTA Section */}
                            <motion.div
                                variants={animations.fadeUp}
                                className="space-y-4 pt-4 md:pt-6"
                            >
                                {/* CTA Title */}
                                <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold">
                                    {tGeneral('CTA_TITLE')}
                                </h2>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8">
                                    {/* Online Booking Button */}
                                    <Link href="/booking" className="flex-1">
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="w-full px-6 py-6 text-base md:text-lg font-bold transition-all hover:scale-105"
                                        >
                                            <CalendarDays className="w-5 h-5 mr-2" />
                                            {t('HERO.CTA_BOOK')}
                                        </Button>
                                    </Link>

                                    {/* Phone Booking Button */}
                                    <Link href={`tel:${CONTACT.phoneRaw}`} className="flex-1">
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            className="w-full px-6 py-6 text-base md:text-lg font-bold"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            {CONTACT.phoneDisplay}
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
