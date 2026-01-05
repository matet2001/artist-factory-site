'use client'

import { Button } from '@/components/ui/button'
import { Combobox, ComboboxOption } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

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
    selectedBookingTime?: number
    selectedBookingDate?: Date
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
    selectedBookingId,
    selectedUserId,
    bookingStartMinute = 0,
    bookingEndMinute = 0,
    selectedBookingTime,
    selectedBookingDate,
}: PhoneBookingFormProps) {
    const t = useTranslations('ADMIN_BOOKINGS')
    const [users, setUsers] = useState<User[]>([])
    const [userSelectionMode, setUserSelectionMode] = useState<'existing' | 'new'>('new')
    const [startMinute, setStartMinute] = useState<number>(bookingStartMinute ?? 0)
    const [endMinute, setEndMinute] = useState<number>(bookingEndMinute ?? 0)
    const [userExistsWarning, setUserExistsWarning] = useState<boolean>(false)

    // Track initial values for edit mode to detect changes
    const [initialValues, setInitialValues] = useState({
        name: '',
        bandName: '',
        note: '',
        startMinute: 0,
        endMinute: 0,
    })

    // Track the current booking ID to detect when we switch to a different booking
    const previousBookingIdRef = useRef<string | undefined>(undefined)

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

    // Update minutes and initial values when entering edit mode or switching bookings
    useEffect(() => {
        if (editMode) {
            // Check if this is a new booking being edited (compare with ref, which doesn't cause re-renders)
            const currentId = selectedBookingId
            const isNewBooking = previousBookingIdRef.current !== currentId

            if (isNewBooking) {
                // Set initial values for the new booking
                setStartMinute(bookingStartMinute ?? 0)
                setEndMinute(bookingEndMinute ?? 0)
                setInitialValues({
                    name: customerName,
                    bandName: customerBandName,
                    note: bookingNote || '',
                    startMinute: bookingStartMinute ?? 0,
                    endMinute: bookingEndMinute ?? 0,
                })
                previousBookingIdRef.current = currentId
            }
        } else {
            // Not in edit mode, reset everything
            setStartMinute(0)
            setEndMinute(0)
            previousBookingIdRef.current = undefined
        }
    }, [
        editMode,
        selectedBookingId,
        bookingStartMinute,
        bookingEndMinute,
        customerName,
        customerBandName,
        bookingNote,
    ])

    // Convert users to combobox options
    const userOptions: ComboboxOption[] = useMemo(() => {
        return users.map((user) => ({
            value: user.id,
            label: user.name || user.email,
            subtitle: user.bandName || user.email,
        }))
    }, [users])

    // Check if user already exists when in "new customer" mode (not in edit mode)
    useEffect(() => {
        if (!editMode && userSelectionMode === 'new' && customerName.trim()) {
            const exists = users.some(
                (u) =>
                    u.name?.toLowerCase() === customerName.toLowerCase() ||
                    u.email.toLowerCase() === customerName.toLowerCase()
            )
            setUserExistsWarning(exists)
        } else {
            setUserExistsWarning(false)
        }
    }, [customerName, userSelectionMode, users, editMode])

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

    // Check if any values have changed in edit mode
    const hasChanges = useMemo(() => {
        if (!editMode) return true // Always allow submit in create mode

        const nameChanged = customerName !== initialValues.name
        const bandNameChanged = customerBandName !== initialValues.bandName
        const noteChanged = (bookingNote || '') !== (initialValues.note || '')
        const startMinuteChanged = startMinute !== initialValues.startMinute
        const endMinuteChanged = endMinute !== initialValues.endMinute

        return nameChanged || bandNameChanged || noteChanged || startMinuteChanged || endMinuteChanged
    }, [
        editMode,
        customerName,
        customerBandName,
        bookingNote,
        startMinute,
        endMinute,
        initialValues,
    ])

    // Calculate booking time range for edit mode
    const bookingRangeInfo = useMemo(() => {
        if (!editMode || !selectedBookingTime || !selectedBookingDate) return null

        const startHour = selectedBookingTime
        const endHour = selectedBookingTime + 1
        const date = selectedBookingDate.toISOString().split('T')[0]

        return t('BOOKING_RANGE_INFO', {
            date,
            startHour,
            startMinute: startMinute.toString().padStart(2, '0'),
            endHour,
            endMinute: endMinute.toString().padStart(2, '0'),
        })
    }, [editMode, selectedBookingTime, selectedBookingDate, startMinute, endMinute, t])

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
                    <Label>{t('CUSTOMER_SELECTION_LABEL')}</Label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={userSelectionMode === 'new' ? 'default' : 'outline'}
                            onClick={() => handleModeChange('new')}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {t('NEW_CUSTOMER')}
                        </Button>
                        <Button
                            type="button"
                            variant={userSelectionMode === 'existing' ? 'default' : 'outline'}
                            onClick={() => handleModeChange('existing')}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {t('EXISTING_CUSTOMER')}
                        </Button>
                    </div>
                </div>
            )}

            {!editMode && userSelectionMode === 'existing' && (
                <div className="space-y-2">
                    <Label htmlFor="user-select">{t('SELECT_USER_LABEL')}</Label>
                    <Combobox
                        options={userOptions}
                        value={selectedUserId}
                        onValueChange={handleUserSelect}
                        placeholder={t('SELECT_USER_PLACEHOLDER')}
                        searchPlaceholder={t('USER_SEARCH_PLACEHOLDER')}
                        emptyText={t('NO_USERS_FOUND')}
                        disabled={isSubmitting}
                    />
                </div>
            )}

            {userExistsWarning && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                    <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        {t('USER_EXISTS_WARNING')}
                    </p>
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
                        <h3 className="text-sm font-semibold mb-2">{t('BOOKING_TIME_DETAILS')}</h3>
                        {bookingRangeInfo && (
                            <div className="bg-muted px-3 py-2 rounded-lg mb-3">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {bookingRangeInfo}
                                </p>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mb-3">
                            {t('BOOKING_TIME_DESC')}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-minute">
                                    {t('START_MINUTE_LABEL')}
                                    {selectedBookingTime !== undefined && (
                                        <span className="text-muted-foreground ml-2">
                                            ({selectedBookingTime}:xx)
                                        </span>
                                    )}
                                </Label>
                                <Select
                                    key={`start-${selectedBookingTime}-${startMinute}`}
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
                                <Label htmlFor="end-minute">
                                    {t('END_MINUTE_LABEL')}
                                    {selectedBookingTime !== undefined && (
                                        <span className="text-muted-foreground ml-2">
                                            ({selectedBookingTime + 1}:xx)
                                        </span>
                                    )}
                                </Label>
                                <Select
                                    key={`end-${selectedBookingTime}-${endMinute}`}
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
                            disabled={!customerName.trim() || isSubmitting || !hasChanges}
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
