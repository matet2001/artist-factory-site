'use client'
import RegisterForm from '@/components/common/auth/form/RegisterForm'
import { useTranslations } from 'next-intl'
import AuthHeader from '../AuthHeader'

export default function RegisterPage() {
    const t = useTranslations('AUTH.HEADERS')

    return (
        <div className="flex flex-col space-y-7">
            <AuthHeader title={t('REGISTER_TITLE')} description={t('REGISTER_DESCRIPTION')} />
            <RegisterForm />
        </div>
    )
}
