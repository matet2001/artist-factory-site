'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { enUS, hu } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'

interface DateSelectorProps {
    selectedDate: Date
    onDateChange: (date: Date) => void
    allowPastDates?: boolean
}

export function DateSelector({ selectedDate, onDateChange, allowPastDates = false }: DateSelectorProps) {
    const locale = useLocale()

    // Map locale to date-fns locale
    const dateLocale = locale === 'hu' ? hu : enUS

    const handlePreviousDay = () => {
        const previousDay = new Date(selectedDate)
        previousDay.setDate(previousDay.getDate() - 1)

        // Don't allow going to past dates unless explicitly allowed (for admin)
        if (!allowPastDates) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (previousDay < today) {
                return
            }
        }

        onDateChange(previousDay)
    }

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate)
        nextDay.setDate(nextDay.getDate() + 1)
        onDateChange(nextDay)
    }

    const isPastDate = () => {
        // If past dates are allowed, never disable the previous button
        if (allowPastDates) {
            return false
        }

        const previousDay = new Date(selectedDate)
        previousDay.setDate(previousDay.getDate() - 1)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return previousDay < today
    }

    return (
        <div className="flex items-center gap-0 md:gap-1 justify-center rounded-lg md:rounded-xl">
            <Popover>
                <div className="flex gap-0 md:gap-1 items-center justify-center p-0.5 md:p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousDay}
                        disabled={isPastDate()}
                        className="h-6 w-5 md:h-12 md:w-12 shrink-0 border-primary/30 hover:border-primary/60 hover:bg-accent transition-colors p-0"
                    >
                        <ChevronLeft className="h-3 w-3 md:h-5 md:w-5" />
                    </Button>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                'justify-center text-left font-semibold border-primary/30 hover:border-primary/60 hover:bg-accent transition-colors px-0.5 md:px-3 py-1 md:py-3 h-7 md:h-12 text-[10px] md:text-base min-w-0',
                                !selectedDate && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-0.5 md:mr-2 h-3 w-3 md:h-5 md:w-5 shrink-0" />
                            {selectedDate ? (
                                <>
                                    <span className="hidden sm:inline whitespace-nowrap">
                                        {format(selectedDate, 'yyyy MMMM d.', { locale: dateLocale })}
                                    </span>
                                    <span className="sm:hidden whitespace-nowrap">
                                        {format(selectedDate, 'M/d', { locale: dateLocale })}
                                    </span>
                                </>
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextDay}
                        className="h-6 w-5 md:h-12 md:w-12 shrink-0 border-primary/30 hover:border-primary/60 hover:bg-accent transition-colors p-0"
                    >
                        <ChevronRight className="h-3 w-3 md:h-5 md:w-5" />
                    </Button>
                </div>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && onDateChange(date)}
                        disabled={
                            allowPastDates
                                ? undefined
                                : (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        locale={dateLocale}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
