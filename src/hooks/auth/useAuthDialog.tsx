'use client'
import { AuthDialogContext } from '@/context/AuthDialogContext'
import { useContext } from 'react'

export function useAuthDialog() {
    const context = useContext(AuthDialogContext)
    if (!context) {
        throw new Error('useAuthDialog must be used within AuthDialogProvider')
    }
    return context
}
