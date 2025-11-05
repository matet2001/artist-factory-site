'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Mail, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function EmailVerifiedContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const success = searchParams.get('success') === 'true'
    const t = useTranslations('AUTH')

    if (success) {
        return (
            <div className="flex flex-col space-y-7">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col items-center space-y-6 py-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative bg-green-50 dark:bg-green-950 p-6 rounded-full">
                                <Mail
                                    className="w-16 h-16 text-green-600 dark:text-green-400"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-950 rounded-full p-1">
                                <CheckCircle2
                                    className="w-8 h-8 text-green-600 dark:text-green-400 animate-in zoom-in duration-300"
                                    fill="currentColor"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 text-center max-w-md">
                            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                {t('EMAIL_VERIFIED_TITLE')}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t('EMAIL_VERIFIED_DESC')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="secondary"
                            className="w-full"
                            size="lg"
                            onClick={() => router.push('/login')}
                        >
                            {t('GO_TO_LOGIN')}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                            {t('BACK_TO_HOME')}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-7">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center space-y-6 py-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-red-50 dark:bg-red-950 p-6 rounded-full">
                            <XCircle
                                className="w-16 h-16 text-red-600 dark:text-red-400"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 text-center max-w-md">
                        <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400">
                            {t('EMAIL_VERIFY_FAILED')}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('EMAIL_VERIFY_FAILED_DESC')}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="secondary"
                        className="w-full"
                        size="lg"
                        onClick={() => router.push('/register')}
                    >
                        {t('TRY_AGAIN')}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                        {t('BACK_TO_HOME')}
                    </Button>
                </div>

                <div className="flex w-full justify-center">
                    <Link
                        className="text-center text-muted-foreground text-sm w-full font-semibold text-link hover:underline cursor-pointer"
                        href={'/login'}
                    >
                        {t('PASSWORD_RESET.BACK_TO_LOGIN')}
                    </Link>
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
