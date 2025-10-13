'use client'

import { CheckCircle2, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { RegisterFormData } from '@/types/auth'

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
import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'

export default function RegisterForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        },
    })

    const onSubmit = async (values: RegisterFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            const formData = new FormData()
            formData.append('name', values.fullName)
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('phone', values.phone)
            formData.append('bandName', values.bandName)

            const signInResult = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirect: false,
            })

            if (signInResult?.error) {
                // Check if it's the success message from registration
                if (signInResult.error.includes('Account created')) {
                    setUserEmail(values.email)
                    setRegistrationSuccess(true)
                } else {
                    setError(signInResult.error)
                }
                return
            }

            router.push('/')
            router.refresh()
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Success state UI
    if (registrationSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center py-8">
                <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">{t('REGISTRATION_SUCCESS_TITLE')}</h3>
                    <p className="text-muted-foreground">{t('REGISTRATION_SUCCESS_DESC')}</p>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{userEmail}</span>
                </div>

                <p className="text-sm text-muted-foreground max-w-md">{t('CHECK_SPAM')}</p>

                <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>
                        {t('BACK_TO_HOME')}
                    </Button>
                    <Button className="flex-1" onClick={() => router.push('/login')}>
                        {t('GO_TO_LOGIN')}
                    </Button>
                </div>

                <button
                    onClick={() => setRegistrationSuccess(false)}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                    {t('RESEND_EMAIL')}
                </button>
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

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button type="submit" className="w-full mt-5" disabled={isSubmitting}>
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
