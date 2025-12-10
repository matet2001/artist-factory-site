'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface PhoneBookingFormProps {
    onCustomerInfoChange: (data: {
        name: string
        bandName?: string
        note?: string
        userId?: string
    }) => void
    onSubmit: () => void
    onUpdate?: (startMinute?: number, endMinute?: number) => void
    onCancelEdit?: () => void
    onDelete?: () => void
    isSubmitting: boolean
    customerName: string
    customerBandName: string
    bookingNote?: string
    hasSelectedBookings: boolean
    editMode?: boolean
    selectedBookingId?: string
    selectedUserId?: string
    bookingStartMinute?: number
    bookingEndMinute?: number
}

interface User {
    id: string
    name: string | null
    email: string
    bandName: string | null
}

export function PhoneBookingForm({
    onCustomerInfoChange,
    onSubmit,
    onUpdate,
    onCancelEdit,
    onDelete,
    isSubmitting,
    customerName,
    customerBandName,
    bookingNote = '',
    hasSelectedBookings,
    editMode = false,
    selectedUserId,
    bookingStartMinute = 0,
    bookingEndMinute = 0,
}: PhoneBookingFormProps) {
    const t = useTranslations('ADMIN_BOOKINGS')
    const [users, setUsers] = useState<User[]>([])
    const [userSelectionMode, setUserSelectionMode] = useState<'existing' | 'new'>('new')
    const [startMinute, setStartMinute] = useState<number>(bookingStartMinute)
    const [endMinute, setEndMinute] = useState<number>(bookingEndMinute)

    // Fetch users when component mounts
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/admin/users')
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.users || [])
                }
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        fetchUsers()
    }, [])

    // Update minutes when booking changes
    useEffect(() => {
        setStartMinute(bookingStartMinute)
        setEndMinute(bookingEndMinute)
    }, [bookingStartMinute, bookingEndMinute])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCustomerInfoChange({
            name: e.target.value,
            bandName: customerBandName,
            note: bookingNote,
        })
    }

    const handleBandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCustomerInfoChange({
            name: customerName,
            bandName: e.target.value,
            note: bookingNote,
        })
    }

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onCustomerInfoChange({
            name: customerName,
            bandName: customerBandName,
            note: e.target.value,
        })
    }

    const handleUserSelect = (userId: string) => {
        const user = users.find((u) => u.id === userId)
        if (user) {
            onCustomerInfoChange({
                name: user.name || '',
                bandName: user.bandName || '',
                note: bookingNote,
                userId: user.id,
            })
        }
    }

    const handleModeChange = (mode: 'existing' | 'new') => {
        setUserSelectionMode(mode)
        if (mode === 'new') {
            onCustomerInfoChange({
                name: '',
                bandName: '',
                note: bookingNote,
                userId: undefined,
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!customerName.trim()) return
        if (editMode && onUpdate) {
            onUpdate(startMinute, endMinute)
        } else {
            onSubmit()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
            <div>
                <h2 className="text-2xl font-bold mb-2">
                    {editMode ? t('EDIT_BOOKING_TITLE') : t('CUSTOMER_INFO_TITLE')}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {editMode ? t('EDIT_BOOKING_DESC') : t('CUSTOMER_INFO_DESC')}
                </p>
            </div>

            {!editMode && (
                <div className="space-y-2">
                    <Label>Customer Selection</Label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={userSelectionMode === 'new' ? 'default' : 'outline'}
                            onClick={() => handleModeChange('new')}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            New Customer
                        </Button>
                        <Button
                            type="button"
                            variant={userSelectionMode === 'existing' ? 'default' : 'outline'}
                            onClick={() => handleModeChange('existing')}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Existing Customer
                        </Button>
                    </div>
                </div>
            )}

            {!editMode && userSelectionMode === 'existing' && (
                <div className="space-y-2">
                    <Label htmlFor="user-select">Select User</Label>
                    <Select onValueChange={handleUserSelect} value={selectedUserId}>
                        <SelectTrigger id="user-select" disabled={isSubmitting}>
                            <SelectValue placeholder="Choose an existing customer..." />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name || user.email}
                                    {user.bandName && ` (${user.bandName})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">
                    {t('NAME_LABEL')} <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={customerName}
                    onChange={handleNameChange}
                    placeholder={t('NAME_PLACEHOLDER')}
                    required
                    disabled={isSubmitting || (userSelectionMode === 'existing' && !editMode)}
                    autoFocus={userSelectionMode === 'new'}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bandName">{t('BAND_NAME_LABEL')}</Label>
                <Input
                    id="bandName"
                    value={customerBandName}
                    onChange={handleBandNameChange}
                    placeholder={t('BAND_NAME_PLACEHOLDER')}
                    disabled={isSubmitting || (userSelectionMode === 'existing' && !editMode)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="note">{t('NOTE_LABEL')}</Label>
                <Textarea
                    id="note"
                    value={bookingNote}
                    onChange={handleNoteChange}
                    placeholder={t('NOTE_PLACEHOLDER')}
                    disabled={isSubmitting}
                    rows={3}
                    className="resize-none"
                />
            </div>

            {editMode && (
                <div className="space-y-4">
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold mb-3">Booking Time Details</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                            Set custom start and end minutes for half-hour bookings (e.g., 9:00-9:30
                            or 9:30-10:00)
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-minute">Start Minute</Label>
                                <Select
                                    value={startMinute.toString()}
                                    onValueChange={(val) => setStartMinute(Number(val))}
                                >
                                    <SelectTrigger id="start-minute" disabled={isSubmitting}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">:00</SelectItem>
                                        <SelectItem value="30">:30</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-minute">End Minute</Label>
                                <Select
                                    value={endMinute.toString()}
                                    onValueChange={(val) => setEndMinute(Number(val))}
                                >
                                    <SelectTrigger id="end-minute" disabled={isSubmitting}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">:00</SelectItem>
                                        <SelectItem value="30">:30</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {customerName.trim() && !editMode && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {t('NAME_CONFIRMED')}
                </div>
            )}

            <div className="flex gap-2">
                {editMode ? (
                    <>
                        <Button
                            type="submit"
                            disabled={!customerName.trim() || isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? t('UPDATING_BUTTON') : t('UPDATE_BUTTON')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancelEdit}
                            disabled={isSubmitting}
                        >
                            {t('CANCEL_BUTTON')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onDelete}
                            disabled={isSubmitting}
                        >
                            {t('DELETE_BUTTON')}
                        </Button>
                    </>
                ) : (
                    <Button
                        type="submit"
                        disabled={!customerName.trim() || !hasSelectedBookings || isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? t('SUBMITTING_BUTTON') : t('SUBMIT_BUTTON')}
                    </Button>
                )}
            </div>
        </form>
    )
}
