'use client'

import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { useAnimations } from '@/hooks/use-animation'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { DollarSign, Mic2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function StudioSection() {
    const t = useTranslations('STUDIO')
    const tRooms = useTranslations('ROOMS')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.2 } as const

    const plugin = React.useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    )

    const studioImages = ['hero.jpg']

    return (
        <section id="studio" className="w-full py-10 scroll-mt-[var(--header-height)]">
            <motion.div
                variants={animations.fadeUp}
                initial="initial"
                whileInView="whileInView"
                viewport={viewportConfig}
                className="mx-auto w-full px-4 relative overflow-hidden z-10"
            >
                <div className="relative w-full overflow-hidden rounded-2xl shadow-xl bg-card">
                    {/* === IMAGE SECTION === */}
                    <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
                        <Carousel
                            plugins={[plugin.current]}
                            className="w-full h-full"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {studioImages.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
                                            <Image
                                                src={`/studio/${img}`}
                                                alt={`${t('TITLE')} – ${index + 1}`}
                                                fill
                                                className="object-cover object-center"
                                                priority={index === 0}
                                            />
                                            {/* Subtle gradient for better legibility near the bottom */}
                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card/80 via-card/40 to-transparent" />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                        </Carousel>
                    </div>

                    {/* === OVERLAY CONTENT CARD === */}
                    <div className="relative z-10 -mt-16 px-4 sm:px-8 pb-8">
                        <div className="relative mx-auto max-w-5xl bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-6 sm:p-8 space-y-6 sm:space-y-8">
                            {/* Palm Trees in corners of the card */}
                            <div className="pointer-events-none absolute inset-0 z-0">
                                <PalmTreeSilhouette position="bottom-left" size="sm" />
                                <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                            </div>

                            <div className="relative z-10 space-y-5 sm:space-y-6">
                                {/* --- Title --- */}
                                <motion.h2
                                    variants={animations.fadeUp}
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
                                >
                                    {t('TITLE')}
                                </motion.h2>

                                {/* --- 3-column layout: Price / Services / CTA --- */}
                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch"
                                >
                                    {/* Price block */}
                                    <motion.div
                                        variants={animations.fadeUp}
                                        className="flex items-center md:items-start gap-3 sm:gap-4"
                                    >
                                        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2.5">
                                            <DollarSign className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                {t('STUDIO_RATE')}
                                            </p>
                                            <p className="text-xl sm:text-2xl font-bold">
                                                10,000 Ft / {t('HOUR')}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t('VAT_FREE')}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Services block */}
                                    <motion.div
                                        variants={animations.fadeUp}
                                        className="flex items-center md:items-start gap-3 sm:gap-4"
                                    >
                                        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2.5">
                                            <Mic2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                {t('SERVICES_TITLE')}
                                            </p>
                                            <p className="text-base sm:text-lg lg:text-xl font-semibold leading-snug">
                                                {t('FULL_ALBUM')}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* CTA column – same visual weight as other columns */}
                                    <motion.div
                                        variants={animations.fadeUp}
                                        className="flex flex-col justify-center gap-3 items-center"
                                    >
                                        <Link href="/booking" className="w-full">
                                            <Button
                                                size="lg"
                                                className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold uppercase shadow-lg transition-transform hover:scale-[1.02] hover:-translate-y-0.5"
                                            >
                                                {t('CTA_BUTTON')}
                                            </Button>
                                        </Link>

                                        <Link href="/studio" className="w-full">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="w-full h-12 sm:h-12 text-sm sm:text-base font-medium"
                                            >
                                                {tRooms('SEE_DETAILS')}
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
