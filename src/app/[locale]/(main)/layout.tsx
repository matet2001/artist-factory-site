import Footer from '@/components/common/footer'
import Header from '@/components/common/header'

export default function MainLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col isolate">
            <Header />

            <main className="flex-1">
                <div className="container mx-auto max-w-6xl px-6 lg:px-8 py-10">
                    {children}
                    {modal}
                </div>
            </main>

            <Footer />
        </div>
    )
}
