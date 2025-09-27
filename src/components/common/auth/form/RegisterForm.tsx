'use client'

import { signIn } from 'next-auth/react'
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

            // Create FormData object like in your implementation
            const formData = new FormData()
            formData.append('name', values.fullName) // Map fullName to name
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('phone', values.phone)
            formData.append('bandName', values.bandName)

            const signInResult = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirect: false,
            })

            if (signInResult?.error) {
                setError('Failed to sign in after registration')
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
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
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
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="+36201234567" {...field} />
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
                                        Band Name{' '}
                                        <span className="text-muted-foreground text-sm">
                                            (optional)
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="The Rockers" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <PasswordInput {...form} />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <Button type="submit" className="w-full mt-5" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing up...' : 'Sign up'}
                    </Button>

                    <AuthSwitch label="Already have an account?" action="Log in" href="/login" />
                </form>
            </Form>
        </div>
    )
}
