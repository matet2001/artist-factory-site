'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AuthOptions } from './auth/navbar/AuthOptions'
import LanguageToggle from './language-toggle'
import Logo from './logo'

const routes = [
    { cta: false, name: 'HOME', href: '/', isCta: false },
    { cta: false, name: 'ROOMS', href: '/rooms', isCta: false },
    { cta: true, name: 'BOOKING', href: '/booking', isCta: true },
    { cta: false, name: 'PRICES', href: '/prices', isCta: false },
    { cta: false, name: 'CONTACT', href: '/contact', isCta: false },
]

export default function Header() {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const translate = useTranslations('NAV')
    const pathname = usePathname()

    function isCurrentRoute(href: string): boolean {
        if (href === '/') {
            return pathname === `/` || pathname === `/en`
        }

        return pathname.endsWith(href)
    }

    const renderNavLinks = (mobile = false) =>
        routes.map((item) => {
            const isActive = isCurrentRoute(item.href)

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className="group"
                    onClick={() => mobile && setIsSheetOpen(false)}
                >
                    <Button
                        variant={item.isCta ? 'default' : 'ghost'}
                        className={cn(
                            'text-md transition-colors',
                            mobile && 'w-full justify-center',
                            // Active state styling for non-CTA buttons
                            !item.isCta &&
                                isActive &&
                                'text-primary font-semibold cursor-default hover:bg-transparent hover:text-primary'
                        )}
                    >
                        {translate(item.name)}
                    </Button>
                </Link>
            )
        })

    return (
        <motion.header
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="sticky top-0 z-50 mx-auto max-w-6xl w-full backdrop-blur-md rounded-b-3xl h-[var(--header-height)] bg-background/70 supports-[backdrop-filter]:bg-background/30"
        >
            <div className="container mx-auto flex h-full items-center justify-between px-10 w-full">
                <Logo />

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-4 justify-center">{renderNavLinks()}</nav>

                <div className="hidden md:flex justify-center items-center space-x-5">
                    <AuthOptions />
                    <LanguageToggle />
                </div>

                {/* Mobile Menu - FIXED */}
                <div className="md:hidden flex items-center gap-3">
                    <LanguageToggle />
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader className="text-left">
                                <SheetTitle className="text-lg font-semibold">
                                    {translate('SHEET_TITLE')}
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col space-y-2 mt-6">
                                {renderNavLinks(true)}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    )
}
