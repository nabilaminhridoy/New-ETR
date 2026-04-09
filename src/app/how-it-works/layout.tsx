import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | ETR',
  description:
    'Learn how to buy and sell travel tickets on ETR in 6 simple steps. From registration and listing to secure payment and ticket delivery.',
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
