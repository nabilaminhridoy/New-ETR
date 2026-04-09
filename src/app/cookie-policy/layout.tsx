import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy – EidTicketResell',
  description: 'EidTicketResell Cookie Policy — learn how we use cookies and similar technologies to improve your experience on our ticket marketplace.',
}

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
