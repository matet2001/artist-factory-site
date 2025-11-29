'use client'

import { Button } from '@/components/ui/button'
import { Bug } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { BugReportDialog } from './bug-report-dialog'

export function BugReportButton() {
    const t = useTranslations('BUG_REPORT')
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                size="icon"
                variant="secondary"
                className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                aria-label={t('BUTTON_TOOLTIP')}
                title={t('BUTTON_TOOLTIP')}
            >
                <Bug className="h-8 w-8" />
            </Button>

            <BugReportDialog open={isOpen} onOpenChange={setIsOpen} />
        </>
    )
}
