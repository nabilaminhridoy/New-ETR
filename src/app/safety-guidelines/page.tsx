'use client'

import { Shield, ShieldCheck, AlertTriangle, Lock, Users, FileCheck, Mail, Phone, CreditCard, Bug, Eye, KeyRound, PhoneCall } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { LegalPageLayout, type TocItem, type RelatedPolicy } from '@/components/layout/legal-page-layout'
import { LegalSection, LegalCallout } from '@/components/layout/legal-section'
import { cn } from '@/lib/utils'

const tocItems: TocItem[] = [
  { id: 'safety-features', title: '1. Our Safety Features' },
  { id: 'buyer-tips', title: '2. Safety Tips for Buyers' },
  { id: 'seller-tips', title: '3. Safety Tips for Sellers' },
  { id: 'payment-safety', title: '4. Payment Safety Tips' },
  { id: 'avoiding-scams', title: '5. Avoiding Scams' },
  { id: 'reporting', title: '6. Reporting Suspicious Activity' },
  { id: 'account-security', title: '7. Account Security' },
  { id: 'emergency-contacts', title: '8. Emergency Contacts' },
]

const relatedPolicies: RelatedPolicy[] = [
  { title: 'Privacy Policy', href: '/privacy-policy', description: 'How we collect, use, and protect your data' },
  { title: 'Terms of Service', href: '/terms-of-service', description: 'Rules and guidelines for using our platform' },
  { title: 'Cookie Policy', href: '/cookie-policy', description: 'How we use cookies to enhance your experience' },
  { title: 'Refund Policy', href: '/refund-policy', description: 'Our refund eligibility and process details' },
]

