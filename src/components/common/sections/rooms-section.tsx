'use client'

import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import RoomList from '@/components/common/rooms/room-list'
import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function RoomsSection() {
    const roomsT = useTranslations('ROOMS')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <section className="relative">
            <div className="w-full h-full text-center relative z-10">
                {/* Enhanced CTA Section with Room List */}
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="
                        bg-card rounded-none p-4 py-8
                        md:rounded-3xl md:p-6 md:py-10
                        lg:p-8 lg:py-12
                        relative w-full
                    "
                >
                    {/* Palm Trees - only on md+ */}
                    <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
                        <PalmTreeSilhouette position="top-left" flipped size="lg" />
                        <PalmTreeSilhouette position="top-right" flipped mirrored size="lg" />
                        <PalmTreeSilhouette position="bottom-left" size="lg" />
                        <PalmTreeSilhouette position="bottom-right" mirrored size="lg" />
                    </div>

                    <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                        {/* Section Header */}
                        <motion.div
                            variants={animations.fadeUp}
                            className="mx-auto max-w-4xl text-center"
                        >
                            <h2 className="text-xs sm:text-sm uppercase text-card-muted-foreground tracking-[0.25em]">
                                {roomsT('PRE_TITLE')}
                            </h2>

                            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-pretty">
                                {roomsT('TITLE')}
                            </h1>

                            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-card-muted-foreground px-4">
                                {roomsT('DESCRIPTION')}
                            </p>
                        </motion.div>

                        {/* Room List with proper spacing */}
                        <motion.div
                            variants={animations.scaleIn}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={{ once: true, amount: 0.2 }}
                            className="flex justify-center items-center px-0 sm:px-2 lg:px-4 xl:px-8"
                        >
                            <RoomList />
                        </motion.div>

                        {/* Call to Action */}
                        <motion.div variants={animations.fadeUp} className="space-y-4 sm:space-y-6">
                            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-center font-semibold px-4">
                                {roomsT('MORE_INFO_PROMPT', {
                                    defaultValue:
                                        'További részletekért látogasd meg a termek oldalát!',
                                })}
                            </h2>

                            <Link href="/rooms">
                                <Button
                                    variant="secondary"
                                    className=" font-semibold p-7 sm:p-10 text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {roomsT('SEE_ALL_ROOMS', {
                                        defaultValue: 'Összes terem megtekintése',
                                    })}
                                    <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-1 sm:ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
