'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  UserCircle,
  ShoppingBag,
  Tag,
  HeadphonesIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MainLayout } from '@/components/layout/main-layout'

/* ───────────── Data ───────────── */

type FAQCategory = 'All' | 'Buying' | 'Selling' | 'Payments' | 'Account' | 'Safety'

interface FAQ {
  id: string
  category: Exclude<FAQCategory, 'All'>
  question: string
  answer: string
}

const categories: { label: FAQCategory; icon: typeof HelpCircle }[] = [
  { label: 'All', icon: HelpCircle },
  { label: 'Buying', icon: ShoppingBag },
  { label: 'Selling', icon: Tag },
  { label: 'Payments', icon: CreditCard },
  { label: 'Account', icon: UserCircle },
  { label: 'Safety', icon: ShieldCheck },
]

const faqs: FAQ[] = [
  // ── Buying ──
  {
    id: 'buy-1',
    category: 'Buying',
    question: 'How do I buy a ticket on EidTicketResell?',
    answer:
      'Browse available tickets using our search filters (route, date, transport type). Once you find a suitable ticket, click "Buy Now", enter your details, choose a payment method, and complete the purchase. You\'ll receive the full ticket details via email or WhatsApp after successful payment.',
  },
  {
    id: 'buy-2',
    category: 'Buying',
    question: 'Is my payment safe on this platform?',
    answer:
      'Absolutely! We use secure payment gateways including bKash, Nagad, and bank transfers. All transactions are encrypted and your financial information is never shared with sellers. We also offer buyer protection — if a ticket is invalid, you get a full refund.',
  },
  {
    id: 'buy-3',
    category: 'Buying',
    question: 'How do I receive my ticket after purchase?',
    answer:
      'It depends on the delivery method chosen by the seller: Online Delivery — you\'ll receive a digital copy via email or WhatsApp. In Person — you\'ll meet the seller at a convenient location. Courier — the physical ticket will be delivered via Pathao, Steadfast, or another courier service.',
  },
  {
    id: 'buy-4',
    category: 'Buying',
    question: 'Can I cancel a purchase after payment?',
    answer:
      'Yes, you can request a cancellation within 24 hours of purchase if the ticket hasn\'t been delivered yet. Contact our support team with your transaction details. If the ticket has already been delivered, cancellation is handled on a case-by-case basis. Invalid tickets always qualify for a full refund.',
  },

  // ── Selling ──
  {
    id: 'sell-1',
    category: 'Selling',
    question: 'How do I sell my unused ticket?',
    answer:
      'First, create an account and complete ID verification (NID, Driving License, or Passport). Then go to "Sell Ticket", fill in all the ticket details (route, date, transport company, seat number, price), upload a photo of the ticket, and submit. Your listing will be reviewed and approved within 24 hours.',
  },
  {
    id: 'sell-2',
    category: 'Selling',
    question: 'What types of tickets can I sell?',
    answer:
      'You can sell any unused travel ticket for Bus, Train, Launch, or Air travel within Bangladesh. The ticket must be valid (not expired or used) and you must be the original purchaser. Duplicate or fake tickets are strictly prohibited and will result in account ban.',
  },
  {
    id: 'sell-3',
    category: 'Selling',
    question: 'How does the listing approval process work?',
    answer:
      'After you submit your ticket listing, our admin team reviews it within 24 hours. They verify the ticket photo, route details, and pricing. Once approved, your listing goes live on the platform. If there are any issues, you\'ll be notified with instructions to fix them.',
  },
  {
    id: 'sell-4',
    category: 'Selling',
    question: 'When and how do I get paid?',
    answer:
      'For online payments, the amount is added to your ETR wallet balance after the transaction is confirmed. You can withdraw to your bKash or bank account anytime (minimum ৳100). For in-person or courier deliveries, payment is typically made directly at the time of ticket exchange.',
  },

  // ── Payments ──
  {
    id: 'pay-1',
    category: 'Payments',
    question: 'What payment methods are available?',
    answer:
      'We support multiple payment methods: bKash, Nagad, Rocket for mobile banking; bank transfers for direct deposit; and cash on delivery for in-person exchanges. Courier delivery (COD) is also available for physical tickets.',
  },
  {
    id: 'pay-2',
    category: 'Payments',
    question: 'How is the platform fee calculated?',
    answer:
      'We charge only 1% of the ticket price as a platform fee, paid by the buyer. For example, if a ticket costs ৳1,000, the platform fee is just ৳10. This is one of the lowest fees in the market, with no hidden charges.',
  },
  {
    id: 'pay-3',
    category: 'Payments',
    question: 'Is there a minimum platform fee?',
    answer:
      'Yes, the minimum platform fee is ৳10. So even if 1% of the ticket price is less than ৳10 (e.g., a ৳500 ticket), the fee will still be ৳10. This helps us maintain the platform and provide quality support services.',
  },

  // ── Account ──
  {
    id: 'acc-1',
    category: 'Account',
    question: 'How do I verify my account?',
    answer:
      'Go to your profile settings and click "Verify Account". Upload a clear photo of your NID (front and back), Driving License (front and back), or Passport (front page). Our team reviews documents within 24-48 hours. Verified accounts get a badge and can sell tickets on the platform.',
  },
  {
    id: 'acc-2',
    category: 'Account',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot Password" on the login page. Enter your registered phone number or email address. You\'ll receive an OTP (one-time password) to verify your identity, then you can set a new password. If you\'re still having trouble, contact our support team.',
  },
  {
    id: 'acc-3',
    category: 'Account',
    question: 'Can I delete my account?',
    answer:
      'Yes, you can request account deletion from your profile settings. Please note that if you have pending transactions or wallet balance, you\'ll need to complete those before deletion. Account deletion is permanent and cannot be undone. Contact support if you need help with the process.',
  },

  // ── Safety ──
  {
    id: 'safe-1',
    category: 'Safety',
    question: 'How are sellers verified on the platform?',
    answer:
      'All sellers must complete ID verification using government-issued documents (NID, Driving License, or Passport). Our admin team reviews each document manually. Verified sellers receive a green verification badge on their profile, giving buyers confidence in their authenticity.',
  },
  {
    id: 'safe-2',
    category: 'Safety',
    question: 'What should I do if I receive a fake or invalid ticket?',
    answer:
      'Contact our support team immediately within 24 hours of receiving the ticket. Provide your transaction details and evidence (photos of the invalid ticket). We\'ll investigate and if confirmed, you\'ll receive a full refund. The seller\'s account will also be suspended and reported.',
  },
  {
    id: 'safe-3',
    category: 'Safety',
    question: 'How do I report a problem or suspicious activity?',
    answer:
      'You can report through multiple channels: use the "Report" button on any listing or user profile, email us at support@eidticketresell.com, or use the Contact Us form. Include as much detail as possible (screenshots, transaction IDs). Our trust & safety team investigates all reports within 24-48 hours.',
  },
]

