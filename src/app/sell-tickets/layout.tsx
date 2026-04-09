import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell Tickets | ETR',
  description:
    'List your unused travel tickets for sale on ETR. Set your price, reach verified buyers, and receive payment securely with just 1% platform fee.',
}

export default function SellTicketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
