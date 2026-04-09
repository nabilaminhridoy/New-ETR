'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Unlock, Check, X, RefreshCw, Plus, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface Permission {
  id: string
  name: string
  description: string | null
  category: string
  createdAt: string
}

interface RoleWithPermissions {
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  permissions: Permission[]
  permissionCount: number
}

export default function RolesAndPermissionsPage() {
  const [roles, setRoles] = useState<RoleWithPermissions[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [isCreatingPermission, setIsCreatingPermission] = useState(false)

  const [newPermission, setNewPermission] = useState({
    name: '',
    description: '',
    category: 'users',
  })

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['users']))

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/admin/roles'),
        fetch('/api/admin/permissions'),
      ])

      const rolesData = await rolesRes.json()
      const permissionsData = await permissionsRes.json()

      if (rolesData.success) {
        setRoles(rolesData.roles)
      }
      if (permissionsData.success) {
        setPermissions(permissionsData.permissions)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load roles and permissions')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleEditRole = (role: RoleWithPermissions) => {
    setSelectedRole(role)
    setSelectedPermissionIds(role.permissions.map((p) => p.id))
    setIsEditingRole(true)
  }

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return

    try {
      const response = await fetch(`/api/admin/roles/${selectedRole.role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permissionIds: selectedPermissionIds,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Role permissions updated successfully')
        setIsEditingRole(false)
        setSelectedRole(null)
        fetchData()
      } else {
        toast.error(data.error || 'Failed to update role permissions')
      }
    } catch (error) {
      console.error('Error updating role permissions:', error)
      toast.error('Failed to update role permissions')
    }
  }

  const handleCreatePermission = async () => {
    if (!newPermission.name || !newPermission.category) {
      toast.error('Name and category are required')
      return
    }

    try {
      const response = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPermission),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Permission created successfully')
        setIsCreatingPermission(false)
        setNewPermission({ name: '', description: '', category: 'users' })
        fetchData()
      } else {
        toast.error(data.error || 'Failed to create permission')
      }
    } catch (error) {
      console.error('Error creating permission:', error)
      toast.error('Failed to create permission')
    }
  }

  const handleDeletePermission = async (permissionId: string) => {
    try {
      const response = await fetch(`/api/admin/permissions/${permissionId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Permission deleted successfully')
        fetchData()
      } else {
        toast.error(data.error || 'Failed to delete permission')
      }
    } catch (error) {
      console.error('Error deleting permission:', error)
      toast.error('Failed to delete permission')
    }
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-500'
      case 'ADMIN':
        return 'bg-blue-500'
      default:
        return 'bg-slate-500'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Admin'
      default:
        return 'User'
    }
  }

  const groupPermissionsByCategory = (perms: Permission[]) => {
    const groups: Record<string, Permission[]> = {}
    perms.forEach((perm) => {
      if (!groups[perm.category]) {
        groups[perm.category] = []
      }
      groups[perm.category].push(perm)
    })
    return groups
  }

  const permissionGroups = groupPermissionsByCategory(permissions)
  const rolePermissionGroups = selectedRole ? groupPermissionsByCategory(permissions) : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={() => setIsCreatingPermission(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Permission
          </Button>
        </div>
      </div>

      {!loading && permissions.length === 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900 dark:text-orange-100">No permissions initialized</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">Please initialize default permissions using the API endpoint.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roles"><Shield className="w-4 h-4 mr-2" />Roles</TabsTrigger>
            <TabsTrigger value="permissions"><Lock className="w-4 h-4 mr-2" />Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card key={role.role}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{getRoleLabel(role.role)}</CardTitle>
                      <Badge className={getRoleBadgeColor(role.role)}>{role.permissionCount}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{role.permissionCount} permissions assigned</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {role.permissions.slice(0, 5).map((permission) => (
                          <div key={permission.id} className="text-xs flex items-center gap-2 p-1.5 rounded bg-muted">
                            <Check className="w-3 h-3 text-green-600" />
                            {permission.name}
                          </div>
                        ))}
                        {role.permissions.length > 5 && <p className="text-xs text-muted-foreground">+{role.permissions.length - 5} more</p>}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditRole(role)}>
                        <Shield className="w-4 h-4 mr-2" />
                        Edit Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            {Object.entries(permissionGroups).map(([category, categoryPermissions]) => (
              <Card key={category}>
                <CardHeader className="cursor-pointer flex flex-row items-center justify-between py-3" onClick={() => toggleCategory(category)}>
                  <CardTitle className="text-base capitalize">{category}</CardTitle>
                  {expandedCategories.has(category) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardHeader>
                {expandedCategories.has(category) && (
                  <CardContent>
                    <div className="space-y-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex-1">
                            <p className="font-medium">{permission.name}</p>
                            {permission.description && <p className="text-sm text-muted-foreground">{permission.description}</p>}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePermission(permission.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Permissions for {selectedRole && getRoleLabel(selectedRole.role)}</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              {Object.entries(rolePermissionGroups).map(([category, categoryPermissions]) => (
                <div key={category}>
                  <h3 className="font-medium mb-2 capitalize">{category}</h3>
                  <div className="space-y-2">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissionIds.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPermissionIds([...selectedPermissionIds, permission.id])
                            } else {
                              setSelectedPermissionIds(selectedPermissionIds.filter((id) => id !== permission.id))
                            }
                          }}
                        />
                        <div className="flex-1">
                          <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">{permission.name}</label>
                          {permission.description && <p className="text-xs text-muted-foreground">{permission.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingRole(false)}>Cancel</Button>
            <Button onClick={handleSaveRolePermissions}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatingPermission} onOpenChange={setIsCreatingPermission}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Permission Name</label>
              <Input placeholder="e.g., manage_users" value={newPermission.name} onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newPermission.category} onValueChange={(value) => setNewPermission({ ...newPermission, category: value })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="tickets">Tickets</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="permissions">Permissions</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="verifications">Verifications</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Description of this permission" value={newPermission.description} onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingPermission(false)}>Cancel</Button>
            <Button onClick={handleCreatePermission}>Create Permission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
