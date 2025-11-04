'use client'

import CtaSection from '@/components/common/sections/cta-section'
import DescriptionSection from '@/components/common/sections/description-section'
import FeaturesSection from '@/components/common/sections/features-section'
import HeroSection from '@/components/common/sections/hero-section'
import RoomsSection from '@/components/common/sections/rooms-section'
import StudioShowcase from '@/components/common/sections/studio-showcase'
import { useTranslations } from 'next-intl'

export default function HomePage() {
    const tGeneral = useTranslations('GENERAL')

    return (
        <div className="flex flex-col gap-y-40">
            <HeroSection />
            <StudioShowcase />
            <DescriptionSection />
            <FeaturesSection />
            <RoomsSection />
            <CtaSection title={tGeneral('CTA_TITLE')} description={tGeneral('CTA_DESC')} />
        </div>
    )
}
