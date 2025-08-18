'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
    LayoutDashboard,
    BadgeDollarSign,
    Headphones,
    Snowflake,
    CalendarDays,
    Phone,
} from 'lucide-react'

export default function HomeHeroSection() {
    const t = useTranslations('HOME')

    return (
        <section className="py-10">
            <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-8">
                <div className="rounded-2xl flex flex-col items-center justify-center min-h-[80vh] sm:min-h-screen bg-transparent space-y-24">
                    {/* Title + Description (wider but contained) */}
                    <div className="mx-auto w-full max-w-4xl text-center flex flex-col justify-center">
                        <h1 className="text-5xl font-bold sm:text-7xl">{t('HERO.TITLE')}</h1>

                        {/* First paragraph only */}
                        <p className="mt-8 text-lg sm:text-xl">{t('HERO.DESCRIPTION_INTRO')}</p>

                        {/* Main CTA */}
                        <Link href="/booking" className="w-full mt-8 group">
                            <div className="inline-flex w-full items-center justify-center gap-3 text-lg sm:text-xl p-5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                <CalendarDays className="w-6 h-6" aria-hidden="true" />
                                {t('HERO.CTA')}
                            </div>
                        </Link>

                        {/* Small CTA cards: equal height, bg-card, larger hover scale, turn primary */}
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <Link href="/booking" className="group h-full">
                                <div className="h-full min-h-[132px] flex flex-col items-center justify-center p-6 rounded-2xl bg-card transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <CalendarDays className="w-6 h-6 mb-2" aria-hidden="true" />
                                    <span className="text-base">{t('HERO.CTA_BOOK')}</span>
                                </div>
                            </Link>

                            <Link href="/contact" className="group h-full">
                                <div className="h-full min-h-[132px] flex flex-col items-center justify-center p-6 rounded-2xl bg-card transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Phone className="w-6 h-6 mb-2" aria-hidden="true" />
                                    <span className="text-base">{t('HERO.CTA_PHONE')}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    {/* Second paragraph after the cards */}
                    <p className="text-lg sm:text-3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         xl text-center max-w-4xl">{t('HERO.DESCRIPTION_DETAILS')}</p>

                    {/* Features (within same container width) */}
                    <div className="mx-auto w-full max-w-4xl">
                        <div className="text-center mb-5">
                            <h2 className="text-4xl font-semibold">{t('FEATURES.TITLE')}</h2>
                        </div>

                        <dl className="mt-10 space-y-8 text-base">
                            <div className="flex items-start gap-3">
                                <LayoutDashboard className="mt-1 w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <dt className="font-semibold">
                                        {t('FEATURES.ROOMS_SPACIOUS')}
                                    </dt>
                                    <dd>{t('FEATURES.ROOMS_SPACIOUS_DESC')}</dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <BadgeDollarSign className="mt-1 w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <dt className="font-semibold">{t('FEATURES.AFFORDABLE')}</dt>
                                    <dd>{t('FEATURES.AFFORDABLE_DESC')}</dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Headphones className="mt-1 w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <dt className="font-semibold">
                                        {t('FEATURES.PREMIUM_EQUIPMENT')}
                                    </dt>
                                    <dd>{t('FEATURES.PREMIUM_EQUIPMENT_DESC')}</dd>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Snowflake className="mt-1 w-6 h-6 text-primary shrink-0" />
                                <div>
                                    <dt className="font-semibold">
                                        {t('FEATURES.AIR_CONDITIONED')}
                                    </dt>
                                    <dd>{t('FEATURES.AIR_CONDITIONED_DESC')}</dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}
