import Logo from '@/components/common/logo'
import LanguageToggle from '@/components/common/language-toggle'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate bg-background">
            {/* Language Switcher - Fixed Top Right */}
            <div className="fixed top-4 right-4 z-50">
                <LanguageToggle />
            </div>

            <main className="flex-1 flex items-start justify-center p-4 py-20">
                <div className="w-full max-w-lg space-y-6">
                    <div className="flex justify-center">
                        <Logo size={300} />
                    </div>
                    {/* Card with teal background */}
                    <div className="bg-card text-card-foreground p-8 rounded-lg shadow-2xl border border-border/50">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
