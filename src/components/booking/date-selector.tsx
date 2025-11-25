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
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
    const locale = useLocale()

    // Map locale to date-fns locale
    const dateLocale = locale === 'hu' ? hu : enUS

    const handlePreviousDay = () => {
        const previousDay = new Date(selectedDate)
        previousDay.setDate(previousDay.getDate() - 1)

        // Don't allow going to past dates
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (previousDay < today) {
            return
        }

        onDateChange(previousDay)
    }

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate)
        nextDay.setDate(nextDay.getDate() + 1)
        onDateChange(nextDay)
    }

    const isPastDate = () => {
        const previousDay = new Date(selectedDate)
        previousDay.setDate(previousDay.getDate() - 1)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return previousDay < today
    }

    return (
        <div className="flex items-center gap-2 justify-center border-1 border-primary rounded-xl">
            <Popover>
                <div className="flex gap-2 items-center justify-center p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousDay}
                        disabled={isPastDate()}
                        className="h-10 w-10 shrink-0 border-primary/30 hover:border-primary/60 hover:bg-accent transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                'justify-center text-left font-semibold border-primary/30 hover:border-primary/60 hover:bg-accent transition-colors',
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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextDay}
                        className="h-10 w-10 shrink-0 border-primary/30 hover:border-primary/60 hover:bg-accent transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

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
        </div>
    )
}
