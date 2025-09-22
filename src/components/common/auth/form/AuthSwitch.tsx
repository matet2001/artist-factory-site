'use client'

import { useAuthDialog } from '@/hooks/auth/useAuthDialog'
import type { AuthMode } from '@/types/AuthTypes'
import { useRouter } from 'next/navigation'

type AuthSwitchProps = {
    label: string
    action: string
    href: string
}

export default function AuthSwitch({ label, action, href }: AuthSwitchProps) {
    const router = useRouter()
    const { openAuthDialog } = useAuthDialog()

    const handleClick = () => {
        // Determine the auth mode based on the href
        const mode: AuthMode = href.includes('register') ? 'register' : 'login'

        // Update the dialog mode and URL
        router.push(href)
    }

    return (
        <p className="text-center text-muted-foreground text-sm">
            {label}{' '}
            <button
                onClick={handleClick}
                className="font-semibold text-link hover:underline cursor-pointer"
                type="button"
            >
                {action}
            </button>
        </p>
    )
}
