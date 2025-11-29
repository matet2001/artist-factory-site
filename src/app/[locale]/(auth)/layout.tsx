import Logo from '@/components/common/logo'
import LanguageToggle from '@/components/common/language-toggle'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate relative">
            {/* Noise texture overlay */}
            <div className="fixed inset-0 z-[-2] mix-blend-overlay pointer-events-none opacity-[0.03]"
                 style={{
                     backgroundImage: 'url(/noise_texture.jpg)',
                     backgroundRepeat: 'repeat',
                     backgroundSize: '100%'
                 }}
            />

            {/* Language Switcher - Fixed Top Right */}
            <div className="fixed top-4 right-4 z-50">
                <LanguageToggle />
            </div>

            <main className="flex-1 flex items-center justify-center p-4 py-8 sm:py-20">
                <div className="w-full max-w-lg space-y-6">
                    <div className="flex justify-center">
                        <Logo size={300} />
                    </div>
                    {/* Card with teal background */}
                    <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-lg shadow-2xl border border-border/50">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
