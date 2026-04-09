'use client'

import { FileText, UserCheck, Ticket, Percent, Ban, ShieldCheck, AlertTriangle, Scale, RefreshCw, Mail, Phone, CreditCard, Users, Gavel, Handshake } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { LegalPageLayout, type TocItem, type RelatedPolicy } from '@/components/layout/legal-page-layout'
import { LegalSection, LegalCallout } from '@/components/layout/legal-section'

const tocItems: TocItem[] = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'user-accounts', title: '2. User Accounts & Registration' },
  { id: 'ticket-listings', title: '3. Ticket Listing Rules' },
  { id: 'buying-selling', title: '4. Buying & Selling Process' },
  { id: 'payments-fees', title: '5. Payments & Fees' },
  { id: 'prohibited', title: '6. Prohibited Activities' },
  { id: 'buyer-protection', title: '7. Buyer Protection' },
  { id: 'limitation', title: '8. Limitation of Liability' },
  { id: 'dispute-resolution', title: '9. Dispute Resolution' },
  { id: 'changes', title: '10. Modifications to Terms' },
  { id: 'contact', title: '11. Contact Us' },
]

const relatedPolicies: RelatedPolicy[] = [
  { title: 'Privacy Policy', href: '/privacy-policy', description: 'How we collect, use, and protect your data' },
  { title: 'Cookie Policy', href: '/cookie-policy', description: 'How we use cookies to enhance your experience' },
  { title: 'Refund Policy', href: '/refund-policy', description: 'Our refund eligibility and process details' },
  { title: 'Safety Guidelines', href: '/safety-guidelines', description: 'Tips for trading safely on our platform' },
]

