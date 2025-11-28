'use client'

import BookingCtaSection from '@/components/common/sections/booking-cta-section'
import CtaSection from '@/components/common/sections/cta-section'
import FeaturesSection from '@/components/common/sections/features-section'
import HeroSection from '@/components/common/sections/hero-section'
import RoomsSection from '@/components/common/sections/rooms-section'
import StudioHomeSection from '@/components/common/sections/studio-home-section'
import { useTranslations } from 'next-intl'

export default function HomePage() {
    const tGeneral = useTranslations('GENERAL')

    return (
        <div className="flex flex-col gap-y-16 md:gap-y-40">
            <HeroSection />
            <FeaturesSection />
            <BookingCtaSection />
            <RoomsSection />
            <StudioHomeSection />
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </div>
    )
}
