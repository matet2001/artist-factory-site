'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Bug } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const MIGRATION_DIALOG_KEY = 'artist-factory-migration-dialog-seen'

export function MigrationDialog() {
    const t = useTranslations('MIGRATION_DIALOG')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Small delay to ensure dialog appears even before auth loads
        const timer = setTimeout(() => {
            // Check if user has already seen the dialog
            const hasSeenDialog = localStorage.getItem(MIGRATION_DIALOG_KEY)
            if (!hasSeenDialog) {
                setOpen(true)
            }
        }, 100) // Small delay to ensure it shows

        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        // Mark dialog as seen in localStorage
        localStorage.setItem(MIGRATION_DIALOG_KEY, 'true')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="p-8 sm:max-w-xl max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-center mb-2">
                        {t('TITLE')}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription asChild>
                    <div className="space-y-4">
                        <p className="text-base sm:text-lg text-foreground leading-relaxed">
                            {t('DESCRIPTION')}
                        </p>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                    <Bug className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {t('BUG_REPORT')}
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleClose}
                                className="w-full"
                                size="lg"
                            >
                                {t('UNDERSTOOD')}
                            </Button>
                        </div>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
