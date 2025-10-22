'use client'

import DescriptionSection from '@/components/common/sections/description-section'
import FeaturesSection from '@/components/common/sections/features-section'
import HeroSection from '@/components/common/sections/hero-section'
import RoomsSection from '@/components/common/sections/rooms-section'
import StudioShowcase from '@/components/common/sections/studio-showcase'

export default function HomePage() {
    return (
        <div className="mb-20 flex flex-col gap-y-40">
            <HeroSection />
            <StudioShowcase />
            <DescriptionSection />
            <FeaturesSection />
            <RoomsSection />
        </div>
    )
}
