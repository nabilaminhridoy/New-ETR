'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type TocItem = {
  id: string
  title: string
}

export type RelatedPolicy = {
  title: string
  href: string
  description: string
}

interface LegalPageLayoutProps {
  title: string
  icon: React.ElementType
  description: string
  lastUpdated: string
  tocItems: TocItem[]
  relatedPolicies: RelatedPolicy[]
  children: React.ReactNode
}

export function LegalPageLayout({
  title,
  icon: Icon,
  description,
  lastUpdated,
  tocItems,
  relatedPolicies,
  children,
}: LegalPageLayoutProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Legal</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-muted-foreground text-lg max-w-3xl">{description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    {tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="w-full text-left text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors"
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">{children}</div>

            {/* Related Policies */}
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-xl font-bold mb-4">Related Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPolicies.map((policy) => (
                  <Link key={policy.href} href={policy.href}>
                    <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-border/60">
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-primary" />
                          {policy.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {policy.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
