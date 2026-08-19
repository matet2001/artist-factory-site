'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ProfileFormData {
    name: string
    phone: string
    bandName: string
}

export default function ProfilePage() {
    const t = useTranslations('PROFILE')
    const tAuth = useTranslations('AUTH')
    const { status } = useSession()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProfileFormData>({
        defaultValues: { name: '', phone: '', bandName: '' },
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile')
                if (!res.ok) throw new Error('Failed to load profile')
                const data = await res.json()

                setEmail(data.user.email)
                form.reset({
                    name: data.user.name || '',
                    phone: data.user.phone || '',
                    bandName: data.user.bandName || '',
                })
            } catch {
                toast.error(t('LOAD_ERROR'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    const onSubmit = async (values: ProfileFormData) => {
        try {
            setIsSubmitting(true)

            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(tAuth(data.error || 'ERRORS.DEFAULT'))
                return
            }

            form.reset({
                name: data.user.name || '',
                phone: data.user.phone || '',
                bandName: data.user.bandName || '',
            })
            toast.success(t('ALERT.UPDATE_SUCCESS'))
        } catch {
            toast.error(t('ALERT.UPDATE_FAIL'))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === 'loading' || isLoading) {
        return (
            <div className="container mx-auto px-4">
                <div className="max-w-lg mx-auto flex justify-center py-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            </div>
        )
    }

    if (status !== 'authenticated') {
        return null
    }

    return (
        <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">
                        {t('PRE_TITLE')}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        {t('TITLE')}
                    </h1>
                </div>

                <Card>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <FormLabel className="text-sm">{tAuth('EMAIL')}</FormLabel>
                                    <Input value={email} disabled readOnly />
                                    <p className="text-xs text-muted-foreground">
                                        {t('EMAIL_NOT_EDITABLE')}
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">
                                                {tAuth('FULL_NAME')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={tAuth('PLACEHOLDER.FULL_NAME')}
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
                                            <FormLabel className="text-sm">
                                                {tAuth('PHONE')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder={tAuth('PLACEHOLDER.PHONE')}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bandName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm flex items-center gap-1">
                                                {tAuth('BAND_NAME')}
                                                <span className="text-muted-foreground text-xs">
                                                    ({tAuth('OPTIONAL')})
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={tAuth('PLACEHOLDER.BAND_NAME')}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    variant="secondary"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? t('SAVING') : t('SAVE_CHANGES')}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
