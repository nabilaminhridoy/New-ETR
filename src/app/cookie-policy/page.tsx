'use client'

import { Cookie, HelpCircle, Settings, Monitor, Globe, Mail, Phone, RefreshCw, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { LegalPageLayout, type TocItem, type RelatedPolicy } from '@/components/layout/legal-page-layout'
import { LegalSection, LegalCallout } from '@/components/layout/legal-section'

const tocItems: TocItem[] = [
  { id: 'what-are-cookies', title: '1. What Are Cookies' },
  { id: 'types-of-cookies', title: '2. Types of Cookies' },
  { id: 'how-we-use', title: '3. How We Use Cookies' },
  { id: 'managing-cookies', title: '4. Managing Cookies' },
  { id: 'third-party-cookies', title: '5. Third-Party Cookies' },
  { id: 'updates', title: '6. Updates to This Policy' },
  { id: 'contact', title: '7. Contact Us' },
]

const relatedPolicies: RelatedPolicy[] = [
  { title: 'Privacy Policy', href: '/privacy-policy', description: 'How we collect, use, and protect your data' },
  { title: 'Terms of Service', href: '/terms-of-service', description: 'Rules and guidelines for using our platform' },
  { title: 'Refund Policy', href: '/refund-policy', description: 'Our refund eligibility and process details' },
  { title: 'Safety Guidelines', href: '/safety-guidelines', description: 'Tips for trading safely on our platform' },
]

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      <LegalPageLayout
        title="Cookie Policy"
        icon={Cookie}
        description="Learn about how EidTicketResell uses cookies and similar technologies to enhance your browsing experience, analyze platform traffic, and deliver personalized content."
        lastUpdated="June 15, 2025"
        tocItems={tocItems}
        relatedPolicies={relatedPolicies}
      >
        <LegalSection id="what-are-cookies" title="1. What Are Cookies" index={0} icon={<HelpCircle className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit our website. They serve as a form of digital memory, allowing the website to remember your actions and preferences over a period of time.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            On EidTicketResell, cookies help us provide a smoother, more personalized experience. They enable essential functionality like staying logged in, remembering your language preference, and ensuring secure transactions. Without cookies, many features of our platform would not work properly.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            In addition to cookies, we may use similar technologies such as <strong className="text-foreground">local storage</strong> and <strong className="text-foreground">pixel tags</strong> for similar purposes. This policy covers all such technologies collectively.
          </p>
        </LegalSection>

        <LegalSection id="types-of-cookies" title="2. Types of Cookies" index={1} icon={<Settings className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-5 leading-relaxed">
            We use several categories of cookies on EidTicketResell, each serving a specific purpose:
          </p>

          {/* Essential Cookies */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                Essential
              </Badge>
              <h3 className="text-base font-semibold text-foreground">Essential Cookies</h3>
            </div>
            <p className="text-muted-foreground mb-3 leading-relaxed">
              These cookies are strictly necessary for the website to function properly. They cannot be disabled without affecting core functionality:
            </p>
            <ul className="space-y-2.5 ml-1">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Session Authentication:</strong> Keeps you logged in as you navigate between pages
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">CSRF Protection:</strong> Prevents cross-site request forgery attacks for security
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Payment Processing:</strong> Ensures secure and reliable transaction processing
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Cookie Consent:</strong> Remembers your cookie preference settings
                </span>
              </li>
            </ul>
          </div>

          {/* Functional Cookies */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20">
                Functional
              </Badge>
              <h3 className="text-base font-semibold text-foreground">Functional Cookies</h3>
            </div>
            <p className="text-muted-foreground mb-3 leading-relaxed">
              These cookies remember your preferences and choices to provide a more personalized experience:
            </p>
            <ul className="space-y-2.5 ml-1">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Language Preference:</strong> Saves your selected language (Bangla/English)
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Theme Settings:</strong> Remembers light/dark mode preference
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Search Filters:</strong> Retains your last used search filters and route preferences
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Recently Viewed:</strong> Shows recently viewed tickets for quick access
                </span>
              </li>
            </ul>
          </div>

          {/* Analytics Cookies */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20">
                Analytics
              </Badge>
              <h3 className="text-base font-semibold text-foreground">Analytics Cookies</h3>
            </div>
            <p className="text-muted-foreground mb-3 leading-relaxed">
              These cookies help us understand how visitors interact with our platform, allowing us to improve performance:
            </p>
            <ul className="space-y-2.5 ml-1">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Page Views:</strong> Tracks which pages are most frequently visited
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">User Journey:</strong> Maps the typical paths users take through the platform
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Performance Metrics:</strong> Measures page load times and identifies technical issues
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Error Tracking:</strong> Captures JavaScript errors to fix bugs faster
                </span>
              </li>
            </ul>
          </div>
        </LegalSection>

        <LegalSection id="how-we-use" title="3. How We Use Cookies" index={2} icon={<Monitor className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            On EidTicketResell, cookies are used for the following specific purposes:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Account Security:</strong> Detect suspicious login patterns and prevent unauthorized access to your account
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Smooth Checkout:</strong> Remember items in your purchase flow and pre-fill payment preferences
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Targeted Improvements:</strong> Understand which features are popular and which need improvement based on usage patterns
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Eid Season Optimization:</strong> Analyze traffic patterns during peak travel seasons to scale our infrastructure
              </span>
            </li>
          </ul>

          <LegalCallout type="info" title="Good to know">
            We never use cookies to track your activity on other websites. Our cookies are limited to eidticketresell.com and its subdomains.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="managing-cookies" title="4. Managing Cookies" index={3} icon={<Settings className="w-5 h-5" />}>
          <LegalCallout type="warning" title="Important">
            Disabling essential cookies will prevent you from logging in, making purchases, or using core platform features. We strongly recommend keeping essential cookies enabled.
          </LegalCallout>
          <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
            You have several options for managing cookies on EidTicketResell:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Cookie Consent Banner:</strong> Use our cookie consent banner (shown on your first visit) to accept or reject non-essential cookies
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Browser Settings:</strong> Most browsers allow you to block, delete, or manage cookies through their settings menu
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Private Browsing:</strong> Use incognito/private mode to browse without persistent cookies
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Mobile Apps:</strong> Manage cookies in your device&apos;s app settings or browser settings
              </span>
            </li>
          </ul>

          <div className="bg-muted/50 rounded-xl p-4 border border-border/40">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Browser-Specific Instructions:</strong>
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>• <strong className="text-foreground">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li>• <strong className="text-foreground">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li>• <strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li>• <strong className="text-foreground">Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul>
          </div>
        </LegalSection>

        <LegalSection id="third-party-cookies" title="5. Third-Party Cookies" index={4} icon={<Globe className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            EidTicketResell integrates with the following trusted third-party services that may set their own cookies:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Payment Gateways:</strong> bKash, Nagad, and banking partners set cookies to facilitate secure payment processing during checkout
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Analytics Services:</strong> Privacy-focused analytics tools that help us understand platform usage without tracking personal information
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Social Media:</strong> Facebook and Google may set cookies if you access our platform through social media links or shared posts
              </span>
            </li>
          </ul>

          <LegalCallout type="info" title="Third-Party Policies">
            Each third-party service has its own cookie and privacy policy. We recommend reviewing their policies. Links to their policies are available on their respective websites. We only work with services that comply with Bangladeshi data protection requirements.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="updates" title="6. Updates to This Policy" index={5} icon={<RefreshCw className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in the cookies we use, new technologies, or regulatory requirements. Changes to this policy may include:
          </p>
          <ul className="space-y-2.5 mb-4">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Adding new types of cookies as we introduce new features
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Updating cookie descriptions or categories as technology evolves
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground leading-relaxed">
                Removing cookies that are no longer needed
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We will notify you of significant changes through our cookie consent banner and update the &quot;Last Updated&quot; date. We encourage you to check this page periodically for the latest information on our cookie practices.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="7. Contact Us" index={6} icon={<Mail className="w-5 h-5" />}>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
                <Phone className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Phone:</strong> +880 1234-567890
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </span>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Data Protection Officer:</strong> dpo@eidticketresell.com
              </p>
            </div>
          </div>
        </LegalSection>
      </LegalPageLayout>
    </MainLayout>
  )
}