export default function TermsOfServicePage() {
  return (
    <MainLayout>
      <LegalPageLayout
        title="Terms of Service"
        icon={FileText}
        description="Please read these Terms of Service carefully before using EidTicketResell. By accessing or using our platform, you agree to be bound by these terms, which govern your use of our ticket resale services in Bangladesh."
        lastUpdated="June 15, 2025"
        tocItems={tocItems}
        relatedPolicies={relatedPolicies}
      >
        <LegalSection id="acceptance" title="1. Acceptance of Terms" index={0} icon={<UserCheck className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            By accessing, registering, or using EidTicketResell (the &quot;Platform&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (&quot;Terms&quot;), along with our <a href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</a> and all applicable laws and regulations of the People&apos;s Republic of Bangladesh.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            If you do not agree with any part of these Terms, you must discontinue use of the Platform immediately. These Terms constitute a legally binding agreement between you (&quot;User,&quot; &quot;Buyer,&quot; or &quot;Seller&quot;) and EidTicketResell.
          </p>

          <LegalCallout type="info" title="Good to know">
            We update these Terms periodically. Continued use of the Platform after any changes means you accept the revised Terms. We recommend reviewing this page regularly.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="user-accounts" title="2. User Accounts & Registration" index={1} icon={<Users className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            To fully utilize our platform, you must create an account. Registration is free but requires:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Accurate Information:</strong> You must provide your real name, valid email address, and a working Bangladeshi phone number (bKash/Nagad enabled for sellers)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Age Requirement:</strong> You must be at least 18 years old to create an account
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Single Account:</strong> Each person may only maintain one active account
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">ID Verification (Sellers):</strong> To list tickets, sellers must complete identity verification using a National ID, Driving License, or Passport
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Account Security">
            You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately if you suspect unauthorized use of your account.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="ticket-listings" title="3. Ticket Listing Rules" index={2} icon={<Ticket className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            All ticket listings on EidTicketResell must comply with the following requirements:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Authenticity:</strong> All tickets must be genuine, valid, and legally obtained. Fake, duplicated, or expired tickets are strictly prohibited
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Accurate Details:</strong> Route, departure time, seat class, coach number, and fare must be accurately described in the listing
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Fair Pricing:</strong> The resale price must not exceed 150% of the original ticket face value unless otherwise permitted during Eid festival periods
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Exclusivity:</strong> A ticket must not be simultaneously listed on any other platform or sold to another buyer
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Clear Photos:</strong> Ticket images must be clear, legible, and not watermarked by other platforms
              </span>
            </li>
          </ul>

          <LegalCallout type="danger" title="Non-compliance">
            Listings that violate these rules will be removed without prior notice. Repeated violations may result in permanent account suspension and potential legal action.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="buying-selling" title="4. Buying & Selling Process" index={3} icon={<Handshake className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            EidTicketResell facilitates a secure marketplace for ticket transactions. Here is how the process works:
          </p>

          <h3 className="text-base font-semibold text-foreground mb-3">For Buyers</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Browse or search available tickets using filters (route, date, price, transport company)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Review ticket details, seller&apos;s verified status, and listing history before purchasing
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Complete payment through our secure payment system (bKash, Nagad, or bank transfer)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Receive the ticket from the seller. File a claim within 24 hours if there are issues
              </span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-3">For Sellers</h3>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Complete ID verification to unlock selling privileges
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Create a listing with accurate ticket details and clear photos
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Respond to buyer inquiries promptly and deliver the ticket upon payment confirmation
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Receive payment to your registered bKash/Nagad number or bank account
              </span>
            </li>
          </ul>
        </LegalSection>

        <LegalSection id="payments-fees" title="5. Payments & Fees" index={4} icon={<CreditCard className="w-5 h-5" />}>
          <LegalCallout type="info" title="Platform Fee Structure">
            EidTicketResell charges a <strong className="text-foreground">1% platform fee</strong> on all transactions, with a <strong className="text-foreground">minimum fee of ৳10 BDT</strong>. This fee is collected from the buyer at the time of purchase and covers payment processing, platform maintenance, and customer support.
          </LegalCallout>
          <ul className="space-y-2.5 mt-4 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Accepted Payment Methods:</strong> bKash, Nagad, Rocket, and bank transfers (DBBL, BRAC, City, Dutch-Bangla)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Seller Payouts:</strong> Released within 24 hours after confirmed ticket delivery. No additional fees for sellers
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Currency:</strong> All transactions are processed in Bangladeshi Taka (BDT/৳)
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Payment Security:</strong> All payments are processed through certified and encrypted payment gateways
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Important">
            Platform fees are non-refundable, even if a transaction is later refunded. Payment gateway charges may apply for failed transactions.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="prohibited" title="6. Prohibited Activities" index={5} icon={<Ban className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The following activities are strictly prohibited on EidTicketResell and will result in immediate account suspension or permanent ban:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Fraud:</strong> Listing fake, forged, or invalid tickets; using stolen payment methods; or impersonating other users
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Price Manipulation:</strong> Artificially inflating prices, colluding with other users, or creating fake demand
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Fee Circumvention:</strong> Attempting to complete transactions outside the platform to avoid platform fees
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Harassment:</strong> Abusive language, threats, discrimination, or intimidation of other users
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Multiple Accounts:</strong> Creating more than one account per person to manipulate listings or reviews
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Spam:</strong> Posting irrelevant listings, sending unsolicited messages, or misusing the review system
              </span>
            </li>
          </ul>

          <LegalCallout type="danger" title="Zero Tolerance Policy">
            Violations involving fraud or illegal activities will be reported to Bangladesh law enforcement authorities. EidTicketResell cooperates fully with all legal investigations.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="buyer-protection" title="7. Buyer Protection" index={6} icon={<ShieldCheck className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Our Buyer Protection program ensures you can shop with confidence. Buyers are protected against:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Invalid or Fake Tickets:</strong> Full refund if the ticket provided is counterfeit, expired, or does not match the listing description
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Seller Non-Delivery:</strong> Full refund if the seller fails to deliver the ticket within the agreed timeframe
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Significant Misrepresentation:</strong> Refund if the ticket details (route, class, timing) substantially differ from the listing
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Claim Deadline">
            All buyer protection claims must be filed within <strong className="text-foreground">24 hours</strong> of the transaction completion. Claims filed after this window will not be eligible for protection. Supporting evidence (screenshots, photos) must be provided.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="limitation" title="8. Limitation of Liability" index={7} icon={<AlertTriangle className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            EidTicketResell acts as an <strong className="text-foreground">intermediary marketplace</strong> connecting buyers and sellers. As such:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                We do not guarantee the quality, authenticity, or condition of tickets listed by third-party sellers
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                We are not responsible for the conduct, actions, or omissions of individual users
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Our total liability is limited to the platform fee collected for the specific transaction in question
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                We are not liable for indirect, incidental, or consequential damages arising from the use of our platform
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Important">
            To the maximum extent permitted by Bangladeshi law, EidTicketResell shall not be liable for any losses, damages, or expenses arising from transactions between users on our platform.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="dispute-resolution" title="9. Dispute Resolution" index={8} icon={<Gavel className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            In the event of a dispute between users or with EidTicketResell, the following resolution process applies:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Direct Communication:</strong> First, try to resolve the issue directly with the other party through our in-app messaging system
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">File a Dispute:</strong> If direct resolution fails, file a formal dispute through your transaction page within 24 hours
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Mediation:</strong> Our support team will review evidence from both parties and mediate a fair resolution within 48 hours
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </span>
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Legal Action:</strong> If mediation fails, either party may pursue legal remedies through the courts of Bangladesh
              </span>
            </li>
          </ul>

          <LegalCallout type="info" title="Governing Law">
            These Terms are governed by and construed in accordance with the laws of Bangladesh. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="changes" title="10. Modifications to Terms" index={9} icon={<RefreshCw className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            EidTicketResell reserves the right to modify these Terms of Service at any time. When changes are made:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                The &quot;Last Updated&quot; date will be revised, and a summary of changes will be posted
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Significant changes will be communicated via email and in-app notification at least 7 days before they take effect
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            If you disagree with any changes, you may terminate your account by contacting us before the changes take effect.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="11. Contact Us" index={10} icon={<Mail className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            For any questions or concerns about these Terms of Service, please contact our legal team:
          </p>
          <div className="bg-muted/50 rounded-xl p-5 space-y-2.5 border border-border/40">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Email:</strong> legal@eidticketresell.com
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Phone:</strong> +880 1234-567890
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Address:</strong> Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </LegalSection>
      </LegalPageLayout>
    </MainLayout>
  )
}
