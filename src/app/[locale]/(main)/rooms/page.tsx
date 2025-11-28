'use client'

import CtaSection from '@/components/common/sections/cta-section'
import { EquipmentIcon } from '@/components/common/rooms/equipment-icon'
import { Badge } from '@/components/ui/badge'
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
import { ArrowRight, DollarSign, Snowflake, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function RoomSection({
    room,
    tRooms,
    tGeneral,
    animations,
    isReversed,
}: {
    room: (typeof rooms)[0]
    tRooms: ReturnType<typeof useTranslations<'ROOMS'>>
    tGeneral: ReturnType<typeof useTranslations<'GENERAL'>>
    animations: ReturnType<typeof useAnimations>
    isReversed: boolean
}) {
    const viewportConfig = { once: true, amount: 0.2 } as const

    const plugin = React.useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    )

    return (
        <section className="relative py-10 md:py-16 lg:py-24">
            <div className="w-full md:max-w-7xl md:mx-auto md:px-4">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="bg-card md:bg-card md:rounded-3xl overflow-hidden border-0 md:border md:border-primary/20 md:shadow-2xl rounded-sm" 
                >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 items-stretch`}>
                        {/* Image Carousel */}
                        <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'} relative`}>
                            <div className="relative h-[400px] sm:h-[500px] lg:h-full lg:min-h-[600px]">
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
                                                <div className="relative h-[400px] sm:h-[500px] lg:h-full lg:min-h-[600px] w-full">
                                                    <Image
                                                        src={`/rooms/${img}`}
                                                        alt={`${tRooms(room.name)} – ${index + 1}`}
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

                                {/* AC Badge - Bottom Center */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                                    <Badge
                                        variant="secondary"
                                        className="gap-2 px-6 py-2.5 text-base backdrop-blur-sm bg-background/90 border-primary/30 shadow-lg whitespace-nowrap"
                                    >
                                        <Snowflake className="h-4 w-4" />
                                        {tGeneral('AIR_CONDITIONED')}
                                    </Badge>
                                </div>

                                {/* Gradient overlay between image and content - desktop only */}
                                <div
                                    className={`hidden md:block absolute inset-y-0 ${isReversed ? 'left-0' : 'right-0'} w-3 z-10 pointer-events-none ${isReversed ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-card to-card/0 backdrop-blur-md`}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className={`${isReversed ? 'lg:order-1' : 'lg:order-2'} p-4 md:p-8 flex flex-col justify-start space-y-10 py-8`}
                        >
                            <motion.div variants={animations.fadeUp} className="text-center lg:text-left">
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold capitalize">
                                    {tRooms(room.name)}
                                </h2>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-wrap gap-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <DollarSign className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {tRooms('BASE_PRICE')}
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {room.price.toLocaleString('hu-HU')} Ft / {tRooms('HOUR')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{tRooms('SIZE')}</p>
                                        <p className="text-2xl font-bold">
                                            {room.size} {tRooms('PEOPLE')}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Equipment Preview - First 3 items */}
                            {room.equipments && room.equipments.length > 0 && (
                                <motion.div
                                    variants={animations.stagger}
                                    initial="initial"
                                    whileInView="whileInView"
                                    viewport={viewportConfig}
                                    className="space-y-3"
                                >
                                    {room.equipments.slice(0, 3).map((eq, i) => {
                                        const tFormatted = (label: string) => {
                                            return label.replace(
                                                /\{\{(\w+)\}\}/g,
                                                (_, key) => tRooms(`EQUIPMENT_PARTS.${key}`)
                                            )
                                        }

                                        return (
                                            <motion.div
                                                key={i}
                                                variants={animations.fadeUp}
                                                className="flex items-start gap-3 p-4 rounded-xl bg-card/60 border border-primary/10"
                                            >
                                                <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
                                                    <EquipmentIcon
                                                        type={eq.type}
                                                        size={20}
                                                        alt={eq.label}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <div className="font-semibold text-foreground text-sm">
                                                        {tRooms(`EQUIPMENT_TYPES.${eq.type.toUpperCase()}`)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                                        {tFormatted(eq.label)}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                            )}

                            {/* CTA Buttons */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link href={`/rooms/${room.id}`} className="flex-1">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full px-8 py-6 text-lg font-bold"
                                    >
                                        {tRooms('SEE_DETAILS')}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/booking" className="flex-1">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="w-full px-8 py-6 text-lg font-bold transition-all hover:scale-105 hover:-translate-y-1"
                                    >
                                        {tRooms('CTA')}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

function StudioSection({
    tStudio,
    tRooms,
    animations,
}: {
    tStudio: ReturnType<typeof useTranslations<'STUDIO'>>
    tRooms: ReturnType<typeof useTranslations<'ROOMS'>>
    animations: ReturnType<typeof useAnimations>
}) {
    const viewportConfig = { once: true, amount: 0.2 } as const

    return (
        <section className="relative py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="bg-transparent md:bg-gradient-to-br md:from-card md:to-card-elevated rounded-none md:rounded-3xl p-0 md:p-8 lg:p-12 border-0 md:border md:border-primary/20 md:shadow-2xl"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Image */}
                        <div className="lg:order-1">
                            <div className="relative h-[400px] sm:h-[500px] overflow-hidden rounded-3xl border border-primary/20 shadow-xl">
                                <Image
                                    src="/studio/hero.jpg"
                                    alt={tStudio('TITLE')}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 lg:order-2">
                            <motion.div variants={animations.fadeUp}>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                                    {tStudio('TITLE')}
                                </h2>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-wrap gap-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <DollarSign className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {tRooms('BASE_PRICE')}
                                        </p>
                                        <p className="text-2xl font-bold">
                                            10,000 Ft / {tRooms('HOUR')}
                                        </p>
                                        <p className="text-xs text-muted-foreground italic">
                                            {tStudio('VAT_FREE')}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col sm:flex-row gap-4 pt-4"
                            >
                                <Link href="/studio" className="flex-1">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-full px-8 py-6 text-lg font-bold"
                                    >
                                        {tRooms('SEE_DETAILS')}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/booking" className="flex-1">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="w-full px-8 py-6 text-lg font-bold transition-all hover:scale-105 hover:-translate-y-1"
                                    >
                                        {tRooms('CTA')}
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default function RoomsPage() {
    const tRooms = useTranslations('ROOMS')
    const tStudio = useTranslations('STUDIO')
    const tGeneral = useTranslations('GENERAL')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

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
                            {tRooms('PRE_TITLE')}
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            {tRooms('TITLE')}
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                            {tRooms('DESCRIPTION')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Room Sections - Each room takes up near full screen height */}
            {rooms.map((room, index) => (
                <RoomSection
                    key={room.id}
                    room={room}
                    tRooms={tRooms}
                    tGeneral={tGeneral}
                    animations={animations}
                    isReversed={index % 2 !== 0}
                />
            ))}

            {/* Studio Section */}
            <StudioSection tStudio={tStudio} tRooms={tRooms} animations={animations} />

            {/* CTA Section */}
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </div>
    )
}
