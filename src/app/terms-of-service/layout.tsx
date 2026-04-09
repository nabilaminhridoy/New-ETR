import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service – EidTicketResell',
  description: 'EidTicketResell Terms of Service — read our terms and conditions for using the ticket marketplace. User obligations, seller policies, and dispute resolution.',
}

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
