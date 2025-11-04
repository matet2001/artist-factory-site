import { CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function CtaButton() {
    const t = useTranslations('HOME')

    return (
        <Link href="/booking" className="group inline-block w-full max-w-xl mx-auto">
            <div className="shadow-[0_0_5px_5px] shadow-primary/40 inline-flex w-full items-center justify-center gap-3 text-base sm:text-lg lg:text-xl p-4 sm:p-5 rounded-2xl bg-primary text-primary-foreground font-semibold transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_8px_8px]">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                {t('HERO.CTA')}
            </div>
        </Link>
    )
}
