'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Loader2, CreditCard, CheckCircle2, XCircle, RefreshCw, Eye, EyeOff,
  Globe, Key, Link as LinkIcon, Webhook, ArrowRightLeft, AlertCircle,
  BookOpen, ExternalLink, Settings, Shield, Upload, Image as ImageIcon
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Gateway Information Interface (Common to all gateways)
interface GatewayInfo {
  isEnabled: boolean
  isSandbox: boolean
  label: string
  description: string
  logo: string
  minAmount: number
  maxAmount: number
  fixedDiscount: number
  percentageDiscount: number
  fixedCharge: number
  percentageCharge: number
}

// bKash Config
interface BkashConfig extends GatewayInfo {
  gatewayType: 'checkout' | 'tokenized'
  credentials: {
    appKey: string
    appSecret: string
    username: string
    password: string
  }
}

// Nagad Config
interface NagadConfig extends GatewayInfo {
  credentials: {
    merchantId: string
    merchantNumber: string
    publicKey: string
    privateKey: string
  }
}

// Rocket Config
interface RocketConfig extends GatewayInfo {
  credentials: {
    number: string
    pendingPayment: boolean
  }
}

// Upay Config
interface UpayConfig extends GatewayInfo {
  credentials: {
    merchantId: string
    merchantKey: string
    merchantName: string
    merchantCode: string
    merchantCity: string
    merchantCategoryCode: string
    merchantMobile: string
  }
}

// SSLCommerz Config
interface SSLCommerzConfig extends GatewayInfo {
  credentials: {
    storeId: string
    storePassword: string
    productCategory: string
    productProfile: string
  }
}

// Aamar Pay Config
interface AamarPayConfig extends GatewayInfo {
  credentials: {
    ipnUrl: string
    storeId: string
    signatureKey: string
  }
}

// EPS Config
interface EPSConfig extends GatewayInfo {
  credentials: {
    merchantId: string
    storeId: string
    username: string
    password: string
    hashKey: string
  }
}

// Pay Station Config
interface PayStationConfig extends GatewayInfo {
  credentials: {
    merchantId: string
    password: string
    payWithCharge: boolean
  }
}

// UddoktaPay Config
interface UddoktaPayConfig extends GatewayInfo {
  credentials: {
    apiKey: string
    baseUrl: string
    apiType: string
    redirectUrl: string
    cancelUrl: string
    webhookUrl: string
  }
}

// PipraPay Config
interface PipraPayConfig extends GatewayInfo {
  credentials: {
    apiKey: string
    baseUrl: string
    redirectUrl: string
    cancelUrl: string
    webhookUrl: string
    currency: string
    returnType: string
  }
}

// ZiniPay Config
interface ZiniPayConfig extends GatewayInfo {
  credentials: {
    apiKey: string
    baseUrl: string
  }
}

