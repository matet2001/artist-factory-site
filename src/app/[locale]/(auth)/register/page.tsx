'use client'
import RegisterForm from '@/components/common/auth/form/RegisterForm'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AuthHeader from '../AuthHeader'

export default function RegisterPage() {
    const [isSuccess, setIsSuccess] = useState(false)
    const t = useTranslations('AUTH.HEADERS')

    return (
        <div className="flex flex-col space-y-7">
            {!isSuccess && (
                <>
                    <div className="my-2" />
                    <AuthHeader title={t('REGISTER_TITLE')} description={t('REGISTER_DESCRIPTION')} />
                </>
            )}

            <RegisterForm onSuccessChange={setIsSuccess} />
        </div>
    )
}
