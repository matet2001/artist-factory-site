'use client'
import LoginForm from '@/components/common/auth/form/LoginForm'
import { useTranslations } from 'next-intl'
import AuthHeader from '../AuthHeader'

export default function LoginPage() {
    const t = useTranslations('AUTH.HEADERS')

    return (
        <div className="flex flex-col space-y-2">
            <AuthHeader title={t('LOGIN_TITLE')} description={t('LOGIN_DESCRIPTION')} />
            <div className="my-2" />
            <LoginForm />
        </div>
    )
}
