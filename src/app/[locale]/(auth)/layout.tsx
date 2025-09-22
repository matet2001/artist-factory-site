import Logo from '@/components/common/logo'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate">
            <main className="flex-1 flex items-start justify-center p-4 py-20">
                <div className="w-full max-w-lg space-y-6">
                    <div className="flex justify-center">
                        <Logo size={300}/>
                    </div>
                    <div className="bg-dialog text-dialog-foreground p-6 rounded-lg shadow-lg">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
