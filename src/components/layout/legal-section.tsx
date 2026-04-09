import { AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LegalSectionProps {
  id: string
  title: string
  index: number
  icon: React.ReactNode
  children: React.ReactNode
}

export function LegalSection({ id, title, index, icon, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className="space-y-4">{children}</div>
        </CardContent>
      </Card>
    </section>
  )
}

interface LegalCalloutProps {
  type: 'info' | 'warning' | 'success' | 'error' | 'danger'
  title: string
  children: React.ReactNode
}

const calloutConfig = {
  info: {
    bgColor: 'bg-sky-50 dark:bg-sky-900/20',
    borderColor: 'border-sky-200 dark:border-sky-800',
    iconColor: 'text-sky-600',
    icon: Info,
  },
  warning: {
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-600',
    icon: AlertTriangle,
  },
  success: {
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-600',
    icon: CheckCircle,
  },
  error: {
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600',
    icon: AlertCircle,
  },
  danger: {
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600',
    icon: AlertCircle,
  },
}

export function LegalCallout({ type, title, children }: LegalCalloutProps) {
  const config = calloutConfig[type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'rounded-xl p-4 border flex gap-3',
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      <div>
        <p className="font-semibold text-sm mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  )
}
