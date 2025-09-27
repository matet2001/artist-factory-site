'use client'

import { useRouter } from 'next/navigation'

type AuthSwitchProps = {
    label: string
    action: string
    href: string
}

export default function AuthSwitch({ label, action, href }: AuthSwitchProps) {
    const router = useRouter()

    const handleClick = () => {
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
