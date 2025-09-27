'use client'

import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function StudioShowcase() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    return (
        <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl w-full">
                <motion.div
                    variants={animations.scaleIn}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="relative h-48 sm:h-64 lg:h-80 xl:h-96 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <Image
                        src="/pictures/IMG_1467.jpg"
                        alt={t('HERO.PROFESSIONAL_ENV_ALT', {
                            defaultValue: 'Studio environment',
                        })}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                        <div className="text-center text-white">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-4">
                                {t('HERO.PROFESSIONAL_ENV_TITLE', {
                                    defaultValue: 'Professional Environment',
                                })}
                            </h3>
                            <p className="text-sm sm:text-base lg:text-lg xl:text-xl opacity-90">
                                {t('HERO.PROFESSIONAL_ENV_DESC', {
                                    defaultValue: 'State-of-the-art rehearsal facilities',
                                })}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