export default function PaymentMethodsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  
  const [bkashForm, setBkashForm] = useState<BkashConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'bKash',
    description: 'Pay securely using bKash mobile wallet',
    logo: '',
    gatewayType: 'checkout',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      appKey: '',
      appSecret: '',
      username: '',
      password: '',
    },
  })

  const [nagadForm, setNagadForm] = useState<NagadConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'Nagad',
    description: 'Pay securely using Nagad mobile wallet',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      merchantId: '',
      merchantNumber: '',
      publicKey: '',
      privateKey: '',
    },
  })

  const [rocketForm, setRocketForm] = useState<RocketConfig>({
    isEnabled: false,
    isSandbox: false,
    label: 'Rocket',
    description: 'Pay directly to Rocket account',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      number: '',
      pendingPayment: false,
    },
  })

  const [upayForm, setUpayForm] = useState<UpayConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'Upay',
    description: 'Pay using Upay payment gateway',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      merchantId: '',
      merchantKey: '',
      merchantName: '',
      merchantCode: '',
      merchantCity: '',
      merchantCategoryCode: '',
      merchantMobile: '',
    },
  })

  const [sslCommerzForm, setSSLCommerzForm] = useState<SSLCommerzConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'SSLCommerz',
    description: 'Pay securely using SSLCommerz payment gateway',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      storeId: '',
      storePassword: '',
      productCategory: 'Electronic',
      productProfile: '',
    },
  })

  const [aamarPayForm, setAamarPayForm] = useState<AamarPayConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'Aamar Pay',
    description: 'Pay using Aamar Pay payment gateway',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      ipnUrl: '',
      storeId: '',
      signatureKey: '',
    },
  })

  const [epsForm, setEpsForm] = useState<EPSConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'EPS',
    description: 'Pay using EPS payment gateway',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      merchantId: '',
      storeId: '',
      username: '',
      password: '',
      hashKey: '',
    },
  })

  const [payStationForm, setPayStationForm] = useState<PayStationConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'Pay Station',
    description: 'Pay using Pay Station payment gateway',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      merchantId: '',
      password: '',
      payWithCharge: false,
    },
  })

  const [uddoktaPayForm, setUddoktaPayForm] = useState<UddoktaPayConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'UddoktaPay',
    description: 'Pay using multiple payment methods via UddoktaPay',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      apiKey: '',
      baseUrl: '',
      apiType: 'checkout-v2',
      redirectUrl: '',
      cancelUrl: '',
      webhookUrl: '',
    },
  })

  const [pipraPayForm, setPipraPayForm] = useState<PipraPayConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'PipraPay',
    description: 'Pay using multiple payment methods via PipraPay',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      apiKey: '',
      baseUrl: '',
      redirectUrl: '',
      cancelUrl: '',
      webhookUrl: '',
      currency: 'BDT',
      returnType: 'POST',
    },
  })

  const [ziniPayForm, setZiniPayForm] = useState<ZiniPayConfig>({
    isEnabled: false,
    isSandbox: true,
    label: 'ZiniPay',
    description: 'Pay using ZiniPay payment gateway',
    logo: '',
    minAmount: 0,
    maxAmount: 999999,
    fixedDiscount: 0,
    percentageDiscount: 0,
    fixedCharge: 0,
    percentageCharge: 0,
    credentials: {
      apiKey: '',
      baseUrl: '',
    },
  })

  // API Type options for UddoktaPay
  const uddoktaPayApiTypes = [
    { value: 'checkout', label: 'Checkout (IPN)', description: 'Basic checkout with IPN notification' },
    { value: 'checkout-v2', label: 'Checkout V2 (Success Page)', description: 'Advanced checkout with success page notification (Recommended)' },
    { value: 'checkout/global', label: 'Checkout Global (IPN)', description: 'Global basic checkout with IPN' },
    { value: 'checkout-v2/global', label: 'Checkout V2 Global', description: 'Global advanced checkout with success page' },
  ]

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    setIsLoading(true)
    try {
      // Helper function to load gateway config
      const loadGatewayConfig = async (gatewayName: string, setForm: any) => {
        try {
          const res = await fetch(`/api/admin/payment-gateways/${gatewayName}`)
          if (res.ok) {
            const data = await res.json()
            if (data.gateway) {
              setForm({
                isEnabled: data.gateway.isEnabled || false,
                isSandbox: data.gateway.isSandbox !== false,
                label: data.gateway.label || gatewayName.charAt(0).toUpperCase() + gatewayName.slice(1),
                description: data.gateway.description || '',
                logo: data.gateway.logo || '',
                minAmount: data.gateway.minAmount ?? 0,
                maxAmount: data.gateway.maxAmount ?? 999999,
                fixedDiscount: data.gateway.fixedDiscount ?? 0,
                percentageDiscount: data.gateway.percentageDiscount ?? 0,
                fixedCharge: data.gateway.fixedCharge ?? 0,
                percentageCharge: data.gateway.percentageCharge ?? 0,
                ...(data.gateway.gatewayType && { gatewayType: data.gateway.gatewayType }),
                credentials: data.gateway.credentials || {},
              })
            }
          }
        } catch (error) {
          console.error(`Error loading ${gatewayName} config:`, error)
        }
      }

      // Load all gateway configs
      await Promise.all([
        loadGatewayConfig('bkash', setBkashForm),
        loadGatewayConfig('nagad', setNagadForm),
        loadGatewayConfig('rocket', setRocketForm),
        loadGatewayConfig('upay', setUpayForm),
        loadGatewayConfig('sslcommerz', setSSLCommerzForm),
        loadGatewayConfig('aamarpay', setAamarPayForm),
        loadGatewayConfig('eps', setEpsForm),
        loadGatewayConfig('paystation', setPayStationForm),
        loadGatewayConfig('uddoktapay', setUddoktaPayForm),
        loadGatewayConfig('piprapay', setPipraPayForm),
        loadGatewayConfig('zinipay', setZiniPayForm),
      ])
    } catch (error) {
      console.error('Error loading configs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generic save function
  const handleSaveGateway = async (gatewayName: string, formData: any) => {
    setIsSaving(gatewayName)
    try {
      const response = await fetch(`/api/admin/payment-gateways/${gatewayName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: `${gatewayName.charAt(0).toUpperCase() + gatewayName.slice(1)} Configuration Saved`,
          description: 'Your payment gateway settings have been saved successfully.',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || `Failed to save ${gatewayName} configuration`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save ${gatewayName} configuration`,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(null)
    }
  }

  // Generic test connection function
  const handleTestConnection = async (gatewayName: string, formData: any) => {
    setIsTesting(gatewayName)
    setTestResult(null)
    try {
      const response = await fetch(`/api/admin/payment-gateways/${gatewayName}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      setTestResult({
        success: data.success,
        message: data.message || (data.success ? 'Connection successful!' : 'Connection failed'),
      })

      toast({
        title: data.success ? 'Connection Successful' : 'Connection Failed',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      })
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Failed to test connection',
      })
      toast({
        title: 'Test Failed',
        description: `Failed to connect to ${gatewayName} gateway`,
        variant: 'destructive',
      })
    } finally {
      setIsTesting(null)
    }
  }

  const toggleShowCredential = (field: string) => {
    setShowCredentials(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // Gateway Information Card Component
  const GatewayInformationCard = ({ 
    gatewayName, 
    form, 
    setForm, 
    showGatewayType = false 
  }: { 
    gatewayName: string
    form: any
    setForm: any
    showGatewayType?: boolean
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Gateway Information</CardTitle>
        <CardDescription>
          Basic information and transaction settings for {gatewayName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Toggle */}
        <div className="flex flex-wrap items-center justify-between p-4 border rounded-lg gap-4">
          <div>
            <Label className="font-semibold">Status</Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable this payment gateway
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isEnabled}
              onCheckedChange={(checked) => setForm({ ...form, isEnabled: checked })}
            />
            <span className="text-sm font-medium">{form.isEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        {/* Sandbox Toggle (if applicable) */}
        {form.isSandbox !== undefined && (
          <div className="flex flex-wrap items-center justify-between p-4 border rounded-lg gap-4">
            <div>
              <Label className="font-semibold">Sandbox Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable for testing. Disable for production payments.
              </p>
            </div>
            <Switch
              checked={form.isSandbox}
              onCheckedChange={(checked) => setForm({ ...form, isSandbox: checked })}
            />
          </div>
        )}

        {/* Display Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Display Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-label`}>Label</Label>
              <Input
                id={`${gatewayName}-label`}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder={`e.g., ${gatewayName}`}
              />
              <p className="text-xs text-muted-foreground">The name shown to customers at checkout</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-description`}>Description</Label>
              <Input
                id={`${gatewayName}-description`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Pay securely using this gateway"
              />
              <p className="text-xs text-muted-foreground">Brief description shown below the label</p>
            </div>
          </div>
        </div>

        {/* Gateway Type (bKash only) */}
        {showGatewayType && (
          <div className="space-y-2">
            <Label htmlFor={`${gatewayName}-gatewayType`}>Gateway Type</Label>
            <Select
              value={form.gatewayType}
              onValueChange={(value) => setForm({ ...form, gatewayType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gateway Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkout">bKash API Checkout</SelectItem>
                <SelectItem value="tokenized">bKash API Tokenized</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose between Checkout (one-time payments) or Tokenized (recurring payments)
            </p>
          </div>
        )}

        {/* Logo Upload */}
        <div className="space-y-2">
          <Label htmlFor={`${gatewayName}-logo`}>Gateway Logo</Label>
          <div className="flex items-center gap-4">
            {form.logo && (
              <div className="w-20 h-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <Input
                id={`${gatewayName}-logo`}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setForm({ ...form, logo: file.name })
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                JPG/JPEG/PNG, 500x250 or 250x250 pixels
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Limits */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Transaction Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-minAmount`}>Minimum Amount (BDT)</Label>
              <Input
                id={`${gatewayName}-minAmount`}
                type="number"
                value={form.minAmount}
                onChange={(e) => setForm({ ...form, minAmount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Minimum transaction amount</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-maxAmount`}>Maximum Amount (BDT)</Label>
              <Input
                id={`${gatewayName}-maxAmount`}
                type="number"
                value={form.maxAmount}
                onChange={(e) => setForm({ ...form, maxAmount: parseFloat(e.target.value) || 999999 })}
                placeholder="999999"
              />
              <p className="text-xs text-muted-foreground">Maximum transaction amount</p>
            </div>
          </div>
        </div>

        {/* Discounts */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Discount Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-fixedDiscount`}>Fixed Discount (BDT)</Label>
              <Input
                id={`${gatewayName}-fixedDiscount`}
                type="number"
                value={form.fixedDiscount}
                onChange={(e) => setForm({ ...form, fixedDiscount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Fixed discount amount</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-percentageDiscount`}>Percentage Discount (%)</Label>
              <Input
                id={`${gatewayName}-percentageDiscount`}
                type="number"
                step="0.01"
                value={form.percentageDiscount}
                onChange={(e) => setForm({ ...form, percentageDiscount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Percentage discount</p>
            </div>
          </div>
        </div>

        {/* Charges */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Charge Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-fixedCharge`}>Fixed Charge (BDT)</Label>
              <Input
                id={`${gatewayName}-fixedCharge`}
                type="number"
                value={form.fixedCharge}
                onChange={(e) => setForm({ ...form, fixedCharge: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Fixed transaction charge</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${gatewayName}-percentageCharge`}>Percentage Charge (%)</Label>
              <Input
                id={`${gatewayName}-percentageCharge`}
                type="number"
                step="0.01"
                value={form.percentageCharge}
                onChange={(e) => setForm({ ...form, percentageCharge: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Percentage transaction charge</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground">Configure payment gateways for receiving payments</p>
        </div>
      </div>

      <Tabs defaultValue="bkash" className="space-y-6">
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 w-full overflow-x-auto">
          <TabsTrigger value="bkash" className="gap-2">
            <span>bKash</span>
            {bkashForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="nagad" className="gap-2">
            <span>Nagad</span>
            {nagadForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rocket" className="gap-2">
            <span>Rocket</span>
            {rocketForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upay" className="gap-2">
            <span>Upay</span>
            {upayForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sslcommerz" className="gap-2">
            <span>SSLCommerz</span>
            {sslCommerzForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="aamarpay" className="gap-2">
            <span>Aamar Pay</span>
            {aamarPayForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="eps" className="gap-2">
            <span>EPS</span>
            {epsForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paystation" className="gap-2">
            <span>Pay Station</span>
            {payStationForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="uddoktapay" className="gap-2">
            <span>UddoktaPay</span>
            {uddoktaPayForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="piprapay" className="gap-2">
            <span>PipraPay</span>
            {pipraPayForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="zinipay" className="gap-2">
            <span>ZiniPay</span>
            {ziniPayForm.isEnabled && (
              <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-green-600">Active</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* bKash */}
        <TabsContent value="bkash">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="bkash" 
              form={bkashForm} 
              setForm={setBkashForm}
              showGatewayType={true}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  bKash API credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bkash-appKey">App Key</Label>
                    <Input
                      id="bkash-appKey"
                      value={bkashForm.credentials.appKey}
                      onChange={(e) => setBkashForm({
                        ...bkashForm,
                        credentials: { ...bkashForm.credentials, appKey: e.target.value }
                      })}
                      placeholder="Enter your bKash App Key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bkash-appSecret">App Secret</Label>
                    <div className="relative">
                      <Input
                        id="bkash-appSecret"
                        type={showCredentials['bkash-appSecret'] ? 'text' : 'password'}
                        value={bkashForm.credentials.appSecret}
                        onChange={(e) => setBkashForm({
                          ...bkashForm,
                          credentials: { ...bkashForm.credentials, appSecret: e.target.value }
                        })}
                        placeholder="Enter your bKash App Secret"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('bkash-appSecret')}
                      >
                        {showCredentials['bkash-appSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bkash-username">Username</Label>
                    <Input
                      id="bkash-username"
                      value={bkashForm.credentials.username}
                      onChange={(e) => setBkashForm({
                        ...bkashForm,
                        credentials: { ...bkashForm.credentials, username: e.target.value }
                      })}
                      placeholder="Enter your bKash Username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bkash-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="bkash-password"
                        type={showCredentials['bkash-password'] ? 'text' : 'password'}
                        value={bkashForm.credentials.password}
                        onChange={(e) => setBkashForm({
                          ...bkashForm,
                          credentials: { ...bkashForm.credentials, password: e.target.value }
                        })}
                        placeholder="Enter your bKash Password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('bkash-password')}
                      >
                        {showCredentials['bkash-password'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('bkash', bkashForm)}
                    disabled={isSaving === 'bkash'}
                  >
                    {isSaving === 'bkash' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('bkash', {
                      appKey: bkashForm.credentials.appKey,
                      appSecret: bkashForm.credentials.appSecret,
                      username: bkashForm.credentials.username,
                      password: bkashForm.credentials.password,
                      isSandbox: bkashForm.isSandbox,
                    })}
                    disabled={isTesting === 'bkash'}
                  >
                    {isTesting === 'bkash' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nagad */}
        <TabsContent value="nagad">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="nagad" 
              form={nagadForm} 
              setForm={setNagadForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Nagad API credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nagad-merchantId">Merchant ID *</Label>
                    <Input
                      id="nagad-merchantId"
                      value={nagadForm.credentials.merchantId}
                      onChange={(e) => setNagadForm({
                        ...nagadForm,
                        credentials: { ...nagadForm.credentials, merchantId: e.target.value }
                      })}
                      placeholder="Enter your Nagad Merchant ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nagad-merchantNumber">Merchant Number *</Label>
                    <Input
                      id="nagad-merchantNumber"
                      value={nagadForm.credentials.merchantNumber}
                      onChange={(e) => setNagadForm({
                        ...nagadForm,
                        credentials: { ...nagadForm.credentials, merchantNumber: e.target.value }
                      })}
                      placeholder="017XXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nagad-publicKey">Public Key *</Label>
                    <div className="relative">
                      <Input
                        id="nagad-publicKey"
                        type={showCredentials['nagad-publicKey'] ? 'text' : 'password'}
                        value={nagadForm.credentials.publicKey}
                        onChange={(e) => setNagadForm({
                          ...nagadForm,
                          credentials: { ...nagadForm.credentials, publicKey: e.target.value }
                        })}
                        placeholder="Enter your Public Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('nagad-publicKey')}
                      >
                        {showCredentials['nagad-publicKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nagad-privateKey">Private Key *</Label>
                    <div className="relative">
                      <Input
                        id="nagad-privateKey"
                        type={showCredentials['nagad-privateKey'] ? 'text' : 'password'}
                        value={nagadForm.credentials.privateKey}
                        onChange={(e) => setNagadForm({
                          ...nagadForm,
                          credentials: { ...nagadForm.credentials, privateKey: e.target.value }
                        })}
                        placeholder="Enter your Private Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('nagad-privateKey')}
                      >
                        {showCredentials['nagad-privateKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('nagad', nagadForm)}
                    disabled={isSaving === 'nagad'}
                  >
                    {isSaving === 'nagad' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('nagad', {
                      merchantId: nagadForm.credentials.merchantId,
                      publicKey: nagadForm.credentials.publicKey,
                      isSandbox: nagadForm.isSandbox,
                    })}
                    disabled={isTesting === 'nagad'}
                  >
                    {isTesting === 'nagad' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rocket */}
        <TabsContent value="rocket">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="rocket" 
              form={rocketForm} 
              setForm={setRocketForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Rocket account details for manual payment verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rocket-number">Rocket Number *</Label>
                    <Input
                      id="rocket-number"
                      value={rocketForm.credentials.number}
                      onChange={(e) => setRocketForm({
                        ...rocketForm,
                        credentials: { ...rocketForm.credentials, number: e.target.value }
                      })}
                      placeholder="018XXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rocket-pendingPayment">Pending Payment</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={rocketForm.credentials.pendingPayment}
                        onCheckedChange={(checked) => setRocketForm({
                          ...rocketForm,
                          credentials: { ...rocketForm.credentials, pendingPayment: checked }
                        })}
                      />
                      <span className="text-sm">
                        {rocketForm.credentials.pendingPayment ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Allow pending payments that require manual verification
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveGateway('rocket', rocketForm)}
                  disabled={isSaving === 'rocket'}
                >
                  {isSaving === 'rocket' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Upay */}
        <TabsContent value="upay">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="upay" 
              form={upayForm} 
              setForm={setUpayForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Upay merchant credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upay-merchantId">Merchant ID *</Label>
                    <Input
                      id="upay-merchantId"
                      value={upayForm.credentials.merchantId}
                      onChange={(e) => setUpayForm({
                        ...upayForm,
                        credentials: { ...upayForm.credentials, merchantId: e.target.value }
                      })}
                      placeholder="Enter your Merchant ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upay-merchantKey">Merchant Key *</Label>
                    <div className="relative">
                      <Input
                        id="upay-merchantKey"
                        type={showCredentials['upay-merchantKey'] ? 'text' : 'password'}
                        value={upayForm.credentials.merchantKey}
                        onChange={(e) => setUpayForm({
                          ...upayForm,
                          credentials: { ...upayForm.credentials, merchantKey: e.target.value }
                        })}
                        placeholder="Enter your Merchant Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('upay-merchantKey')}
                      >
                        {showCredentials['upay-merchantKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upay-merchantName">Merchant Name *</Label>
                    <Input
                      id="upay-merchantName"
                      value={upayForm.credentials.merchantName}
                      onChange={(e) => setUpayForm({
                        ...upayForm,
                        credentials: { ...upayForm.credentials, merchantName: e.target.value }
                      })}
                      placeholder="Enter your Merchant Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upay-merchantCode">Merchant Code *</Label>
                    <Input
                      id="upay-merchantCode"
                      value={upayForm.credentials.merchantCode}
                      onChange={(e) => setUpayForm({
                        ...upayForm,
                        credentials: { ...upayForm.credentials, merchantCode: e.target.value }
                      })}
                      placeholder="Enter your Merchant Code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upay-merchantCategoryCode">Merchant Category Code *</Label>
                    <Input
                      id="upay-merchantCategoryCode"
                      value={upayForm.credentials.merchantCategoryCode}
                      onChange={(e) => setUpayForm({
                        ...upayForm,
                        credentials: { ...upayForm.credentials, merchantCategoryCode: e.target.value }
                      })}
                      placeholder="e.g., 5499"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upay-merchantCity">Merchant City *</Label>
                    <Input
                      id="upay-merchantCity"
                      value={upayForm.credentials.merchantCity}
                      onChange={(e) => setUpayForm({
                        ...upayForm,
                        credentials: { ...upayForm.credentials, merchantCity: e.target.value }
                      })}
                      placeholder="e.g., Dhaka"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="upay-merchantMobile">Merchant Mobile *</Label>
                    <Input
                      id="upay-merchantMobile"
                      value={upayForm.credentials.merchantMobile}
                      onChange={(e) => setUpayForm({
                        ...upayForm,
                        credentials: { ...upayForm.credentials, merchantMobile: e.target.value }
                      })}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('upay', upayForm)}
                    disabled={isSaving === 'upay'}
                  >
                    {isSaving === 'upay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('upay', {
                      merchantId: upayForm.credentials.merchantId,
                      merchantKey: upayForm.credentials.merchantKey,
                      isSandbox: upayForm.isSandbox,
                    })}
                    disabled={isTesting === 'upay'}
                  >
                    {isTesting === 'upay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SSLCommerz */}
        <TabsContent value="sslcommerz">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="sslcommerz" 
              form={sslCommerzForm} 
              setForm={setSSLCommerzForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  SSLCommerz store credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sslcommerz-storeId">Store ID *</Label>
                    <Input
                      id="sslcommerz-storeId"
                      value={sslCommerzForm.credentials.storeId}
                      onChange={(e) => setSSLCommerzForm({
                        ...sslCommerzForm,
                        credentials: { ...sslCommerzForm.credentials, storeId: e.target.value }
                      })}
                      placeholder="Enter your Store ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sslcommerz-storePassword">Store Password *</Label>
                    <div className="relative">
                      <Input
                        id="sslcommerz-storePassword"
                        type={showCredentials['sslcommerz-storePassword'] ? 'text' : 'password'}
                        value={sslCommerzForm.credentials.storePassword}
                        onChange={(e) => setSSLCommerzForm({
                          ...sslCommerzForm,
                          credentials: { ...sslCommerzForm.credentials, storePassword: e.target.value }
                        })}
                        placeholder="Enter your Store Password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('sslcommerz-storePassword')}
                      >
                        {showCredentials['sslcommerz-storePassword'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sslcommerz-productCategory">Product Category *</Label>
                    <Select
                      value={sslCommerzForm.credentials.productCategory}
                      onValueChange={(value) => setSSLCommerzForm({
                        ...sslCommerzForm,
                        credentials: { ...sslCommerzForm.credentials, productCategory: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronic">Electronic</SelectItem>
                        <SelectItem value="Topup">Topup</SelectItem>
                        <SelectItem value="Bus Ticket">Bus Ticket</SelectItem>
                        <SelectItem value="Air Ticket">Air Ticket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sslcommerz-productProfile">Product Profile</Label>
                    <Input
                      id="sslcommerz-productProfile"
                      value={sslCommerzForm.credentials.productProfile}
                      onChange={(e) => setSSLCommerzForm({
                        ...sslCommerzForm,
                        credentials: { ...sslCommerzForm.credentials, productProfile: e.target.value }
                      })}
                      placeholder="e.g., general"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('sslcommerz', sslCommerzForm)}
                    disabled={isSaving === 'sslcommerz'}
                  >
                    {isSaving === 'sslcommerz' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('sslcommerz', {
                      storeId: sslCommerzForm.credentials.storeId,
                      storePassword: sslCommerzForm.credentials.storePassword,
                      isSandbox: sslCommerzForm.isSandbox,
                    })}
                    disabled={isTesting === 'sslcommerz'}
                  >
                    {isTesting === 'sslcommerz' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aamar Pay */}
        <TabsContent value="aamarpay">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="aamarpay" 
              form={aamarPayForm} 
              setForm={setAamarPayForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Aamar Pay store credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aamarpay-ipnUrl">IPN URL *</Label>
                    <Input
                      id="aamarpay-ipnUrl"
                      value={aamarPayForm.credentials.ipnUrl}
                      onChange={(e) => setAamarPayForm({
                        ...aamarPayForm,
                        credentials: { ...aamarPayForm.credentials, ipnUrl: e.target.value }
                      })}
                      placeholder="https://yoursite.com/api/webhook/aamarpay"
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Auto-generated, read-only</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aamarpay-storeId">Store ID *</Label>
                    <Input
                      id="aamarpay-storeId"
                      value={aamarPayForm.credentials.storeId}
                      onChange={(e) => setAamarPayForm({
                        ...aamarPayForm,
                        credentials: { ...aamarPayForm.credentials, storeId: e.target.value }
                      })}
                      placeholder="Enter your Store ID"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="aamarpay-signatureKey">Signature Key *</Label>
                    <div className="relative">
                      <Input
                        id="aamarpay-signatureKey"
                        type={showCredentials['aamarpay-signatureKey'] ? 'text' : 'password'}
                        value={aamarPayForm.credentials.signatureKey}
                        onChange={(e) => setAamarPayForm({
                          ...aamarPayForm,
                          credentials: { ...aamarPayForm.credentials, signatureKey: e.target.value }
                        })}
                        placeholder="Enter your Signature Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('aamarpay-signatureKey')}
                      >
                        {showCredentials['aamarpay-signatureKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('aamarpay', aamarPayForm)}
                    disabled={isSaving === 'aamarpay'}
                  >
                    {isSaving === 'aamarpay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('aamarpay', {
                      storeId: aamarPayForm.credentials.storeId,
                      signatureKey: aamarPayForm.credentials.signatureKey,
                      isSandbox: aamarPayForm.isSandbox,
                    })}
                    disabled={isTesting === 'aamarpay'}
                  >
                    {isTesting === 'aamarpay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EPS */}
        <TabsContent value="eps">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="eps" 
              form={epsForm} 
              setForm={setEpsForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  EPS merchant credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eps-merchantId">Merchant ID *</Label>
                    <Input
                      id="eps-merchantId"
                      value={epsForm.credentials.merchantId}
                      onChange={(e) => setEpsForm({
                        ...epsForm,
                        credentials: { ...epsForm.credentials, merchantId: e.target.value }
                      })}
                      placeholder="Enter your Merchant ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eps-storeId">Store ID *</Label>
                    <Input
                      id="eps-storeId"
                      value={epsForm.credentials.storeId}
                      onChange={(e) => setEpsForm({
                        ...epsForm,
                        credentials: { ...epsForm.credentials, storeId: e.target.value }
                      })}
                      placeholder="Enter your Store ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eps-username">Username *</Label>
                    <Input
                      id="eps-username"
                      value={epsForm.credentials.username}
                      onChange={(e) => setEpsForm({
                        ...epsForm,
                        credentials: { ...epsForm.credentials, username: e.target.value }
                      })}
                      placeholder="Enter your Username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eps-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="eps-password"
                        type={showCredentials['eps-password'] ? 'text' : 'password'}
                        value={epsForm.credentials.password}
                        onChange={(e) => setEpsForm({
                          ...epsForm,
                          credentials: { ...epsForm.credentials, password: e.target.value }
                        })}
                        placeholder="Enter your Password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('eps-password')}
                      >
                        {showCredentials['eps-password'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="eps-hashKey">Hash Key *</Label>
                    <div className="relative">
                      <Input
                        id="eps-hashKey"
                        type={showCredentials['eps-hashKey'] ? 'text' : 'password'}
                        value={epsForm.credentials.hashKey}
                        onChange={(e) => setEpsForm({
                          ...epsForm,
                          credentials: { ...epsForm.credentials, hashKey: e.target.value }
                        })}
                        placeholder="Enter your Hash Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('eps-hashKey')}
                      >
                        {showCredentials['eps-hashKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('eps', epsForm)}
                    disabled={isSaving === 'eps'}
                  >
                    {isSaving === 'eps' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('eps', {
                      merchantId: epsForm.credentials.merchantId,
                      storeId: epsForm.credentials.storeId,
                      username: epsForm.credentials.username,
                      password: epsForm.credentials.password,
                      isSandbox: epsForm.isSandbox,
                    })}
                    disabled={isTesting === 'eps'}
                  >
                    {isTesting === 'eps' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pay Station */}
        <TabsContent value="paystation">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="paystation" 
              form={payStationForm} 
              setForm={setPayStationForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Pay Station merchant credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paystation-merchantId">Merchant ID *</Label>
                    <Input
                      id="paystation-merchantId"
                      value={payStationForm.credentials.merchantId}
                      onChange={(e) => setPayStationForm({
                        ...payStationForm,
                        credentials: { ...payStationForm.credentials, merchantId: e.target.value }
                      })}
                      placeholder="Enter your Merchant ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paystation-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="paystation-password"
                        type={showCredentials['paystation-password'] ? 'text' : 'password'}
                        value={payStationForm.credentials.password}
                        onChange={(e) => setPayStationForm({
                          ...payStationForm,
                          credentials: { ...payStationForm.credentials, password: e.target.value }
                        })}
                        placeholder="Enter your Password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('paystation-password')}
                      >
                        {showCredentials['paystation-password'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="paystation-payWithCharge">Pay With Charge</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={payStationForm.credentials.payWithCharge}
                        onCheckedChange={(checked) => setPayStationForm({
                          ...payStationForm,
                          credentials: { ...payStationForm.credentials, payWithCharge: checked }
                        })}
                      />
                      <span className="text-sm">
                        {payStationForm.credentials.payWithCharge ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Will the merchant bear the payment charge?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('paystation', payStationForm)}
                    disabled={isSaving === 'paystation'}
                  >
                    {isSaving === 'paystation' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('paystation', {
                      merchantId: payStationForm.credentials.merchantId,
                      password: payStationForm.credentials.password,
                      isSandbox: payStationForm.isSandbox,
                    })}
                    disabled={isTesting === 'paystation'}
                  >
                    {isTesting === 'paystation' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* UddoktaPay */}
        <TabsContent value="uddoktapay">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="uddoktapay" 
              form={uddoktaPayForm} 
              setForm={setUddoktaPayForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  UddoktaPay API credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="uddoktapay-apiKey">API Key *</Label>
                    <div className="relative">
                      <Input
                        id="uddoktapay-apiKey"
                        type={showCredentials['uddoktapay-apiKey'] ? 'text' : 'password'}
                        value={uddoktaPayForm.credentials.apiKey}
                        onChange={(e) => setUddoktaPayForm({
                          ...uddoktaPayForm,
                          credentials: { ...uddoktaPayForm.credentials, apiKey: e.target.value }
                        })}
                        placeholder="Enter your API Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('uddoktapay-apiKey')}
                      >
                        {showCredentials['uddoktapay-apiKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uddoktapay-baseUrl">Base URL *</Label>
                    <Input
                      id="uddoktapay-baseUrl"
                      value={uddoktaPayForm.credentials.baseUrl}
                      onChange={(e) => setUddoktaPayForm({
                        ...uddoktaPayForm,
                        credentials: { ...uddoktaPayForm.credentials, baseUrl: e.target.value }
                      })}
                      placeholder={uddoktaPayForm.isSandbox ? "https://sandbox.uddoktapay.com/api" : "https://yourdomain.com/api"}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="uddoktapay-apiType">API Type</Label>
                    <Select
                      value={uddoktaPayForm.credentials.apiType}
                      onValueChange={(value) => setUddoktaPayForm({
                        ...uddoktaPayForm,
                        credentials: { ...uddoktaPayForm.credentials, apiType: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select API Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {uddoktaPayApiTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-muted-foreground ml-2">- {type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('uddoktapay', uddoktaPayForm)}
                    disabled={isSaving === 'uddoktapay'}
                  >
                    {isSaving === 'uddoktapay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('uddoktapay', {
                      apiKey: uddoktaPayForm.credentials.apiKey,
                      baseUrl: uddoktaPayForm.credentials.baseUrl || (uddoktaPayForm.isSandbox ? 'https://sandbox.uddoktapay.com/api' : ''),
                    })}
                    disabled={isTesting === 'uddoktapay'}
                  >
                    {isTesting === 'uddoktapay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PipraPay */}
        <TabsContent value="piprapay">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="piprapay" 
              form={pipraPayForm} 
              setForm={setPipraPayForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  PipraPay API credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="piprapay-apiKey">API Key *</Label>
                    <div className="relative">
                      <Input
                        id="piprapay-apiKey"
                        type={showCredentials['piprapay-apiKey'] ? 'text' : 'password'}
                        value={pipraPayForm.credentials.apiKey}
                        onChange={(e) => setPipraPayForm({
                          ...pipraPayForm,
                          credentials: { ...pipraPayForm.credentials, apiKey: e.target.value }
                        })}
                        placeholder="Enter your API Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('piprapay-apiKey')}
                      >
                        {showCredentials['piprapay-apiKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="piprapay-baseUrl">Base URL *</Label>
                    <Input
                      id="piprapay-baseUrl"
                      value={pipraPayForm.credentials.baseUrl}
                      onChange={(e) => setPipraPayForm({
                        ...pipraPayForm,
                        credentials: { ...pipraPayForm.credentials, baseUrl: e.target.value }
                      })}
                      placeholder={pipraPayForm.isSandbox ? "https://sandbox.piprapay.com" : "https://piprapay.com"}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('piprapay', pipraPayForm)}
                    disabled={isSaving === 'piprapay'}
                  >
                    {isSaving === 'piprapay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('piprapay', {
                      apiKey: pipraPayForm.credentials.apiKey,
                      baseUrl: pipraPayForm.credentials.baseUrl || (pipraPayForm.isSandbox ? 'https://sandbox.piprapay.com' : ''),
                    })}
                    disabled={isTesting === 'piprapay'}
                  >
                    {isTesting === 'piprapay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ZiniPay */}
        <TabsContent value="zinipay">
          <div className="space-y-6">
            <GatewayInformationCard 
              gatewayName="zinipay" 
              form={ziniPayForm} 
              setForm={setZiniPayForm}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  ZiniPay API credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zinipay-apiKey">API Key *</Label>
                    <div className="relative">
                      <Input
                        id="zinipay-apiKey"
                        type={showCredentials['zinipay-apiKey'] ? 'text' : 'password'}
                        value={ziniPayForm.credentials.apiKey}
                        onChange={(e) => setZiniPayForm({
                          ...ziniPayForm,
                          credentials: { ...ziniPayForm.credentials, apiKey: e.target.value }
                        })}
                        placeholder="Enter your API Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleShowCredential('zinipay-apiKey')}
                      >
                        {showCredentials['zinipay-apiKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zinipay-baseUrl">Base URL *</Label>
                    <Input
                      id="zinipay-baseUrl"
                      value={ziniPayForm.credentials.baseUrl}
                      onChange={(e) => setZiniPayForm({
                        ...ziniPayForm,
                        credentials: { ...ziniPayForm.credentials, baseUrl: e.target.value }
                      })}
                      placeholder={ziniPayForm.isSandbox ? "https://sandbox.zinipay.com/api" : "https://zinipay.com/api"}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSaveGateway('zinipay', ziniPayForm)}
                    disabled={isSaving === 'zinipay'}
                  >
                    {isSaving === 'zinipay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('zinipay', {
                      apiKey: ziniPayForm.credentials.apiKey,
                      baseUrl: ziniPayForm.credentials.baseUrl || (ziniPayForm.isSandbox ? 'https://sandbox.zinipay.com/api' : ''),
                    })}
                    disabled={isTesting === 'zinipay'}
                  >
                    {isTesting === 'zinipay' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </motion.div>
  )
}
