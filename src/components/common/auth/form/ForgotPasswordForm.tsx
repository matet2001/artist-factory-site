'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { LoginFormData } from '@/types/auth'

import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CheckCircle2, Mail } from 'lucide-react'
import Link from 'next/link'

interface ForgotPasswordFormProps {
    onSuccessChange?: (success: boolean) => void
}

const ForgotPasswordForm = ({ onSuccessChange }: ForgotPasswordFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const t = useTranslations('AUTH')

    const form = useForm<Pick<LoginFormData, 'email'>>({
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (values: Pick<LoginFormData, 'email'>) => {
        try {
            setIsSubmitting(true)
            setError(null)

            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || t('PASSWORD_RESET.ERROR'))
                toast.error(data.error || t('PASSWORD_RESET.ERROR'))
                return
            }

            setSuccess(true)
            onSuccessChange?.(true)
            toast.success(t('PASSWORD_RESET.SUCCESS'))
        } catch {
            const errorMsg = t('PASSWORD_RESET.ERROR')
            setError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
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
                            {t('PASSWORD_RESET.SUCCESS')}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('PASSWORD_RESET.CHECK_EMAIL')}
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
                    <EmailInput {...form} />

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button
                        variant={'secondary'}
                        className="w-full mt-5"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('PASSWORD_RESET.SENDING') : t('PASSWORD_RESET.SEND_LINK')}
                    </Button>

                    <AuthSwitch
                        label={t('REMEMBER_PASSWORD')}
                        action={t('SIGN_IN_CALL')}
                        href="/login"
                    />
                </form>
            </Form>
        </div>
    )
}

export default ForgotPasswordForm
