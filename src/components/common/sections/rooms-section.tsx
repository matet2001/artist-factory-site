'use client'

import RoomList from '@/components/common/rooms/room-list'
import TikiTorch from '@/components/common/TikiTorch'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useAnimations } from '@/hooks/use-animation'

export default function RoomsSection() {
    const roomsT = useTranslations('ROOMS')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <section className="relative">
            <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Enhanced CTA Section with Room List */}
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 relative w-full"
                >
                    {/* Tiki Torches in all corners - angled towards center - hidden on mobile */}
                    <div className="hidden sm:block">
                        <TikiTorch position="top-left" />
                        <TikiTorch position="top-right" />
                        <TikiTorch position="bottom-left" />
                        <TikiTorch position="bottom-right" />
                    </div>

                    <div className="relative z-10 space-y-8 sm:space-y-10 lg:space-y-12">
                        {/* Section Header */}
                        <motion.div
                            variants={animations.fadeUp}
                            className="mx-auto max-w-4xl text-center"
                        >
                            <h2 className="text-xs sm:text-sm uppercase text-muted-foreground tracking-[0.25em]">
                                {roomsT('PRE_TITLE')}
                            </h2>

                            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-pretty">
                                {roomsT('TITLE')}
                            </h1>

                            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
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
                                    variant="default"
                                    size="xl"
                                    className="bg-background/70 hover:bg-background/40 text-primary-foreground font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    {roomsT('SEE_ALL_ROOMS', {
                                        defaultValue: 'Összes terem megtekintése',
                                    })}
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
