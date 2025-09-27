'use client'

import PalmTreeSilhouette from '@/components/common/PalmTreeSilhoutte'
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
            <div className="absolute left-0 top-0 z-0">
                <PalmTreeSilhouette flipped />
            </div>
            <div className="absolute right-0 top-0 z-0">
                <PalmTreeSilhouette flipped mirrored />
            </div>
            <div className="absolute left-0 bottom-0 z-0">
                <PalmTreeSilhouette />
            </div>
            <div className="absolute right-0 bottom-0 z-0">
                <PalmTreeSilhouette mirrored />
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
