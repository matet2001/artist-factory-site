// app/[locale]/rooms/[roomId]/page.tsx
'use client'

import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import CtaSection from '@/components/common/sections/cta-section'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { useAnimations } from '@/hooks/use-animation'
import { rooms } from '@/lib/rooms'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { DollarSign, Snowflake, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

export default function RoomDetailPage({ params }: { params: Promise<{ roomId: string }> }) {
    const t = useTranslations('ROOMS')
    const tGeneral = useTranslations('GENERAL')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    const { roomId } = React.use(params)
    const room = rooms.find((r) => r.id === roomId)

    if (!room) {
        notFound()
    }

    function tFormatted(label: string) {
        return label.replace(/\{\{(\w+)\}\}/g, (_, key) => t(`EQUIPMENT_PARTS.${key}`))
    }

    const plugin = React.useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    )

    return (
        <div>
            {/* Title Section - Clean, matching studio style */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        viewport={viewportConfig}
                        className="text-center space-y-4"
                    >
                        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">
                            {t('PRE_TITLE')}
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight capitalize">
                            {t(room.name)}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Image Carousel Section - Large, box-shaped */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl border border-primary/20 shadow-2xl"
                    >
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
                                {room.images.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
                                            <Image
                                                src={`/rooms/${img}`}
                                                alt={`${t(room.name)} – ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                        </Carousel>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* Equipment Section */}
            <section className="relative py-8 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="space-y-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center">
                            {t('EQUIPMENT_TITLE')}
                        </h2>

                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
                        >
                            {room.equipments.map((eq, i) => (
                                <motion.div
                                    key={i}
                                    variants={animations.scaleIn}
                                    className="flex items-start gap-4 p-6 rounded-xl bg-card/80 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                                >
                                    <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                                        <EquipmentIcon type={eq.type} size={24} alt={eq.label} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-foreground text-base mb-2">
                                            {t(`EQUIPMENT_TYPES.${eq.type.toUpperCase()}`)}
                                        </div>
                                        <div className="text-sm text-card-muted-foreground">
                                            {tFormatted(eq.label)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing & Stats Section */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="space-y-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center">
                            {t('DETAILS_TITLE')}
                        </h2>

                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                        >
                            {/* Price */}
                            <motion.div
                                variants={animations.scaleIn}
                                className="flex flex-col items-center justify-center gap-4 p-10 bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all text-center"
                                style={{
                                    borderRadius: '48% 52% 46% 54% / 54% 48% 52% 46%',
                                    minHeight: '280px',
                                }}
                            >
                                <div className="p-4 rounded-full bg-primary/10">
                                    <DollarSign className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    {t('BASE_PRICE')}
                                </h3>
                                <div className="text-4xl font-bold text-foreground">
                                    {room.price.toLocaleString('hu-HU')} Ft
                                </div>
                                <div className="text-sm text-muted-foreground">/ {t('HOUR')}</div>
                            </motion.div>

                            {/* Capacity */}
                            <motion.div
                                variants={animations.scaleIn}
                                className="flex flex-col items-center justify-center gap-4 p-10 bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all text-center"
                                style={{
                                    borderRadius: '52% 48% 50% 50% / 48% 52% 48% 52%',
                                    minHeight: '280px',
                                }}
                            >
                                <div className="p-4 rounded-full bg-primary/10">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{t('SIZE')}</h3>
                                <div className="text-4xl font-bold text-foreground">
                                    {room.size}
                                </div>
                                <div className="text-sm text-muted-foreground">{t('PEOPLE')}</div>
                            </motion.div>

                            {/* AC */}
                            <motion.div
                                variants={animations.scaleIn}
                                className="flex flex-col items-center justify-center gap-4 p-10 bg-card-elevated border border-primary/20 hover:border-primary/30 hover:shadow-lg transition-all text-center"
                                style={{
                                    borderRadius: '50% 50% 48% 52% / 52% 50% 50% 48%',
                                    minHeight: '280px',
                                }}
                            >
                                <div className="p-4 rounded-full bg-primary/10">
                                    <Snowflake className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    {tGeneral('AIR_CONDITIONED')}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    {tGeneral('AIR_CONDITIONED_DESC')}
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </div>
    )
}
