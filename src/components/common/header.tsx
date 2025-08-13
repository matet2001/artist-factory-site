'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Logo from './logo'
import { useTranslations } from 'next-intl'
import LanguageToggle from './language-toggle'

const routes = [
    { cta: false, name: 'HOME', href: '/', isCta: false },
    { cta: false, name: 'ROOMS', href: '/room', isCta: false },
    { cta: true, name: 'BOOKING', href: '/booking', isCta: true },
    { cta: false, name: 'PRICES', href: '/prices', isCta: false },
    { cta: false, name: 'CONTACT', href: '/contact', isCta: false },
]
export default function Header() {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const translate = useTranslations('NAV')

    return (
        <motion.header
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="sticky top-0 z-50 w-full backdrop-blur-md rounded-b-3xl h-[var(--header-height)] bg-transparent"
        >
            <div className="container mx-auto flex h-full items-center justify-between px-4 max-w-7xl w-full">
                <Logo />

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-4 justify-center  ">
                    {routes.map((item) => (
                        <Button
                            key={item.href}
                            variant={item.isCta ? 'default' : 'ghost'}
                            className="text-md"
                        >
                            <Link href={item.href}>{translate(item.name)}</Link>
                        </Button>
                    ))}
                </nav>

                <LanguageToggle />

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" aria-describedby={undefined}>
                            <p id="mobile-menu-description" className="sr-only">
                                Mobile navigation menu
                            </p>

                            <SheetHeader className="text-left text-lg font-semibold">
                                Navigáció
                            </SheetHeader>
                            <SheetTitle />
                            <nav className="flex flex-col space-y-2">
                                {routes.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant={item.isCta ? 'default' : 'ghost'}
                                        className="text-md"
                                    >
                                        <Link href={item.href}>{translate(item.name)}</Link>
                                    </Button>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    )
}
