import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | ETR',
  description:
    'Get in touch with the ETR support team. Reach us via email, phone, or our contact form. We typically respond within 24 hours.',
}

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
