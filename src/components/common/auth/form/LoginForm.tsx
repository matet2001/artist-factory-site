'use client'

import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [passwordVisible, setPasswordVisible] = useState(false)
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

            const formData = new FormData()
            formData.append('email', values.email)
            formData.append('password', values.password)

            const response = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirect: false,
            })

            if (response?.error) {
                setError(t('INVALID_CREDENTIALS'))
                toast.error(t('INVALID_CREDENTIALS'))
                return
            }

            // Success toast
            toast.success(t('ALERT.LOGIN_SUCCESS') + values.email.split('@')[0])

            router.push('/')
            router.refresh()
        } catch {
            const errorMsg = t('LOGIN_ERROR')
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

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

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
