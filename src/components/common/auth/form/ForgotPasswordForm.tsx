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
import PasswordInput from './PasswordInput'

const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

const resetPasswordSchema = z.object({
    code: z.string().min(6),
    password: z.string().min(6),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

const ForgotPasswordForm = () => {
    const { signIn, isLoaded } = useSignIn()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResetMode, setIsResetMode] = useState(false)
    const [email, setEmail] = useState('')
    const t = useTranslations('AUTH')
    const router = useRouter()

    const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const resetPasswordForm = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            code: '',
            password: '',
        },
    })

    const onForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
        if (!isLoaded) return

        setIsSubmitting(true)

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: values.email,
            })

            setEmail(values.email)
            setIsResetMode(true)
            toast.success(t('PASSWORD_RESET.SUCCESS'))
        } catch (err: any) {
            const message = err.errors?.[0]?.message ?? t('ERRORS.DEFAULT')
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const onResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
        if (!isLoaded) return

        setIsSubmitting(true)

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: values.code,
                password: values.password,
            })

            if (result.status === 'complete') {
                toast.success('Password reset successfully!')
                router.replace('/')
            }
        } catch (err: any) {
            const message = err.errors?.[0]?.message ?? 'Password reset failed'
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isResetMode) {
        return (
            <div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">Reset your password</h3>
                    <p className="text-muted-foreground text-sm">
                        Enter the code sent to {email} and your new password.
                    </p>
                </div>

                <Form {...resetPasswordForm}>
                    <form
                        onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={resetPasswordForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <PasswordInput {...resetPasswordForm} />

                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setIsResetMode(false)}
                        >
                            Back to email
                        </Button>
                    </form>
                </Form>
            </div>
        )
    }

    return (
        <Form {...forgotPasswordForm}>
            <form
                onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
                className="space-y-5"
            >
                <EmailInput {...forgotPasswordForm} />

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : t('PASSWORD_RESET.SUBMIT')}
                </Button>

                <AuthSwitch label={t('REMEMBER_PASSWORD')} action={t('SIGN_IN')} href="/login" />
            </form>
        </Form>
    )
}

export default ForgotPasswordForm
