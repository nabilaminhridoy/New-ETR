'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Download, CheckCircle2, Clock, XCircle, RotateCcw, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, formatDate } from '@/lib/utils'

interface RefundRequest {
  id: string
  amount: number
  reason: string
  description?: string
  status: 'PENDING' | 'APPROVED' | 'REFUNDED' | 'REJECTED'
  adminNotes?: string
  rejectionReason?: string
  approvedAt?: string
  refundedAt?: string
  createdAt: string
  transaction: {
    id: string
    invoiceNumber: string
    transactionId?: string
    totalAmount: number
    paymentMethod: string
    ticket: {
      id: string
      ticketId: string
      transportType: string
      transportCompany: string
      fromCity: string
      toCity: string
      travelDate: string
    }
    buyer: {
      id: string
      name: string
      email: string
      phone: string
    }
  }
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
  processor?: {
    id: string
    name: string
    email: string
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'REFUNDED':
      return <Badge className="bg-green-500">Refunded</Badge>
    case 'APPROVED':
      return <Badge className="bg-blue-500">Approved</Badge>
    case 'PENDING':
      return <Badge variant="secondary">Pending</Badge>
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function RefundRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    refunded: 0,
    rejected: 0,
  })

  const fetchRefundRequests = async (status?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (status && status !== 'ALL') {
        params.append('status', status)
      }

      const response = await fetch(`/api/admin/refund-requests?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setRefundRequests(data.data)
        updateStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching refund requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllStats = async () => {
    try {
      const response = await fetch('/api/admin/refund-requests?status=ALL&limit=1000')
      const data = await response.json()
      if (data.success) {
        updateStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateStats = (requests: RefundRequest[]) => {
    setStats({
      all: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      approved: requests.filter(r => r.status === 'APPROVED').length,
      refunded: requests.filter(r => r.status === 'REFUNDED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length,
    })
  }

  useEffect(() => {
    fetchRefundRequests(statusFilter)
    fetchAllStats()
  }, [statusFilter])

  const handleStatusUpdate = async (id: string, status: string, notes?: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/refund-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: notes,
          rejectionReason: reason,
          processedBy: 'admin', // In real app, this would be the logged-in admin's ID
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSelectedRequest(null)
        setRejectDialogOpen(false)
        setRejectionReason('')
        setAdminNotes('')
        fetchRefundRequests(statusFilter)
        fetchAllStats()
      }
    } catch (error) {
      console.error('Error updating refund request:', error)
    }
  }

  const filteredRequests = refundRequests.filter((request) => {
    const matchesSearch =
      request.transaction.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.transaction.ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Refund Requests</h1>
          <p className="text-muted-foreground">Manage buyer refund requests</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer transition-all ${statusFilter === 'ALL' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">All</p>
                <p className="text-xl font-bold">{stats.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${statusFilter === 'PENDING' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('PENDING')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${statusFilter === 'APPROVED' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('APPROVED')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${statusFilter === 'REFUNDED' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('REFUNDED')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refunded</p>
                <p className="text-xl font-bold">{stats.refunded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${statusFilter === 'REJECTED' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setStatusFilter('REJECTED')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice, user, or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No refund requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Refund ID</TableHead>
                    <TableHead className="whitespace-nowrap">Ticket ID</TableHead>
                    <TableHead className="whitespace-nowrap">Ticket</TableHead>
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Reason</TableHead>
                    <TableHead className="whitespace-nowrap">Amount</TableHead>
                    <TableHead className="whitespace-nowrap">Transaction ID</TableHead>
                    <TableHead className="whitespace-nowrap">Method</TableHead>
                    <TableHead className="whitespace-nowrap">Account</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium text-xs">{request.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium text-xs">{request.transaction.ticket.ticketId}</TableCell>
                      <TableCell>
                        <div className="min-w-[200px]">
                          <p className="text-xs text-muted-foreground">{request.transaction.ticket.transportType}</p>
                          <p className="font-medium text-sm">{request.transaction.ticket.transportCompany}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.transaction.ticket.fromCity} → {request.transaction.ticket.toCity}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[150px]">
                          <p className="font-medium text-sm">{request.user.name}</p>
                          <p className="text-xs text-muted-foreground">{request.user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-sm" title={request.reason}>
                        {request.reason}
                      </TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">{formatPrice(request.amount)}</TableCell>
                      <TableCell className="font-medium text-xs whitespace-nowrap">
                        {request.transaction.transactionId || request.transaction.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{request.transaction.paymentMethod}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {request.transaction.invoiceNumber}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Refund Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-medium mb-2">Requested By</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedRequest.user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selectedRequest.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedRequest.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Request Date</p>
                    <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Ticket & Transaction Info */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-medium mb-2">Transaction Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Invoice Number</p>
                    <p className="font-medium">{selectedRequest.transaction.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transaction ID</p>
                    <p className="font-medium text-xs">{selectedRequest.transaction.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ticket ID</p>
                    <p className="font-medium">{selectedRequest.transaction.ticket.ticketId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transport Type</p>
                    <p className="font-medium text-sm">{selectedRequest.transaction.ticket.transportType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transport Company</p>
                    <p className="font-medium text-sm">{selectedRequest.transaction.ticket.transportCompany}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <p className="font-medium text-sm">{selectedRequest.transaction.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Route</p>
                    <p className="font-medium text-sm">
                      {selectedRequest.transaction.ticket.fromCity} → {selectedRequest.transaction.ticket.toCity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Travel Date</p>
                    <p className="font-medium text-sm">{formatDate(selectedRequest.transaction.ticket.travelDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Original Amount</p>
                    <p className="font-medium">{formatPrice(selectedRequest.transaction.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Refund Amount</p>
                    <p className="font-bold text-lg text-primary">{formatPrice(selectedRequest.amount)}</p>
                  </div>
                </div>
              </div>

              {/* Refund Reason */}
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium mb-1">Refund Reason</p>
                <p className="text-sm">{selectedRequest.reason}</p>
                {selectedRequest.description && (
                  <>
                    <p className="text-sm font-medium mt-3 mb-1">Description</p>
                    <p className="text-sm">{selectedRequest.description}</p>
                  </>
                )}
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                {selectedRequest.processor && (
                  <div>
                    <p className="text-sm text-muted-foreground">Processed By</p>
                    <p className="font-medium">{selectedRequest.processor.name}</p>
                  </div>
                )}
              </div>

              {selectedRequest.rejectionReason && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                  <p className="text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.adminNotes && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Admin Notes</p>
                  <p className="text-sm text-blue-600">{selectedRequest.adminNotes}</p>
                </div>
              )}

              {/* Admin Notes Input */}
              {selectedRequest.status === 'PENDING' && (
                <div>
                  <p className="text-sm font-medium mb-2">Admin Notes</p>
                  <Textarea
                    placeholder="Add any notes for this refund request..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'PENDING' && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    className="text-red-600"
                    onClick={() => setRejectDialogOpen(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-primary"
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'APPROVED', adminNotes)}
                  >
                    Approve
                  </Button>
                </DialogFooter>
              )}

              {selectedRequest.status === 'APPROVED' && (
                <DialogFooter>
                  <Button
                    className="bg-primary gap-2"
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'REFUNDED', adminNotes)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Refunded
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Refund Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Rejection Reason</p>
              <Textarea
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate(selectedRequest!.id, 'REJECTED', adminNotes, rejectionReason)}
                disabled={!rejectionReason}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
