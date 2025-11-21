'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { enUS, hu } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useLocale } from 'next-intl'

interface DateSelectorProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
    const locale = useLocale()

    // Map locale to date-fns locale
    const dateLocale = locale === 'hu' ? hu : enUS

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-center text-left font-semibold border-1 border-accent',
                        !selectedDate && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        format(selectedDate, 'PPP', { locale: dateLocale })
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && onDateChange(date)}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    locale={dateLocale}
                />
            </PopoverContent>
        </Popover>
    )
}
