'use client'

import PalmLeafDivider from '@/components/common/palm-leaft-divider'
import PalmTreeSilhouette from '@/components/common/palm-tree-silhoutte'
import TikiTorch from '@/components/common/TikiTorch'
import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { CONTACT } from '@/lib/constants'
import { motion } from 'framer-motion'
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

function useMapsUrls() {
    return useMemo(() => {
        return {
            mapsEmbed: `https://www.google.com/maps?hl=hu&q=47.5158572,19.049491&z=19&output=embed`,
            mapsPlaceLink: `https://www.google.hu/maps/place/Pr%C3%B3baterem+Budapest+-+Artist+Factory+Pr%C3%B3batermek+%C3%A9s+St%C3%BAdi%C3%B3/@47.5157889,19.0497344,19z/data=!4m16!1m9!3m8!1s0x4741dc08be36a3cd:0xb3c92d9ab52716ac!2sPr%C3%B3baterem+Budapest+-+Artist+Factory+Pr%C3%B3batermek+%C3%A9s+St%C3%BAdi%C3%B3!8m2!3d47.5158572!4d19.049491!9m1!1b1!16s%2Fg%2F1thw5hrh!3m5!1s0x4741dc08be36a3cd:0xb3c92d9ab52716ac!8m2!3d47.5158572!4d19.049491!16s%2Fg%2F1thw5hrh?entry=ttu&g_ep=EgoyMDI1MDkyNC4wIKXMDSoASAFQAw%3D%3D`,
        }
    }, [])
}

export default function ContactSection() {
    const t = useTranslations('CONTACT')
    const { mapsEmbed, mapsPlaceLink } = useMapsUrls()
    const animations = useAnimations()

    const visualHeight = 'h-[16rem] sm:h-[22rem] md:h-[28rem] lg:h-[30rem]'
    const viewportConfig = { once: true, amount: 0.1 } as const

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
            latitude: 47.5158572,
            longitude: 19.049491,
        },
    }

    return (
        <div className="mb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Title Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="sm" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>

                        <div className="relative z-10 py-8 sm:py-10 lg:py-12">
                            {/* Title */}
                            <div className="space-y-4 sm:space-y-6">
                                <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-muted-foreground">
                                    {t('PRE_TITLE')}
                                </p>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-pretty">
                                    {t('TITLE')}
                                </h1>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Maps Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden w-full"
                    >
                        <div className="relative z-10">
                            {/* Grid: Map + Image */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                animate="whileInView"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6"
                            >
                                <motion.div
                                    variants={animations.scaleIn}
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
                                    variants={animations.scaleIn}
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
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Accessibility, Buttons and Contact Info Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Tiki Torches in corners with extra padding for visibility */}
                        <div className="hidden sm:block">
                            <TikiTorch position="top-left" />
                            <TikiTorch position="top-right" />
                            <TikiTorch position="bottom-left" />
                            <TikiTorch position="bottom-right" />
                        </div>

                        <div className="relative z-10 space-y-12 sm:space-y-16 lg:space-y-20">
                            {/* Access Information */}
                            <motion.div
                                variants={animations.fadeUp}
                                initial="initial"
                                animate="whileInView"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="max-w-5xl mx-auto"
                            >
                                <div className="space-y-6 sm:space-y-8">
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                                        {t('ACCESS.TITLE')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left text-sm sm:text-base lg:text-lg leading-relaxed text-foreground/90">
                                        <div className="space-y-4">
                                            <p>
                                                <span className="font-bold">
                                                    {t('ACCESS.TRAM').split(':')[0]}:
                                                </span>
                                                {t('ACCESS.TRAM').split(':').slice(1).join(':')}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    {t('ACCESS.TROLLEY').split(':')[0]}:
                                                </span>
                                                {t('ACCESS.TROLLEY').split(':').slice(1).join(':')}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <p>
                                                <span className="font-bold">
                                                    {t('ACCESS.CAR').split(':')[0]}:
                                                </span>
                                                {t('ACCESS.CAR').split(':').slice(1).join(':')}
                                            </p>
                                            <p>{t('ACCESS.ENTRANCE')}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTA buttons */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                animate="whileInView"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="flex flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
                            >
                                <motion.div variants={animations.scaleIn} className="w-full">
                                    <Button asChild size="xl" variant="default" className="w-full">
                                        <a
                                            href={mapsPlaceLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="sm:hidden">Google Maps</span>
                                            <span className="hidden sm:inline">
                                                {t('GOOGLE_MAPS')}
                                            </span>
                                            <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                                        </a>
                                    </Button>
                                </motion.div>

                                <motion.div variants={animations.scaleIn} className="w-full">
                                    <Button
                                        asChild
                                        variant="secondary"
                                        size="xl"
                                        className="w-full"
                                    >
                                        <a
                                            href="https://futar.bkk.hu/?toCoord=47.5160181%2C19.0493435&toName=Artist%20Factory&toSubName=Studio%2C%20Pozsonyi%20%C3%BAt%2016%20Budapest%201137&toDisplayName=Artist%20Factory%2C%20Budapest%201137&map=18/47.51602/19.04934"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="sm:hidden">BKK Futár</span>
                                            <span className="hidden sm:inline">
                                                {t('BKK_FUTAR')}
                                            </span>
                                            <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                                        </a>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Contact Information Section */}
            <section className="relative">
                <div className="w-full mx-auto text-center relative z-10">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-muted/30 rounded-3xl p-4 sm:p-6 lg:p-8 py-8 sm:py-10 lg:py-12 relative overflow-hidden w-full"
                    >
                        {/* Palm Trees in corners */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <PalmTreeSilhouette position="top-left" flipped size="sm" />
                            <PalmTreeSilhouette position="top-right" flipped mirrored size="sm" />
                            <PalmTreeSilhouette position="bottom-left" size="sm" />
                            <PalmTreeSilhouette position="bottom-right" mirrored size="sm" />
                        </div>

                        <div className="relative z-10 py-8 sm:py-10 lg:py-12">
                            {/* Contact info */}
                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                animate="whileInView"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="space-y-3 sm:space-y-6 text-base sm:text-lg lg:text-xl"
                            >
                                <motion.div
                                    variants={animations.fadeUp}
                                    className="flex items-center justify-center gap-3"
                                >
                                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                    <Link
                                        href={`tel:${CONTACT.phoneRaw}`}
                                        className="hover:underline"
                                    >
                                        {CONTACT.phoneDisplay}
                                    </Link>
                                </motion.div>
                                {CONTACT.email && (
                                    <motion.div
                                        variants={animations.fadeUp}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                        <Link
                                            href={`mailto:${CONTACT.email}`}
                                            className="hover:underline"
                                        >
                                            {CONTACT.email}
                                        </Link>
                                    </motion.div>
                                )}

                                <motion.div
                                    variants={animations.fadeUp}
                                    className="flex items-center justify-center gap-3"
                                >
                                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                                    <span>{CONTACT.address}</span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
