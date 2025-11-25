'use client'

import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { BookingTermsDialog } from './booking-terms-consent'

export function BookingRulesInfo() {
    const t = useTranslations('BOOKING')
    const [showTermsDialog, setShowTermsDialog] = useState(false)

    return (
        <>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6 mb-6">
                <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1">
                        <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">
                            {t('RULES.TITLE')}
                        </h3>
                        <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
                            <p>{t('RULES.ADVANCE_24H')}</p>
                            <p>{t('RULES.CANCEL_48H')}</p>
                        </div>
                        <Button
                            variant="link"
                            onClick={() => setShowTermsDialog(true)}
                            className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                        >
                            {t('RULES.VIEW_FULL_TERMS')}
                        </Button>
                    </div>
                </div>
            </div>

            <BookingTermsDialog open={showTermsDialog} onOpenChange={setShowTermsDialog} />
        </>
    )
}
