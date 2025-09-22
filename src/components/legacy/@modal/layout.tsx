'use client'

import { Dialog } from '@/components/ui/dialog'
import { useAuthDialog } from '@/hooks/auth/useAuthDialog'
import { useRouter } from 'next/navigation'

export default function AuthModalLayout({
    children,
    modal,
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
    const router = useRouter()
    const { open, setOpen } = useAuthDialog()
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setOpen(false)
                    setTimeout(() => {
                        router.push('/')
                    }, 200)
                }
            }}
        >
            {children}
            {modal}
        </Dialog>
    )
}
