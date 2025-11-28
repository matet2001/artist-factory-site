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
            <div className="bg-primary/5 border border-primary/20 rounded-none md:rounded-xl p-2 md:p-4 lg:p-6 mb-3 md:mb-6">
                <div className="flex items-start gap-2 md:gap-3">
                    <div className="shrink-0 mt-0.5 md:mt-1">
                        <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1.5 md:space-y-3">
                        <h3 className="font-semibold text-foreground text-xs md:text-sm lg:text-base">
                            {t('RULES.TITLE')}
                        </h3>
                        <div className="space-y-1 md:space-y-2 text-[10px] md:text-sm lg:text-base text-muted-foreground">
                            <p>{t('RULES.ADVANCE_24H')}</p>
                            <p>{t('RULES.CANCEL_48H')}</p>
                        </div>
                        <Button
                            variant="link"
                            onClick={() => setShowTermsDialog(true)}
                            className="p-0 h-auto font-semibold text-primary hover:text-primary/80 text-xs md:text-sm"
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
