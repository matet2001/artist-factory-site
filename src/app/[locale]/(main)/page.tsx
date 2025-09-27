'use client'

import PalmLeafDivider from '@/components/common/palm-leaft-divider'
import DescriptionSection from '@/components/common/sections/description-section'
import FeaturesSection from '@/components/common/sections/features-section'
import HeroSection from '@/components/common/sections/hero-section'
import RoomsSection from '@/components/common/sections/rooms-section'
import StudioShowcase from '@/components/common/sections/studio-showcase'

export default function HomeHeroSection() {
    return (
        <div className="mb-20">
            {/* Hero Section */}
            <HeroSection />

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Studio Showcase Section */}
            <StudioShowcase />

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Description Section */}
            <DescriptionSection />

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Features Section - breaks out of container with absolute positioning */}
            <FeaturesSection />

            {/* Palm Leaf Divider */}
            <PalmLeafDivider spacing="normal" />

            {/* Rooms Section */}
            <RoomsSection />
        </div>
    )
}
