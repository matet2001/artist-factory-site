'use client'

import { signIn, useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { LoginFormData } from '@/types/auth'

import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'

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
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

/**
 * Format user's name based on locale
 * @param fullName - User's full name (e.g., "John Doe")
 * @param locale - Current locale ('en' or 'hu')
 * @returns First name for English, last name for Hungarian
 */
const formatNameByLocale = (fullName: string, locale: string): string => {
    const names = fullName.trim().split(' ')
    if (names.length === 0) return fullName

    // For Hungarian (hu), use last name (second name in Western format)
    // For English (en), use first name
    if (locale === 'hu' && names.length > 1) {
        return names[names.length - 1] // Last name
    }
    return names[0] // First name
}

const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [showResendVerification, setShowResendVerification] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const t = useTranslations('AUTH')
    const locale = useLocale()
    const router = useRouter()
    const { update } = useSession()

    const form = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return

        const timer = setInterval(() => {
            setResendCooldown((prev) => Math.max(0, prev - 1))
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleResendVerification = async () => {
        try {
            setIsResending(true)
            const email = form.getValues('email')

            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.status === 429) {
                // Rate limited - show cooldown
                setResendCooldown(data.remainingSeconds || 60)
                toast.error(t('ERRORS.RATE_LIMIT', { seconds: data.remainingSeconds }))
            } else if (response.ok) {
                toast.success(t('ALERT.VERIFICATION_EMAIL_SENT'))
                setShowResendVerification(false)
            } else {
                toast.error(t(data.error || 'ERRORS.EMAIL_SEND_FAILED'))
            }
        } catch {
            toast.error(t('ERRORS.EMAIL_SEND_FAILED'))
        } finally {
            setIsResending(false)
        }
    }

    const onSubmit = async (values: LoginFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)
            setShowResendVerification(false)

            const formData = new FormData()
            formData.append('email', values.email)
            formData.append('password', values.password)

            const response = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirect: false,
            })

            if (response?.error) {
                // Map error messages to translation keys
                let errorKey = 'ERRORS.INVALID_CREDENTIALS'

                if (response.error.includes('MIGRATED_USER_NEEDS_PASSWORD_RESET')) {
                    errorKey = 'ERRORS.MIGRATED_USER_NEEDS_PASSWORD_RESET'
                    setShowResendVerification(false)
                } else if (response.error.includes('verify your email')) {
                    errorKey = 'ERRORS.EMAIL_NOT_VERIFIED'
                    setShowResendVerification(true) // Show resend button
                } else if (response.error.includes('Invalid credentials')) {
                    errorKey = 'ERRORS.INVALID_CREDENTIALS'
                    setShowResendVerification(false)
                }

                const errorMsg = t(errorKey)
                setError(errorMsg)
                toast.error(errorMsg)
                return
            }

            // Update session to get latest user data
            await update()

            // Fetch user data to get the full name
            const response2 = await fetch('/api/auth/session')
            const sessionData = await response2.json()

            // Format name based on locale and show success toast
            const userName = sessionData?.user?.name || values.email.split('@')[0]
            const formattedName = formatNameByLocale(userName, locale)
            toast.success(t('ALERT.LOGIN_SUCCESS') + `${formattedName}!`)

            router.push('/')
            router.refresh()
        } catch {
            const errorMsg = t('ERRORS.LOGIN_FAILED')
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <EmailInput {...form} />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>{t('PASSWORD_LABEL')}</FormLabel>
                                    <div className="text-sm">
                                        <Link
                                            href="/forgot-password"
                                            className="font-semibold text-accent hover:underline"
                                        >
                                            {t('PASSWORD_RESET.CALL')}
                                        </Link>
                                    </div>
                                </div>
                                <FormControl>
                                    <div className="relative mt-1">
                                        <Input
                                            type={passwordVisible ? 'text' : 'password'}
                                            {...field}
                                            placeholder={t('PLACEHOLDER.PASSWORD')}
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

                    {error && (
                        <div className="space-y-3">
                            <div className="text-red-500 text-sm text-center">{error}</div>
                            {showResendVerification && (
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        disabled={isResending || resendCooldown > 0}
                                        className="text-sm text-accent hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResending
                                            ? t('SENDING')
                                            : resendCooldown > 0
                                              ? t('RESEND_IN', { seconds: resendCooldown })
                                              : t('RESEND_VERIFICATION')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <Button
                        variant={'secondary'}
                        className="w-full mt-5"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('SIGNING_IN') : t('SIGN_IN')}
                    </Button>

                    <AuthSwitch
                        label={t('NEED_ACCOUNT')}
                        action={t('SIGN_UP_CALL')}
                        href="/register"
                    />
                </form>
            </Form>
        </div>
    )
}

export default LoginForm
