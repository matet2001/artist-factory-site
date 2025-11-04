'use client'

import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import logo from '@/assets/logo.png'

export default function DescriptionSection() {
    const t = useTranslations('HOME')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.3 } as const

    // Logo configurations - more varied positions, rotations, and larger sizes
    const logoConfigs = [
        { top: '8%', left: '3%', rotation: -35, size: 140, opacity: 0.65 },
        { top: '12%', right: '5%', rotation: 45, size: 160, opacity: 0.72 },
        { top: '45%', left: '2%', rotation: -25, size: 120, opacity: 0.58 },
        { bottom: '10%', left: '8%', rotation: -50, size: 150, opacity: 0.68 },
        { bottom: '12%', right: '4%', rotation: 55, size: 135, opacity: 0.62 },
        { top: '60%', right: '6%', rotation: 20, size: 110, opacity: 0.55 },
    ]

    return (
        <section className="relative">
            <div className="w-full h-full text-center relative z-10">
                <motion.div
                    variants={animations.fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={viewportConfig}
                    className="bg-gradient-to-br from-card to-card-elevated rounded-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-15 relative w-full h-full section-height flex justify-center items-center overflow-hidden border border-primary/20 shadow-2xl"
                >
                    {/* Scattered Logos */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {logoConfigs.map((config, index) => (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    top: config.top,
                                    left: config.left,
                                    right: config.right,
                                    bottom: config.bottom,
                                    transform: `rotate(${config.rotation}deg)`,
                                    opacity: config.opacity,
                                }}
                            >
                                <Image
                                    src={logo}
                                    alt="Artist logo decoration"
                                    width={config.size}
                                    height={config.size}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="mx-auto w-full max-w-4xl text-center flex items-center justify-center relative z-10 px-4 h-full"
                    >
                        <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-relaxed">
                            {t('HERO.DESCRIPTION_DETAILS')}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
