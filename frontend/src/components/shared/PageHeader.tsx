import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        {icon && <span className="text-3xl">{icon}</span>}
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      )}
    </div>
  )
}
