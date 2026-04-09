import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Payment Successful – EidTicketResell',
  },
}

export default function PaymentSuccessfulLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
