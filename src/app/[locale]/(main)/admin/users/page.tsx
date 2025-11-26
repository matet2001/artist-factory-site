import { authOptions } from '@/../auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions)

    // Double-check server-side that user is admin
    console.log(session?.user)
    if (!session?.user?.isAdmin) {
        redirect('/')
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Felhasználók / Users</h1>
                <div className="bg-card p-8 rounded-lg border">
                    <p className="text-muted-foreground">
                        Admin users management page - Coming soon
                    </p>
                </div>
            </div>
        </div>
    )
}
