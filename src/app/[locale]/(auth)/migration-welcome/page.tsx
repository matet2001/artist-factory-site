'use client'

import AuthHeader from '../AuthHeader'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type MigrationPasswordFormData = {
    password: string
    confirmPassword: string
}

function MigrationWelcomeContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const t = useTranslations('AUTH')

    const form = useForm<MigrationPasswordFormData>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: MigrationPasswordFormData) => {
        if (values.password !== values.confirmPassword) {
            const errorMsg = t('PASSWORD_MISMATCH')
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        if (values.password.length < 6) {
            const errorMsg = t('PASSWORD_REQUIRED')
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        if (!token) {
            const errorMsg = t('MIGRATION.INVALID_LINK')
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: values.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMsg = data.error || t('MIGRATION.SETUP_FAILED')
                setError(errorMsg)
                toast.error(errorMsg)
                return
            }

            setSuccess(true)
            toast.success(t('MIGRATION.SUCCESS'))

            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (error) {
            console.error(error)
            const errorMsg = t('MIGRATION.ERROR')
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!token) {
        return (
            <div className="flex flex-col space-y-7">
                <div className="my-2" />
                <AuthHeader
                    title={t('MIGRATION.INVALID_LINK')}
                    description={t('MIGRATION.INVALID_LINK_DESC')}
                />
                <div className="space-y-8">
                    <Button
                        variant="secondary"
                        className="w-full"
                        size="lg"
                        onClick={() => router.push('/')}
                    >
                        {t('BACK_TO_HOME')}
                    </Button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="flex flex-col space-y-7">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col items-center space-y-6 py-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative bg-green-50 dark:bg-green-950 p-6 rounded-full">
                                <CheckCircle2
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
                                {t('MIGRATION.SUCCESS')}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {t('MIGRATION.SUCCESS_DESC')}
                            </p>
                            <p className="text-muted-foreground text-xs leading-relaxed mt-2">
                                {t('MIGRATION.REDIRECTING')}
                            </p>
                        </div>
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

    return (
        <div className="flex flex-col space-y-7">
            {/* Header */}
            <div className="my-2" />
            <AuthHeader
                title={t('MIGRATION.WELCOME_TITLE')}
                description={t('MIGRATION.WELCOME_SUBTITLE')}
            />

            {/* Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    {t('MIGRATION.WHATS_NEW')}
                </h3>
                <ul className="space-y-3 text-sm text-purple-800 dark:text-purple-200">
                    <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                        <span>{t('MIGRATION.FEATURE_1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                        <span>{t('MIGRATION.FEATURE_2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                        <span>{t('MIGRATION.FEATURE_3')}</span>
                    </li>
                </ul>
            </div>

            {/* Password Setup Form */}
            <div className="space-y-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('NEW_PASSWORD')}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={passwordVisible ? 'text' : 'password'}
                                                placeholder={t('PLACEHOLDER.PASSWORD')}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {passwordVisible ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('CONFIRM_PASSWORD')}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={confirmPasswordVisible ? 'text' : 'password'}
                                                placeholder={t('PLACEHOLDER.CONFIRM_PASSWORD')}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirmPasswordVisible(!confirmPasswordVisible)
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {confirmPasswordVisible ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <Button
                            variant="secondary"
                            className="w-full mt-5"
                            size="lg"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('MIGRATION.SETTING_UP') : t('MIGRATION.CONTINUE')}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default function MigrationWelcomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MigrationWelcomeContent />
        </Suspense>
    )
}
