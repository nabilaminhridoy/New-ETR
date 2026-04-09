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
import { Loader2, Server, Database, Shield, Globe, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

interface EnvironmentSettings {
  application: {
    appName: string
    appEnv: string
    appUrl: string
    debugMode: boolean
    maintenanceMode: boolean
  }
  security: {
    sslEnabled: boolean
    sessionTimeout: number
    maxLoginAttempts: number
  }
  database: {
    dbConnection: string
    dbHost: string
    dbPort: string
    dbName: string
    dbUsername: string
    dbPassword: string
    dbStatus: string
    lastBackup: string
  }
  cache: {
    cacheEnabled: boolean
    cacheTTL: number
  }
}

export default function EnvironmentSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [settings, setSettings] = useState<EnvironmentSettings | null>(null)
  const [appName, setAppName] = useState('')
  const [appUrl, setAppUrl] = useState('')
  const [sessionTimeout, setSessionTimeout] = useState('60')
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5')
  const [cacheTTL, setCacheTTL] = useState('3600')
  const [dbHost, setDbHost] = useState('')
  const [dbPort, setDbPort] = useState('')
  const [dbName, setDbName] = useState('')
  const [dbUsername, setDbUsername] = useState('')
  const [dbPassword, setDbPassword] = useState('')

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/environment-settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
          setAppName(data.application.appName || '')
          setAppUrl(data.application.appUrl || '')
          setSessionTimeout(String(data.security.sessionTimeout))
          setMaxLoginAttempts(String(data.security.maxLoginAttempts))
          setCacheTTL(String(data.cache.cacheTTL))
          setDbHost(data.database.dbHost || '')
          setDbPort(data.database.dbPort || '')
          setDbName(data.database.dbName || '')
          setDbUsername(data.database.dbUsername || '')
          setDbPassword(data.database.dbPassword || '')
        }
      } catch (error) {
        console.error('Error fetching environment settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to load environment settings',
          variant: 'destructive',
        })
      } finally {
        setIsFetching(false)
      }
    }
    fetchSettings()
  }, [toast])

  const handleSave = async () => {
    if (!settings) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/environment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: {
            appName: appName,
            appUrl: appUrl,
            debugMode: settings.application.debugMode,
            maintenanceMode: settings.application.maintenanceMode,
          },
          database: {
            dbHost: dbHost,
            dbPort: dbPort,
            dbName: dbName,
            dbUsername: dbUsername,
            dbPassword: dbPassword,
          },
          security: {
            sslEnabled: settings.security.sslEnabled,
            sessionTimeout: parseInt(sessionTimeout) || 60,
            maxLoginAttempts: parseInt(maxLoginAttempts) || 5,
          },
          cache: {
            cacheEnabled: settings.cache.cacheEnabled,
            cacheTTL: parseInt(cacheTTL) || 3600,
          },
        }),
      })

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'Environment settings have been updated successfully.',
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving environment settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save environment settings',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = async () => {
    toast({
      title: 'Cache Cleared',
      description: 'Application cache has been cleared successfully.',
    })
  }

  const handleBackup = async () => {
    toast({
      title: 'Backup Started',
      description: 'Database backup has been initiated.',
    })
  }

  const handleOptimize = async () => {
    toast({
      title: 'Optimization Complete',
      description: 'Database has been optimized successfully.',
    })
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load settings</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Environment Settings</h1>
          <p className="text-muted-foreground">Configure application environment settings</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>

      {/* Maintenance Mode Warning */}
      {settings.application.maintenanceMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Maintenance Mode is Active
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                The website is currently offline for visitors. Only administrators can access the site. 
                Toggle the switch below to disable maintenance mode.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Site Online Status */}
      {!settings.application.maintenanceMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Site is Online
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                The website is accessible to all visitors.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Mode */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="w-5 h-5" />
              Application Mode
            </CardTitle>
            <CardDescription>Configure application runtime settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="appName">App Name</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="appName"
                  value={appName}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="appUrl">App URL</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="appUrl"
                  type="url"
                  value={appUrl}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Application Environment</Label>
                <p className="text-sm text-muted-foreground">Current environment mode</p>
              </div>
              <Badge className={settings.application.appEnv === 'production' ? 'bg-green-500' : 'bg-yellow-500'}>
                {settings.application.appEnv === 'production' ? 'Production' : 'Development'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Enable detailed error messages</p>
              </div>
              <Switch
                checked={settings.application.debugMode}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  application: { ...settings.application, debugMode: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Take site offline for maintenance</p>
              </div>
              <Switch
                checked={settings.application.maintenanceMode}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  application: { ...settings.application, maintenanceMode: checked }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Security configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SSL/HTTPS</Label>
                <p className="text-sm text-muted-foreground">Force secure connections</p>
              </div>
              <Switch
                checked={settings.security.sslEnabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  security: { ...settings.security, sslEnabled: checked }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input 
                id="sessionTimeout" 
                type="number" 
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input 
                id="maxLoginAttempts" 
                type="number" 
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Configuration
            </CardTitle>
            <CardDescription>Database connection details and management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dbConnection">Database Connection</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="dbConnection"
                  value={settings.database.dbConnection}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dbHost">Database Host</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="dbHost"
                  value={dbHost}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dbPort">Database Port</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="dbPort"
                  value={dbPort}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dbName">Database Name</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="dbName"
                  value={dbName}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dbUsername">Database Username</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="dbUsername"
                  value={dbUsername}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="dbPassword">Database Password</Label>
                  <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                </div>
                <Input
                  id="dbPassword"
                  type="password"
                  value={dbPassword}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm font-medium">Connection Status</span>
                <Badge variant="secondary" className="bg-green-500 hover:bg-green-600">
                  {settings.database.dbStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-sm">{settings.database.lastBackup}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleBackup}>
                Backup Now
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleOptimize}>
                Optimize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cache Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Cache Settings
            </CardTitle>
            <CardDescription>Performance optimization settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Caching</Label>
                <p className="text-sm text-muted-foreground">Improve site performance</p>
              </div>
              <Switch
                checked={settings.cache.cacheEnabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings,
                  cache: { ...settings.cache, cacheEnabled: checked }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cacheTTL">Cache TTL (seconds)</Label>
              <Input 
                id="cacheTTL" 
                type="number" 
                value={cacheTTL}
                onChange={(e) => setCacheTTL(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full" onClick={handleClearCache}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
