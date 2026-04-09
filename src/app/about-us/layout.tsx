import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About ETR | Our Mission',
  description:
    'Learn about ETR\'s mission to make Eid travel easier in Bangladesh. Meet our team, discover our values, and find out why thousands trust us for ticket resale.',
}

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
