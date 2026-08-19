import Footer from '@/components/common/footer'
import Header from '@/components/common/header'
import { BugReportButton } from '@/components/common/bug-report-button'
import React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate">
            <Header />

            <main className="flex-1 py-12 mb-20">
                {children}
            </main>

            <Footer />
            <BugReportButton />
        </div>
    )
}
