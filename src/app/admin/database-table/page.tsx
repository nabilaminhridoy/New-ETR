'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Loader2, Database, Table as TableIcon, Search, RefreshCw, 
  Columns, Key, Link2, FileText, ArrowUpDown, ChevronLeft, ChevronRight
} from 'lucide-react'

interface DatabaseTable {
  name: string
  rowCount: number
}

interface TableColumn {
  name: string
  type: string
  nullable: boolean
  default: string | null
  maxLength: number | null
  precision: number | null
  scale: number | null
  isPrimaryKey: boolean
  position: number
}

interface TableStructure {
  name: string
  columns: TableColumn[]
  primaryKeys: string[]
  foreignKeys: Array<{ column_name: string; foreign_table_name: string; foreign_column_name: string }>
  indexes: Array<{ index_name: string; column_name: string; index_type: string }>
}

interface TableData {
  tableName: string
  columns: string[]
  rows: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function DatabaseTablePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [tables, setTables] = useState<DatabaseTable[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'data' | 'structure'>('data')
  const [tableStructure, setTableStructure] = useState<TableStructure | null>(null)
  const [tableData, setTableData] = useState<TableData | null>(null)
  
  // Data view state
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')

  // Loading states
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoadingStructure, setIsLoadingStructure] = useState(false)

  useEffect(() => {
    fetchTables()
  }, [])

  useEffect(() => {
    if (selectedTable) {
      if (activeTab === 'data') {
        fetchTableData(selectedTable)
      } else {
        fetchTableStructure(selectedTable)
      }
    }
  }, [selectedTable, activeTab, page, limit, search, sortColumn, sortOrder])

