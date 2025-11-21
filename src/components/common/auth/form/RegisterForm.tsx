'use client'

import { CheckCircle2, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { RegisterFormData } from '@/types/auth'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'

interface RegisterFormProps {
    onSuccessChange?: (success: boolean) => void
}

export default function RegisterForm({ onSuccessChange }: RegisterFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const t = useTranslations('AUTH')

    const form = useForm<RegisterFormData>({
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
            phone: '',
            bandName: '',
            privacyConsent: false,
        },
    })

    const onSubmit = async (values: RegisterFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Check privacy consent
            if (!values.privacyConsent) {
                const errorMsg = t('PRIVACY_REQUIRED')
                setError(errorMsg)
                toast.error(errorMsg)
                setIsSubmitting(false)
                return
            }

            // Call the registration API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    name: values.fullName,
                    phone: values.phone,
                    bandName: values.bandName,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle error with translation key
                const errorKey = data.error || 'ERRORS.REGISTRATION_FAILED'
                const errorMsg = t(errorKey)
                setError(errorMsg)
                toast.error(errorMsg)
                return
            }

            // Registration successful
            setUserEmail(values.email)
            setRegistrationSuccess(true)
            onSuccessChange?.(true)
            toast.success(t('REGISTRATION_SUCCESS_TITLE'))
        } catch {
            const errorMsg = t('ERRORS.REGISTRATION_FAILED')
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendEmail = async () => {
        try {
            setIsResending(true)
            setError(null)

            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle rate limit error with remaining seconds
                if (data.error === 'RESEND_EMAIL_RATE_LIMIT' && data.remainingSeconds) {
                    const errorMsg = t('RESEND_EMAIL_RATE_LIMIT', {
                        seconds: data.remainingSeconds,
                    })
                    setError(errorMsg)
                    toast.error(errorMsg)
                } else {
                    // Handle other errors
                    const errorKey = data.error || 'RESEND_EMAIL_ERROR'
                    const errorMsg = t(errorKey)
                    setError(errorMsg)
                    toast.error(errorMsg)
                }
                return
            }

            // Success
            const successMsg = t('RESEND_EMAIL_SUCCESS')
            toast.success(successMsg)
            setError(null)
        } catch {
            const errorMsg = t('RESEND_EMAIL_ERROR')
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsResending(false)
        }
    }

    // Success state UI
    if (registrationSuccess) {
        return (
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
                            {t('REGISTRATION_SUCCESS_TITLE')}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('REGISTRATION_SUCCESS_DESC')}
                        </p>
                    </div>

                    {/* Email display card */}
                    <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
                        <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">
                            {userEmail}
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground max-w-md">{t('CHECK_SPAM')}</p>
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                {/* Action buttons */}
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

                {/* Resend email button */}
                <div className="flex w-full justify-center">
                    <button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="text-center text-muted-foreground text-sm w-full font-semibold hover:text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? t('RESENDING_EMAIL') : t('RESEND_EMAIL')}
                    </button>
                </div>
            </div>
        )
    }

    // Regular form UI
    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
                    <EmailInput {...form} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('FULL_NAME')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('PLACEHOLDER.FULL_NAME')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('PHONE')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder={t('PLACEHOLDER.PHONE')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="bandName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('BAND_NAME')}{' '}
                                        <span className="text-muted-foreground text-sm">
                                            ({t('OPTIONAL')})
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('PLACEHOLDER.BAND_NAME')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <PasswordInput {...form} />
                    </div>

                    {/* Privacy Policy Consent */}
                    <FormField
                        control={form.control}
                        name="privacyConsent"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-start gap-3 mt-3">
                                    <FormControl>
                                        <Checkbox
                                            id="privacy-consent"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <label
                                        htmlFor="privacy-consent"
                                        className="text-sm font-normal leading-relaxed cursor-pointer flex-1"
                                    >
                                        {t('PRIVACY_CONSENT')}{' '}
                                        <Link
                                            href="/privacy-policy"
                                            className="text-primary hover:underline font-medium"
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t('PRIVACY_POLICY')}
                                        </Link>
                                        .
                                    </label>
                                </div>
                                <FormMessage className="ml-9" />
                            </FormItem>
                        )}
                    />

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button
                        variant={'secondary'}
                        type="submit"
                        className="w-full mt-5"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('SIGNING_UP') : t('SIGN_UP')}
                    </Button>

                    <AuthSwitch
                        label={t('HAVE_ACCOUNT')}
                        action={t('SIGN_IN_CALL')}
                        href="/login"
                    />
                </form>
            </Form>
        </div>
    )
}
