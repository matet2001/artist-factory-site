'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useAnimations } from '@/hooks/use-animation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function PrivacyPolicyPage() {
    const t = useTranslations('PRIVACY')
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

    return (
        <>
            {/* Title Section */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        viewport={viewportConfig}
                        className="text-center space-y-4"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            {t('TITLE')}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative py-10">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="space-y-6"
                    >
                        {/* Intro Highlight */}
                        <Card className="border-primary/20 bg-primary/5 py-8">
                            <CardContent className="flex items-center justify-center">
                                <p className="text-base font-medium text-center">{t('INTRO')}</p>
                            </CardContent>
                        </Card>

                        {/* General Information */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('GENERAL.TITLE')}
                                </h2>
                                <div className="space-y-3">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('GENERAL.DM_CONSENT')}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('GENERAL.SECURE_STORAGE')}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('GENERAL.THIRD_PARTY')}
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('GENERAL.DATA_ACCESS')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purpose of Data Processing */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('PURPOSE.TITLE')}
                                </h2>
                                <div className="space-y-6">
                                    {/* Identification */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg  text-foreground">
                                            {t('PURPOSE.IDENTIFICATION.TITLE')}
                                        </h3>
                                        <div className="ml-4">
                                            <p className="text-muted-foreground">
                                                <span className="text-foreground">
                                                    {t('PURPOSE.IDENTIFICATION.PASSWORD.LABEL')}:
                                                </span>{' '}
                                                {t('PURPOSE.IDENTIFICATION.PASSWORD.DESCRIPTION')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Communication */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg text-foreground">
                                            {t('PURPOSE.COMMUNICATION.TITLE')}
                                        </h3>
                                        <div className="ml-4">
                                            <p className="text-muted-foreground">
                                                <span className="text-foreground">
                                                    {t('PURPOSE.COMMUNICATION.EMAIL.LABEL')}:
                                                </span>{' '}
                                                {t('PURPOSE.COMMUNICATION.EMAIL.DESCRIPTION')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Legal Basis */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('LEGAL.TITLE')}
                                </h2>
                                <ul className="space-y-2 ml-6 list-disc">
                                    <li className="text-muted-foreground leading-relaxed">
                                        {t('LEGAL.USER_CONSENT')}
                                    </li>
                                    <li className="text-muted-foreground leading-relaxed">
                                        {t('LEGAL.INFOTV')}
                                    </li>
                                    <li className="text-muted-foreground leading-relaxed">
                                        {t('LEGAL.ECOMMERCE_ACT')}
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Your Rights */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6 space-y-4">
                                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-3">
                                    {t('RIGHTS.TITLE')}
                                </h2>
                                <ul className="space-y-2 ml-6 list-disc">
                                    <li className="text-foreground leading-relaxed">
                                        {t('RIGHTS.REQUEST_INFO')}
                                    </li>
                                    <li className="text-foreground leading-relaxed">
                                        {t('RIGHTS.CORRECTION_DELETION')}
                                    </li>
                                    <li className="text-foreground leading-relaxed">
                                        {t('RIGHTS.WITHDRAW_CONSENT')}
                                    </li>
                                    <li className="text-foreground leading-relaxed">
                                        {t('RIGHTS.FILE_COMPLAINT')}
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
