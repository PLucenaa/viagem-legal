import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
    children: ReactNode
    subtitle?: ReactNode
    className?: string
}

export function PageHeader({ children, subtitle, className }: PageHeaderProps) {
    return (
        <div className={cn(className)}>
            <h1 className="page-heading">{children}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
    )
}
