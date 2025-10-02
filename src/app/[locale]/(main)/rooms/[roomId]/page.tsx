// app/[locale]/rooms/[roomId]/page.tsx
'use client'

import PalmLeafDivider from '@/components/common/palm-leaft-divider'
import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import TikiTorch from '@/components/common/TikiTorch'
import { Button } from '@/components/ui/button'
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
import { CalendarDays, DollarSign, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export default function RoomDetailPage({ params }: { params: Promise<{ roomId: string }> }) {
    const t = useTranslations('ROOMS')
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
        <div className="mb-20">
            {/* Title Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="sm" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>

                        <div className="relative z-10 py-8 sm:py-10 lg:py-12">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight capitalize">
                                {t(room.name)}
                            </h1>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Image Carousel Section */}
            <section className="relative">
                <div className="w-full mx-auto relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden w-full"
                    >
                        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
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
                                                    className="object-cover rounded-2xl"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                            </Carousel>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Pricing & Details Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Tiki Torches in corners */}
                        <div className="hidden sm:block">
                            <TikiTorch position="top-left" />
                            <TikiTorch position="top-right" />
                            <TikiTorch position="bottom-left" />
                            <TikiTorch position="bottom-right" />
                        </div>

                        <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                            {/* Price & Capacity */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16"
                            >
                                {/* Price */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="text-center p-6 rounded-xl bg-background/70 min-w-[240px]"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <DollarSign className="h-6 w-6 text-foreground" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {t('BASE_PRICE')}
                                        </h3>
                                    </div>
                                    <div className="text-3xl font-bold text-foreground">
                                        {room.price.toLocaleString('hu-HU')} Ft
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        / {t('HOUR')}
                                    </div>
                                </motion.div>

                                {/* Capacity */}
                                <motion.div
                                    variants={animations.scaleIn}
                                    className="text-center p-6 rounded-xl bg-background/70 min-w-[240px]"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Users className="h-6 w-6 text-foreground" />
                                        <h3 className="text-lg font-bold text-foreground">
                                            {t('SIZE')}
                                        </h3>
                                    </div>
                                    <div className="text-3xl font-bold text-foreground">
                                        {room.size}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {t('PEOPLE')}
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Equipment List */}
                            <motion.div
                                variants={animations.fadeUp}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                            >
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">
                                    {t('EQUIPMENT_TITLE', { default: 'Felszereltség' })}
                                </h2>

                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                                >
                                    {room.equipments.map((eq, i) => (
                                        <motion.div
                                            key={i}
                                            variants={animations.fadeUp}
                                            className="flex items-start gap-3 sm:gap-4 p-4 rounded-lg bg-background/70 text-left"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <EquipmentIcon
                                                    type={eq.type}
                                                    size={24}
                                                    alt={eq.label}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-foreground text-sm sm:text-base mb-1">
                                                    {t(`EQUIPMENT_TYPES.${eq.type.toUpperCase()}`)}
                                                </div>
                                                <div className="text-sm text-muted-foreground break-words">
                                                    {tFormatted(eq.label)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>

                            {/* CTA Button */}
                            <motion.div
                                variants={animations.scaleIn}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="pt-4"
                            >
                                <Link
                                    href="/booking"
                                    className="group inline-block w-full max-w-xl mx-auto"
                                >
                                    <Button
                                        size="lg"
                                        className="w-full inline-flex items-center justify-center gap-3 text-base sm:text-lg lg:text-xl px-8 sm:px-12 py-7 sm:py-8 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 hover:-translate-y-0.5"
                                    >
                                        <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
                                        {t('CTA')}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}