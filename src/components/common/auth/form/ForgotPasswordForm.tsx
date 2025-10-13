'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

type ForgotPasswordFormData = {
    email: string
}

const ForgotPasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations('AUTH')

    const form = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (values: ForgotPasswordFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)
            setMessage(null)

            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to send reset email')
                return
            }

            setMessage(data.message)
            form.reset()
        } catch (error) {
            setError('An error occurred. Please try again.')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <EmailInput {...form} />

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    {message && (
                        <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded">
                            {message}
                        </div>
                    )}

                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t('SENDING') : t('PASSWORD_RESET.SUBMIT')}
                    </Button>

                    <AuthSwitch
                        label={t('REMEMBER_PASSWORD')}
                        action={t('SIGN_IN')}
                        href="/login"
                    />
                </form>
            </Form>
        </div>
    )
}

export default ForgotPasswordForm
