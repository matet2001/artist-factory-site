'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import RoomList from './room-list'

export default function RoomsHero() {
    const t = useTranslations('ROOMS')

    return (
        <section className="mt-20 mb-5">
            <div className="w-full h-full mx-auto max-w-2xl px-2 sm:px-6 lg:max-w-7xl lg:px-4 text-center">
                <div className="mx-auto max-w-4xl lg:text-center mb-5">
                    <h2 className="text-sm uppercase text-muted-foreground tracking-[0.25em]">
                        {t('PRE_TITLE')}
                    </h2>

                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
                        {t('TITLE')}
                    </h1>

                    <p className="mt-6 text-lg text-muted-foreground">{t('DESCRIPTION')}</p>
                </div>
                <div className="flex justify-center items-center">
                    <RoomList />
                </div>

                <div className="mt-16 flex flex-col items-center gap-6 text-muted-foreground">
                    <h2 className="text-2xl sm:text-xl text-center font-medium">
                        {t('MORE_INFO_PROMPT', {
                            defaultValue: 'További részletekért látogasd meg a termek oldalát!',
                        })}
                    </h2>

                    <Link href="/rooms">
                        <Button variant="secondary" size={'xl'}>
                            {t('SEE_ALL_ROOMS', {
                                defaultValue: 'Összes terem megtekintése',
                            })}
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
