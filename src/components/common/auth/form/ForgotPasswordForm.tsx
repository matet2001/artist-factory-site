'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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

const ForgotPasswordForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResetMode, setIsResetMode] = useState(false)
    const [email, setEmail] = useState('')
    const t = useTranslations('AUTH')
    const router = useRouter()

    const forgotPasswordForm = useForm({
        defaultValues: {
            email: '',
        },
    })

    const resetPasswordForm = useForm({
        defaultValues: {
            code: '',
            password: '',
        },
    })

    const onForgotPasswordSubmit = async (values: any) => {
        setIsSubmitting(true)

        // TODO: Implement actual forgot password logic
        console.log('Forgot password form submitted:', values)

        setTimeout(() => {
            setEmail(values.email)
            setIsResetMode(true)
            setIsSubmitting(false)
            console.log('Password reset email sent')
        }, 1000)
    }

    const onResetPasswordSubmit = async (values: any) => {
        setIsSubmitting(true)

        // TODO: Implement actual password reset logic
        console.log('Reset password form submitted:', values)

        setTimeout(() => {
            setIsSubmitting(false)
            console.log('Password reset successful')
        }, 1000)
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
