'use client'

import { motion } from 'framer-motion'
import {
  UserPlus,
  Upload,
  ClipboardCheck,
  ShieldCheck,
  TicketCheck,
  Wallet,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'

/* ───────────── Step Data ───────────── */

const steps = [
  {
    icon: UserPlus,
    title: 'Register & Verify',
    description:
      'Create your account with email and phone verification. Sellers must complete ID verification (NID, Driving License, or Passport) for added trust.',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600',
  },
  {
    icon: Upload,
    title: 'List Your Ticket',
    description:
      'Upload your unused ticket with details — transport type, route, date, seat number, and selling price. Or browse existing listings if you\'re a buyer.',
    color: 'bg-sky-500',
    lightColor: 'bg-sky-500/10',
    textColor: 'text-sky-600',
  },
  {
    icon: ClipboardCheck,
    title: 'Admin Reviews & Approves',
    description:
      'Our team verifies every ticket listing for authenticity. Approved tickets appear on the marketplace; rejected ones get feedback for correction.',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-500/10',
    textColor: 'text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Buyer Pays Securely',
    description:
      'Buyers pay through secure channels — bKash, Nagad, SSLCommerz, or in-person. A small 1% platform fee (min \u09F310) keeps us running.',
    color: 'bg-violet-500',
    lightColor: 'bg-violet-500/10',
    textColor: 'text-violet-600',
  },
  {
    icon: TicketCheck,
    title: 'Ticket Delivered',
    description:
      'Digital tickets are delivered instantly. Physical tickets can be sent via courier (Pathao, Steadfast) or exchanged in person — your choice.',
    color: 'bg-rose-500',
    lightColor: 'bg-rose-500/10',
    textColor: 'text-rose-600',
  },
  {
    icon: Wallet,
    title: 'Seller Gets Paid',
    description:
      'Once the buyer confirms receipt, payment is released to the seller\'s ETR wallet. Withdraw anytime to your bKash, Nagad, or bank account.',
    color: 'bg-teal-500',
    lightColor: 'bg-teal-500/10',
    textColor: 'text-teal-600',
  },
]

/* ───────────── FAQ Data ───────────── */

const faqs = [
  {
    question: 'Is it safe to buy tickets on EidTicketResell?',
    answer:
      'Absolutely. All sellers must go through ID verification. Every listing is reviewed by our admin team before going live. Payments are held securely until the buyer confirms ticket receipt, so your money is protected at every step.',
  },
  {
    question: 'How much does it cost to sell a ticket?',
    answer:
      'Selling is almost free! We charge a tiny 1% platform fee (minimum \u09F310) per successful sale. This fee is automatically deducted from the payment before it reaches your wallet. No upfront costs, no hidden charges.',
  },
  {
    question: 'What happens if a ticket is rejected by admin?',
    answer:
      'If your listing is rejected, you\'ll receive a notification with the reason (e.g., blurry ticket image, unverifiable PNR). You can fix the issue and resubmit for review at no extra cost. Most rejections are resolved quickly.',
  },
  {
    question: 'How do I receive payment as a seller?',
    answer:
      'Payment is released to your ETR wallet after the buyer confirms receiving the ticket. From your wallet, you can withdraw to bKash, Nagad, Rocket, or bank account. Most withdrawals are processed within 24 hours.',
  },
]

/* ───────────── Animation Variants ───────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

/* ───────────── Page ───────────── */

export default function HowItWorksPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.08),transparent_50%)]" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                How It Works
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg lg:text-xl">
                Buy or sell tickets in 6 simple steps. Our platform ensures safe,
                transparent, and hassle-free transactions from start to finish.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Timeline Steps ── */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="relative"
          >
            {/* Vertical Line */}
            <div className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-violet-300 to-teal-300 hidden md:block" />
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-violet-300 to-teal-300 md:hidden" />

            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isEven = index % 2 === 0

                return (
                  <motion.div
                    key={step.title}
                    variants={fadeUp}
                    custom={index}
                    className="relative"
                  >
                    {/* Circle node on the line */}
                    <div
                      className={`absolute left-6 lg:left-1/2 -translate-x-1/2 z-10 hidden md:flex`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Card - alternating sides on desktop */}
                    <div
                      className={`md:w-[calc(50%-2.5rem)] ${
                        isEven
                          ? 'md:mr-auto md:pr-0'
                          : 'md:ml-auto md:pl-0'
                      } pl-16 md:pl-0`}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
                        <CardContent className="p-6">
                          {/* Mobile circle */}
                          <div className="md:hidden flex items-center gap-3 mb-4">
                            <div
                              className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-white flex-shrink-0`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.lightColor} ${step.textColor}`}
                            >
                              Step {index + 1}
                            </span>
                          </div>

                          {/* Desktop header */}
                          <div className="hidden md:flex items-center gap-3 mb-3">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${step.lightColor} ${step.textColor}`}
                            >
                              Step {index + 1}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* ── For Sellers CTA ── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary to-emerald-600 border-0">
              <CardContent className="p-8 lg:p-10 text-center text-white">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                  Ready to Sell Your Unused Tickets?
                </h2>
                <p className="opacity-90 max-w-xl mx-auto mb-6">
                  Have unused travel tickets? List them on EidTicketResell and help
                  fellow travelers while recovering your money. All sellers must
                  complete ID verification for buyer safety.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/find-tickets">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="gap-2 font-semibold"
                    >
                      Browse Tickets
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/sell-tickets">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold"
                    >
                      List a Ticket
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-gradient-to-b from-muted/40 to-background py-16">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mt-2">
                Quick answers to common questions about how ETR works.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Card>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="px-6"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
