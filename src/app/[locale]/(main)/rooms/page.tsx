'use client'

import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import RoomSection from '@/components/common/rooms/room-section'
import StudioSection from '@/components/common/rooms/studio-section'
import { useAnimations } from '@/hooks/use-animation'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function RoomsPage() {
    const t = useTranslations('ROOMS')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    return (
        <div className="mb-20 flex flex-col gap-y-40">
            {/* Title Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="sm" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>

                        <div className="relative z-10 py-8 sm:py-10 lg:py-12">
                            {/* Title */}
                            <div className="space-y-4 sm:space-y-6">
                                <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-card-muted-foreground">
                                    {t('PRE_TITLE')}
                                </p>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-pretty">
                                    {t('TITLE')}
                                </h1>
                                <p className="text-sm sm:text-base lg:text-lg text-card-muted-foreground px-4 max-w-3xl mx-auto">
                                    {t('DESCRIPTION')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Room Sections */}
            {rooms.map((room) => (
                <RoomSection key={room.id} room={room} />
            ))}

            {/* Studio Section */}
            <StudioSection />
        </div>
    )
}
