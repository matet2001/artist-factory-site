'use client'

import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { LoginFormData } from '@/types/auth'

import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations('AUTH')
    const router = useRouter()

    const form = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (values: LoginFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Create FormData object like in your implementation
            const formData = new FormData()
            formData.append('email', values.email)
            formData.append('password', values.password)

            const response = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirect: false,
            })

            if (response?.error) {
                setError(t('INVALID_CREDENTIALS'))
                return
            }

            router.push('/')
            router.refresh()
        } catch {
            setError(t('LOGIN_ERROR'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <EmailInput {...form} />
                    <PasswordInput {...form} />

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button className="w-full mt-5" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t('SIGNING_IN') : t('SIGN_IN')}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline cursor-pointer"
                        >
                            {t('PASSWORD_RESET.CALL')}
                        </button>
                    </div>

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
