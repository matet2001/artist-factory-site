'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'

interface PhoneBookingFormProps {
    onCustomerInfoChange: (data: { name: string; bandName?: string; note?: string }) => void
    onSubmit: () => void
    onUpdate?: () => void
    onCancelEdit?: () => void
    onDelete?: () => void
    isSubmitting: boolean
    customerName: string
    customerBandName: string
    bookingNote?: string
    hasSelectedBookings: boolean
    editMode?: boolean
    selectedBookingId?: string
}

export function PhoneBookingForm({
    onCustomerInfoChange,
    onSubmit,
    onUpdate,
    onCancelEdit,
    onDelete,
    isSubmitting,
    customerName,
    customerBandName,
    bookingNote = '',
    hasSelectedBookings,
    editMode = false,
}: PhoneBookingFormProps) {
    const t = useTranslations('ADMIN_BOOKINGS')

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCustomerInfoChange({
            name: e.target.value,
            bandName: customerBandName,
            note: bookingNote,
        })
    }

    const handleBandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCustomerInfoChange({
            name: customerName,
            bandName: e.target.value,
            note: bookingNote,
        })
    }

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onCustomerInfoChange({
            name: customerName,
            bandName: customerBandName,
            note: e.target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!customerName.trim()) return
        if (editMode && onUpdate) {
            onUpdate()
        } else {
            onSubmit()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
            <div>
                <h2 className="text-2xl font-bold mb-2">
                    {editMode ? t('EDIT_BOOKING_TITLE') : t('CUSTOMER_INFO_TITLE')}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {editMode ? t('EDIT_BOOKING_DESC') : t('CUSTOMER_INFO_DESC')}
                </p>
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

            <div className="space-y-2">
                <Label htmlFor="note">{t('NOTE_LABEL')}</Label>
                <Textarea
                    id="note"
                    value={bookingNote}
                    onChange={handleNoteChange}
                    placeholder={t('NOTE_PLACEHOLDER')}
                    disabled={isSubmitting}
                    rows={3}
                    className="resize-none"
                />
            </div>

            {customerName.trim() && !editMode && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {t('NAME_CONFIRMED')}
                </div>
            )}

            <div className="flex gap-2">
                {editMode ? (
                    <>
                        <Button
                            type="submit"
                            disabled={!customerName.trim() || isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? t('UPDATING_BUTTON') : t('UPDATE_BUTTON')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancelEdit}
                            disabled={isSubmitting}
                        >
                            {t('CANCEL_BUTTON')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onDelete}
                            disabled={isSubmitting}
                        >
                            {t('DELETE_BUTTON')}
                        </Button>
                    </>
                ) : (
                    <Button
                        type="submit"
                        disabled={!customerName.trim() || !hasSelectedBookings || isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? t('SUBMITTING_BUTTON') : t('SUBMIT_BUTTON')}
                    </Button>
                )}
            </div>
        </form>
    )
}
