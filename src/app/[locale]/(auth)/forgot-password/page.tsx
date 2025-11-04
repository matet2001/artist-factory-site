'use client'

import ForgotPasswordForm from '@/components/common/auth/form/ForgotPasswordForm'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AuthHeader from '../AuthHeader'

export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false)
    const t = useTranslations('AUTH.PASSWORD_RESET')

    return (
        <div className="flex flex-col space-y-7">
            {!isSuccess && (
                <>
                    <div className="my-2" />
                    <AuthHeader title={t('TITLE')} description={t('DESC')} />
                </>
            )}

            <ForgotPasswordForm onSuccessChange={setIsSuccess} />
        </div>
    )
}
