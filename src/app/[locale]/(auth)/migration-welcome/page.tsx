'use client'

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
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
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
            setError(t('PASSWORDS_NOT_MATCH'))
            return
        }

        if (values.password.length < 6) {
            setError(t('PASSWORD_REQUIRED'))
            return
        }

        if (!token) {
            setError(t('MIGRATION.INVALID_LINK'))
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
                setError(data.error || t('MIGRATION.SETUP_FAILED'))
                return
            }

            setSuccess(true)
            toast.success(t('MIGRATION.SUCCESS'))

            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error) {
            setError(t('MIGRATION.ERROR'))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <p className="text-red-500">{t('MIGRATION.INVALID_LINK')}</p>
                    <Button onClick={() => router.push('/')}>{t('BACK_TO_HOME')}</Button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="text-green-600 text-lg font-semibold">
                        {t('MIGRATION.SUCCESS')}
                    </div>
                    <p className="text-muted-foreground">{t('MIGRATION.REDIRECTING')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8">
                {/* Welcome Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 p-4">
                            <Sparkles className="h-12 w-12 text-purple-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold">{t('MIGRATION.WELCOME_TITLE')}</h1>
                    <p className="text-xl text-muted-foreground">
                        {t('MIGRATION.WELCOME_SUBTITLE')}
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                    <h3 className="font-semibold text-blue-900">{t('MIGRATION.WHATS_NEW')}</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>{t('MIGRATION.FEATURE_1')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>{t('MIGRATION.FEATURE_2')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>{t('MIGRATION.FEATURE_3')}</span>
                        </li>
                    </ul>
                </div>

                {/* Password Setup Form */}
                <div className="bg-white rounded-lg border p-6 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">{t('MIGRATION.SET_PASSWORD')}</h2>
                        <p className="text-muted-foreground">{t('MIGRATION.SET_PASSWORD_DESC')}</p>
                    </div>

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
                                                    onClick={() =>
                                                        setPasswordVisible(!passwordVisible)
                                                    }
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
                                                    type={
                                                        confirmPasswordVisible ? 'text' : 'password'
                                                    }
                                                    placeholder={t('PLACEHOLDER.CONFIRM_PASSWORD')}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setConfirmPasswordVisible(
                                                            !confirmPasswordVisible
                                                        )
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

                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}

                            <Button
                                className="w-full"
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
