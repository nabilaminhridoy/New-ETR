'use client'

import { RotateCcw, CheckCircle2, ListOrdered, Clock, XCircle, PieChart, Mail, Phone, ShieldAlert, Ban } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { LegalPageLayout, type TocItem, type RelatedPolicy } from '@/components/layout/legal-page-layout'
import { LegalSection, LegalCallout } from '@/components/layout/legal-section'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const tocItems: TocItem[] = [
  { id: 'eligibility', title: '1. Eligibility for Refunds' },
  { id: 'refund-process', title: '2. Refund Request Process' },
  { id: 'refund-timeline', title: '3. Refund Timeline' },
  { id: 'non-refundable', title: '4. Non-Refundable Items' },
  { id: 'cancellation-policy', title: '5. Cancellation Policy' },
  { id: 'disputes-chargebacks', title: '6. Disputes & Chargebacks' },
  { id: 'contact-support', title: '7. Contact Support' },
]

const relatedPolicies: RelatedPolicy[] = [
  { title: 'Privacy Policy', href: '/privacy-policy', description: 'How we collect, use, and protect your data' },
  { title: 'Terms of Service', href: '/terms-of-service', description: 'Rules and guidelines for using our platform' },
  { title: 'Cookie Policy', href: '/cookie-policy', description: 'How we use cookies to enhance your experience' },
  { title: 'Safety Guidelines', href: '/safety-guidelines', description: 'Tips for trading safely on our platform' },
]

