'use client'

import { Button } from '@/components/ui/button'
import { CONTACT } from '@/lib/constants'
import type { Variants } from 'framer-motion'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

function useMapsUrls(address: string) {
    return useMemo(() => {
        const q = encodeURIComponent(address)
        return {
            mapsEmbed: `https://www.google.com/maps?hl=hu&q=${q}&z=16&output=embed`,
            mapsPlaceLink: `https://www.google.hu/maps/place/Artist+Factory+Rehearsal+Hall+And+Studio/@47.5158608,19.0469161,17z/data=!3m1!4b1!4m6!3m5!1s0x4741dc08be36a3cd:0xb3c92d9ab52716ac!8m2!3d47.5158572!4d19.049491!16s%2Fg%2F1thw5hrh?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D`,
        }
    }, [address])
}

export default function ContactSection() {
    const t = useTranslations('CONTACT')
    const { mapsEmbed, mapsPlaceLink } = useMapsUrls(CONTACT.address)

    const visualHeight = 'h-[16rem] sm:h-[22rem] md:h-[28rem] lg:h-[30rem]'
    const prefersReduced = useReducedMotion()

    const stagger: Variants = {
        initial: {},
        whileInView: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
    }

    const card: Variants = {
        initial: { opacity: 0, y: prefersReduced ? 0 : 12 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: easeOut },
        },
    }

    const fadeUp: Variants = {
        initial: { opacity: 0, y: prefersReduced ? 0 : 14 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: easeOut },
        },
    }

    // ✅ no window — use env var or hardcode for consistent SSR/CSR
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'ArtistFactory Próbahely',
        description:
            'Budapesti próbaterem és stúdió — könnyen megközelíthető tömegközlekedéssel, rugalmas foglalás.',
        address: {
            '@type': 'PostalAddress',
            streetAddress: CONTACT.address,
            addressLocality: 'Budapest',
            addressCountry: 'HU',
        },
        telephone: CONTACT.phoneRaw,
        email: CONTACT.email,
        image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://artistfactory.hu'}/terkepzoom.jpg`,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 47.515181710128985,
            longitude: 19.049547169919382,
        },
    }

    return (
        <section className="w-full">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
                {/* Header */}
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col items-center text-center"
                >
                    <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                        {t('PRE_TITLE')}
                    </p>
                    <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                        {t('TITLE')}
                    </h1>
                </motion.div>

                {/* Grid: Map + Image */}
                <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
                >
                    <motion.div
                        variants={card}
                        className="w-full overflow-hidden rounded-2xl border bg-card shadow-sm"
                    >
                        <div className={visualHeight}>
                            <iframe
                                title="Google Map — ArtistFactory"
                                src={mapsEmbed}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="h-full w-full border-0"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={card}
                        className="w-full overflow-hidden rounded-2xl border bg-card shadow-sm"
                    >
                        <div className={`relative ${visualHeight}`}>
                            <Image
                                src="/terkepzoom.jpg"
                                alt="ArtistFactory megközelítési térkép és környék"
                                fill
                                className="object-cover"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Full-width description */}
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.2 }}
                    className="text-base sm:text-lg leading-relaxed text-foreground/90"
                >
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3">{t('ACCESS.TITLE')}</h2>
                    <div className="space-y-4">
                        <p>{t('ACCESS.TRAM')}</p>
                        <p>{t('ACCESS.TROLLEY')}</p>
                        <p>{t('ACCESS.CAR')}</p>
                        <p>{t('ACCESS.ENTRANCE')}</p>
                    </div>

                    {/* CTA buttons */}
                    <motion.div
                        variants={stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.2 }}
                        className="flex flex-col gap-x-20 gap-y-5 sm:flex-row sm:items-center sm:justify-between mt-8"
                    >
                        <motion.div variants={card} className="w-full gap-x-5">
                            <Button asChild size="xl" variant="secondary" className="w-full">
                                <a href={mapsPlaceLink} target="_blank" rel="noopener noreferrer">
                                    {t('GOOGLE_MAPS')}
                                    <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                                </a>
                            </Button>
                        </motion.div>

                        <motion.div variants={card} className="w-full ">
                            <Button asChild variant="secondary" size="xl" className="w-full">
                                <a
                                    href="https://futar.bkk.hu/?toCoord=47.5160181%2C19.0493435&toName=Artist%20Factory&toSubName=Studio%2C%20Pozsonyi%20%C3%BAt%2016%20Budapest%201137&toDisplayName=Artist%20Factory%2C%20Budapest%201137&map=18/47.51602/19.04934"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('BKK_FUTAR')}
                                    <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                                </a>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Contact info */}
                <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, amount: 0.2 }}
                    className="space-y-3 text-base sm:text-lg flex flex-col justify-center items-center"
                >
                    <div className='w-full flex flex-col justify-start gap-3'>
                        <motion.p variants={card} className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 shrink-0" />
                            <span>{CONTACT.address}</span>
                        </motion.p>
                        <motion.p variants={card} className="flex items-center gap-3">
                            <Phone className="h-5 w-5 shrink-0" />
                            <Link href={`tel:${CONTACT.phoneRaw}`} className="hover:underline">
                                {CONTACT.phoneDisplay}
                            </Link>
                        </motion.p>
                        {CONTACT.email && (
                            <motion.p variants={card} className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0" />
                                <Link href={`mailto:${CONTACT.email}`} className="hover:underline">
                                    {CONTACT.email}
                                </Link>
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
