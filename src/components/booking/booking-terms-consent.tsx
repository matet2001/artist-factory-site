'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '../ui/button'

// Reusable Terms Dialog Component
interface BookingTermsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingTermsDialog({ open, onOpenChange }: BookingTermsDialogProps) {
    const t = useTranslations('BOOKING')

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm md:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-2xl font-bold mb-3 md:mb-6">
                        {t('TERMS.TITLE')}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <div className="space-y-3 md:space-y-6 text-foreground">
                        <div>
                            <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-foreground">
                                {t('TERMS.ADVANCE_BOOKING_TITLE')}
                            </h3>
                            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                                {t('TERMS.ADVANCE_BOOKING')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-foreground">
                                {t('TERMS.CANCELLATION_TITLE')}
                            </h3>
                            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                                {t('TERMS.CANCELLATION')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-foreground">
                                {t('TERMS.SAME_DAY_CHANGES_TITLE')}
                            </h3>
                            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                                {t('TERMS.SAME_DAY_CHANGES')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-foreground">
                                {t('TERMS.CONTACT_TITLE')}
                            </h3>
                            <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                                {t('TERMS.CONTACT')}
                            </p>
                        </div>

                        <Button
                            onClick={() => onOpenChange(false)}
                            className="w-full mt-2 md:mt-4"
                        >
                            {t('TERMS.CLOSE')}
                        </Button>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

interface BookingTermsConsentProps {
    termsAccepted: boolean
    setTermsAccepted: (accepted: boolean) => void
}
export default function BookingTermsConsent({
    termsAccepted,
    setTermsAccepted,
}: BookingTermsConsentProps) {
    const t = useTranslations('BOOKING')
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div className="mb-6 flex items-start gap-3">
            <Checkbox
                id="terms-consent"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1"
            />
            <label
                htmlFor="terms-consent"
                className="text-sm font-normal leading-relaxed cursor-pointer flex-1"
            >
                {t('TERMS_CONSENT')}{' '}
                <button
                    type="button"
                    className="text-primary hover:underline font-medium cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault()
                        setDialogOpen(true)
                    }}
                >
                    {t('TERMS_OF_BOOKING')}
                </button>
                .
            </label>

            <BookingTermsDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    )
}