  const fetchTables = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/database/tables')
      const data = await response.json()
      if (data.success) {
        setTables(data.tables)
      } else {
        throw new Error(data.error || 'Failed to fetch tables')
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
      toast({
        title: 'Error',
        description: 'Failed to load database tables',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTableStructure = async (tableName: string) => {
    setIsLoadingStructure(true)
    try {
      const response = await fetch(`/api/admin/database/tables/${tableName}/structure`)
      const data = await response.json()
      if (data.success) {
        setTableStructure(data.table)
      } else {
        throw new Error(data.error || 'Failed to fetch table structure')
      }
    } catch (error) {
      console.error('Error fetching table structure:', error)
      toast({
        title: 'Error',
        description: 'Failed to load table structure',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingStructure(false)
    }
  }

  const fetchTableData = async (tableName: string) => {
    setIsLoadingData(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortColumn && { sortColumn, sortOrder }),
      })

      const response = await fetch(`/api/admin/database/tables/${tableName}/data?${params}`)
      const data = await response.json()
      if (data.success) {
        setTableData(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch table data')
      }
    } catch (error) {
      console.error('Error fetching table data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load table data',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortColumn(column)
      setSortOrder('ASC')
    }
    setPage(1)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const renderCellContent = (value: any, column: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">NULL</span>
    }
    
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'TRUE' : 'FALSE'}</Badge>
    }
    
    if (typeof value === 'object') {
      return <code className="text-xs bg-muted px-1 rounded">{JSON.stringify(value)}</code>
    }
    
    const strValue = String(value)
    if (strValue.length > 100) {
      return (
        <div className="max-w-xs">
          <span className="text-xs">{strValue.substring(0, 100)}...</span>
          <span className="text-xs text-muted-foreground block">({strValue.length} chars)</span>
        </div>
      )
    }
    
    return <span className="text-sm">{strValue}</span>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            Database Tables
          </h1>
          <p className="text-muted-foreground">View and manage database tables</p>
        </div>
        <Button variant="outline" onClick={fetchTables} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TableIcon className="w-4 h-4" />
              Tables
            </CardTitle>
            <CardDescription>{tables.length} tables found</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-1">
                  {tables.map((table) => (
                    <button
                      key={table.name}
                      onClick={() => {
                        setSelectedTable(table.name)
                        setActiveTab('data')
                        setPage(1)
                        setSearch('')
                        setSortColumn('')
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTable === table.name
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="font-medium text-sm">{table.name}</div>
                      <div className="text-xs opacity-70 mt-1">{table.rowCount} rows</div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Table Content */}
        <Card className="lg:col-span-3">
          {selectedTable ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg">{selectedTable}</CardTitle>
                  <CardDescription>
                    {tableData ? `${tableData.pagination.total} total rows` : ''}
                  </CardDescription>
                </div>
                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                  <TabsList>
                    <TabsTrigger value="data" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Data
                    </TabsTrigger>
                    <TabsTrigger value="structure" className="gap-2">
                      <Columns className="w-4 h-4" />
                      Structure
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {activeTab === 'data' ? (
                    <motion.div
                      key="data"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Search and Filter */}
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search in all columns..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25 rows</SelectItem>
                            <SelectItem value="50">50 rows</SelectItem>
                            <SelectItem value="100">100 rows</SelectItem>
                            <SelectItem value="200">200 rows</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Data Table */}
                      {isLoadingData ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : tableData && tableData.rows.length > 0 ? (
                        <>
                          <ScrollArea className="h-[calc(100vh-420px)]">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {tableData.columns.map((column) => (
                                    <TableHead 
                                      key={column}
                                      className="cursor-pointer hover:bg-muted transition-colors select-none"
                                      onClick={() => handleSort(column)}
                                    >
                                      <div className="flex items-center gap-2">
                                        {column}
                                        {sortColumn === column && (
                                          <ArrowUpDown className="w-4 h-4" />
                                        )}
                                      </div>
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tableData.rows.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {tableData.columns.map((column) => (
                                      <TableCell key={column}>
                                        {renderCellContent(row[column], column)}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>

                          {/* Pagination */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, tableData.pagination.total)} of {tableData.pagination.total} entries
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                              </Button>
                              <span className="text-sm px-3">
                                Page {page} of {tableData.pagination.totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(tableData!.pagination.totalPages, p + 1))}
                                disabled={page === tableData.pagination.totalPages}
                              >
                                Next
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          No data found in this table
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="structure"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {isLoadingStructure ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : tableStructure ? (
                        <ScrollArea className="h-[calc(100vh-380px)]">
                          <div className="space-y-6">
                            {/* Columns */}
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Columns className="w-4 h-4" />
                                Columns ({tableStructure.columns.length})
                              </h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Column</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Nullable</TableHead>
                                    <TableHead>Default</TableHead>
                                    <TableHead>Key</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {tableStructure.columns.map((column) => (
                                    <TableRow key={column.name}>
                                      <TableCell className="font-medium">{column.name}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline">{column.type}</Badge>
                                      </TableCell>
                                      <TableCell>
                                        {column.nullable ? (
                                          <Badge variant="secondary">YES</Badge>
                                        ) : (
                                          <Badge className="bg-red-500">NO</Badge>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">
                                        {column.default || <span className="italic">NULL</span>}
                                      </TableCell>
                                      <TableCell>
                                        {column.isPrimaryKey && (
                                          <Badge variant="default" className="gap-1">
                                            <Key className="w-3 h-3" />
                                            PK
                                          </Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Foreign Keys */}
                            {tableStructure.foreignKeys.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                  <Link2 className="w-4 h-4" />
                                  Foreign Keys ({tableStructure.foreignKeys.length})
                                </h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Column</TableHead>
                                      <TableHead>References</TableHead>
                                      <TableHead>On Table</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {tableStructure.foreignKeys.map((fk, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="font-medium">{fk.column_name}</TableCell>
                                        <TableCell>{fk.foreign_column_name}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">{fk.foreign_table_name}</Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            {/* Indexes */}
                            {tableStructure.indexes.length > 0 && (
                              <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Indexes ({tableStructure.indexes.length})
                                </h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Index Name</TableHead>
                                      <TableHead>Column</TableHead>
                                      <TableHead>Type</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {tableStructure.indexes.map((index, indexNum) => (
                                      <TableRow key={indexNum}>
                                        <TableCell className="font-medium">{index.index_name}</TableCell>
                                        <TableCell>{index.column_name}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">{index.index_type}</Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Database className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Select a Table</h3>
              <p className="text-muted-foreground">
                Choose a table from the list to view its data or structure
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </motion.div>
  )
}
