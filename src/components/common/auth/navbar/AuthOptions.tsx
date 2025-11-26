'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { CgProfile } from 'react-icons/cg'

export function AuthOptions() {
    const router = useRouter()
    const t = useTranslations('AUTH')
    const tUser = useTranslations('USER')
    const { data: session, status } = useSession()

    // Loading skeleton
    if (status === 'loading') {
        return (
            <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>
        )
    }

    // User is authenticated - show profile menu
    if (session?.user) {
        return (
            <div className="flex items-center space-x-3">
                {/* Optional: Show user name */}
                <span className="text-sm text-muted-foreground hidden sm:block">
                    {session.user.name || session.user.email}
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger className="relative flex rounded-full text-sm cursor-pointer outline-none hover:opacity-80 transition-opacity">
                        <span className="sr-only">Open user menu</span>
                        <CgProfile size={25} className="text-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48" align="end">
                        <div className="px-2 py-1.5 text-sm border-b mb-1">
                            <p className="font-medium">{session.user.name}</p>
                            <p className="text-muted-foreground truncate">{session.user.email}</p>
                        </div>

                        {/* Admin menu items */}
                        {session.user?.isAdmin && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/users" className="cursor-pointer">
                                        {tUser('ADMIN.USERS')}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href="/admin/bookings" className="cursor-pointer">
                                        {tUser('ADMIN.BOOKINGS')}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                            </>
                        )}

                        {/* <DropdownMenuItem asChild>
                            <Link href="/profile" className="cursor-pointer">
                                {tUser('PROFILE')}
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                {tUser('SETTINGS')}
                            </Link>
                        </DropdownMenuItem> */}

                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="text-destructive focus:text-destructive-foreground hover:bg-destructive/20 cursor-pointer mt-1"
                        >
                            {tUser('LOGOUT')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    // User is not authenticated - show auth buttons
    return (
        <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/register')} variant="default">
                {t('SIGN_UP')}
            </Button>
        </div>
    )
}
