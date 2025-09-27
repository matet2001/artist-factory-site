import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PalmTreeSilhouetteProps {
    mirrored?: boolean
    flipped?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    opacity?: 'light' | 'medium' | 'dark'
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const sizeClasses = {
    sm: 'w-12 sm:w-16 md:w-20 lg:w-24 h-12',
    md: 'w-16 sm:w-20 md:w-28 lg:w-32 h-auto',
    lg: 'w-20 sm:w-28 md:w-36 lg:w-44 h-auto',
    xl: 'w-24 sm:w-32 md:w-44 lg:w-56 h-12',
}

const opacityClasses = {
    light: 'opacity-10',
    medium: 'opacity-20',
    dark: 'opacity-30',
}

const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
}

export default function PalmTreeSilhouette({
    mirrored = false,
    flipped = false,
    className,
    size = 'md',
    opacity = 'medium',
    position,
}: PalmTreeSilhouetteProps) {
    return (
        <div
            className={cn(
                'pointer-events-none absolute z-[-1]',
                sizeClasses[size],
                position && positionClasses[position],
                className
            )}
            style={{
                aspectRatio: `${583 / 600}`, // Maintain original aspect ratio
            }}
        >
            <Image
                src="/decorations/palm_tree_1.png"
                alt=""
                fill
                className={cn(
                    'object-contain',
                    opacityClasses[opacity],
                    mirrored && 'scale-x-[-1]',
                    flipped && 'scale-y-[-1]'
                )}
                priority={false}
            />
        </div>
    )
}
