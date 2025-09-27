import Footer from '@/components/common/footer'
import Header from '@/components/common/header'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate">
            <Header />

            <main className="flex-1">
                <div className="container mx-auto max-w-6xl px-6 lg:px-8">{children}</div>
            </main>

            <Footer />
        </div>
    )
}
