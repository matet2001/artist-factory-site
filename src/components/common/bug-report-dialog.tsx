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
import { Textarea } from '@/components/ui/textarea'
import { Bug, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface BugReportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface FormData {
    name: string
    email: string
    description: string
    images: File[]
}

interface FormErrors {
    name?: string
    email?: string
    description?: string
}

export function BugReportDialog({ open, onOpenChange }: BugReportDialogProps) {
    const t = useTranslations('BUG_REPORT')
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        description: '',
        images: [],
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = t('VALIDATION.NAME_REQUIRED')
        }

        if (!formData.email.trim()) {
            newErrors.email = t('VALIDATION.EMAIL_REQUIRED')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('VALIDATION.EMAIL_INVALID')
        }

        if (!formData.description.trim()) {
            newErrors.description = t('VALIDATION.DESCRIPTION_REQUIRED')
        } else if (formData.description.trim().length < 10) {
            newErrors.description = t('VALIDATION.DESCRIPTION_MIN')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const remainingSlots = 3 - formData.images.length
        const newImages = files.slice(0, remainingSlots)

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
        }))
    }

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('description', formData.description)

            formData.images.forEach((image, index) => {
                formDataToSend.append(`image${index}`, image)
            })

            const response = await fetch('/api/bug-report', {
                method: 'POST',
                body: formDataToSend,
            })

            if (!response.ok) {
                throw new Error('Failed to submit bug report')
            }

            toast.success(t('SUCCESS_TITLE'), {
                description: t('SUCCESS_MESSAGE'),
            })

            // Reset form
            setFormData({
                name: '',
                email: '',
                description: '',
                images: [],
            })
            setErrors({})
            onOpenChange(false)
        } catch (error) {
            console.error('Error submitting bug report:', error)
            toast.error(t('ERROR_TITLE'), {
                description: t('ERROR_MESSAGE'),
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bug className="w-5 h-5 text-destructive" />
                        {t('DIALOG_TITLE')}
                    </DialogTitle>
                    <DialogDescription>{t('DIALOG_DESCRIPTION')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            {t('NAME_LABEL')}
                        </label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder={t('NAME_PLACEHOLDER')}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            {t('EMAIL_LABEL')}
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder={t('EMAIL_PLACEHOLDER')}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            {t('DESCRIPTION_LABEL')}
                        </label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder={t('DESCRIPTION_PLACEHOLDER')}
                            className="min-h-32"
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {t('ATTACH_IMAGES')}
                        </label>
                        <p className="text-xs text-muted-foreground">
                            {t('ATTACH_IMAGES_DESC')}
                        </p>

                        {formData.images.length < 3 && (
                            <div className="relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        )}

                        {/* Image Previews */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {formData.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-md overflow-hidden border"
                                    >
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('SUBMITTING') : t('SUBMIT_BUTTON')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
