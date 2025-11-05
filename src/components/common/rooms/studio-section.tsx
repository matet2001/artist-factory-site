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

    // Add your studio images here
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
                    <div className="relative h-[500px] sm:h-[550px]">
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
                                        <div className="relative h-[500px] sm:h-[550px] w-full overflow-hidden rounded-t-2xl">
                                            <Image
                                                src={`/studio/${img}`}
                                                alt={`${t('TITLE')} – ${index + 1}`}
                                                fill
                                                className="object-cover object-center"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Position arrows outside the image carousel */}
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                        </Carousel>
                    </div>

                    {/* === OVERLAY CONTENT AREA === */}
                    <div className="relative z-10 -mt-10 px-6 sm:px-10 pb-5">
                        {/* Gradient behind content – only lower portion of image */}
                        <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-t from-card/90 to-card/10 backdrop-blur-md rounded-b-2xl z-[-1]" />

                        <div className="w-full text-center p-5 space-y-6">
                            {/* --- Title --- */}
                            <motion.h2
                                variants={animations.fadeUp}
                                className="text-white text-3xl sm:text-5xl font-bold capitalize drop-shadow-lg"
                            >
                                {t('TITLE')}
                            </motion.h2>

                            {/* --- Description --- */}
                            {/* <motion.p
                                variants={animations.fadeUp}
                                className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto drop-shadow-md"
                            >
                                {t('SUBTITLE')}
                            </motion.p> */}

                            {/* --- Features (Price / Service Type) --- */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12"
                            >
                                <motion.div
                                    variants={animations.fadeUp}
                                    className="flex items-center gap-3"
                                >
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide drop-shadow-md">
                                            {t('STUDIO_RATE')}
                                        </p>
                                        <p className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                                            10,000 Ft / {t('HOUR')}
                                        </p>
                                        <p className="text-white/60 text-xs drop-shadow-md">
                                            {t('VAT_FREE')}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={animations.fadeUp}
                                    className="flex items-center gap-3"
                                >
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
                                        <Mic2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide drop-shadow-md">
                                            {t('SERVICES_TITLE')}
                                        </p>
                                        <p className="text-white text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg break-words">
                                            {t('FULL_ALBUM')}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* --- CTA Buttons --- */}
                            <motion.div
                                variants={animations.fadeUpDelay}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 pt-4"
                            >
                                <Link href="/studio" className="w-full sm:w-auto">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full sm:w-auto px-10 py-7 text-lg font-bold shadow-2xl transition-all hover:scale-105 hover:-translate-y-0.5"
                                    >
                                        {tRooms('SEE_DETAILS')}
                                    </Button>
                                </Link>

                                <Link href="/booking" className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto px-14 py-7 text-lg uppercase font-bold transition-all hover:scale-105 hover:-translate-y-0.5"
                                    >
                                        {t('CTA_BUTTON')}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                        {/* Palm Trees in bottom corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
