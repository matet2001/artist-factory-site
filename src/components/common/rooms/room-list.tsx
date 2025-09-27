'use client'

import Autoplay from 'embla-carousel-autoplay'
import * as React from 'react'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { rooms } from '@/lib/rooms'
import RoomCard from './room-card'

export default function RoomList() {
    const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-5xl px-8 sm:px-0"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
                align: 'start',
                loop: true,
            }}
        >
            <CarouselContent className="-ml-2">
                {rooms.map((room) => (
                    <CarouselItem
                        key={room.id}
                        className="basis-full sm:basis-1/2 lg:basis-1/3 py-4"
                    >
                        <RoomCard room={room} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="border-0 left-0 sm:-left-12" />
            <CarouselNext className="border-0 right-0 sm:-right-12" />
        </Carousel>
    )
}
