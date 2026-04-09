'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Send, Loader2, ArrowRight, MessageCircleQuestion } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { MainLayout } from '@/components/layout/main-layout'

/* ───────────── Schema ───────────── */

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

/* ───────────── Data ───────────── */

const contactCards = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@eidticketresell.com',
    description: 'We reply within 24 hours',
    color: 'bg-emerald-500',
    hoverColor: 'group-hover:bg-emerald-500',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+880 1700-000000',
    description: 'Mon–Sat, 9 AM – 9 PM',
    color: 'bg-sky-500',
    hoverColor: 'group-hover:bg-sky-500',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: 'Dhaka, Bangladesh',
    description: 'Visit our main office',
    color: 'bg-violet-500',
    hoverColor: 'group-hover:bg-violet-500',
  },
]

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'ticket', label: 'Ticket Issue' },
  { value: 'payment', label: 'Payment Problem' },
  { value: 'account', label: 'Account Issue' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
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
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

/* ───────────── Page ───────────── */

export default function ContactUsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast.success('Message Sent!', {
      description: `Thank you ${data.name}, we'll get back to you within 24 hours.`,
    })
    form.reset()
  }

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
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                Get in <span className="text-gradient">Touch</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg lg:text-xl">
                Have questions or need help? Our support team is here for you.
                Reach out and we&apos;ll respond within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Contact Info Cards ── */}
        <section className="max-w-5xl mx-auto px-4 -mt-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6"
          >
            {contactCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div key={card.title} variants={fadeUp} custom={i}>
                  <Card className="h-full group cursor-default hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div
                        className={`w-14 h-14 rounded-2xl ${card.color}/10 flex items-center justify-center mb-4 transition-colors duration-300 ${card.hoverColor}/15 group-hover:scale-110`}
                      >
                        <Icon
                          className={`w-6 h-6 text-muted-foreground transition-colors duration-300 ${card.hoverColor}/15 group-hover:text-white`}
                          style={{ color: undefined }}
                        />
                        <Icon className={`w-6 h-6 ${card.color} absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                      <p className="text-foreground font-medium text-sm mb-1">
                        {card.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* ── Contact Form ── */}
        <section className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 hidden lg:block"
            >
              <div className="sticky top-28">
                <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Fill out the form and our team will get back to you as soon as
                  possible. We typically respond within 24 hours on business days.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Email Us</p>
                      <p className="text-sm text-muted-foreground">
                        support@eidticketresell.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Call Us</p>
                      <p className="text-sm text-muted-foreground">
                        +880 1700-000000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Visit Us</p>
                      <p className="text-sm text-muted-foreground">
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <Card>
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6 lg:hidden">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Send className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Send us a message</h2>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll respond within 24 hours
                      </p>
                    </div>
                  </div>

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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Phone */}
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+880 1XXX-XXXXXX"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Subject */}
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Subject <span className="text-destructive">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjects.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                      {s.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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
                                placeholder="Tell us how we can help you..."
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
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ Preview ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircleQuestion className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Need Quick Answers?</h3>
                    <p className="text-sm text-muted-foreground">
                      Check our FAQs for instant help on common topics.
                    </p>
                  </div>
                </div>
                <Link href="/faqs">
                  <Button variant="outline" className="gap-2 group">
                    Browse FAQs
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  )
}
