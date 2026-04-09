'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import {
  Users,
  Target,
  Heart,
  Shield,
  MapPin,
  Ticket,
  Star,
  TrendingUp,
  Eye,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Briefcase,
  Code2,
  Palette,
  Zap,
  ArrowRight,
  Send,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'

/* ───────────── Data ───────────── */

const stats = [
  { value: 10000, suffix: '+', label: 'Happy Travelers', icon: Users },
  { value: 5000, suffix: '+', label: 'Tickets Sold', icon: Ticket },
  { value: 64, suffix: '', label: 'Cities Covered', icon: MapPin },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
]

const impactStats = [
  { value: 15000, suffix: '+', label: 'Tickets Resold', icon: Ticket, color: 'from-emerald-500 to-teal-500' },
  { value: 12000, suffix: '+', label: 'Happy Buyers', icon: Users, color: 'from-sky-500 to-blue-500' },
  { value: 64, suffix: '', label: 'Cities Covered', icon: MapPin, color: 'from-violet-500 to-purple-500' },
  { value: 2500000, suffix: '+', label: 'Money Saved', prefix: '৳', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
]

const techStack = [
  { name: 'Next.js', description: 'Full-stack React framework for production', color: 'from-gray-900 to-black dark:from-gray-100 dark:to-white', textColor: 'text-white dark:text-gray-900' },
  { name: 'React', description: 'Component-based UI library', color: 'from-sky-400 to-sky-600', textColor: 'text-white' },
  { name: 'Prisma', description: 'Next-generation ORM for databases', color: 'from-indigo-500 to-violet-600', textColor: 'text-white' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', color: 'from-cyan-400 to-teal-500', textColor: 'text-white' },
  { name: 'Node.js', description: 'JavaScript runtime for the backend', color: 'from-green-500 to-emerald-600', textColor: 'text-white' },
  { name: 'PostgreSQL', description: 'Advanced open-source database', color: 'from-blue-600 to-blue-800', textColor: 'text-white' },
]

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description:
      'We prioritize secure transactions and verify all sellers to protect our users.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'Built by Bangladeshis for Bangladeshis, understanding local travel needs.',
  },
  {
    icon: Heart,
    title: 'Helping Hand',
    description:
      'Helping travelers recover costs while helping others reach home for Eid.',
  },
  {
    icon: Target,
    title: 'Simple & Fair',
    description:
      'Just 1% platform fee (min \u09F310). No hidden charges, no surprises.',
  },
]

const team = [
  {
    name: 'Nabil Amin',
    role: 'Founder & CEO',
    initials: 'NA',
    color: 'bg-emerald-500',
    bio: 'Passionate about solving real problems for Bangladeshi travelers. Nabil envisioned ETR to bring transparency to ticket reselling.',
    socials: { linkedin: '#', twitter: '#', email: 'nabil@eidticketresell.com' },
  },
  {
    name: 'Fahim Rahman',
    role: 'Chief Technology Officer',
    initials: 'FR',
    color: 'bg-sky-500',
    bio: 'Full-stack engineer with 8+ years of experience. Fahim leads the platform architecture and ensures a seamless user experience.',
    socials: { linkedin: '#', twitter: '#', email: 'fahim@eidticketresell.com' },
  },
  {
    name: 'Tasnia Akter',
    role: 'Head of Operations',
    initials: 'TA',
    color: 'bg-violet-500',
    bio: 'Operations expert specializing in marketplace logistics. Tasnia ensures every transaction is smooth and every user is supported.',
    socials: { linkedin: '#', twitter: '#', email: 'tasnia@eidticketresell.com' },
  },
  {
    name: 'Rafiq Hasan',
    role: 'Customer Experience Lead',
    initials: 'RH',
    color: 'bg-amber-500',
    bio: 'Dedicated to user satisfaction, Rafiq leads our 24/7 support team and continuously improves the platform based on feedback.',
    socials: { linkedin: '#', twitter: '#', email: 'rafiq@eidticketresell.com' },
  },
]

const openPositions = [
  { title: 'Frontend Developer', type: 'Full-time', location: 'Dhaka, Bangladesh' },
  { title: 'Backend Developer', type: 'Full-time', location: 'Remote' },
  { title: 'UI/UX Designer', type: 'Full-time', location: 'Dhaka, Bangladesh' },
]

/* ───────────── Animated Counter ───────────── */

function AnimatedCounter({
  target,
  suffix,
  prefix = '',
}: {
  target: number
  suffix: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return num.toLocaleString()
    }
    return num.toString()
  }

  return (
    <div ref={ref} className="text-3xl lg:text-4xl font-bold text-primary">
      {prefix}{formatNumber(count)}{suffix}
    </div>
  )
}

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
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

/* ───────────── Page ───────────── */

