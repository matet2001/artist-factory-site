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
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { CgProfile } from 'react-icons/cg'

type AuthOptionsProps = {
    variant?: 'desktop' | 'mobile'
}

export function AuthOptions({ variant = 'desktop' }: AuthOptionsProps) {
    const router = useRouter()
    const t = useTranslations('AUTH')
    const tUser = useTranslations('USER')
    const { data: session, status } = useSession()

    const isMobile = variant === 'mobile'

    // Loading skeleton
    if (status === 'loading') {
        return (
            <div
                className={cn(
                    'flex items-center space-x-2',
                    isMobile && 'w-full flex-col space-x-0 space-y-3'
                )}
            >
                <Skeleton className={cn('h-9 w-20', isMobile && 'w-full h-10')} />
                {!isMobile && <Skeleton className="h-6 w-6 rounded-full" />}
            </div>
        )
    }

    // User is authenticated - show profile menu (desktop) or simple logout button (mobile)
    if (session?.user) {
        if (isMobile) {
            // Mobil: centered buttons, not full width
            return (
                <div className="flex flex-col gap-2 items-center w-full">
                    <div className="text-center text-sm">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-muted-foreground truncate">{session.user.email}</p>
                    </div>

                    {/* Admin linkek mobilon is jöhetnek külön sorban, ha szeretnéd */}
                    {session.user?.isAdmin && (
                        <div className="flex flex-col gap-2 mt-2 items-center w-full">
                            <Button
                                variant="outline"
                                className="justify-center w-full max-w-[200px]"
                                onClick={() => router.push('/admin/users')}
                            >
                                {tUser('ADMIN.USERS')}
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-center w-full max-w-[200px]"
                                onClick={() => router.push('/admin/bookings')}
                            >
                                {tUser('ADMIN.BOOKINGS')}
                            </Button>
                        </div>
                    )}

                    <Button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        variant="destructive"
                        className="mt-3 w-full max-w-[200px]"
                    >
                        {tUser('LOGOUT')}
                    </Button>
                </div>
            )
        }

        // Desktop – marad a dropdown
        return (
            <div className="flex items-center space-x-3">
                {/* <span className="text-sm text-muted-foreground hidden sm:block w-full min-[150px]">
                    {session.user.name || session.user.email}
                </span> */}

                <DropdownMenu>
                    <DropdownMenuTrigger className="relative flex rounded-full text-sm cursor-pointer outline-none hover:opacity-80 transition-opacity">
                        <span className="sr-only">Open user menu</span>
                        <CgProfile size={25} className="text-foreground" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-48" align="end">
                        <div className="px-2 py-1.5 text-sm border-b mb-1 ">
                            <p className="font-medium">{session.user.name}</p>
                            <p className="text-muted-foreground truncate">{session.user.email}</p>
                        </div>

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

                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="text-destructive focus:text-destructive-foreground hover:bg-destructive/20  cursor-pointer mt-1"
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
        <div
            className={cn(
                'flex items-center space-x-2',
                isMobile && 'flex-col space-x-0 space-y-3 items-center w-full'
            )}
        >
            {/* Login */}
            <Button
                onClick={() => router.push('/login')}
                variant={isMobile ? 'outline' : 'ghost'}
                className={cn(isMobile && 'py-3 text-base w-full max-w-[200px]')}
            >
                {t('SIGN_IN')}
            </Button>

            {/* Register */}
            <Button
                onClick={() => router.push('/register')}
                variant="default"
                className={cn(isMobile && 'py-3 text-base w-full max-w-[200px]')}
            >
                {t('SIGN_UP')}
            </Button>
        </div>
    )
}
