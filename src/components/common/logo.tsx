import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/logo.png'


export default function Logo({ size = 170 }) {
    return (
        <Link href="/">
            <Image
                className={`mx-auto`}
                src={logo}
                alt="Artist Factory Logo"
                width={size}
                height={size / 3}
                style={{ maxWidth: '100%', height: 'auto' }}
                priority
            />
        </Link>
    )
}
