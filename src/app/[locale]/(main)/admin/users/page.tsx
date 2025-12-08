'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UserData {
    id: string
    name: string | null
    email: string
    phone: string | null
    bandName: string | null
    isAdmin: boolean
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
    _count: {
        bookings: number
    }
}

export default function AdminUsersPage() {
    const t = useTranslations('ADMIN_USERS')
    const { data: session, status } = useSession()
    const router = useRouter()

    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(30)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchDebounce, setSearchDebounce] = useState('')

    // Redirect non-admin users
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated' && !session?.user?.isAdmin) {
            router.push('/')
        }
    }, [session, status, router])

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounce(searchTerm)
            setCurrentPage(1) // Reset to first page on search
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchUsers = useCallback(
        async (page: number, pageSize: number, search: string) => {
            setLoading(true)
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    perPage: pageSize.toString(),
                    ...(search && { search }),
                })

                const res = await fetch(`/api/admin/users?${params}`)
                if (!res.ok) throw new Error('Failed to fetch users')

                const data = await res.json()
                setUsers(data.users)
                setTotalRows(data.pagination.totalUsers)
            } catch (error) {
                console.error('Error fetching users:', error)
                toast.error(t('ERROR_LOAD_FAILED'))
            } finally {
                setLoading(false)
            }
        },
        [t]
    )

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.isAdmin) {
            fetchUsers(currentPage, perPage, searchDebounce)
        }
    }, [currentPage, perPage, searchDebounce, fetchUsers, session, status])

    const formatDate = (date: Date | null) => {
        if (!date) return t('NOT_SET')
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const totalPages = Math.ceil(totalRows / perPage)
    const startIndex = (currentPage - 1) * perPage + 1
    const endIndex = Math.min(currentPage * perPage, totalRows)

    if (!session?.user?.isAdmin && status !== 'loading') {
        return null
    }

    return (
        <div className="container mx-auto px-4">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{t('PAGE_TITLE')}</h1>
                    <p className="text-muted-foreground">{t('PAGE_SUBTITLE')}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Input
                            type="text"
                            placeholder={t('SEARCH_PLACEHOLDER')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <div className="text-sm text-muted-foreground">
                            {t('TOTAL_USERS', { count: totalRows })}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-bold uppercase text-xs tracking-wider min-w-[120px]">
                                            {t('COLUMN_NAME')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider min-w-[140px]">
                                            {t('COLUMN_BAND_NAME')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider min-w-[120px]">
                                            {t('COLUMN_PHONE')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider min-w-[180px]">
                                            {t('COLUMN_EMAIL')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider text-center min-w-[90px]">
                                            {t('COLUMN_BOOKINGS_COUNT')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider text-center min-w-[90px]">
                                            {t('COLUMN_EMAIL_VERIFIED')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider text-center min-w-[80px]">
                                            {t('COLUMN_ADMIN')}
                                        </TableHead>
                                        <TableHead className="font-bold uppercase text-xs tracking-wider min-w-[150px]">
                                            {t('COLUMN_CREATED_AT')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={8} className="h-32 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : users.length === 0 ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell
                                                colSpan={8}
                                                className="h-32 text-center text-muted-foreground"
                                            >
                                                {t('NO_USERS_FOUND')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.name || t('NOT_SET')}
                                                </TableCell>
                                                <TableCell>
                                                    {user.bandName || t('NOT_SET')}
                                                </TableCell>
                                                <TableCell>{user.phone || t('NOT_SET')}</TableCell>
                                                <TableCell className="text-sm">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {user._count.bookings}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {user.emailVerified ? t('YES') : t('NO')}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {user.isAdmin ? t('YES') : t('NO')}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatDate(user.createdAt)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-4 border-t border-border bg-card">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                <div className="text-sm text-muted-foreground">
                                    {totalRows > 0
                                        ? t('SHOWING_RESULTS', {
                                              start: startIndex,
                                              end: endIndex,
                                              total: totalRows,
                                          })
                                        : t('SHOWING_RESULTS', {
                                              start: 0,
                                              end: 0,
                                              total: 0,
                                          })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                                        {t('ROWS_PER_PAGE')}
                                    </span>
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(Number(e.target.value))
                                            setCurrentPage(1)
                                        }}
                                        className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                    disabled={currentPage === 1 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-sm font-medium whitespace-nowrap">
                                    {t('PAGE_OF', {
                                        current: currentPage,
                                        total: totalPages || 1,
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                    disabled={currentPage >= totalPages || loading}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
