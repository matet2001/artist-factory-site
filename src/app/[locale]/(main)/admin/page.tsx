import { authOptions } from '@/../auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    console.log(session?.user)

    // Redirect non-admin users to home
    if (!session?.user?.isAdmin) {
        redirect('/')
    }

    // Redirect admin users to the users page
    redirect('/admin/users')
}
