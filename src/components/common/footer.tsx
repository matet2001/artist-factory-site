'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import Logo from './logo'
import { CONTACT } from '@/lib/constans'

const equipments = [
    {
        name: 'Dobok',
        list: [
            { name: 'DW Design', link: '#' },
            { name: 'DW Collectors pergő', link: '#' },
            { name: 'Gretsch Renown Maple', link: '#' },
            { name: 'Ludwig Supraphonic pergő', link: '#' },
            { name: 'NATAL Originals Maple', link: '#' },
            { name: 'NATAL Aged Bronze pergő', link: '#' },
            { name: 'Yamaha Stage Custom fusion', link: '#' },
            { name: 'Yamaha Tour Custom fusion', link: '#' },
        ],
    },
    // {
    //     name: 'Cinek',
    //     list: [
    //         { name: 'Paiste PST 7', link: '#' },
    //         { name: 'Paiste PST 8', link: '#' },
    //         { name: 'Zildjian A Custom', link: '#' },
    //         { name: 'Zildjian S Family', link: '#' },
    //         { name: 'MEINL CLASSICS Custom', link: '#' },
    //         { name: 'Agean', link: '#' },
    //         { name: 'Istanbul', link: '#' },
    //         { name: 'Anatolian', link: '#' },
    // },
    // {
    //     name: 'Keverőerősítők',
    //     list: [{ name: 'Yamaha EMX 512 SC', link: '#' }],
    // },
    // {
    //     name: 'Hangfalak',
    //     list: [{ name: 'Yamaha S115V', link: '#' }],
    // },
    // {
    //     name: 'Basszus erősítők',
    //     list: [
    //         { name: 'Ampeg SVT-3PRO (400W)', link: '#' },
    //         { name: 'Ampeg Micro VR (200W)', link: '#' },
    //         { name: 'Orange OB1 - 300 (300W)', link: '#' },
    //         { name: 'Ashdown (600W) Mark King', link: '#' },
    //         { name: 'Warwick WN Profet 3.3 (300W)', link: '#' },
    //         { name: 'Warwick WN Profet 3.2 (300W)', link: '#' },
    //         { name: 'Ashdown 8x10 (1200W)', link: '#' },
    //         { name: 'Ampeg SVT-212AV (600W)', link: '#' },
    //         { name: 'Warwick 6x10 (600W)', link: '#' },
    //         { name: 'Imperator Custom Made (1300W)', link: '#' },
    //         { name: 'Ashdown 4x10 (600W)', link: '#' },
    //     ],
    // },
    // {
    //     name: 'Gitárerősítők',
    //     list: [
    //         { name: 'Peavey EVH 5150 III 50W EL34', link: '#' },
    //         { name: 'Orange TH 30', link: '#' },
    //         { name: 'Peavey Classic 30', link: '#' },
    //         { name: 'Marshall 1923 C 85TH', link: '#' },
    //         { name: 'ENGL Screamer 4x10', link: '#' },
    //         { name: 'Orange Dual Terror 4x10', link: '#' },
    //         { name: 'Orange Rocker 32 Black', link: '#' },
    //         { name: 'Hughes & Kettner TubeMeister Deluxe 40', link: '#' },
    //         { name: 'Joyo Mjolnir', link: '#' },
    //     ],
    // },
    // {
    //     name: 'Mikrofonok',
    //     list: [
    //         { name: 'Shure Beta 57A', link: '#' },
    //         { name: 'Audio Technica AT PRO31', link: '#' },
    //     ],
    // },
]

export default function Footer() {
    const t = useTranslations('FOOTER')

    return (
        <footer className="bg-primary-light dark:bg-primary-dark text-light-foreground dark:text-dark-foreground">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                    {/* Logo + Contact */}
                    <div>
                        <Logo />
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

                    {/* Equipments */}
                    <div className="sm:ml-10">
                        <h2 className="mb-4 text-sm font-semibold uppercase">{t('EQUIPMENTS')}</h2>
                        <ul className="space-y-4 text-sm">
                            {equipments.map((brand) => (
                                <li key={brand.name}>
                                    <h3 className="font-medium">{brand.name}</h3>
                                    <ul className="ml-2 list-disc list-inside text-xs">
                                        {brand.list.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <hr className="my-6 border-light-border dark:border-dark-border" />

                <div className="sm:flex sm:items-center sm:justify-between text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span>© 2025 PróbaPont</span>
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
