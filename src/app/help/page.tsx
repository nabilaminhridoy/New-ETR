'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  HelpCircle,
  ShoppingCart,
  Tag,
  CreditCard,
  UserCheck,
  Shield,
  Wrench,
  Mail,
  Phone,
  MessageCircle,
  Search,
  Send,
  Loader2,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Headphones,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { MainLayout } from '@/components/layout/main-layout'

/* ───────────── Schema ───────────── */

const helpFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type HelpFormData = z.infer<typeof helpFormSchema>

/* ───────────── Data ───────────── */

const helpCategories = [
  {
    id: 'buying',
    title: 'Buying Tickets',
    icon: ShoppingCart,
    color: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500',
    questions: [
      'How do I search for available tickets?',
      'What payment methods are accepted?',
      'How do I receive my ticket after purchase?',
      'Can I cancel a purchase?',
    ],
  },
  {
    id: 'selling',
    title: 'Selling Tickets',
    icon: Tag,
    color: 'bg-sky-500',
    iconBg: 'bg-sky-500/10 group-hover:bg-sky-500',
    questions: [
      'How do I list a ticket for sale?',
      'What is the approval process?',
      'When will I receive payment?',
      'How is the platform fee calculated?',
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Wallet',
    icon: CreditCard,
    color: 'bg-violet-500',
    iconBg: 'bg-violet-500/10 group-hover:bg-violet-500',
    questions: [
      'How does the wallet system work?',
      'How do I withdraw my earnings?',
      'What payment gateways do you support?',
      'Is my payment information secure?',
    ],
  },
  {
    id: 'account',
    title: 'Account & Verification',
    icon: UserCheck,
    color: 'bg-amber-500',
    iconBg: 'bg-amber-500/10 group-hover:bg-amber-500',
    questions: [
      'How do I verify my account?',
      'How do I reset my password?',
      'How do I update my profile information?',
      'Can I delete my account?',
    ],
  },
  {
    id: 'safety',
    title: 'Safety & Security',
    icon: Shield,
    color: 'bg-rose-500',
    iconBg: 'bg-rose-500/10 group-hover:bg-rose-500',
    questions: [
      'How are sellers verified?',
      'What if I receive a fake ticket?',
      'How do I report a problem?',
      'What safety guidelines should I follow?',
    ],
  },
  {
    id: 'technical',
    title: 'Technical Issues',
    icon: Wrench,
    color: 'bg-slate-500',
    iconBg: 'bg-slate-500/10 group-hover:bg-slate-500',
    questions: [
      'The website is not loading properly',
      'I cannot complete my payment',
      'How do I enable browser notifications?',
      'My app keeps crashing',
    ],
  },
]

const contactOptions = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message and we will get back to you within 24 hours on business days.',
    value: 'support@eidticketresell.com',
    action: 'mailto:support@eidticketresell.com',
    actionLabel: 'Send Email',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our support team available Monday to Saturday, 9 AM to 9 PM.',
    value: '+880 1700-000000',
    action: 'tel:+8801700000000',
    actionLabel: 'Call Now',
    gradient: 'from-sky-500 to-sky-600',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support agents during business hours. Average response time under 5 minutes.',
    value: 'Available 9 AM – 9 PM',
    action: '#',
    actionLabel: 'Start Chat',
    gradient: 'from-violet-500 to-violet-600',
  },
]

const popularQuestions = [
  {
    question: 'How do I buy a ticket on ETR?',
    answer:
      'Browse available tickets on the Find Tickets page, select your desired ticket, review the details, and proceed to payment. Once payment is confirmed, you will receive your ticket details via email and in your dashboard.',
  },
  {
    question: 'What payment methods are available?',
    answer:
      'We support bKash, Nagad, SSLCommerz, and Upay for payments. You can also use your ETR wallet balance if you have sufficient funds. All transactions are secured with industry-standard encryption.',
  },
  {
    question: 'How do I list my ticket for sale?',
    answer:
      'Go to the Sell Tickets page, fill in the ticket details (transport type, route, date, seat, price), submit for admin review. Once approved, your ticket will be visible to all buyers. You need a verified account to sell tickets.',
  },
  {
    question: 'What happens after I purchase a ticket?',
    answer:
      'After successful payment, the ticket is marked as sold and you receive the ticket details (PNR, seat number, etc.) via email and in your purchases section. You can also contact the seller through the platform for any clarifications.',
  },
  {
    question: 'How is my money protected?',
    answer:
      'ETR uses an escrow-like system where payment is held securely until the transaction is confirmed. If there is any dispute, our support team will investigate and ensure fair resolution. Seller payment is released after the buyer confirms receipt.',
  },
]

