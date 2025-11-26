'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

interface PhoneBookingFormProps {
    onCustomerInfoChange: (data: { name: string; bandName?: string }) => void
    onSubmit: () => void
    isSubmitting: boolean
    customerName: string
    customerBandName: string
    hasSelectedBookings: boolean
}

export function PhoneBookingForm({
    onCustomerInfoChange,
    onSubmit,
    isSubmitting,
    customerName,
    customerBandName,
    hasSelectedBookings,
}: PhoneBookingFormProps) {
    const t = useTranslations('ADMIN_BOOKINGS')

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCustomerInfoChange({
            name: e.target.value,
            bandName: customerBandName,
        })
    }

    const handleBandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCustomerInfoChange({
            name: customerName,
            bandName: e.target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!customerName.trim()) return
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
            <div>
                <h2 className="text-2xl font-bold mb-2">{t('CUSTOMER_INFO_TITLE')}</h2>
                <p className="text-sm text-muted-foreground">{t('CUSTOMER_INFO_DESC')}</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">
                    {t('NAME_LABEL')} <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={customerName}
                    onChange={handleNameChange}
                    placeholder={t('NAME_PLACEHOLDER')}
                    required
                    disabled={isSubmitting}
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bandName">{t('BAND_NAME_LABEL')}</Label>
                <Input
                    id="bandName"
                    value={customerBandName}
                    onChange={handleBandNameChange}
                    placeholder={t('BAND_NAME_PLACEHOLDER')}
                    disabled={isSubmitting}
                />
            </div>

            {customerName.trim() && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {t('NAME_CONFIRMED')}
                </div>
            )}

            <Button
                type="submit"
                disabled={!customerName.trim() || !hasSelectedBookings || isSubmitting}
                className="w-full"
            >
                {isSubmitting ? t('SUBMITTING_BUTTON') : t('SUBMIT_BUTTON')}
            </Button>
        </form>
    )
}
