'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RefreshCw, Eye, CheckCircle2, XCircle, Calendar, User, FileText, Loader2, Download, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'

interface AuditLogUser {
  id: string
  name: string | null
  email: string
  role: string
}

interface AuditLog {
  id: string
  userId: string
  action: string
  entityType: string | null
  entityId: string | null
  changes: string | null
  status: string
  errorMessage: string | null
  ipAddress: string | null
  userAgent: string | null
  metadata: string | null
  createdAt: string
  user: AuditLogUser
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('')
  const [entityTypeFilter, setEntityTypeFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchLogs(1)
  }, [searchQuery, statusFilter, actionFilter, entityTypeFilter, startDate, endDate])

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(actionFilter && { action: actionFilter }),
        ...(entityTypeFilter && { entityType: entityTypeFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })

      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setLogs(data.auditLogs)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || 'Failed to fetch audit logs')
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Failed to fetch audit logs')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchLogs(pagination.page)
  }

  const handleViewDetails = async (logId: string) => {
    try {
      const response = await fetch(`/api/admin/audit-logs/${logId}`)
      const data = await response.json()

      if (data.success) {
        setSelectedLog(data.auditLog)
      } else {
        toast.error(data.error || 'Failed to fetch log details')
      }
    } catch (error) {
      console.error('Error fetching log details:', error)
      toast.error('Failed to fetch log details')
    }
  }

  const handleExportLogs = () => {
    const headers = ['Date', 'User', 'Email', 'Role', 'Action', 'Entity', 'Status', 'IP Address']
    const rows = logs.map((log) => [
      formatDateTime(log.createdAt),
      log.user.name || 'Unknown',
      log.user.email,
      log.user.role,
      log.action,
      log.entityType || '-',
      log.status,
      log.ipAddress || '-',
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Audit logs exported successfully')
  }

  const getStatusBadge = (status: string) => {
    return status === 'success' ? (
      <Badge className="bg-green-500">Success</Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    )
  }

  const getActionIcon = (action: string) => {
    const lowerAction = action.toLowerCase()
    if (lowerAction.includes('create') || lowerAction.includes('add')) {
      return <Plus className="w-4 h-4 text-green-600" />
    } else if (lowerAction.includes('delete') || lowerAction.includes('remove')) {
      return <XCircle className="w-4 h-4 text-red-600" />
    } else if (lowerAction.includes('update') || lowerAction.includes('edit')) {
      return <RefreshCw className="w-4 h-4 text-blue-600" />
    } else if (lowerAction.includes('login')) {
      return <User className="w-4 h-4 text-green-600" />
    } else if (lowerAction.includes('logout')) {
      return <User className="w-4 h-4 text-slate-600" />
    }
    return <FileText className="w-4 h-4 text-primary" />
  }

  const parseJson = (jsonString: string | null) => {
    if (!jsonString) return null
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      return jsonString
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all admin actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by action, user, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Action (e.g., login)" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} />
            <Input placeholder="Entity (e.g., user)" value={entityTypeFilter} onChange={(e) => setEntityTypeFilter(e.target.value)} />
            <div className="flex gap-2">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1" />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No audit logs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {log.user.name?.charAt(0) || log.user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{log.user.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{log.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {log.entityType && <p className="font-medium">{log.entityType}</p>}
                        {log.entityId && <p className="text-xs text-muted-foreground">ID: {log.entityId}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.ipAddress || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{formatDateTime(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedLog.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{selectedLog.user.name || 'Unknown'} ({selectedLog.user.email})</p>
                  <p className="text-xs text-muted-foreground">Role: {selectedLog.user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Action</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                {selectedLog.entityType && (
                  <div>
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <p className="font-medium">{selectedLog.entityType}</p>
                  </div>
                )}
                {selectedLog.entityId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Entity ID</p>
                    <p className="font-medium">{selectedLog.entityId}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-medium">{selectedLog.ipAddress}</p>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">User Agent</p>
                    <p className="font-medium text-sm break-all">{selectedLog.userAgent}</p>
                  </div>
                )}
              </div>

              {selectedLog.errorMessage && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Error Message</p>
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-red-900 dark:text-red-100 text-sm">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              {selectedLog.changes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Changes</p>
                  <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(parseJson(selectedLog.changes), null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Metadata</p>
                  <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(parseJson(selectedLog.metadata), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
