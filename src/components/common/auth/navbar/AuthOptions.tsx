'use client'
import { Button } from '@/components/ui/button'
import { useAuthDialog } from '@/hooks/auth/useAuthDialog'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function AuthOptions() {
    const router = useRouter()
    const { openAuthDialog } = useAuthDialog()
    const t = useTranslations('AUTH')

    return (
        <Button
            onClick={() => {
                router.push('/register')
            }}
            variant="default"
        >
            {t('SIGN_UP')}
        </Button>
    )
}
