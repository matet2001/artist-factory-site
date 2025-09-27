import { cn } from '@/lib/utils'
import Image from 'next/image'

interface TikiTorchProps {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    className?: string
    size?: 'sm' | 'md' | 'lg'
    opacity?: number
}

export default function TikiTorch({
    position,
    className,
    size = 'md',
    opacity = 0.2,
}: TikiTorchProps) {
    const sizeClasses = {
        sm: 'w-8 h-12 sm:w-10 sm:h-16',
        md: 'w-12 h-20 sm:w-16 sm:h-24',
        lg: 'w-16 h-24 sm:w-20 sm:h-32',
    }

    const positionClasses = {
        'top-left': 'top-0 left-0 rotate-45',
        'top-right': 'top-0 right-0 rotate-[135deg]',
        'bottom-left': 'bottom-0 left-0 rotate-[-45deg]',
        'bottom-right': 'bottom-0 right-0 rotate-[-135deg]',
    }

    return (
        <div
            className={cn('absolute z-0', positionClasses[position], className)}
            style={{ opacity }}
        >
            <div className={cn('relative', sizeClasses[size])}>
                <Image src="/decorations/tiki-torch.png" alt="" fill className="object-contain" />
            </div>
        </div>
    )
}
