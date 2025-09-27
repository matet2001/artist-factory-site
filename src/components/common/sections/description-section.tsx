'use client'

import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function DescriptionSection() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <section className="section-height flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/30 rounded-xl relative overflow-hidden">
            {/* Palm Trees in all corners */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <PalmTreeSilhouette position="top-left" flipped size="lg" />
                <PalmTreeSilhouette position="top-right" flipped mirrored size="lg" />
                <PalmTreeSilhouette position="bottom-left" size="lg" />
                <PalmTreeSilhouette position="bottom-right" mirrored size="lg" />
            </div>

            <motion.div
                variants={animations.fadeUp}
                initial="initial"
                whileInView="whileInView"
                viewport={viewportConfig}
                className="mx-auto w-full max-w-4xl text-center flex items-center justify-center relative z-10 px-4"
            >
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-foreground/90 leading-relaxed">
                    {t('HERO.DESCRIPTION_DETAILS')}
                </p>
            </motion.div>
        </section>
    )
}
