import Footer from '@/components/common/footer'
import Header from '@/components/common/header'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate">
            <Header />

            <main className="flex-1 py-12 mb-20">
                {children}
            </main>

            <Footer />
        </div>
    )
}
