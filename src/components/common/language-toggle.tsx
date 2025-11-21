'use client'

import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from '@/i18n/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Locale } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'

const flagMap: Record<Locale, string> = {
    hu: '/assets/icons/hungary.png',
    en: '/assets/icons/united-kingdom.png',
}

export default function LanguageToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const [isPending, startTransition] = useTransition()

    const currentLocale = params?.locale as Locale
    const nextLocale: Locale = currentLocale === 'en' ? 'hu' : 'en'

    const handleToggle = () => {
         startTransition(() => {
            router.replace(
                // @ts-expect-error safe param assumption
                { pathname, params },
                { locale: nextLocale }
            )
        })
    }

    return (
        <Button
            onClick={handleToggle}
            variant="ghost"
            size="icon"
            className="relative w-[40px] h-[40px] p-1 overflow-hidden"
            disabled={isPending}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentLocale}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Image
                        src={flagMap[currentLocale]}
                        alt={`${currentLocale} flag`}
                        width={25}
                        height={25}
                        priority
                    />
                </motion.div>
            </AnimatePresence>
        </Button>
    )
}
