'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Shield, Key, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface RecaptchaProvider {
  enabled: boolean
  siteKey: string
  secretKey: string
  minScore?: string // For reCAPTCHA V3
}

interface RecaptchaSettings {
  recaptchaV2: RecaptchaProvider
  recaptchaV3: RecaptchaProvider
  cloudflare: RecaptchaProvider
  hcaptcha: RecaptchaProvider
}

const defaultSettings: RecaptchaSettings = {
  recaptchaV2: {
    enabled: false,
    siteKey: '',
    secretKey: '',
  },
  recaptchaV3: {
    enabled: false,
    siteKey: '',
    secretKey: '',
    minScore: '0.5',
  },
  cloudflare: {
    enabled: false,
    siteKey: '',
    secretKey: '',
  },
  hcaptcha: {
    enabled: false,
    siteKey: '',
    secretKey: '',
  },
}

export default function RecaptchaSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [settings, setSettings] = useState<RecaptchaSettings>(defaultSettings)
  const [showSecrets, setShowSecrets] = useState({
    recaptchaV2: false,
    recaptchaV3: false,
    cloudflare: false,
    hcaptcha: false,
  })

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/recaptcha-settings')
        if (response.ok) {
          const data = await response.json()
          setSettings({ ...defaultSettings, ...data.settings })
        }
      } catch (error) {
        console.error('Error fetching reCAPTCHA settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to load reCAPTCHA settings',
          variant: 'destructive',
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/recaptcha-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'reCAPTCHA settings have been updated successfully.',
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving reCAPTCHA settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save reCAPTCHA settings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProvider = (provider: keyof RecaptchaSettings, field: string, value: any) => {
    setSettings({
      ...settings,
      [provider]: {
        ...settings[provider],
        [field]: value,
      },
    })
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const ProviderCard = ({
    title,
    description,
    provider,
    icon,
    docsUrl,
    hasMinScore = false,
  }: {
    title: string
    description: string
    provider: keyof RecaptchaSettings
    icon: React.ReactNode
    docsUrl: string
    hasMinScore?: boolean
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <Switch
            checked={settings[provider].enabled}
            onCheckedChange={(checked) => updateProvider(provider, 'enabled', checked)}
          />
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{description}</span>
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-xs"
          >
            <ExternalLink className="w-3 h-3" />
            Docs
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${provider}-siteKey`}>Site Key</Label>
          <Input
            id={`${provider}-siteKey`}
            placeholder="Enter site key"
            value={settings[provider].siteKey}
            onChange={(e) => updateProvider(provider, 'siteKey', e.target.value)}
            disabled={!settings[provider].enabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${provider}-secretKey`}>Secret Key</Label>
          <div className="flex gap-2">
            <Input
              id={`${provider}-secretKey`}
              type={showSecrets[provider] ? 'text' : 'password'}
              placeholder="Enter secret key"
              value={settings[provider].secretKey}
              onChange={(e) => updateProvider(provider, 'secretKey', e.target.value)}
              disabled={!settings[provider].enabled}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setShowSecrets({
                  ...showSecrets,
                  [provider]: !showSecrets[provider],
                })
              }
              disabled={!settings[provider].enabled}
            >
              {showSecrets[provider] ? <Shield className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {hasMinScore && (
          <div className="space-y-2">
            <Label htmlFor={`${provider}-minScore`}>Minimum Score (0.0 - 1.0)</Label>
            <Input
              id={`${provider}-minScore`}
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={settings[provider].minScore}
              onChange={(e) => updateProvider(provider, 'minScore', e.target.value)}
              disabled={!settings[provider].enabled}
            />
            <p className="text-xs text-muted-foreground">
              Higher values (e.g., 0.7) require more user-like behavior. Recommended: 0.5
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">reCAPTCHA Settings</h1>
          <p className="text-muted-foreground">Configure CAPTCHA providers for bot protection</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure one or more CAPTCHA providers to protect your application from bots and automated abuse.
          Only enable one provider at a time for each form unless you have specific requirements.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google reCAPTCHA V2 */}
        <ProviderCard
          title="Google reCAPTCHA V2"
          description="Classic checkbox challenge for user verification"
          provider="recaptchaV2"
          icon={<Shield className="w-5 h-5 text-blue-600" />}
          docsUrl="https://developers.google.com/recaptcha/docs/v2"
        />

        {/* Google reCAPTCHA V3 */}
        <ProviderCard
          title="Google reCAPTCHA V3"
          description="Invisible verification with score-based analysis"
          provider="recaptchaV3"
          icon={<Shield className="w-5 h-5 text-green-600" />}
          docsUrl="https://developers.google.com/recaptcha/docs/v3"
          hasMinScore={true}
        />

        {/* Cloudflare Turnstile */}
        <ProviderCard
          title="Cloudflare Turnstile"
          description="Cloudflare's CAPTCHA alternative for improved UX"
          provider="cloudflare"
          icon={<Shield className="w-5 h-5 text-orange-600" />}
          docsUrl="https://developers.cloudflare.com/turnstile/"
        />

        {/* hCAPTCHA */}
        <ProviderCard
          title="hCAPTCHA"
          description="Privacy-focused CAPTCHA alternative"
          provider="hcaptcha"
          icon={<Shield className="w-5 h-5 text-purple-600" />}
          docsUrl="https://docs.hcaptcha.com/"
        />
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Configuration Status
          </CardTitle>
          <CardDescription>Overview of your CAPTCHA provider configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Google reCAPTCHA V2</span>
              </div>
              <span className={`text-sm ${settings.recaptchaV2.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                {settings.recaptchaV2.enabled ? '✓ Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium">Google reCAPTCHA V3</span>
              </div>
              <span className={`text-sm ${settings.recaptchaV3.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                {settings.recaptchaV3.enabled ? `✓ Enabled (Min: ${settings.recaptchaV3.minScore})` : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Cloudflare Turnstile</span>
              </div>
              <span className={`text-sm ${settings.cloudflare.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                {settings.cloudflare.enabled ? '✓ Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="font-medium">hCAPTCHA</span>
              </div>
              <span className={`text-sm ${settings.hcaptcha.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                {settings.hcaptcha.enabled ? '✓ Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Make sure to add your domain to the CAPTCHA provider's allowlist and configure the appropriate
            integration in your forms.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
