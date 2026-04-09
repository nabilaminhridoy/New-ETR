import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQs | ETR',
  description:
    'Frequently asked questions about buying, selling, payments, account verification, and safety on ETR. Browse by category or search.',
}

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