const safetyFeatures = [
  {
    icon: Shield,
    title: 'ID Verified Sellers',
    description: 'All sellers are verified with NID, Driving License, or Passport before they can list tickets on our platform.',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Multiple payment options (bKash, Nagad, bank) with encrypted transactions. Your financial info is always protected.',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    icon: Users,
    title: 'Buyer Protection',
    description: 'Full refund guaranteed if the ticket is invalid, fake, or the seller fails to deliver within the promised timeframe.',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    icon: FileCheck,
    title: 'Ticket Verification',
    description: 'Our support team reviews reported tickets, verifies authenticity with transport companies, and removes fake listings.',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
]

export default function SafetyGuidelinesPage() {
  return (
    <MainLayout>
      <LegalPageLayout
        title="Safety Guidelines"
        icon={ShieldCheck}
        description="We prioritize your safety with multiple layers of protection. Learn how to trade safely on EidTicketResell, protect your payments, avoid scams, and what to do if something goes wrong."
        lastUpdated="June 15, 2025"
        tocItems={tocItems}
        relatedPolicies={relatedPolicies}
      >
        <LegalSection id="safety-features" title="1. Our Safety Features" index={0} icon={<Shield className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-5 leading-relaxed">
            We&apos;ve built multiple layers of protection into EidTicketResell to keep you safe during every transaction:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safetyFeatures.map((feature) => {
              const FeatureIcon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={cn(
                    'flex items-start gap-3.5 p-4 rounded-xl bg-muted/50 border border-border/40 transition-all duration-200 hover:border-primary/20 hover:shadow-sm'
                  )}
                >
                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                    feature.color
                  )}>
                    <FeatureIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </LegalSection>

        <LegalSection id="buyer-tips" title="2. Safety Tips for Buyers" index={1} icon={<Users className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Follow these essential tips to ensure a safe and successful ticket purchase:
          </p>
          <ul className="space-y-3 mb-4">
            {[
              'Always verify the seller has a verified badge (green checkmark) before purchasing',
              'Check the ticket details carefully — route, date, time, seat class, and coach number should match the listing',
              'Compare the ticket price with the original fare. Be cautious of prices that seem too good to be true',
              'For in-person ticket exchanges, meet in a safe, public location with witnesses present',
              'Keep all transaction records, screenshots, and communication logs until the journey is completed',
              'Report any suspicious activity immediately — do not wait until after the journey',
              'Never share your bKash/Nagad PIN, OTP, or full card number with anyone',
              'Use the platform\'s built-in messaging system for all communication — never move to WhatsApp or SMS',
              'Verify the PNR number or booking reference with the transport company (e.g., Shohoz, Hanif, TR) if possible',
              'Check the seller\'s rating and review history before making a purchase',
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>

          <LegalCallout type="success" title="Verified Seller Advantage">
            Buyers are <strong className="text-foreground">3x less likely</strong> to encounter issues when purchasing from verified sellers with good ratings. Always prioritize verified sellers.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="seller-tips" title="3. Safety Tips for Sellers" index={2} icon={<FileCheck className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            If you&apos;re selling tickets on EidTicketResell, follow these guidelines for a safe and successful experience:
          </p>
          <ul className="space-y-3 mb-4">
            {[
              'Only list tickets you legally own — selling someone else\'s ticket without permission is prohibited',
              'Provide accurate and complete ticket information — include clear, unedited photos of the ticket',
              'Respond promptly to buyer inquiries — fast responses build trust and lead to quicker sales',
              'Deliver tickets as soon as payment is confirmed — our system tracks delivery time for buyer protection',
              'Keep proof of ticket ownership and delivery (screenshots, chat logs) for at least 30 days',
              'Set a fair resale price — excessive markups damage the community and may result in listing removal',
              'Do not share the actual ticket until payment has been fully confirmed on the platform',
              'Report buyers who attempt to pay outside the platform — direct payment requests may be scams',
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection id="payment-safety" title="4. Payment Safety Tips" index={3} icon={<CreditCard className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Protecting your money is just as important as getting a valid ticket. Follow these payment safety guidelines:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Always Pay Through the Platform:</strong> Never pay directly to a seller&apos;s bKash/Nagad number or bank account. All payments through EidTicketResell are protected by our Buyer Protection program
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Never Share OTPs or PINs:</strong> EidTicketResell will never ask for your bKash/Nagad PIN, OTP, or card CVV. If someone asks for these, it&apos;s a scam
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Verify Payment Requests:</strong> If you receive a suspicious payment link, check the URL carefully — it should start with eidticketresell.com
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Check Transaction Confirmations:</strong> Always wait for official payment confirmation on the platform before proceeding
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Enable Notifications:</strong> Turn on transaction notifications for your bKash/Nagad to catch unauthorized transactions immediately
              </span>
            </li>
          </ul>

          <LegalCallout type="danger" title="Red Flag — Direct Payment Request">
            If a seller asks you to send money directly to their personal number instead of using the platform, <strong className="text-foreground">this is almost certainly a scam</strong>. Report them immediately.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="avoiding-scams" title="5. Avoiding Scams" index={4} icon={<Bug className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Be aware of these common scams targeting ticket buyers and sellers in Bangladesh:
          </p>

          <h3 className="text-base font-semibold text-foreground mb-3">Common Scam Types</h3>
          <ul className="space-y-2.5 mb-5">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Fake Ticket Scam:</strong> Seller provides a doctored or edited ticket image. The PNR number doesn&apos;t match any real booking
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Duplicate Sale:</strong> Seller sells the same ticket to multiple buyers. Only the first person gets the valid ticket
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Advance Fee Scam:</strong> Seller asks for partial payment outside the platform as a &quot;deposit&quot; and disappears
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Phishing:</strong> Fake emails or messages pretending to be EidTicketResell asking for login credentials or payment info
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Impersonation:</strong> Someone creates a fake profile using another person&apos;s name and ID verification documents
              </span>
            </li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mb-3">How to Spot a Scam</h3>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Too Cheap:</strong> Price significantly below market value is a major red flag
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Urgency Pressure:</strong> Scammers create false urgency (&quot;only 5 minutes left&quot;) to rush you into paying without verifying
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">No Verified Badge:</strong> Unverified sellers have not confirmed their identity with us
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Refuses Platform Payment:</strong> Insists on direct bKash/Nagad transfer instead of using our secure payment system
              </span>
            </li>
          </ul>

          <LegalCallout type="warning" title="When in Doubt">
            If something feels off about a listing or a seller, trust your instincts. It&apos;s better to miss a deal than to lose your money. Report suspicious listings to our support team immediately.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="reporting" title="6. Reporting Suspicious Activity" index={5} icon={<Eye className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            If you encounter any suspicious behavior or fraudulent activity, reporting it helps protect the entire community. You can report:
          </p>
          <ul className="space-y-3 mb-4">
            {[
              'Fake or invalid tickets that don\'t match the listing description',
              'Sellers who don\'t respond after receiving payment',
              'Tickets that are already used, canceled, or don\'t exist in the transport system',
              'Users who attempt to move transactions outside the platform',
              'Suspicious seller profiles — no verified badge, new account, unusual behavior',
              'Phishing attempts — fake emails, messages, or websites impersonating EidTicketResell',
              'Any other safety concerns or potential fraud',
            ].map((reason, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
                <span className="text-muted-foreground leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>

          <div className="bg-muted/50 rounded-xl p-4 border border-border/40 mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">How to File a Report:</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>Go to the specific ticket listing page or transaction page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>Click the &quot;Report&quot; button (flag icon)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Select the reason and provide a detailed description with evidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <span>Submit — our team will review within 24-48 hours</span>
              </li>
            </ol>
          </div>

          <LegalCallout type="success" title="Confidential Reporting">
            All reports are treated confidentially. The reported user will not know who filed the report. We take every report seriously and investigate thoroughly.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="account-security" title="7. Account Security" index={6} icon={<KeyRound className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Protecting your EidTicketResell account is crucial. Follow these best practices:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Strong Password:</strong> Use a unique, strong password (at least 8 characters with uppercase, lowercase, numbers, and symbols). Don&apos;t reuse passwords from other accounts
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Two-Factor Authentication (2FA):</strong> Enable 2FA on your account for an extra layer of security
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Secure Device:</strong> Don&apos;t log in from shared or public computers. Always log out after using a shared device
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Keep App Updated:</strong> Always use the latest version of our app or website for the most up-to-date security features
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Monitor Activity:</strong> Regularly check your transaction history and account activity for anything unusual
              </span>
            </li>
          </ul>

          <LegalCallout type="danger" title="Account Compromised?">
            If you suspect your account has been compromised, change your password immediately and contact us at <strong className="text-foreground">security@eidticketresell.com</strong>. We will secure your account and investigate any unauthorized activity.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="emergency-contacts" title="8. Emergency Contacts" index={7} icon={<PhoneCall className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            In case of emergencies, fraud, or urgent safety concerns, reach out through any of these channels:
          </p>
          <div className="bg-muted/50 rounded-xl p-5 space-y-3 border border-border/40 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Email:</strong> safety@eidticketresell.com
                </p>
                <p className="text-xs text-muted-foreground">General safety inquiries</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-red-600" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Urgent:</strong> emergency@eidticketresell.com
                </p>
                <p className="text-xs text-muted-foreground">For active fraud or immediate threats</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Phone:</strong> +880 1234-567890
                </p>
                <p className="text-xs text-muted-foreground">9 AM – 9 PM BDT (extended hours during Eid)</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Bangladesh Emergency Services</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">National Emergency Service:</strong> 999</li>
              <li>• <strong className="text-foreground">Cyber Crime Complain:</strong> +880 1320-010148</li>
              <li>• <strong className="text-foreground">CID Control Room:</strong> +880 1320-019998</li>
              <li>• <strong className="text-foreground">Online GD App:</strong> <a href="https://play.google.com/store/apps/details?id=com.opus_bd.lostandfound" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download on Google Play</a></li>
            </ul>
          </div>
        </LegalSection>
      </LegalPageLayout>
    </MainLayout>
  )
}
