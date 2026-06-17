import type { LucideIcon } from 'lucide-react'
import { CalendarClock } from 'lucide-react'

type SectionTitleProps = {
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

export default function SectionTitle({ icon: Icon = CalendarClock, children, className = '' }: SectionTitleProps) {
  return (
    <div className={`section-title ${className}`}>
      <Icon size={18} className="text-fog" />
      <span>{children}</span>
    </div>
  )
}