export default function AboutUsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
          <div className="absolute inset-0 hero-pattern opacity-30" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-gradient">
                About EidTicketResell
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg lg:text-xl">
                Bangladesh&apos;s most trusted platform for buying and selling unused
                Eid travel tickets.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Mission & Vision ── */}
        <section className="max-w-5xl mx-auto px-4 -mt-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Card className="h-full border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Every Eid, thousands of travelers in Bangladesh buy tickets in
                    advance, only to have their plans change. These tickets often go to
                    waste, and the money is lost. We created EidTicketResell to solve
                    this problem by connecting ticket sellers with buyers who need
                    them, all in a safe and verified environment.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Card className="h-full border-l-4 border-l-sky-500 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-sky-600" />
                    </div>
                    <h2 className="text-xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the go-to marketplace for all ticket reselling needs in
                    Bangladesh — not just for Eid, but year-round. We envision a
                    future where no travel ticket goes to waste, and every traveler
                    has a fair chance to reach their destination.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Stats ── */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div key={stat.label} variants={fadeUp} custom={i}>
                  <Card className="text-center hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      <p className="text-sm text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* ── Our Impact ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.06),transparent_60%)]" />
          <div className="relative max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-3 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                Our Impact
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
                Making a Difference
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Numbers that reflect our commitment to serving Bangladeshi travelers.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {impactStats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div key={stat.label} variants={fadeUp} custom={i}>
                    <Card className="text-center overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative">
                      {/* Gradient top bar */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${stat.color}`} />
                      <CardContent className="p-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <AnimatedCounter
                          target={stat.value}
                          suffix={stat.suffix}
                          prefix={stat.prefix}
                        />
                        <p className="text-sm text-muted-foreground mt-1 font-medium">
                          {stat.label}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Technology Stack ── */}
        <section className="max-w-5xl mx-auto px-4 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-3 px-4 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20">
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Built With
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              Our Technology Stack
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              We use modern, reliable technologies to deliver a fast and secure experience.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
          >
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="h-full text-center overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-border/60">
                  <CardContent className="p-6 lg:p-8 flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                      <Code2 className={`w-7 h-7 ${tech.textColor}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Values ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gradient">Our Values</h2>
            <p className="text-muted-foreground mt-2">
              The principles that guide everything we do.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div key={value.title} variants={fadeUp} custom={i}>
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{value.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* ── Team ── */}
        <section className="bg-gradient-to-b from-muted/40 to-background py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gradient">Meet Our Team</h2>
              <p className="text-muted-foreground mt-2">
                The passionate people behind EidTicketResell.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{
                    y: -8,
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                >
                  <Card className="h-full text-center transition-all duration-300 group hover:shadow-xl border-border/60">
                    <CardContent className="p-6 flex flex-col items-center">
                      {/* Avatar */}
                      <div
                        className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-background shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}
                      >
                        {member.initials}
                      </div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {member.bio}
                      </p>
                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-3 w-full">
                        <a
                          href={member.socials.linkedin}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors border border-primary/10"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          LinkedIn
                        </a>
                        <a
                          href={`mailto:${member.socials.email}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors border border-border"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Email
                        </a>
                      </div>
                      {/* Social Icons */}
                      <div className="flex gap-2">
                        <a
                          href={member.socials.linkedin}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={member.socials.twitter}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white transition-colors"
                          aria-label={`${member.name} Twitter`}
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
              <CardContent className="p-8 lg:p-10 relative">
                <h2 className="text-2xl font-bold mb-6 text-gradient">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    EidTicketResell was born from a simple observation: every Eid
                    season, social media is flooded with people trying to sell their
                    unused bus, train, and launch tickets. The process was chaotic,
                    unorganized, and risky for both buyers and sellers.
                  </p>
                  <p>
                    We saw an opportunity to create a dedicated platform that brings
                    trust, verification, and ease to this process. With mandatory ID
                    verification for sellers, secure payment options, and a transparent
                    platform fee structure, we&apos;ve built a solution that works for
                    everyone.
                  </p>
                  <p>
                    Today, EidTicketResell has helped thousands of travelers across
                    Bangladesh save money and reach their loved ones during the most
                    important festival of the year. From buses to trains, launches to
                    flights — we cover it all.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ── Join Our Team ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-primary via-emerald-600 to-teal-600 border-0 overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/3 rounded-full blur-2xl" />

              <CardContent className="p-8 lg:p-12 relative">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  {/* Left side: CTA */}
                  <div className="flex-1 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/25">
                        <Zap className="w-3.5 h-3.5 mr-1" />
                        We&apos;re Hiring!
                      </Badge>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                      Join Our Team
                    </h2>
                    <p className="text-white/85 text-sm lg:text-base leading-relaxed mb-6 max-w-lg">
                      We&apos;re looking for talented individuals who are passionate about
                      building great products and making a real impact in Bangladesh.
                      Be part of our growing team!
                    </p>
                    <a href="/contact-us">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all">
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>

                  {/* Right side: Open positions */}
                  <div className="flex-1">
                    <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">
                      Open Positions
                    </p>
                    <div className="space-y-3">
                      {openPositions.map((position, i) => (
                        <motion.div
                          key={position.title}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors border border-white/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-white">{position.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-white/60 text-xs flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {position.type}
                                </span>
                                <span className="text-white/60 text-xs flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {position.location}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                              onClick={() => window.location.href = '/contact-us'}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ── Growth Banner ── */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary to-emerald-600 border-0 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-8 lg:p-10 text-center text-white relative">
                <TrendingUp className="w-10 h-10 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                  Growing Every Day
                </h2>
                <p className="opacity-90 max-w-xl mx-auto mb-6">
                  We&apos;re constantly improving. New features, better security, and
                  expanded transport options are on the way. Join thousands who
                  already trust ETR for their travel needs.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="/find-tickets">
                    <button className="px-6 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
                      Find Tickets
                    </button>
                  </a>
                  <a href="/sell-tickets">
                    <button className="px-6 py-2.5 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                      Sell Tickets
                    </button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  )
}
