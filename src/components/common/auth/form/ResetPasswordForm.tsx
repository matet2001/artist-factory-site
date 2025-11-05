'use client'

import { CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import AuthSwitch from '@/components/common/auth/form/AuthSwitch'
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
import Link from 'next/link'

type ResetPasswordFormData = {
    password: string
    confirmPassword: string
}

interface ResetPasswordFormProps {
    onSuccessChange?: (success: boolean) => void
}

export default function ResetPasswordForm({ onSuccessChange }: ResetPasswordFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const t = useTranslations('AUTH')

    const form = useForm<ResetPasswordFormData>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: ResetPasswordFormData) => {
        if (values.password !== values.confirmPassword) {
            const errorMsg = t('PASSWORD_MISMATCH') || 'Passwords do not match'
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        if (!token) {
            const errorMsg = t('PASSWORD_RESET.INVALID_LINK') || 'Invalid reset link'
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
                const errorMsg =
                    data.error || t('PASSWORD_RESET.ERROR') || 'Failed to reset password'
                setError(errorMsg)
                toast.error(errorMsg)
                return
            }

            setSuccess(true)
            onSuccessChange?.(true)
            toast.success(t('PASSWORD_RESET.RESET_SUCCESS'))
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch {
            const errorMsg = t('PASSWORD_RESET.ERROR') || 'An error occurred. Please try again.'
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!token) {
        return (
            <div className="space-y-8">
                <div className="space-y-4 text-center">
                    <p className="text-red-500 text-lg font-semibold">
                        {t('PASSWORD_RESET.INVALID_LINK') || 'Invalid reset link'}
                    </p>
                </div>

                <Button
                    variant={'secondary'}
                    className="w-full"
                    onClick={() => router.push('/forgot-password')}
                >
                    {t('PASSWORD_RESET.REQUEST_NEW') || 'Request new link'}
                </Button>

                <AuthSwitch
                    label={t('REMEMBER_PASSWORD')}
                    action={t('SIGN_IN_CALL')}
                    href="/login"
                />
            </div>
        )
    }

    if (success) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center space-y-6 py-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-green-50 dark:bg-green-950 p-6 rounded-full">
                            <KeyRound
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
                            {t('PASSWORD_RESET.RESET_SUCCESS')}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('PASSWORD_RESET.REDIRECTING')}
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
        )
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('NEW_PASSWORD') || 'New Password'}</FormLabel>
                                <FormControl>
                                    <div className="relative mt-1">
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
                                <FormLabel>{t('CONFIRM_PASSWORD') || 'Confirm Password'}</FormLabel>
                                <FormControl>
                                    <div className="relative mt-1">
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
                        variant={'secondary'}
                        className="w-full mt-5"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('RESETTING') : t('PASSWORD_RESET.RESET_BUTTON')}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
