'use client'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function CtaCard({
    title,
    icon: Icon,
    href,
    content,
}: {
    title: string
    icon: LucideIcon
    href: string
    content?: string
}) {
    return (
        <Link href={href} className="group block">
            <div className="rounded-xl border bg-card/70 backdrop-blur p-4 shadow transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    <div className="font-medium">{title}</div>
                </div>
                {content ? (
                    <div className="mt-2 text-sm text-muted-foreground">{content}</div>
                ) : null}
            </div>
        </Link>
    )
}
