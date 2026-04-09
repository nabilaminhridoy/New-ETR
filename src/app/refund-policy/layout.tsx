import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy – EidTicketResell',
  description: 'EidTicketResell Refund Policy — learn about our refund process, eligibility criteria, and how to request a refund for ticket purchases.',
}

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
