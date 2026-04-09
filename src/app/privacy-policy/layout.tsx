import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – EidTicketResell',
  description: 'EidTicketResell Privacy Policy — understand how we collect, use, and protect your personal information when you buy or sell tickets on our platform.',
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
