'use client'

interface TimelineIndicatorProps {
    position: number
}

export function TimelineIndicator({ position }: TimelineIndicatorProps) {
    return (
        <tr
            className="absolute left-0 right-0 h-0.5 bg-red-500 z-20 pointer-events-none"
            style={{
                top: `${position}%`,
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
            }}
        >
            <td className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full border-2 border-background" />
        </tr>
    )
}