export default function RefundPolicyPage() {
  return (
    <MainLayout>
      <LegalPageLayout
        title="Refund Policy"
        icon={RotateCcw}
        description="Our refund policy is designed to be fair and transparent. Learn about refund eligibility, the request process, timelines, exceptions, and how we handle disputes on EidTicketResell."
        lastUpdated="June 15, 2025"
        tocItems={tocItems}
        relatedPolicies={relatedPolicies}
      >
        <LegalSection id="eligibility" title="1. Eligibility for Refunds" index={0} icon={<CheckCircle2 className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            At EidTicketResell, we stand behind the quality of transactions on our platform. Refunds are available under the following circumstances:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Invalid or Fake Tickets:</strong> The ticket provided by the seller is counterfeit, expired, already used, or does not exist in the transport company&apos;s system
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Seller Non-Delivery:</strong> The seller fails to deliver the ticket within 2 hours of payment confirmation
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Significant Misrepresentation:</strong> The ticket details (route, seat class, timing, coach number) substantially differ from the listing description
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Transport Company Cancellation:</strong> The bus/train/ferry service is officially canceled by the transport operator, and the ticket becomes unusable
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Duplicate Listings:</strong> The same ticket is sold to multiple buyers by the seller
              </span>
            </li>
          </ul>

          <LegalCallout type="info" title="Good to know">
            All refund requests require supporting evidence such as screenshots, ticket photos, or communication records with the seller. Clear evidence helps us process your refund faster.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="refund-process" title="2. Refund Request Process" index={1} icon={<ListOrdered className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            To request a refund, follow these simple steps:
          </p>
          <ol className="space-y-3 mb-4">
            {[
              'Log into your EidTicketResell account and navigate to "My Purchases"',
              'Select the specific transaction you wish to dispute and click "Request Refund"',
              'Select a refund reason from the available options and provide a detailed description',
              'Upload supporting evidence (ticket photos, screenshots, chat logs)',
              'Submit your request — our support team will acknowledge within 2 hours',
              'Our team will investigate and make a decision within 24–48 hours',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <LegalCallout type="warning" title="24-Hour Deadline">
            Refund claims <strong className="text-foreground">must be filed within 24 hours</strong> of the completed transaction. Late claims may not be accepted, except in extenuating circumstances where the buyer can provide compelling evidence.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="refund-timeline" title="3. Refund Timeline" index={2} icon={<Clock className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Once your refund is approved, the processing time depends on your original payment method. The table below outlines expected timelines:
          </p>

          <div className="rounded-xl border border-border/60 overflow-hidden mb-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Payment Method</TableHead>
                  <TableHead className="font-semibold text-foreground">Processing Time</TableHead>
                  <TableHead className="font-semibold text-foreground">Refund Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium">bKash</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                      1–3 business days
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">bKash wallet</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium">Nagad</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                      1–3 business days
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">Nagad wallet</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium">Rocket</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                      3–5 business days
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">Rocket wallet</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium">Bank Transfer</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                      5–7 business days
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">Original bank account</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium">ETR Wallet Balance</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                      Instant
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">Platform wallet</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <LegalCallout type="success" title="Refund Notifications">
            You will receive an email and in-app notification when your refund is approved, when processing begins, and when the funds are successfully credited to your account.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="non-refundable" title="4. Non-Refundable Items" index={3} icon={<XCircle className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Refunds are <strong className="text-foreground">not available</strong> in the following situations:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Change of Mind:</strong> The buyer decides not to travel or changes their travel plans after purchase
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Missed Departure:</strong> The buyer arrives late and misses the scheduled departure time
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Late Claims:</strong> Refund requests filed more than 24 hours after the transaction without valid extenuating circumstances
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Platform Fees:</strong> The 1% platform fee (minimum ৳10 BDT) is always non-refundable, regardless of the refund outcome
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Insufficient Evidence:</strong> Claims made without adequate supporting documentation or proof
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Verified Valid Tickets:</strong> Tickets that are verified as genuine and match the listing description
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Partial Refunds">
            In certain cases, a partial refund may be offered based on the circumstances and evidence provided. Partial refund decisions are made at the sole discretion of our support team and are final.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="cancellation-policy" title="5. Cancellation Policy" index={4} icon={<Ban className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Different rules apply depending on who initiates the cancellation:
          </p>

          <h3 className="text-base font-semibold text-foreground mb-3">Buyer Cancellation</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Before Payment:</strong> Buyers can cancel at no cost before payment is completed
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">After Payment, Before Delivery:</strong> Full refund minus the platform fee if the seller has not yet delivered the ticket
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">After Delivery:</strong> No refund unless the ticket is invalid or misrepresented (subject to standard refund review)
              </span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-3">Seller Cancellation</h3>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Before Payment:</strong> Sellers can cancel listings at no cost
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">After Payment:</strong> Full refund to buyer if seller cancels after receiving payment. Seller may receive a cancellation warning
              </span>
            </li>
          </ul>

          <LegalCallout type="danger" title="Repeated Cancellations">
            Sellers with a high cancellation rate may face listing restrictions, reduced visibility, or account suspension. We monitor cancellation patterns to ensure a reliable marketplace.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="disputes-chargebacks" title="6. Disputes & Chargebacks" index={5} icon={<ShieldAlert className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We encourage resolving issues through our built-in dispute resolution system before contacting payment providers directly:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Built-in Disputes:</strong> Use our dispute system first for faster resolution. Our team mediates and makes a decision within 48 hours
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Payment Provider Disputes:</strong> If you initiate a chargeback or dispute with bKash/Nagad/bank directly, we will cooperate with the investigation but the process may take significantly longer (15–30 days)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Evidence Requirements:</strong> Both parties must provide all relevant evidence. Withholding evidence may result in an unfavorable decision
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Important">
            Filing false or frivolous disputes is a violation of our Terms of Service and may result in account suspension. Our dispute decisions are based on the evidence provided and are considered final.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="contact-support" title="7. Contact Support" index={6} icon={<Mail className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Our dedicated support team is available to help you with any refund-related questions or concerns. Reach out to us through any of the following channels:
          </p>
          <div className="bg-muted/50 rounded-xl p-5 space-y-2.5 border border-border/40 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Email:</strong> refunds@eidticketresell.com
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Phone:</strong> +880 1234-567890 (9 AM – 9 PM BDT)
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">WhatsApp:</strong> +880 1234-567890
              </p>
            </div>
          </div>

          <LegalCallout type="info" title="Response Times">
            Email inquiries are typically responded to within <strong className="text-foreground">4 business hours</strong>. Phone support is available from 9 AM to 9 PM Bangladesh Standard Time, 7 days a week during Eid season.
          </LegalCallout>
        </LegalSection>
      </LegalPageLayout>
    </MainLayout>
  )
}
