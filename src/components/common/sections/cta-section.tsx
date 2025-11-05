'use client'

import CtaButton from '@/components/common/cta-button'
import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'

interface CtaSectionProps {
    title: string
    description: string
}

export default function CtaSection({ title, description }: CtaSectionProps) {
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    return (
        <section className="relative py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="relative bg-gradient-to-br from-card to-card-elevated rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-primary/20 shadow-2xl"
                >
                    {/* Palm Trees in corners */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <PalmTreeSilhouette position="top-left" flipped size="sm" />
                        <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                        <PalmTreeSilhouette position="bottom-left" size="sm" />
                        <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            variants={animations.stagger}
                            initial="initial"
                            whileInView="whileInView"
                            viewport={viewportConfig}
                            className="space-y-8 text-center"
                        >
                            <motion.h2
                                variants={animations.fadeUp}
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                            >
                                {title}
                            </motion.h2>
                            <motion.p
                                variants={animations.fadeUp}
                                className="text-card-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto"
                            >
                                {description}
                            </motion.p>
                            <motion.div variants={animations.scaleIn}>
                                <CtaButton />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
