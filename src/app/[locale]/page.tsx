import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

export default function HomePage() {
    const t = useTranslations('HOME')

    return (
        <div>
            {/* <LanguageSwitcher /> */}
            <h1>Hello h1</h1>
            <p>Hello p</p>
        </div>
    )
}
