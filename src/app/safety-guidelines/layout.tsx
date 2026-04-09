import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safety Guidelines – EidTicketResell',
  description: 'EidTicketResell Safety Guidelines — stay safe when buying and selling travel tickets online. Tips for secure transactions and scam prevention.',
}

export default function SafetyGuidelinesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
