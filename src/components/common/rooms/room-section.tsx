'use client'

import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Room } from '@/lib/rooms'
import Autoplay from 'embla-carousel-autoplay'
import { DollarSign, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { EquipmentIcon } from './equipment-icon'

type RoomSectionProps = {
    room: Room
}

export default function RoomSection({ room }: RoomSectionProps) {
    const t = useTranslations('ROOMS')

    function tFormatted(label: string) {
        return label.replace(/\{\{(\w+)\}\}/g, (_, key) => t(`EQUIPMENT_PARTS.${key}`))
    }

    const plugin = React.useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    )

    return (
        <section id={`room-${room.id}`} className="w-full py-10 scroll-mt-[var(--header-height)]">
            <div className="mx-auto w-full max-w-6xl px-4">
                <div className="relative w-full overflow-hidden rounded-2xl shadow-xl bg-card">
                    {/* === IMAGE SECTION === */}
                    <div className="relative h-[500px] sm:h-[550px]">
                        <Carousel
                            plugins={[plugin.current]}
                            className="w-full h-full"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {room.images.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative h-[500px] sm:h-[550px] w-full overflow-hidden rounded-t-2xl">
                                            <Image
                                                src={`/rooms/${img}`}
                                                alt={`${t(room.name)} – ${index + 1}`}
                                                fill
                                                className="object-cover object-center"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Position arrows outside the image carousel */}
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-md" />
                        </Carousel>
                    </div>

                    {/* === OVERLAY CONTENT AREA === */}
                    <div className="relative z-10 -mt-10  px-6 sm:px-10">
                        {/* Gradient behind content – only lower portion of image */}
                        <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-t from-card/90 to-card/10 backdrop-blur-md rounded-b-2xl z-[-1]" />

                        <div className="w-full text-center p-5 space-y-5">
                            {/* --- Title --- */}
                            <h2 className="text-white text-2xl sm:text-4xl font-bold capitalize drop-shadow-lg">
                                {t(room.name)}
                            </h2>

                            {/* === Wider container just for equipments and CTA === */}
                            <div className="mx-auto w-full space-y-5">
                                {/* --- Equipments --- */}
                                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm w-full">
                                    {room.equipments.map((eq, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <EquipmentIcon
                                                type={eq.type}
                                                size={20}
                                                alt={eq.label}
                                            />
                                            <span className="drop-shadow-sm">
                                                {t(`EQUIPMENT_TYPES.${eq.type.toUpperCase()}`)}
                                                {' – '}
                                                {tFormatted(eq.label)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* --- Features (Price / Size) --- */}
                                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-white/90 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium drop-shadow-md">
                                            {t('BASE_PRICE')}: {room.price.toLocaleString('hu-HU')}{' '}
                                            Ft / {t('HOUR')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium drop-shadow-md">
                                            {t('SIZE')}: {room.size} {t('PEOPLE')}
                                        </span>
                                    </div>
                                </div>

                                {/* --- CTA Button --- */}
                                <Link href="/booking">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto px-12 py-6 text-lg uppercase font-bold shadow-xl transition-transform hover:scale-105 hover:-translate-y-0.5"
                                    >
                                        {t('CTA')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
