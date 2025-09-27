import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PalmTreeSilhouetteProps {
    mirrored?: boolean
    flipped?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    opacity?: 'light' | 'medium' | 'dark'
}

const sizeClasses = {
    sm: 'h-32 w-[31px] sm:h-40 sm:w-[39px] lg:h-48 lg:w-[47px]',
    md: 'h-48 w-48',
    lg: 'h-64 w-[62px] sm:h-80 sm:w-[78px] lg:h-96 lg:w-[93px]',
    xl: 'h-80 w-[78px] sm:h-96 sm:w-[93px] lg:h-[28rem] lg:w-[109px]',
}

const opacityClasses = {
    light: 'opacity-10',
    medium: 'opacity-20',
    dark: 'opacity-30',
}

export default function PalmTreeSilhouette({
    mirrored = false,
    flipped = false,
    className,
    size = 'md',
    opacity = 'medium',
}: PalmTreeSilhouetteProps) {
    return (
        <div className={cn('relative', sizeClasses[size], className)}>
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
