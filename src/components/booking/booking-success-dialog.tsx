'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface BookingSuccessDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BookingSuccessDialog({ open, onOpenChange }: BookingSuccessDialogProps) {
    const t = useTranslations('BOOKING')

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 sm:p-10 max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                    <div className="flex flex-col items-center text-center mb-2 sm:mb-4">
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="mb-3 sm:mb-4"
                        >
                            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                        </motion.div>

                        <DialogTitle className="text-xl sm:text-2xl font-bold">
                            {t('BOOKING_SUCCESS_TITLE')}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <DialogDescription asChild>
                    <div className="space-y-3 sm:space-y-4 text-center">
                        {/* Main Description */}
                        <p className="text-sm sm:text-base text-foreground leading-relaxed">
                            {t('BOOKING_SUCCESS_DESC')}
                        </p>

                        {/* Secondary Message */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {t('BOOKING_SUCCESS_EMAIL_NOTICE')}
                        </p>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
