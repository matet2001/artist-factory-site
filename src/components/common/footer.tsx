'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import Logo from './logo'
import { CONTACT } from '@/lib/constants'

const equipmentBrands: string[] = [
    'DW',
    'Gretsch',
    'Ludwig',
    'NATAL',
    'Yamaha',
    'Paiste',
    'Zildjian',
    'Meinl',
    'Agean',
    'Istanbul',
    'Ampeg',
    'Orange',
    'Warwick',
    'Peavey',
    'Marshall',
    'Hughes & Kettner',
    'Audio-Technica',
]

export default function Footer() {
    const t = useTranslations('FOOTER')

    return (
        <footer className="bg-primary-light dark:bg-primary-dark text-light-foreground dark:text-dark-foreground">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                {/* CONTENT GRID: natural flow, no absolute */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 items-stretch">
                    {/* LEFT: Logo (top) + Contact (below) */}
                    <div className="flex flex-col justify-start h-full">
                        <div>
                            <Logo size={220} />
                            <div className="mt-5 text-sm">
                                <h2 className="mb-4 font-semibold uppercase">{t('CONTACT')}</h2>
                                <p className="mb-2">{CONTACT.address}</p>
                                <p className="mb-2">
                                    Mobil:{' '}
                                    <a
                                        href={`tel:${CONTACT.phoneRaw}`}
                                        className="text-primary hover:underline"
                                    >
                                        {CONTACT.phoneDisplay}
                                    </a>
                                </p>
                                <p>
                                    Email:{' '}
                                    <a
                                        href={`mailto:${CONTACT.email}`}
                                        className="text-primary hover:underline"
                                    >
                                        {CONTACT.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/* spacer so bottoms align with right column */}
                        <div className="pt-4" />
                    </div>

                    {/* RIGHT: Equipment brands */}
                    <div className="flex flex-col justify-between h-full sm:ml-10">
                        <div>
                            <h2 className="mb-4 text-sm font-semibold uppercase">
                                {t('EQUIPMENTS')}
                            </h2>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm">
                                {equipmentBrands.map((brand) => (
                                    <li key={brand} className="leading-6">
                                        {brand}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="pt-4" />
                    </div>
                </div>

                <hr className="my-6 border-light-border dark:border-dark-border" />

                {/* Footer bottom */}
                <div className="sm:flex sm:items-center sm:justify-between text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span>© 2025 ArtistFactory</span>
                        <span>|</span>
                        <span>{t('RIGHTS')}</span>
                        <span>|</span>
                        <span>
                            {t('DEVELOPMENT')}:&nbsp;
                            <Link
                                href="https://www.linkedin.com/in/m%C3%A1t%C3%A9-pojbics/"
                                target="_blank"
                                className="hover:text-primary"
                            >
                                Pojbics Máté
                            </Link>
                        </span>
                        <span>|</span>
                        <span>
                            <a
                                href="https://www.flaticon.com/free-icons/hungary"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                Flag icons created by Freepik - Flaticon
                            </a>
                        </span>
                    </div>

                    <div className="flex mt-4 sm:mt-0 gap-4 text-2xl">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="https://www.tiktok.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                        >
                            <FaTiktok />
                        </a>
                        <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                        >
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
