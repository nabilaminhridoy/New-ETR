'use client'

import { ShieldCheck, User, Database, Share2, Lock, ShieldQuestion, Cookie, Globe2, Baby, RefreshCw, Mail, Clock } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { LegalPageLayout, type TocItem, type RelatedPolicy } from '@/components/layout/legal-page-layout'
import { LegalSection, LegalCallout } from '@/components/layout/legal-section'

const tocItems: TocItem[] = [
  { id: 'information-we-collect', title: '1. Information We Collect' },
  { id: 'how-we-use', title: '2. How We Use Your Information' },
  { id: 'information-sharing', title: '3. Information Sharing' },
  { id: 'data-security', title: '4. Data Security' },
  { id: 'cookies-tracking', title: '5. Cookies & Tracking' },
  { id: 'your-rights', title: '6. Your Rights' },
  { id: 'data-retention', title: '7. Data Retention' },
  { id: 'childrens-privacy', title: "8. Children's Privacy" },
  { id: 'changes', title: '9. Changes to This Policy' },
  { id: 'contact', title: '10. Contact Us' },
]

const relatedPolicies: RelatedPolicy[] = [
  { title: 'Terms of Service', href: '/terms-of-service', description: 'Rules and guidelines for using our platform' },
  { title: 'Cookie Policy', href: '/cookie-policy', description: 'How we use cookies to enhance your experience' },
  { title: 'Refund Policy', href: '/refund-policy', description: 'Our refund eligibility and process details' },
  { title: 'Safety Guidelines', href: '/safety-guidelines', description: 'Tips for trading safely on our platform' },
]

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <LegalPageLayout
        title="Privacy Policy"
        icon={ShieldCheck}
        description="We are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines how EidTicketResell collects, uses, and safeguards your data when you use our platform in Bangladesh."
        lastUpdated="June 15, 2025"
        tocItems={tocItems}
        relatedPolicies={relatedPolicies}
      >
        <LegalSection id="information-we-collect" title="1. Information We Collect" index={0} icon={<User className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            At EidTicketResell, we collect information to provide you with a safe and efficient ticket resale experience. The types of information we collect depend on how you use our platform:
          </p>

          <h3 className="text-base font-semibold text-foreground mb-3">Personal Information</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Account Information:</strong> Full name, email address, phone number, profile picture, and date of birth when you register an account
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">ID Verification:</strong> National ID (NID), Driving License, or Passport images required for seller verification in accordance with Bangladeshi regulations
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Payment Information:</strong> bKash/Nagad phone numbers, bank account details (for payouts), and transaction records. <em>Full card numbers are never stored on our servers.</em>
              </span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-3">Usage Data</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Transaction Data:</strong> Ticket purchases, sales history, offer amounts, and communication logs between buyers and sellers
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Device Information:</strong> IP address, browser type, operating system, device identifiers, and screen resolution
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Platform Activity:</strong> Pages visited, search queries, time spent on pages, and click patterns
              </span>
            </li>
          </ul>

          <LegalCallout type="info" title="Good to know">
            We only collect the minimum information necessary to provide our services. You can browse tickets without creating an account, but buying or selling requires registration.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="how-we-use" title="2. How We Use Your Information" index={1} icon={<Database className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We use the information we collect for the following purposes:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Service Delivery:</strong> Process ticket transactions, verify seller identities, facilitate secure payments through bKash, Nagad, and bank transfers, and deliver purchased tickets
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Communication:</strong> Send order confirmations, transaction updates, platform notifications, and respond to your support requests via email, SMS, or in-app messaging
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Platform Improvement:</strong> Analyze usage patterns to improve our services, fix bugs, and develop new features that better serve the Bangladeshi market
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Safety & Fraud Prevention:</strong> Detect and prevent fraudulent activities, verify user identities, enforce our terms of service, and comply with applicable Bangladeshi laws
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Marketing (with consent):</strong> Send promotional offers and newsletters only if you have opted in. You can unsubscribe at any time
              </span>
            </li>
          </ul>

          <LegalCallout type="success" title="Your data, your control">
            We will never sell your personal information to third parties for marketing purposes. Your data is used exclusively to serve you better and keep the platform safe.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="information-sharing" title="3. Information Sharing" index={2} icon={<Share2 className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We understand the importance of your privacy. We share your information only in the following limited circumstances:
          </p>

          <h3 className="text-base font-semibold text-foreground mb-3">With Other Users</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Transaction Counterparts:</strong> When you complete a transaction, limited contact details (name and phone number) are shared with the other party to facilitate ticket delivery
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Public Listings:</strong> Seller display names and verified badge status are visible on public ticket listings
              </span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-3">With Service Providers</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Payment Processors:</strong> bKash, Nagad, and banking partners to process payments and payouts
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Cloud & Analytics Providers:</strong> Secure hosting providers and analytics services to maintain and improve platform performance
              </span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-3">Legal Requirements</h3>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Law Enforcement:</strong> When required by Bangladeshi law, court order, or government regulation
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Dispute Resolution:</strong> To resolve disputes between users or investigate fraudulent activities
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Important">
            All third-party service providers are contractually obligated to protect your data and may only use it for the specific purposes we have authorized.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="data-security" title="4. Data Security" index={3} icon={<Lock className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Encryption:</strong> All data transmissions are encrypted using SSL/TLS (256-bit). Sensitive documents are encrypted at rest using AES-256
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Secure Infrastructure:</strong> Our servers are hosted in secure data centers with firewalls, intrusion detection systems, and 24/7 monitoring
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Access Controls:</strong> Role-based access with multi-factor authentication for our team. Only authorized personnel can access sensitive data
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Regular Audits:</strong> Periodic security audits and vulnerability assessments to identify and address potential risks
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Payment Security:</strong> All payment processing is handled through certified payment gateways. We never store your bKash/Nagad PIN or bank credentials
              </span>
            </li>
          </ul>

          <LegalCallout type="info" title="Good to know">
            While we take comprehensive security measures, no system is 100% secure. We recommend using strong, unique passwords and enabling two-factor authentication for your account.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="cookies-tracking" title="5. Cookies & Tracking" index={4} icon={<Cookie className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience on EidTicketResell. Cookies are small text files stored on your device that help us:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Essential Functions:</strong> Keep you logged in, remember your preferences, and maintain shopping cart data
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Analytics:</strong> Understand how users navigate our platform and identify areas for improvement
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Performance:</strong> Monitor site speed and reliability to ensure a smooth experience
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            You can manage your cookie preferences at any time through your browser settings or our cookie consent banner. For a detailed breakdown of all cookies we use, please visit our{' '}
            <a href="/cookie-policy" className="text-primary hover:underline font-medium">Cookie Policy</a>.
          </p>
        </LegalSection>

        <LegalSection id="your-rights" title="6. Your Rights" index={5} icon={<ShieldQuestion className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Under Bangladeshi law and our commitment to user privacy, you have the following rights regarding your personal data:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Right to Access:</strong> You can request a copy of all personal data we hold about you at any time
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Right to Correction:</strong> You can update or correct inaccurate personal information through your account settings or by contacting support
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Right to Deletion:</strong> You can request deletion of your personal data, subject to legal retention requirements. Accounts with pending transactions must be resolved first
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Right to Portability:</strong> You can request your data in a structured, machine-readable format
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Right to Opt-Out:</strong> You can opt out of marketing communications at any time using the unsubscribe link in our emails
              </span>
            </li>
          </ul>

          <LegalCallout type="success" title="How to exercise your rights">
            To exercise any of these rights, email us at <strong className="text-foreground">privacy@eidticketresell.com</strong> or use the Data Request form in your account settings. We respond to all requests within 30 days.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="data-retention" title="7. Data Retention" index={6} icon={<Clock className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Active Accounts:</strong> Personal data is retained for as long as your account is active
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Transaction Records:</strong> Kept for a minimum of 5 years for legal and tax compliance under Bangladeshi law
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">ID Verification Documents:</strong> Stored securely until account deletion or 5 years after your last transaction, whichever is longer
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Closed Accounts:</strong> Data is anonymized or deleted within 90 days of account closure, except where legal retention is required
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="Important">
            Certain data may need to be retained longer to comply with Bangladeshi financial regulations, resolve disputes, or enforce our terms of service.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="childrens-privacy" title="8. Children's Privacy" index={7} icon={<Baby className="w-5 h-5" />}>
          <LegalCallout type="danger" title="Age Requirement">
            Our platform is strictly for users aged 18 and above. We do not knowingly collect personal information from individuals under 18 years of age.
          </LegalCallout>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            EidTicketResell is designed exclusively for adults. By using our platform, you represent that you are at least 18 years old. We do not target minors, and we do not collect personal information from children under any circumstances. If we discover that we have inadvertently collected data from a person under 18, we will take immediate steps to delete that information from our servers.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at{' '}
            <strong className="text-foreground">privacy@eidticketresell.com</strong> and we will take appropriate action.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="9. Changes to This Policy" index={8} icon={<RefreshCw className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make changes:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                The &quot;Last Updated&quot; date at the top of this page will be revised
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                We will notify you via email for significant changes that affect your rights
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                A prominent in-platform notification will be displayed when you next log in
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We encourage you to review this policy periodically. Your continued use of EidTicketResell after any changes constitutes acceptance of the updated policy.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="10. Contact Us" index={9} icon={<Mail className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact our Data Protection Officer:
          </p>
          <div className="bg-muted/50 rounded-xl p-5 space-y-2.5 border border-border/40">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Email:</strong> privacy@eidticketresell.com
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Phone:</strong> +880 1234-567890
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Address:</strong> Dhaka, Bangladesh
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 leading-relaxed text-sm">
            We aim to respond to all privacy-related inquiries within <strong className="text-foreground">30 business days</strong>.
          </p>
        </LegalSection>
      </LegalPageLayout>
    </MainLayout>
  )
}
