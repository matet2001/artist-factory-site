import logo from '@/assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
    size?: number
}

export default function Logo({ size = 170 }: LogoProps) {
    return (
        <Link href="/" className="flex-shrink-0">
            <Image
                src={logo}
                alt="Artist Factory Logo"
                width={size}
                height={size / 3}
                className="w-32 sm:w-40 md:w-44 lg:w-[170px] h-auto"
                priority
            />
        </Link>
    )
}
