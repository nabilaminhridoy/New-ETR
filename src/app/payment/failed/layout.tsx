import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Payment Failed – EidTicketResell',
  },
}

export default function PaymentFailedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
