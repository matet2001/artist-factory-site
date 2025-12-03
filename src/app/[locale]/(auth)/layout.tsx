import LanguageToggle from '@/components/common/language-toggle'
import Logo from '@/components/common/logo'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate relative">
            {/* Language Switcher - Fixed Top Right */}
            <div className="fixed top-4 right-4 z-50">
                <LanguageToggle />
            </div>

            <main className="flex-1 flex items-center justify-center px-0 py-8 sm:px-4 sm:py-20">
                <div className="w-full sm:max-w-lg sm:mx-auto space-y-6">
                    <div className="flex justify-center">
                        <Logo size={260} />
                    </div>

                    {/* Responsive card:
                        - Mobile: full-width block with no radius/border/shadow
                        - Desktop: classic card with radius/border/shadow
                    */}
                    <div
                        className="
                            bg-card text-card-foreground 
                            px-4 py-6 
                            sm:p-8
                            rounded-none sm:rounded-xl
                            border-0 sm:border sm:border-border/50
                            shadow-none sm:shadow-2xl
                        "
                    >
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
