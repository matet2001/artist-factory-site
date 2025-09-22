'use client'

import AuthDialogHeader from '@/components/common/auth/AuthDialogHeader'
import LoginForm from '@/components/common/auth/form/LoginForm'
import { DialogContent } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'

export default function LoginModalRoute() {
    const t = useTranslations('AUTH.HEADERS')

    return (
        <>
            <AuthDialogHeader title={t('LOGIN_TITLE')} description={t('LOGIN_DESCRIPTION')} />{' '}
            <DialogContent className="max-w-lg p-6">
                <LoginForm />
            </DialogContent>
        </>
    )
}
