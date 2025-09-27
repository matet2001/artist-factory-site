'use client'
import { Button } from '@/components/ui/button'
import { Room } from '@/lib/rooms'
import { DollarSign, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
    room: Room
}

export default function RoomCard({ room }: Props) {
    const router = useRouter()

    const t = useTranslations('ROOMS')
    const imagePath = room.heroImage ? `/rooms/${room.heroImage}` : '/rooms/Room1.jpg'

    const goToRoom = () => router.push(`/rooms/#room-${room.id}`)

    return (
        <div
            onClick={goToRoom}
            className="group relative w-full h-80 sm:h-96 overflow-hidden rounded-2xl cursor-pointer hover:outline hover:outline-muted/50 transition-colors duration-200"
        >
            {/* Background Image */}
            <div className="absolute inset-x-0 top-0 h-2/3 z-0">
                <Image
                    src={imagePath}
                    alt={`${room.name} image`}
                    fill
                    className="object-cover object-center "
                    priority
                />
            </div>

            {/* Dark Gradient Overlay */}
            <div className="absolute rounded-t-3xl inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-background to-background/10 backdrop-blur-md " />

            {/* Content Container */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                {/* Title */}
                <h3 className="text-white text-xl sm:text-2xl font-bold capitalize mb-3 ">
                    {t(room.name)}
                </h3>

                {/* Features */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex items-center gap-2 text-white/90">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium drop-shadow-md">
                            {room.price} / {t('HOUR')}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-white/90">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium drop-shadow-md">
                            {room.size} {t('PEOPLE')}
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <Link href={`/booking`} className="w-full">
                    <Button
                        variant="default"
                        className="w-full rounded-lg shadow-xl transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-105 backdrop-blur-sm"
                    >
                        {t('CTA')}
                    </Button>
                </Link>
            </div>

            {/* Optional: Hover effect overlay */}
            {/* <div className="absolute inset-0 z-5 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" /> */}
        </div>
    )
}
