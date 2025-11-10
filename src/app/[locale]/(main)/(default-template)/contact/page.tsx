'use client'

import CtaSection from '@/components/common/sections/cta-section'
import { Button } from '@/components/ui/button'
import { useAnimations } from '@/hooks/use-animation'
import { CONTACT } from '@/lib/constants'
import { motion } from 'framer-motion'
import { Bus, Car, ExternalLink, Mail, MapPin, Phone, TramFront } from 'lucide-react'
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

const accessMethods = [
    { key: 'TRAM', icon: TramFront },
    { key: 'TROLLEY', icon: Bus },
    { key: 'CAR', icon: Car },
]

export default function ContactSection() {
    const t = useTranslations('CONTACT')
    const tGeneral = useTranslations('GENERAL')
    const { mapsEmbed, mapsPlaceLink } = useMapsUrls()
    const animations = useAnimations()
    const viewportConfig = { once: true, amount: 0.1 } as const

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
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Title Section - Clean, matching studio style */}
            <section className="relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        animate="whileInView"
                        viewport={viewportConfig}
                        className="text-center space-y-4"
                    >
                        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">
                            {t('PRE_TITLE')}
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                            {t('TITLE')}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Maps Section - Box shaped, full pictures */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Google Map */}
                        <motion.div
                            variants={animations.scaleIn}
                            className="relative h-[400px] sm:h-[500px] overflow-hidden rounded-3xl border border-primary/20 shadow-2xl"
                        >
                            <iframe
                                title="Google Map — ArtistFactory"
                                src={mapsEmbed}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="h-full w-full border-0"
                                allowFullScreen
                            />
                        </motion.div>

                        {/* Location Image */}
                        <motion.div
                            variants={animations.scaleIn}
                            className="relative h-[400px] sm:h-[500px] overflow-hidden rounded-3xl border border-primary/20 shadow-2xl"
                        >
                            <Image
                                src="/terkepzoom.jpg"
                                alt="ArtistFactory megközelítési térkép és környék"
                                fill
                                className="object-cover"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How to Get Here Section - Solid card without buttons */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.fadeUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="bg-card rounded-3xl p-8 sm:p-12 lg:p-16 border border-primary/20 shadow-2xl"
                    >
                        <div className="space-y-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center">
                                {t('ACCESS.TITLE')}
                            </h2>

                            <motion.div
                                variants={animations.stagger}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={viewportConfig}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                            >
                                {accessMethods.map((method) => {
                                    const Icon = method.icon
                                    const translationText = t(`ACCESS.${method.key}`)
                                    const [title, ...descParts] = translationText.split(':')
                                    const description = descParts.join(':').trim()

                                    return (
                                        <motion.div
                                            key={method.key}
                                            variants={animations.scaleIn}
                                            className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card-elevated border border-primary/20 text-center"
                                        >
                                            <div className="p-3 rounded-full bg-primary/10">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">
                                                {title}
                                            </h3>
                                            <p className="text-sm text-card-muted-foreground">
                                                {description}
                                            </p>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>

                            {/* Entrance Note */}
                            <motion.div
                                variants={animations.scaleIn}
                                className="text-sm italic max-w-2xl mx-auto bg-card-elevated/50 p-4 rounded-lg border border-primary/10 text-center"
                            >
                                {t('ACCESS.ENTRANCE')}
                            </motion.div>
                        </div>
                        <div
                            className="mt-10 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto"
                        >
                            <motion.div variants={animations.scaleIn} className="flex-1">
                                <Button asChild size="xl" variant="default" className="w-full">
                                    <a
                                        href={mapsPlaceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="sm:hidden">Google Maps</span>
                                        <span className="hidden sm:inline">{t('GOOGLE_MAPS')}</span>
                                        <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                                    </a>
                                </Button>
                            </motion.div>

                            <motion.div variants={animations.scaleIn} className="flex-1">
                                <Button asChild variant="secondary" size="xl" className="w-full">
                                    <a
                                        href="https://futar.bkk.hu/?toCoord=47.5160181%2C19.0493435&toName=Artist%20Factory&toSubName=Studio%2C%20Pozsonyi%20%C3%BAt%2016%20Budapest%201137&toDisplayName=Artist%20Factory%2C%20Budapest%201137&map=18/47.51602/19.04934"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="sm:hidden">BKK Futár</span>
                                        <span className="hidden sm:inline">{t('BKK_FUTAR')}</span>
                                        <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
                                    </a>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards - Organic shapes at the end */}
            <section className="relative py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={animations.stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={viewportConfig}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Phone Card */}
                        <motion.div
                            variants={animations.scaleIn}
                            className="group flex flex-col items-center gap-4 p-8 bg-card/80 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                            style={{
                                borderRadius: '50% 50% 45% 55% / 55% 50% 50% 45%',
                                minHeight: '200px',
                            }}
                        >
                            <div className="flex-shrink-0 p-4 rounded-full bg-primary/10">
                                <Phone className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                            </div>
                            <Link
                                href={`tel:${CONTACT.phoneRaw}`}
                                className="text-lg font-medium text-foreground hover:text-primary transition-colors text-center"
                            >
                                {CONTACT.phoneDisplay}
                            </Link>
                        </motion.div>

                        {/* Email Card */}
                        <motion.div
                            variants={animations.scaleIn}
                            className="group flex flex-col items-center gap-4 p-8 bg-card/80 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                            style={{
                                borderRadius: '55% 45% 52% 48% / 48% 55% 45% 52%',
                                minHeight: '200px',
                            }}
                        >
                            <div className="flex-shrink-0 p-4 rounded-full bg-primary/10">
                                <Mail className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                            </div>
                            <Link
                                href={`mailto:${CONTACT.email}`}
                                className="text-lg font-medium text-foreground hover:text-primary transition-colors text-center break-all"
                            >
                                {CONTACT.email}
                            </Link>
                        </motion.div>

                        {/* Address Card */}
                        <motion.div
                            variants={animations.scaleIn}
                            className="group flex flex-col items-center gap-4 p-8 bg-card/80 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                            style={{
                                borderRadius: '48% 52% 50% 50% / 52% 48% 52% 48%',
                                minHeight: '200px',
                            }}
                        >
                            <div className="flex-shrink-0 p-4 rounded-full bg-primary/10">
                                <MapPin className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                            </div>
                            <p className="text-lg font-medium text-foreground text-center">
                                {CONTACT.address}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </div>
    )
}
