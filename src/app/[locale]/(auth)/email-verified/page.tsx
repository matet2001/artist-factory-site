'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function EmailVerifiedContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const success = searchParams.get('success') === 'true'
    const t = useTranslations('AUTH')

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 p-6">
                            <CheckCircle2 className="h-20 w-20 text-green-600" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold">{t('EMAIL_VERIFIED_TITLE')}</h1>
                        <p className="text-muted-foreground text-lg">{t('EMAIL_VERIFIED_DESC')}</p>
                    </div>

                    <div className="pt-6 space-y-3">
                        <Button className="w-full" size="lg" onClick={() => router.push('/login')}>
                            {t('GO_TO_LOGIN')}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/')}
                        >
                            {t('BACK_TO_HOME')}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 p-6">
                        <XCircle className="h-20 w-20 text-red-600" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold">{t('EMAIL_VERIFY_FAILED')}</h1>
                    <p className="text-muted-foreground text-lg">{t('EMAIL_VERIFY_FAILED_DESC')}</p>
                </div>

                <div className="pt-6 space-y-3">
                    <Button className="w-full" size="lg" onClick={() => router.push('/register')}>
                        {t('TRY_AGAIN')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                        {t('BACK_TO_HOME')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function EmailVerifiedPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EmailVerifiedContent />
        </Suspense>
    )
}
