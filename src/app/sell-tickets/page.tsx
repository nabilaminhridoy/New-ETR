'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bus, Train, Ship, Plane, Upload, MapPin, Clock, Calendar,
  DollarSign, FileText, AlertCircle, Info, CheckCircle2, Loader2,
  Package, User, ArrowLeft, Home, X, Image as ImageIcon, Check, CheckCircle,
  Ticket, Eye, Plus, CircleHelp, Hash, Building2, Navigation, Bookmark,
  CreditCard, Calculator, Timer, Sparkles, ChevronRight, Send,
  Lightbulb, CircleCheckBig, ArrowRight, HelpCircle, TrendingUp, Camera, Shield, Zap, Star
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store'
import { cn, formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

// Transport type options
const transportTypes = [
  { value: 'BUS', label: 'Bus', icon: Bus, color: 'bg-blue-500' },
  { value: 'TRAIN', label: 'Train', icon: Train, color: 'bg-purple-500' },
  { value: 'LAUNCH', label: 'Launch', icon: Ship, color: 'bg-cyan-500' },
  { value: 'AIR', label: 'Air', icon: Plane, color: 'bg-amber-500' },
]

// Class types by transport
const classTypesByTransport = {
  BUS: [
    { value: 'NON_AC_ECONOMY', label: 'Non-AC Economy' },
    { value: 'NON_AC_BUSINESS', label: 'Non-AC Business' },
    { value: 'AC_ECONOMY', label: 'AC Economy' },
    { value: 'AC_BUSINESS', label: 'AC Business' },
    { value: 'SLEEPER', label: 'Sleeper' },
    { value: 'SUIT_CLASS_BUSINESS', label: 'Suit Class Business' },
    { value: 'SUIT_CLASS_SLEEPER', label: 'Suit Class Sleeper' },
  ],
  TRAIN: [
    { value: 'AC_B', label: 'AC-B' },
    { value: 'AC_S', label: 'AC-S' },
    { value: 'SNIGDHA', label: 'SNIGDHA' },
    { value: 'F_BERTH', label: 'F-BERTH' },
    { value: 'F_SEAT', label: 'F-SEAT' },
    { value: 'F_CHAIR', label: 'F-CHAIR' },
    { value: 'S_CHAIR', label: 'S-CHAIR' },
    { value: 'SHOVAN', label: 'SHOVAN' },
    { value: 'SHULOV', label: 'SHULOV' },
    { value: 'AC_CHAIR', label: 'AC-CHAIR' },
  ],
  LAUNCH: [
    { value: 'STANDING', label: 'Standing' },
    { value: 'NON_AC_SEAT', label: 'Non-AC Seat' },
    { value: 'AC_SEAT', label: 'AC Seat' },
    { value: 'NON_AC_CABIN', label: 'Non-AC Cabin' },
    { value: 'AC_CABIN', label: 'AC Cabin' },
    { value: 'VIP_CABIN', label: 'VIP Cabin' },
  ],
  AIR: [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST_CLASS', label: 'First Class' },
  ],
}

// Sleeper positions
const sleeperPositions = [
  { value: 'UPPER_DECK', label: 'Upper Deck' },
  { value: 'LOWER_DECK', label: 'Lower Deck' },
]

// Courier services
const courierServices = [
  { value: 'PATHAO', label: 'Pathao' },
  { value: 'STEADFAST', label: 'Steadfast' },
  { value: 'REDEX', label: 'Redex' },
  { value: 'PAPERFLY', label: 'Paperfly' },
  { value: 'ECOURIER', label: 'eCourier' },
  { value: 'CARRYBEE', label: 'Carrybee' },
  { value: 'OTHER', label: 'Other' },
]

// Popular Bangladesh cities
const popularCities = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Comilla',
  'Gazipur', 'Narayanganj', 'Mymensingh', 'Bogra', 'Cox\'s Bazar', 'Jessore', 'Dinajpur',
  'Brahmanbaria', 'Savar', 'Tongi', 'Narsingdi', 'Tangail', 'Jamalpur', 'Kishoreganj',
  'Faridpur', 'Madaripur', 'Gopalganj', 'Nawabganj', 'Habiganj', 'Bhairab', 'Narail',
  'Satkhira', 'Bagerhat', 'Magura', 'Meherpur', 'Kushtia', 'Chuadanga', 'Jhenaidah',
  'Pabna', 'Sirajganj', 'Natore', 'Naogaon', 'Joypurhat', 'Dhamrai', 'Manikganj',
]

