'use client'

import AuthDialogHeader from '@/components/common/auth/AuthDialogHeader'
import RegisterForm from '@/components/common/auth/form/RegisterForm'
import { DialogContent } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'

export default function RegisterModalRoute() {
    const t = useTranslations('AUTH.HEADERS')

    return (
        <>
            <DialogContent className="max-w-lg p-6">
            <AuthDialogHeader title={t('REGISTER_TITLE')} description={t('REGISTER_DESCRIPTION')} />
                <RegisterForm />
            </DialogContent>
        </>
    )
}
