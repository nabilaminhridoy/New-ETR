'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Ticket, Users, ShoppingCart, TrendingUp,
  TrendingDown, Clock, CheckCircle2, XCircle, RotateCcw,
  CalendarDays, Download, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice, formatDate } from '@/lib/utils'

// Mock data for analytics (in real app, this would come from API)
const mockStats = {
  revenue: {
    total: 1250000,
    today: 45000,
    thisMonth: 485000,
    lastMonth: 420000,
    growth: 15.5,
  },
  tickets: {
    total: 2450,
    sold: 1850,
    pending: 350,
    active: 200,
    today: 45,
    thisMonth: 520,
  },
  users: {
    total: 12500,
    active: 8750,
    newToday: 35,
    newThisMonth: 890,
  },
  transactions: {
    total: 3250,
    completed: 2850,
    pending: 280,
    failed: 120,
    amountToday: 45000,
  },
  refunds: {
    total: 85,
    pending: 15,
    approved: 20,
    refunded: 45,
    rejected: 5,
    amount: 42500,
  },
}

const recentTransactions = [
  { id: '1', type: 'sale', user: 'Rahman Ahmed', amount: 4500, status: 'COMPLETED', date: '2025-01-15T10:30:00' },
  { id: '2', type: 'refund', user: 'Fatima Khatun', amount: 3500, status: 'PENDING', date: '2025-01-15T10:25:00' },
  { id: '3', type: 'sale', user: 'Mohammad Ali', amount: 8200, status: 'COMPLETED', date: '2025-01-15T10:20:00' },
  { id: '4', type: 'sale', user: 'Nusrat Jahan', amount: 2800, status: 'FAILED', date: '2025-01-15T10:15:00' },
  { id: '5', type: 'refund', user: 'Karim Uddin', amount: 6500, status: 'APPROVED', date: '2025-01-15T10:10:00' },
]

const topRoutes = [
  { route: 'Dhaka → Chittagong', sales: 580, revenue: 2900000 },
  { route: 'Dhaka → Sylhet', sales: 420, revenue: 2100000 },
  { route: 'Dhaka → Rajshahi', sales: 350, revenue: 1750000 },
  { route: 'Chittagong → Dhaka', sales: 310, revenue: 1550000 },
  { route: 'Dhaka → Khulna', sales: 280, revenue: 1400000 },
]

const transportTypeStats = [
  { type: 'BUS', count: 1450, revenue: 7250000, percentage: 60 },
  { type: 'TRAIN', count: 650, revenue: 3250000, percentage: 27 },
  { type: 'LAUNCH', count: 250, revenue: 1250000, percentage: 10 },
  { type: 'AIR', count: 100, revenue: 500000, percentage: 3 },
]

const paymentMethodStats = [
  { method: 'bKash', count: 850, revenue: 4250000, percentage: 38 },
  { method: 'Nagad', count: 680, revenue: 3400000, percentage: 31 },
  { method: 'SSLCOMMERZ', count: 420, revenue: 2100000, percentage: 19 },
  { method: 'Upay', count: 170, revenue: 850000, percentage: 8 },
  { method: 'Others', count: 80, revenue: 400000, percentage: 4 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    // Simulate refresh
    setTimeout(() => setLoading(false), 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'REFUNDED':
      case 'APPROVED':
        return <Badge className="bg-green-500">{status}</Badge>
      case 'PENDING':
        return <Badge variant="secondary">{status}</Badge>
      case 'FAILED':
      case 'REJECTED':
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="w-4 h-4 text-green-600" />
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-red-600" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform performance and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue & Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(mockStats.revenue.total)}</div>
            <div className="flex items-center gap-2 mt-1">
              {mockStats.revenue.growth > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">+{mockStats.revenue.growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">{mockStats.revenue.growth}%</span>
                </>
              )}
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Sold */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Sold</CardTitle>
            <Ticket className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.tickets.sold.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{mockStats.tickets.pending} Pending</Badge>
              <span className="text-xs text-muted-foreground">{mockStats.tickets.today} today</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.users.total.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-500">{mockStats.users.active} Active</Badge>
              <span className="text-xs text-muted-foreground">+{mockStats.users.newThisMonth} this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.transactions.total.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">{mockStats.transactions.completed} Completed</span>
              <span className="text-xs text-muted-foreground">• {mockStats.transactions.pending} Pending</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Refund Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Refund Overview</CardTitle>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{mockStats.refunds.total}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{mockStats.refunds.pending}</span>
                  <Badge variant="secondary">{formatPrice(7500)}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{mockStats.refunds.approved}</span>
                  <Badge className="bg-blue-500">{formatPrice(10000)}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Refunded</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{mockStats.refunds.refunded}</span>
                  <Badge className="bg-green-500">{formatPrice(22500)}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Rejected</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{mockStats.refunds.rejected}</span>
                  <Badge variant="destructive">{formatPrice(2500)}</Badge>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Refund Amount</span>
                  <span className="text-lg font-bold text-red-600">{formatPrice(mockStats.refunds.amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Transport Type */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Transport Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transportTypeStats.map((stat) => (
                <div key={stat.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stat.type}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{stat.count} tickets</span>
                      <span className="font-medium">{formatPrice(stat.revenue)}</span>
                      <span className="text-xs text-muted-foreground">({stat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* More Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{route.route}</p>
                      <p className="text-xs text-muted-foreground">{route.sales} tickets sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatPrice(route.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodStats.map((stat) => (
                <div key={stat.method} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stat.method}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{stat.count} transactions</span>
                      <span className="font-medium">{formatPrice(stat.revenue)}</span>
                      <span className="text-xs text-muted-foreground">({stat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.user}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.type === 'refund' ? '-' : '+'}{formatPrice(transaction.amount)}
                    </p>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