/* ───────────── Variants ───────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

/* ───────────── Page ───────────── */

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'All' || faq.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: faqs.length }
    for (const faq of faqs) {
      counts[faq.category] = (counts[faq.category] || 0) + 1
    }
    return counts
  }, [])

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
          <div className="absolute inset-0 hero-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                Frequently Asked{' '}
                <span className="text-gradient">Questions</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg lg:text-xl">
                Find quick answers to common questions about buying, selling,
                payments, and account management.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Search & Filter ── */}
        <section className="max-w-5xl mx-auto px-4 -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6 lg:p-8">
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs... (e.g., payment, refund, ticket)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    const isActive = activeCategory === cat.label
                    const count = categoryCounts[cat.label] || 0
                    return (
                      <Button
                        key={cat.label}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveCategory(cat.label)}
                        className={`gap-1.5 transition-all duration-200 ${
                          isActive
                            ? 'btn-primary shadow-md'
                            : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.label}
                        <span
                          className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-inherit'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {count}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ── FAQ Accordion ── */}
        <section className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Results info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {filteredFaqs.length}
                </span>{' '}
                {filteredFaqs.length === 1 ? 'question' : 'questions'}
                {activeCategory !== 'All' && (
                  <span>
                    {' '}
                    in{' '}
                    <span className="font-semibold text-foreground">
                      {activeCategory}
                    </span>
                  </span>
                )}
                {searchQuery.trim() !== '' && (
                  <span>
                    {' '}
                    matching &quot;
                    <span className="font-semibold text-foreground">
                      {searchQuery}
                    </span>
                    &quot;
                  </span>
                )}
              </p>
              {(searchQuery.trim() !== '' || activeCategory !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All')
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* FAQs */}
            {filteredFaqs.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Accordion type="multiple" className="divide-y">
                    {filteredFaqs.map((faq, i) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3 text-left">
                            <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold mt-0.5">
                              {i + 1}
                            </span>
                            <span className="font-medium leading-relaxed">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="pl-10">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                            <span className="inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                              {faq.category}
                            </span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn&apos;t find any FAQs matching your search. Try a
                    different keyword or browse all categories.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveCategory('All')
                    }}
                    className="gap-2"
                  >
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </section>

        {/* ── Still Need Help CTA ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary to-emerald-600 border-0 overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

              <CardContent className="relative p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4 text-center md:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <HeadphonesIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      Still Need Help?
                    </h2>
                    <p className="text-white/80 max-w-md leading-relaxed">
                      Can&apos;t find what you&apos;re looking for? Our support
                      team is ready to assist you with any questions or concerns.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <Link href="/contact-us">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 gap-2 font-semibold shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Us
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  )
}
