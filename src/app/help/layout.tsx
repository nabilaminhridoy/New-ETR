import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center – EidTicketResell',
  description:
    'Get help with buying, selling, payments, and account issues on EidTicketResell. Explore help topics by category or submit a support request.',
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
