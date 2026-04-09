'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, MoreHorizontal, UserPlus, Shield, Ban, CheckCircle2, XCircle, Mail, Phone, Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isActive: boolean
  isVerified: boolean
  isEmailVerified: boolean
  profileImage: string | null
  createdAt: string
  totalSales: number
  totalPurchases: number
  balance: number
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [refreshing, setRefreshing] = useState(false)

  // Block/Unblock dialog state
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState<User | null>(null)

  // Change role dialog state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN' | 'SUPER_ADMIN'>('USER')

  const [currentUserRole, setCurrentUserRole] = useState<'USER' | 'ADMIN' | 'SUPER_ADMIN'>('USER')

  useEffect(() => {
    // Get current user role from auth store
    const userStr = localStorage.getItem('auth-storage')
    if (userStr) {
      try {
        const authData = JSON.parse(userStr)
        if (authData.state?.user?.role) {
          setCurrentUserRole(authData.state.user.role)
        }
      } catch (e) {
        console.error('Error parsing auth data:', e)
      }
    }
  }, [])

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
      })

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers(1)
  }, [searchQuery, statusFilter, roleFilter])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUsers(pagination.page)
  }

  const handleViewDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()

      if (response.ok) {
        setSelectedUser(data.user)
      } else {
        toast.error(data.error || 'Failed to fetch user details')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Failed to fetch user details')
    }
  }

  const handleBlockUser = () => {
    if (!userToBlock) return

    fetch(`/api/admin/users/${userToBlock.id}/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ block: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('User blocked successfully')
          setBlockDialogOpen(false)
          setUserToBlock(null)
          fetchUsers(pagination.page)
        } else {
          toast.error(data.error || 'Failed to block user')
        }
      })
      .catch((error) => {
        console.error('Error blocking user:', error)
        toast.error('Failed to block user')
      })
  }

  const handleUnblockUser = (userId: string) => {
    fetch(`/api/admin/users/${userId}/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ block: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('User unblocked successfully')
          fetchUsers(pagination.page)
        } else {
          toast.error(data.error || 'Failed to unblock user')
        }
      })
      .catch((error) => {
        console.error('Error unblocking user:', error)
        toast.error('Failed to unblock user')
      })
  }

  const handleChangeRole = () => {
    if (!userToChangeRole) return

    fetch(`/api/admin/users/${userToChangeRole.id}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message || 'Role changed successfully')
          setRoleDialogOpen(false)
          setUserToChangeRole(null)
          fetchUsers(pagination.page)
        } else {
          toast.error(data.error || 'Failed to change role')
        }
      })
      .catch((error) => {
        console.error('Error changing role:', error)
        toast.error('Failed to change role')
      })
  }

  const openBlockDialog = (user: User) => {
    setUserToBlock(user)
    setBlockDialogOpen(true)
  }

  const openRoleDialog = (user: User) => {
    setUserToChangeRole(user)
    setNewRole(user.role)
    setRoleDialogOpen(true)
  }

  const getStatusBadge = (status: boolean) => {
    return status
      ? <Badge className="bg-green-500">Active</Badge>
      : <Badge variant="destructive">Blocked</Badge>
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-purple-500">Super Admin</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-500">Admin</Badge>
      default:
        return <Badge variant="secondary">User</Badge>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          {/* <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button> */}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">{pagination.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{users.filter(u => u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-xl font-bold">{users.filter(u => !u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-xl font-bold">{users.filter(u => u.isVerified).length}</p>
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
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user.profileImage || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{user.totalSales} sales • {user.totalPurchases} purchases</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3" />
                        {user.name}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">৳{user.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {currentUserRole === 'SUPER_ADMIN' && (
                            <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                              <Shield className="w-4 h-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => user.isActive ? openBlockDialog(user) : handleUnblockUser(user.id)}
                            className={user.isActive ? 'text-red-600' : 'text-green-600'}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            {user.isActive ? 'Block User' : 'Unblock User'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.profileImage || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedUser.name?.charAt(0) || selectedUser.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name || 'Unknown'}</h3>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.isActive)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="font-medium">{selectedUser.totalSales}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="font-medium">{selectedUser.totalPurchases}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="font-medium text-primary">৳{selectedUser.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Verified</p>
                  <p className="font-medium">{selectedUser.isEmailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Verified</p>
                  <p className="font-medium">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block User Dialog */}
      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block <strong>{userToBlock?.name || userToBlock?.email}</strong>?
              This will prevent them from accessing their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlockUser} className="bg-red-600 hover:bg-red-700">
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          {userToChangeRole && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Change role for <strong>{userToChangeRole.name || userToChangeRole.email}</strong>
              </p>
              <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole}>Change Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
