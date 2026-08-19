'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface EditableUser {
    id: string
    name: string | null
    email: string
    phone: string | null
    bandName: string | null
}

interface EditUserDialogProps {
    user: EditableUser | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdated: (user: EditableUser) => void
}

export function EditUserDialog({ user, open, onOpenChange, onUpdated }: EditUserDialogProps) {
    const t = useTranslations('ADMIN_USERS')
    const tAuth = useTranslations('AUTH')

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [bandName, setBandName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setPhone(user.phone || '')
            setBandName(user.bandName || '')
        }
    }, [user])

    const handleSubmit = async () => {
        if (!user) return

        if (!name.trim()) {
            toast.error(t('NAME_REQUIRED'))
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, bandName }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(t('UPDATE_ERROR'))
                return
            }

            toast.success(t('UPDATE_SUCCESS'))
            onUpdated(data.user)
            onOpenChange(false)
        } catch {
            toast.error(t('UPDATE_ERROR'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('EDIT_USER_TITLE')}</DialogTitle>
                    <DialogDescription>{t('EDIT_USER_DESC')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>{tAuth('EMAIL')}</Label>
                        <Input value={user?.email || ''} disabled readOnly />
                    </div>

                    <div className="space-y-2">
                        <Label>{tAuth('FULL_NAME')}</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>{tAuth('PHONE')}</Label>
                        <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{tAuth('BAND_NAME')}</Label>
                        <Input value={bandName} onChange={(e) => setBandName(e.target.value)} />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        {t('CANCEL')}
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? t('SAVING') : t('SAVE_CHANGES')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
