'use client'

import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePerRowsChange = async (newPerPage: number, page: number) => {
        setPerPage(newPerPage)
        setCurrentPage(page)
    }

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

    const columns: TableColumn<UserData>[] = [
        {
            name: t('COLUMN_NAME'),
            selector: (row) => row.name || t('NOT_SET'),
            sortable: true,
            wrap: true,
            grow: 1.2,
        },
        {
            name: t('COLUMN_BAND_NAME'),
            selector: (row) => row.bandName || t('NOT_SET'),
            sortable: true,
            wrap: true,
            grow: 1.2,
        },
        {
            name: t('COLUMN_PHONE'),
            selector: (row) => row.phone || t('NOT_SET'),
            sortable: true,
            wrap: true,
            grow: 1,
        },
        {
            name: t('COLUMN_BOOKINGS_COUNT'),
            selector: (row) => row._count.bookings,
            sortable: true,
            width: '110px',
            style: {
                justifyContent: 'center',
            },
        },
        {
            name: t('COLUMN_CREATED_AT'),
            selector: (row) => formatDate(row.createdAt),
            sortable: true,
            wrap: true,
            grow: 1.3,
        },
        {
            name: t('COLUMN_EMAIL_VERIFIED'),
            selector: (row) => (row.emailVerified ? t('YES') : t('NO')),
            sortable: true,
            width: '100px',
            style: {
                justifyContent: 'center',
            },
        },
        {
            name: t('COLUMN_EMAIL'),
            selector: (row) => row.email,
            sortable: true,
            wrap: true,
            grow: 1.5,
        },
        {
            name: t('COLUMN_ADMIN'),
            selector: (row) => (row.isAdmin ? t('YES') : t('NO')),
            sortable: true,
            width: '90px',
            style: {
                justifyContent: 'center',
            },
        },
    ]

    const customStyles = {
        table: {
            style: {
                backgroundColor: 'hsl(var(--card))',
            },
        },
        tableWrapper: {
            style: {
                backgroundColor: 'hsl(var(--card))',
            },
        },
        headRow: {
            style: {
                backgroundColor: 'hsl(var(--muted))',
                borderBottom: '2px solid hsl(var(--border))',
                minHeight: '56px',
            },
        },
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: '700',
                color: 'hsl(var(--foreground))',
                paddingLeft: '20px',
                paddingRight: '20px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
            },
        },
        rows: {
            style: {
                backgroundColor: 'hsl(var(--card))',
                borderBottom: '1px solid hsl(var(--border))',
                minHeight: '72px',
                fontSize: '14px',
                '&:hover': {
                    backgroundColor: 'hsl(var(--accent))',
                    cursor: 'pointer',
                },
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                color: 'hsl(var(--foreground))',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
            },
        },
        pagination: {
            style: {
                backgroundColor: 'hsl(var(--card))',
                borderTop: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                fontSize: '14px',
            },
            pageButtonsStyle: {
                borderRadius: '6px',
                height: '36px',
                width: '36px',
                padding: '8px',
                margin: '4px',
                cursor: 'pointer',
                transition: '0.2s',
                color: 'hsl(var(--foreground))',
                fill: 'hsl(var(--foreground))',
                backgroundColor: 'transparent',
                '&:disabled': {
                    cursor: 'not-allowed',
                    color: 'hsl(var(--muted-foreground))',
                    fill: 'hsl(var(--muted-foreground))',
                },
                '&:hover:not(:disabled)': {
                    backgroundColor: 'hsl(var(--accent))',
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: 'hsl(var(--accent))',
                },
            },
        },
    }

    if (!session?.user?.isAdmin && status !== 'loading') {
        return null
    }

    return (
        <div className="container mx-auto py-12 px-4">
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

                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg text-foreground">
                        <DataTable
                            columns={columns}
                            data={users}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            paginationDefaultPage={currentPage}
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[30, 50, 100]}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            // customStyles={customStyles}
                            // noDataComponent={
                            //     <div className="py-8 text-center text-muted-foreground bg-card">
                            //         {t('NO_USERS_FOUND')}
                            //     </div>
                            // }
                            // progressComponent={
                            //     <div className="py-8 flex justify-center bg-card">
                            //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                            //     </div>
                            // }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
