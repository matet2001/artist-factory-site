'use client'

import { RoomSection } from '@/components/common/rooms/room-section'
import CtaSection from '@/components/common/sections/cta-section'
import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { ArrowRight, DollarSign } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

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