// Ticket types
const ticketTypes = [
  { value: 'ONLINE_COPY', label: 'Online Copy', description: 'Digital PDF ticket', badge: 'PDF Required' },
  { value: 'COUNTER_COPY', label: 'Counter Copy', description: 'Physical paper ticket' },
]

// Delivery types
const deliveryTypes = [
  {
    value: 'ONLINE_DELIVERY',
    label: 'Online Delivery',
    description: 'Buyer will get a PDF ticket instant delivery on email or download from their dashboard.',
    icon: FileText,
    requiresTicketType: 'ONLINE_COPY'
  },
  {
    value: 'IN_PERSON',
    label: 'In Person (Recommended)',
    description: 'You will need deliver the ticket in person meetup location.',
    icon: User,
  },
  {
    value: 'COURIER',
    label: 'Courier',
    description: 'Deliver the ticket through courier service (COD).',
    icon: Package,
  },
]

// Form schema
const ticketSchema = z.object({
  transportType: z.enum(['BUS', 'TRAIN', 'LAUNCH', 'AIR']),
  ticketType: z.enum(['ONLINE_COPY', 'COUNTER_COPY']),
  pnrNumber: z.string().min(1, 'PNR number is required'),
  transportCompany: z.string().min(1, 'Transport company is required'),
  fromCity: z.string().min(1, 'From city is required'),
  toCity: z.string().min(1, 'To city is required'),
  boardingPoint: z.string().min(1, 'Boarding point is required'),
  travelDate: z.string().min(1, 'Travel date is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  seatNumber: z.string().min(1, 'Seat number is required'),
  classType: z.string().min(1, 'Class type is required'),
  sleeperPosition: z.enum(['UPPER_DECK', 'LOWER_DECK']).optional().nullable(),
  originalPrice: z.coerce.number().min(1, 'Original price is required'),
  sellingPrice: z.coerce.number().optional().nullable(),
  notes: z.string().optional(),
  deliveryType: z.enum(['ONLINE_DELIVERY', 'IN_PERSON', 'COURIER']),
  location: z.string().optional(),
  courierService: z.enum(['PATHAO', 'STEADFAST', 'REDEX', 'PAPERFLY', 'ECOURIER', 'CARRYBEE', 'OTHER']).optional().nullable(),
  courierFee: z.coerce.number().optional().nullable(),
  courierFeePaidBy: z.enum(['BUYER', 'SELLER']).optional().nullable(),
})

type TicketFormValues = z.infer<typeof ticketSchema>

export default function SellTicketsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null)

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      transportType: 'BUS',
      ticketType: 'COUNTER_COPY',
      pnrNumber: '',
      transportCompany: '',
      fromCity: '',
      toCity: '',
      boardingPoint: '',
      travelDate: '',
      departureTime: '',
      seatNumber: '',
      classType: '',
      sleeperPosition: null,
      originalPrice: 0,
      sellingPrice: null,
      notes: '',
      deliveryType: 'IN_PERSON',
      location: '',
      courierService: null,
      courierFee: null,
      courierFeePaidBy: null,
    },
  })

  // Watch all relevant form values for preview card
  const watchTransportType = form.watch('transportType')
  const watchTicketType = form.watch('ticketType')
  const watchClassType = form.watch('classType')
  const watchDeliveryType = form.watch('deliveryType')
  const watchFromCity = form.watch('fromCity')
  const watchToCity = form.watch('toCity')
  const watchTransportCompany = form.watch('transportCompany')
  const watchTravelDate = form.watch('travelDate')
  const watchDepartureTime = form.watch('departureTime')
  const watchSeatNumber = form.watch('seatNumber')
  const watchSellingPrice = form.watch('sellingPrice')
  const watchOriginalPrice = form.watch('originalPrice')
  const watchNotes = form.watch('notes')
  const watchLocation = form.watch('location')
  const watchCourierService = form.watch('courierService')
  const watchCourierFee = form.watch('courierFee')
  const watchCourierFeePaidBy = form.watch('courierFeePaidBy')
  const watchPnrNumber = form.watch('pnrNumber')
  const watchBoardingPoint = form.watch('boardingPoint')

  // Get class types for selected transport
  const classTypes = classTypesByTransport[watchTransportType as keyof typeof classTypesByTransport] || []

  // Check if sleeper position should be shown (Bus + Sleeper class)
  const showSleeperPosition = watchTransportType === 'BUS' && watchClassType === 'SLEEPER'

  // Check if online delivery is available
  const canShowOnlineDelivery = watchTicketType === 'ONLINE_COPY'

  // Filter delivery types based on ticket type
  const availableDeliveryTypes = deliveryTypes.filter(dt =>
    !dt.requiresTicketType || dt.requiresTicketType === watchTicketType
  )

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB')
      return
    }

    // Check if PDF is required for online copy
    if (watchTicketType === 'ONLINE_COPY' && file.type !== 'application/pdf') {
      setFileError('PDF file is required for Online Copy tickets')
      return
    }

    // Check file type
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'

    if (!isImage && !isPdf) {
      setFileError('Only image or PDF files are allowed')
      return
    }

    setFileName(file.name)
    setFileType(isPdf ? 'pdf' : 'image')

    // Create preview for images
    if (isImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  // Remove file
  const removeFile = () => {
    setFilePreview(null)
    setFileName(null)
    setFileType(null)
    setFileError(null)
  }

  // Reset class type when transport type changes
  useEffect(() => {
    form.setValue('classType', '')
  }, [watchTransportType, form])

  // Reset sleeper position when class type changes
  useEffect(() => {
    if (!showSleeperPosition) {
      form.setValue('sleeperPosition', null)
    }
  }, [showSleeperPosition, form])

  // Reset delivery type when ticket type changes
  useEffect(() => {
    if (watchTicketType === 'COUNTER_COPY' && watchDeliveryType === 'ONLINE_DELIVERY') {
      form.setValue('deliveryType', 'IN_PERSON')
    }
  }, [watchTicketType, watchDeliveryType, form])

  // Calculate platform fee and total
  const originalPrice = form.watch('originalPrice') || 0
  const sellingPrice = form.watch('sellingPrice') || originalPrice
  const platformFee = Math.max(Math.round(sellingPrice * 0.01), 10) // 1% min 10 BDT
  const sellerReceives = sellingPrice - platformFee

  // Progress stepper steps with descriptions
  const stepperSteps = [
    { label: 'Transport', icon: Bus, desc: 'Type & file' },
    { label: 'Journey', icon: MapPin, desc: 'Route & details' },
    { label: 'Pricing', icon: DollarSign, desc: 'Price & notes' },
    { label: 'Delivery', icon: Package, desc: 'Method & location' },
  ]

  // Determine active step based on form completion
  const activeStep = useMemo(() => {
    const values = form.getValues()
    // Step 0: Transport Type - always started
    if (!values.transportType || !values.ticketType || !fileName) return 0
    // Step 1: Journey Details
    if (!values.pnrNumber || !values.transportCompany || !values.fromCity || !values.toCity ||
        !values.boardingPoint || !values.travelDate || !values.departureTime ||
        !values.classType || !values.seatNumber) return 1
    // Step 2: Pricing
    if (!values.originalPrice || values.originalPrice <= 0) return 2
    // Step 3: Delivery
    if (!values.deliveryType) return 2
    if (values.deliveryType === 'IN_PERSON' && !values.location) return 3
    if (values.deliveryType === 'COURIER' && (!values.courierService || !values.courierFee || !values.courierFeePaidBy)) return 3
    return 3
  }, [form, fileName])

  // Compute step completion status for green checkmark indicators
  const stepCompletion = useMemo(() => {
    const values = form.getValues()
    return [
      // Step 0: Transport & Ticket Type
      !!(values.transportType && values.ticketType && fileName),
      // Step 1: Journey Details
      !!(values.pnrNumber && values.transportCompany && values.fromCity && values.toCity &&
        values.boardingPoint && values.travelDate && values.departureTime &&
        values.classType && values.seatNumber),
      // Step 2: Pricing
      !!(values.originalPrice && values.originalPrice > 0),
      // Step 3: Delivery
      !!(
        values.deliveryType === 'ONLINE_DELIVERY' ||
        (values.deliveryType === 'IN_PERSON' && values.location) ||
        (values.deliveryType === 'COURIER' && values.courierService && values.courierFee && values.courierFeePaidBy)
      ),
    ]
  }, [form, fileName])

  // Get transport type display info
  const currentTransportType = transportTypes.find(t => t.value === watchTransportType)
  const currentClassType = classTypes.find(c => c.value === watchClassType)
  const displayPrice = watchSellingPrice || watchOriginalPrice || 0
  const transportColorMap: Record<string, string> = { BUS: 'from-blue-500 to-blue-600', TRAIN: 'from-purple-500 to-purple-600', LAUNCH: 'from-cyan-500 to-cyan-600', AIR: 'from-amber-500 to-amber-600' }
  const transportTextColorMap: Record<string, string> = { BUS: 'text-blue-500', TRAIN: 'text-purple-500', LAUNCH: 'text-cyan-500', AIR: 'text-amber-500' }

  // Form submission
  const onSubmit = async (data: TicketFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to sell tickets',
        variant: 'destructive',
      })
      router.push('/user/login')
      return
    }

    // Validate file upload
    if (!fileName) {
      setFileError('Ticket image or PDF is required')
      return
    }

    // Validate online copy requires PDF
    if (data.ticketType === 'ONLINE_COPY' && fileType !== 'pdf') {
      setFileError('PDF file is required for Online Copy tickets')
      return
    }

    // Validate delivery-specific fields
    if (data.deliveryType === 'IN_PERSON' && !data.location) {
      form.setError('location', { message: 'Location is required for In Person delivery' })
      return
    }

    if (data.deliveryType === 'COURIER') {
      if (!data.courierService) {
        form.setError('courierService', { message: 'Courier service is required' })
        return
      }
      if (!data.courierFee || data.courierFee <= 0) {
        form.setError('courierFee', { message: 'Courier fee is required' })
        return
      }
      if (!data.courierFeePaidBy) {
        form.setError('courierFeePaidBy', { message: 'Select who pays the courier fee' })
        return
      }
    }

    setIsLoading(true)

    try {
      const formData = new FormData()

      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'ticketFile') {
          formData.append(key, String(value))
        }
      })

      // Append file - we need to get the actual file from the input
      const fileInput = document.getElementById('ticketFile') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        formData.append('ticketFile', fileInput.files[0])
      }

      // Get auth token from store
      const token = useAuthStore.getState().token

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        const ticketId = result.ticket?.ticketId || 'N/A'
        setCreatedTicketId(ticketId)
        setShowSuccess(true)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to list ticket',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show login required if not authenticated
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please login to sell your tickets on our platform.
              </p>
              <div className="flex flex-col gap-3">
                <Button className="btn-primary" onClick={() => router.push('/user/login')}>
                  Login Now
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main form area */}
            <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <a href="/" className="hover:text-primary">Home</a>
              <span>/</span>
              <span className="text-foreground">Sell Ticket</span>
            </div>
            <h1 className="text-2xl font-bold">Sell Your Ticket</h1>
            <p className="text-muted-foreground">List your unused travel ticket for resale</p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-6 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between relative">
              {/* Connection line background */}
              <div className="absolute top-5 left-[calc(12.5%+12px)] right-[calc(12.5%+12px)] h-0.5 bg-muted" />
              {/* Connection line progress */}
              <motion.div
                className="absolute top-5 left-[calc(12.5%+12px)] h-0.5 bg-primary"
                animate={{ width: `${(activeStep / (stepperSteps.length - 1)) * (100 - 25)}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              {stepperSteps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = activeStep === index
                const isCompleted = activeStep > index
                return (
                  <div key={step.label} className="flex flex-col items-center gap-1.5 relative z-10 flex-1">
                    <motion.div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                        isActive && 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110',
                        isCompleted && 'border-primary bg-primary text-primary-foreground',
                        !isActive && !isCompleted && 'border-muted-foreground/30 bg-background text-muted-foreground'
                      )}
                      animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span className={cn(
                      'text-xs font-semibold text-center transition-colors',
                      isActive && 'text-primary',
                      isCompleted && 'text-primary',
                      !isActive && !isCompleted && 'text-muted-foreground'
                    )}>
                      {step.label}
                    </span>
                    <span className={cn(
                      'text-[10px] text-center transition-colors hidden sm:block',
                      isActive ? 'text-primary/70' : 'text-muted-foreground/70'
                    )}>
                      {step.desc}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* BRTA Warning */}
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 mb-6">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">Important Notice</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Tickets priced higher than BRTA regulations will be rejected. Please ensure your selling price complies with government regulations.
            </AlertDescription>
          </Alert>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                  {/* Green success banner with confetti-like decoration */}
                  <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-6 py-12 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0">
                      <motion.div
                        className="absolute top-3 left-6 w-3 h-3 rounded-full bg-white/30"
                        animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute top-8 right-8 w-2 h-2 rounded-full bg-white/20"
                        animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                      />
                      <motion.div
                        className="absolute bottom-6 left-10 w-4 h-4 rounded-full bg-white/15"
                        animate={{ y: [0, -10, 0], opacity: [0.15, 0.4, 0.15] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                      />
                      <motion.div
                        className="absolute bottom-4 right-12 w-2.5 h-2.5 rounded-full bg-white/25"
                        animate={{ y: [0, -7, 0], opacity: [0.25, 0.5, 0.25] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                      className="relative"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
                          >
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-bold text-white relative"
                    >
                      Ticket Listed Successfully!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-emerald-100/80 mt-2 relative"
                    >
                      Your ticket is now under review
                    </motion.p>
                  </div>

                  <div className="p-6 space-y-5">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center space-y-3"
                    >
                      {createdTicketId && (
                        <div className="bg-muted/50 rounded-xl p-3 inline-flex items-center gap-2 border">
                          <Ticket className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Ticket ID:</span>
                          <span className="font-mono font-bold text-sm">{createdTicketId}</span>
                        </div>
                      )}
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Your ticket is pending admin review. You&apos;ll receive a notification once it&apos;s approved and visible to buyers.
                      </p>

                      {/* Quick stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 text-center">
                          <Clock className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Review: 1-24h</span>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 text-center">
                          <Eye className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Track in Dashboard</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col gap-3"
                    >
                      <Link href="/user/listings" className="w-full" onClick={() => setShowSuccess(false)}>
                        <Button className="btn-primary w-full gap-2 h-11">
                          <Eye className="w-4 h-4" />
                          View My Listings
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full gap-2 h-11"
                        onClick={() => {
                          setShowSuccess(false)
                          setCreatedTicketId(null)
                          form.reset()
                          removeFile()
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        List Another Ticket
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Transport & Ticket Type */}
              <Card className="overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 border-b">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold shadow-sm">1</div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bus className="w-5 h-5 text-blue-500" />
                    Transport & Ticket Type
                  </CardTitle>
                  {stepCompletion[0] && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                <CardContent className="space-y-6">
                  {/* Transport Type */}
                  <FormField
                    control={form.control}
                    name="transportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Type *</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {transportTypes.map((type) => {
                            const Icon = type.icon
                            return (
                              <div
                                key={type.value}
                                className={cn(
                                  'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all',
                                  field.value === type.value
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                )}
                                onClick={() => field.onChange(type.value)}
                              >
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2', type.color)}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <span className={cn('font-medium', field.value === type.value ? 'text-primary' : '')}>
                                  {type.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ticket Type */}
                  <FormField
                    control={form.control}
                    name="ticketType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Type *</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          {ticketTypes.map((type) => (
                            <div
                              key={type.value}
                              className={cn(
                                'relative flex flex-col items-start p-4 rounded-xl border-2 cursor-pointer transition-all',
                                field.value === type.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              )}
                              onClick={() => field.onChange(type.value)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn('font-medium', field.value === type.value ? 'text-primary' : '')}>
                                  {type.label}
                                </span>
                                {type.badge && (
                                  <Badge variant="secondary" className="text-xs">{type.badge}</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{type.description}</span>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Ticket Image or PDF *</Label>
                    <p className="text-sm text-muted-foreground">
                      {watchTicketType === 'ONLINE_COPY'
                        ? 'PDF file is required for Online Copy tickets'
                        : 'Upload an image or PDF of your ticket (max 5MB)'}
                    </p>

                    {!fileName ? (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="ticketFile"
                          accept={watchTicketType === 'ONLINE_COPY' ? '.pdf' : 'image/*,.pdf'}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="ticketFile" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {watchTicketType === 'ONLINE_COPY' ? 'PDF only (max 5MB)' : 'PNG, JPG, PDF (max 5MB)'}
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {fileType === 'pdf' ? (
                              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-red-600" />
                              </div>
                            ) : filePreview ? (
                              <img src={filePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                            ) : null}
                            <div>
                              <p className="font-medium text-sm">{fileName}</p>
                              <p className="text-xs text-muted-foreground capitalize">{fileType} file</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {fileError && (
                      <p className="text-sm text-destructive">{fileError}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Journey Details */}
              <Card className="overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 border-b">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">2</div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    Journey Details
                  </CardTitle>
                  {stepCompletion[1] && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pnrNumber"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1.5">
                            <FormLabel>PNR Number *</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleHelp className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>The unique booking reference number on your ticket</TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <div className="relative group">
                              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input placeholder="Enter PNR number" className="pl-10 h-10 transition-all focus-visible:ring-primary/30 focus-visible:border-primary/30" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transportCompany"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1.5">
                            <FormLabel>Transport Company *</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleHelp className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>The bus, train, launch, or airline operator name</TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <div className="relative group">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input placeholder="e.g., Green Line, Bangladesh Biman" className="pl-10 h-10 transition-all focus-visible:ring-primary/30 focus-visible:border-primary/30" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fromCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select departure city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {popularCities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select destination city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {popularCities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="boardingPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boarding Point *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Gabtoli Bus Terminal, Kamalapur Railway Station" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="travelDate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1.5">
                            <FormLabel>Travel Date *</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleHelp className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>The date of your journey - must be today or later</TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <div className="relative group">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                              <Input type="date" min={new Date().toISOString().split('T')[0]} className="pl-10 h-10 transition-all focus-visible:ring-primary/30 focus-visible:border-primary/30" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="departureTime"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1.5">
                            <FormLabel>Departure Time *</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleHelp className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>The scheduled departure time of your transport</TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <div className="relative group">
                              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                              <Input type="time" className="pl-10 h-10 transition-all focus-visible:ring-primary/30 focus-visible:border-primary/30" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="classType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Type *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1.5">
                            <FormLabel>Seat Number *</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleHelp className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>Your assigned seat number as shown on the ticket</TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <div className="relative group">
                              <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input placeholder="e.g., A1, B2, 12A" className="pl-10 h-10 transition-all focus-visible:ring-primary/30 focus-visible:border-primary/30" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sleeper Position - Conditional */}
                  <AnimatePresence>
                    {showSleeperPosition && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="sleeperPosition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sleeper Position *</FormLabel>
                              <Select value={field.value || ''} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select deck position" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sleeperPositions.map((pos) => (
                                    <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 border-b">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm">3</div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    Pricing
                  </CardTitle>
                  {stepCompletion[2] && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                <CardContent className="space-y-4">
                  {/* Platform Fee Info */}
                  <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800 dark:text-blue-200 text-sm">Platform Fee Information</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-300 text-xs">
                      <p>A 1% platform fee (minimum ৳10) is deducted from the seller&apos;s earnings. When the buyer pays the full ticket price for Online Delivery, the fee is automatically calculated and deducted.</p>
                    </AlertDescription>
                  </Alert>

                  {/* Estimated Fee Calculator */}
                  {originalPrice > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold text-sm">Estimated Earnings</h4>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-3 py-2.5 bg-background rounded-lg">
                          <span className="text-sm text-muted-foreground">Selling Price:</span>
                          <span className="font-bold text-base">৳{sellingPrice.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center px-3 py-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-xs text-red-600 dark:text-red-400">Platform Fee (1%, min ৳10):</span>
                          </div>
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">-৳{platformFee.toLocaleString()}</span>
                        </div>

                        <div className="border-t border-dashed" />

                        <div className="flex justify-between items-center px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">You Receive:</span>
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">৳{sellerReceives.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Fee is automatically deducted when the transaction is completed. Funds are released to your wallet after successful delivery.
                      </p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price (BDT) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter original ticket price"
                              min="0"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The price you paid for the ticket.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price (BDT)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Leave empty to use original price"
                              min="0"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormDescription>
                            The price buyer pays. Platform fee deducted from earnings.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Price Breakdown */}
                  {(originalPrice > 0) && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">Price Summary</h4>
                        <Badge variant="secondary" className="text-xs">1% Fee Included</Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-background rounded-md">
                          <span className="text-muted-foreground">Buyer Pays:</span>
                          <span className="font-semibold">৳{sellingPrice.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-destructive text-xs">
                          <span>Platform Fee (1%, min ৳10):</span>
                          <span>-৳{platformFee.toLocaleString()}</span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <span className="font-medium text-green-700 dark:text-green-400">You Receive:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">৳{sellerReceives.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes / Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information about the ticket..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Delivery Options */}
              <Card className="overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10 border-b">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500 text-white text-xs font-bold shadow-sm">4</div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-5 h-5 text-violet-500" />
                    Ticket Delivery
                  </CardTitle>
                  {stepCompletion[3] && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                <div className="px-6 pt-1">
                  <p className="text-xs text-muted-foreground mb-4">Choose how you want to deliver the ticket to the buyer</p>
                </div>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="deliveryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Type *</FormLabel>
                        <div className="space-y-3">
                          {availableDeliveryTypes.map((type) => {
                            const Icon = type.icon
                            return (
                              <div
                                key={type.value}
                                className={cn(
                                  'relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                                  field.value === type.value
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                )}
                                onClick={() => field.onChange(type.value)}
                              >
                                <div className={cn(
                                  'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                                  field.value === type.value
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground'
                                )}>
                                  {field.value === type.value && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Icon className={cn('w-5 h-5', field.value === type.value ? 'text-primary' : '')} />
                                    <span className={cn('font-medium', field.value === type.value ? 'text-primary' : '')}>
                                      {type.label}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Delivery Info Boxes */}
                  <AnimatePresence mode="wait">
                    {watchDeliveryType === 'ONLINE_DELIVERY' && (
                      <motion.div
                        key="online"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertTitle className="text-blue-800 dark:text-blue-200">Online Delivery Info</AlertTitle>
                          <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              <li>Buyer will get instant PDF ticket via email</li>
                              <li>1% platform fee (min ৳10) will be deducted</li>
                              <li>Amount will be on hold until buyer safely boards</li>
                              <li>After confirmation, amount releases to your wallet</li>
                              <li>You can withdraw money anytime</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {watchDeliveryType === 'IN_PERSON' && (
                      <motion.div
                        key="inperson"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                          <Info className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800 dark:text-green-200">In Person Delivery Info</AlertTitle>
                          <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              <li>Meet buyer at a safe public location</li>
                              <li>Exchange ticket after receiving payment</li>
                              <li>Both parties should verify details</li>
                            </ul>
                          </AlertDescription>
                        </Alert>

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meeting Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Farmgate Metro Station, Platform 3" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {watchDeliveryType === 'COURIER' && (
                      <motion.div
                        key="courier"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                          <Info className="h-4 w-4 text-amber-600" />
                          <AlertTitle className="text-amber-800 dark:text-amber-200">Courier Delivery Info</AlertTitle>
                          <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              <li>Buyer pays first, then ticket is shipped</li>
                              <li>Courier fee can be paid by either party</li>
                              <li>Tracking number will be shared with buyer</li>
                            </ul>
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="courierService"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Courier Service *</FormLabel>
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select courier" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {courierServices.map((service) => (
                                      <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="courierFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Courier Fee (BDT) *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter courier fee"
                                    min="0"
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="courierFeePaidBy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Courier Fee Paid By *</FormLabel>
                              <div className="flex gap-4">
                                <div className={cn(
                                  'flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                  field.value === 'BUYER' ? 'border-primary bg-primary/5' : 'border-border'
                                )}
                                  onClick={() => field.onChange('BUYER')}
                                >
                                  <div className={cn(
                                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                                    field.value === 'BUYER'
                                      ? 'border-primary bg-primary'
                                      : 'border-muted-foreground'
                                  )}>
                                    {field.value === 'BUYER' && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <Label className="cursor-pointer">Buyer</Label>
                                </div>
                                <div className={cn(
                                  'flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                  field.value === 'SELLER' ? 'border-primary bg-primary/5' : 'border-border'
                                )}
                                  onClick={() => field.onChange('SELLER')}
                                >
                                  <div className={cn(
                                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                                    field.value === 'SELLER'
                                      ? 'border-primary bg-primary'
                                      : 'border-muted-foreground'
                                  )}>
                                    {field.value === 'SELLER' && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <Label className="cursor-pointer">Seller (You)</Label>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-end sticky bottom-4 z-10 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 to-transparent pt-4 pb-2"
              >
                <div className="flex gap-3 w-full sm:w-auto p-3 sm:p-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none h-11"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn-primary min-w-[160px] h-11 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    <span className="relative flex items-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        List Ticket
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                    </span>
                  </Button>
                </div>
              </motion.div>

              {/* Need Help link */}
              <div className="text-center pt-2 pb-6">
                <Link
                  href="/help"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Need Help? Visit our Help Center
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </form>
          </Form>
            </div>
            {/* End main form area */}

            {/* Right Sidebar - Floating Preview + Tips */}
            <div className="hidden lg:block w-[340px] shrink-0">
              <div className="sticky top-24 space-y-5">
                {/* Live Preview Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold">Live Preview</h3>
                  </div>
                  <Card className="overflow-hidden border-2 border-dashed border-primary/20 dark:border-primary/10">
                    {/* Transport color bar */}
                    <div className={cn('h-2 bg-gradient-to-r', transportColorMap[watchTransportType] || 'from-slate-400 to-slate-500')} />
                    <CardContent className="p-4 space-y-4">
                      {/* Transport type + company */}
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br', transportColorMap[watchTransportType] || 'from-slate-400 to-slate-500')}>
                          {currentTransportType && <currentTransportType.icon className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="secondary" className={cn('text-xs', transportTextColorMap[watchTransportType])}>
                            {currentTransportType?.label || '—'}
                          </Badge>
                          <p className="text-sm font-semibold truncate mt-0.5">
                            {watchTransportCompany || 'Company Name'}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Route */}
                      <div className="flex items-center gap-2 text-center">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="text-sm font-bold">{watchFromCity || '—'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <div className="h-px w-4 bg-muted-foreground/30" />
                          <Navigation className="w-4 h-4" />
                          <div className="h-px w-4 bg-muted-foreground/30" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">To</p>
                          <p className="text-sm font-bold">{watchToCity || '—'}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground">Class</p>
                          <p className="font-medium">{currentClassType?.label || '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Seat</p>
                          <p className="font-medium">{watchSeatNumber || '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{watchTravelDate ? new Date(watchTravelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-medium">{watchDepartureTime || '—'}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Price */}
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Selling Price</p>
                        <p className="text-xl font-bold text-primary">
                          {displayPrice > 0 ? `৳${displayPrice.toLocaleString()}` : '৳—'}
                        </p>
                      </div>

                      {/* Delivery */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Package className="w-3.5 h-3.5" />
                        <span>{deliveryTypes.find(d => d.value === watchDeliveryType)?.label || 'Select delivery'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tips Sidebar Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">Selling Tips</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {[
                          { icon: TrendingUp, text: 'Set competitive prices for faster sales' },
                          { icon: Camera, text: 'Clear photos increase buyer confidence' },
                          { icon: Shield, text: 'Verified sellers get 3x more buyers' },
                          { icon: Zap, text: 'Quick response time boosts your rating' },
                          { icon: Star, text: 'Accurate descriptions prevent disputes' },
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                            <tip.icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                            <span className="leading-relaxed">{tip.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
          {/* End flex row */}
        </div>
      </div>
    </MainLayout>
  )
}
