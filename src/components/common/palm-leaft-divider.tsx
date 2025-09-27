import { motion } from 'framer-motion'
import Image from 'next/image'

interface PalmLeafDividerProps {
    count?: number
    mobileCount?: number
    spacing?: 'tight' | 'normal' | 'wide'
    size?: 'sm' | 'md' | 'lg'
    opacity?: number
    className?: string
}

const spacingClasses = {
    tight: 'space-x-1 sm:space-x-2',
    normal: 'space-x-2 sm:space-x-4',
    wide: 'space-x-4 sm:space-x-8',
}

const sizeClasses = {
    sm: 'w-9 h-9 sm:w-12 sm:h-12',
    md: 'w-12 h-12 sm:w-18 sm:h-18',
    lg: 'w-15 h-15 sm:w-24 sm:h-24',
}

export default function PalmLeafDivider({
    count = 7,
    mobileCount = 5,
    spacing = 'normal',
    size = 'md',
    opacity = 0.4,
    className = '',
}: PalmLeafDividerProps) {
    const actualMobileCount = mobileCount

    return (
        <div
            className={`relative flex items-center justify-center my-8 overflow-hidden ${className}`}
        >
            {/* Mobile version with fewer leaves */}
            <div className={`sm:hidden flex items-center justify-center ${spacingClasses[spacing]}`}>
                {[...Array(actualMobileCount)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: opacity, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={`relative ${sizeClasses[size]}`}
                        style={{ opacity }}
                    >
                        <Image
                            src="/decorations/palm-leaf.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Desktop version with full count */}
            <div className={`hidden sm:flex items-center justify-center ${spacingClasses[spacing]}`}>
                {[...Array(count)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: opacity, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={`relative ${sizeClasses[size]}`}
                        style={{ opacity }}
                    >
                        <Image
                            src="/decorations/palm-leaf.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
