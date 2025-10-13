'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'

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

type ResetPasswordFormData = {
    password: string
    confirmPassword: string
}

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const t = useTranslations('AUTH')

    const form = useForm<ResetPasswordFormData>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: ResetPasswordFormData) => {
        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (!token) {
            setError('Invalid reset link')
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
                setError(data.error || 'Failed to reset password')
                return
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error) {
            setError('An error occurred. Please try again.')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-red-500">Invalid reset link</p>
                <Button className="mt-4" onClick={() => router.push('/forgot-password')}>
                    Request new link
                </Button>
            </div>
        )
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="text-green-600 text-lg font-semibold">
                    Password reset successfully!
                </div>
                <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t('PASSWORD_RESET.NEW_PASSWORD')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('PASSWORD_RESET.NEW_PASSWORD_DESC')}
                </p>
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
                                    <Input
                                        type="password"
                                        placeholder={t('PLACEHOLDER.PASSWORD')}
                                        {...field}
                                    />
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
                                    <Input
                                        type="password"
                                        placeholder={t('PLACEHOLDER.CONFIRM_PASSWORD')}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t('RESETTING') : t('PASSWORD_RESET.RESET_BUTTON')}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
