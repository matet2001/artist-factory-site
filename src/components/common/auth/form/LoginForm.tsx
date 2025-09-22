'use client'

import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import AuthSwitch from './AuthSwitch'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

const LoginForm = () => {
    const { signIn, isLoaded, setActive } = useSignIn()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const t = useTranslations('AUTH')
    const router = useRouter()

    const loginSchema = z.object({
        email: z.string().email(t('EMAIL_REQUIRED')),
        password: z.string().min(6, t('PASSWORD_REQUIRED')),
    })

    type LoginFormValues = z.infer<typeof loginSchema>

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (values: LoginFormValues) => {
        if (!isLoaded) return

        setIsSubmitting(true)

        try {
            const result = await signIn.create({
                identifier: values.email,
                password: values.password,
            })

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                toast.success(t('ALERT.LOGIN_SUCCESS') + values.email)
                router.replace('/')
            }
        } catch (err: any) {
            const code = err.errors?.[0]?.code
            const fallback = t('ERRORS.DEFAULT')

            const message = t(`ERRORS.${code}`, { default: fallback }) // fallback if no match
            toast.error(message)
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
