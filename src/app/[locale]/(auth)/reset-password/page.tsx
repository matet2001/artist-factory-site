'use client'

import ResetPasswordForm from '@/components/common/auth/form/ResetPasswordForm'
import AuthHeader from '../AuthHeader'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function ResetPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false)
    const t = useTranslations('AUTH.PASSWORD_RESET')

    return (
        <div className="flex flex-col space-y-7">
            {!isSuccess && (
                <>
                    <div className="my-2" />
                    <AuthHeader title={t('NEW_PASSWORD')} description={t('NEW_PASSWORD_DESC')} />
                </>
            )}

            <ResetPasswordForm onSuccessChange={setIsSuccess} />
        </div>
    )
}