/* ───────────── Animation Variants ───────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

/* ───────────── Page ───────────── */

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<HelpFormData>({
    resolver: zodResolver(helpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return helpCategories
    const q = searchQuery.toLowerCase()
    return helpCategories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.questions.some((question) => question.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const onSubmit = async (data: HelpFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast.success('Request Submitted!', {
      description: `Thank you ${data.name}, we'll respond within 24 hours.`,
    })
    form.reset()
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        {/* ── Emergency Banner ── */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-bounce-subtle" />
            <span className="font-medium">
              Need urgent help? Call us at{' '}
              <a
                href="tel:+8801700000000"
                className="underline underline-offset-2 font-bold hover:text-amber-100 transition-colors"
              >
                +880 1700-000000
              </a>
            </span>
          </div>
        </div>

        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
          <div className="absolute inset-0 hero-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.06),transparent_50%)]" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
                <HelpCircle className="w-4 h-4 mr-1.5" />
                Help Center
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                How Can We{' '}
                <span className="text-gradient">Help You?</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg lg:text-xl">
                Find answers to common questions, explore help topics, or reach
                out to our support team — we&apos;re here for you.
              </p>
            </motion.div>

            {/* ── Search Bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help topics, e.g. 'how to buy tickets'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-5 text-base rounded-2xl border-2 focus:border-primary/50 shadow-sm bg-background"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {filteredCategories.length} categor{filteredCategories.length === 1 ? 'y' : 'ies'} found
                  for &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Category Cards ── */}
        <section className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, i) => {
                const Icon = cat.icon
                return (
                  <motion.div key={cat.id} variants={fadeUp} custom={i}>
                    <Card className="h-full group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 card-hover-glow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                          >
                            <Icon
                              className={`w-5 h-5 transition-colors duration-300 text-muted-foreground group-hover:text-white`}
                            />
                          </div>
                          <CardTitle className="text-lg">{cat.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {cat.questions.map((q, qi) => (
                            <li
                              key={qi}
                              className="flex items-start gap-2 text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                              {q}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t">
                          <Link href="/faqs" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link">
                            View all questions
                            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 py-12 text-center">
                <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-lg">No topics found for your search.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try different keywords or browse all categories.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>
        </section>

        {/* ── Contact Options ── */}
        <section className="max-w-6xl mx-auto px-4 pb-12 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Contact Support</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose the most convenient way to reach our team
              </p>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6"
            >
              {contactOptions.map((option, i) => {
                const Icon = option.icon
                return (
                  <motion.div key={option.title} variants={fadeUp} custom={i}>
                    <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col items-center">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-4 shadow-lg`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
                          {option.description}
                        </p>
                        <p className="text-sm font-medium text-foreground mb-4">
                          {option.value}
                        </p>
                        <Link href={option.action}>
                          <Button variant="outline" size="sm" className="gap-1.5 group/btn">
                            {option.actionLabel}
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Popular Questions (FAQ Accordion) ── */}
        <section className="max-w-4xl mx-auto px-4 pb-12 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Popular Questions</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Quick answers to the most common inquiries
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {popularQuestions.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/faqs">
                    <Button variant="outline" className="gap-2 group/btn w-full sm:w-auto">
                      View All FAQs
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ── Contact Form ── */}
        <section className="max-w-3xl mx-auto px-4 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Submit a Request</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Can&apos;t find what you&apos;re looking for? Send us a message.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Full Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Email Address <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Subject */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Subject <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="How can we help?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Message <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your issue in detail..."
                              rows={5}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="btn-primary w-full sm:w-auto gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  )
}
