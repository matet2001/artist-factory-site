'use client'

import { useSignUp } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(1),
    phone: z.string().min(1),
    bandName: z.string().optional(),
})

const verificationSchema = z.object({
    code: z.string().min(6).max(6),
})

type RegisterFormValues = z.infer<typeof registerSchema>
type VerificationFormValues = z.infer<typeof verificationSchema>

export default function RegisterForm() {
    const { signUp, isLoaded, setActive } = useSignUp()
    const router = useRouter()
    const t = useTranslations('AUTH')

    const [isVerifying, setIsVerifying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
            phone: '',
            bandName: '',
        },
    })

    const verificationForm = useForm<VerificationFormValues>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            code: '',
        },
    })

    const onRegisterSubmit = async (values: RegisterFormValues) => {
        if (!isLoaded) return
        setIsSubmitting(true)

        try {
            // Create the sign-up with all user data
            await signUp.create({
                emailAddress: values.email,
                password: values.password,
                firstName: values.fullName.split(' ')[0] || values.fullName,
                lastName: values.fullName.split(' ').slice(1).join(' ') || '',
                phoneNumber: values.phone,
                unsafeMetadata: {
                    bandName: values.bandName || null,
                },
            })

            // Send verification email
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            })

            // Switch to verification step
            setIsVerifying(true)
            toast.success(t('EMAIL_SENT') || 'Verification email sent!')
        } catch (err: any) {
            const message = err.errors?.[0]?.message ?? t('ERRORS.DEFAULT')
            toast.error(message)
            console.error('Registration error:', JSON.stringify(err, null, 2))
        } finally {
            setIsSubmitting(false)
        }
    }

    const onVerificationSubmit = async (values: VerificationFormValues) => {
        if (!isLoaded) return
        setIsSubmitting(true)

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: values.code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({
                    session: completeSignUp.createdSessionId,
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            console.log('Current task:', session?.currentTask)
                            return
                        }
                        await router.push('/')
                    },
                })
                toast.success(t('ALERT.REGISTRATION_SUCCESS') || 'Registration successful!')
            } else {
                console.error('Sign-up not complete:', JSON.stringify(completeSignUp, null, 2))
                toast.error('Verification failed. Please try again.')
            }
        } catch (err: any) {
            const message = err.errors?.[0]?.message ?? 'Verification failed'
            toast.error(message)
            console.error('Verification error:', JSON.stringify(err, null, 2))
        } finally {
            setIsSubmitting(false)
        }
    }

    // Show verification form
    if (isVerifying) {
        return (
            <div className="space-y-8">
                <Form {...verificationForm}>
                    <form
                        onSubmit={verificationForm.handleSubmit(onVerificationSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={verificationForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('VERIFICATION_CODE') || 'Verification Code'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" maxLength={6} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting
                                ? t('VERIFYING') || 'Verifying...'
                                : t('VERIFY') || 'Verify'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setIsVerifying(false)}
                        >
                            {t('BACK_TO_REGISTRATION') || 'Back to registration'}
                        </Button>
                    </form>
                </Form>
            </div>
        )
    }

    // Show registration form
    return (
        <div className="space-y-8">
            <Form {...registerForm}>
                <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-5 w-full"
                >
                    <EmailInput {...registerForm} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={registerForm.control}
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
                            control={registerForm.control}
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
                            control={registerForm.control}
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

                        <PasswordInput {...registerForm} />
                    </div>

                    <div id="clerk-captcha"></div>

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
