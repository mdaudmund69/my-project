"use client"

import { useState } from "react"
import { Upload, Search, Filter, Download, Eye, Trash2, ArrowLeft, FileText, ImageIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/components/protected-route"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  category: string
  caseId?: string
  caseName?: string
}

export default function DocumentsPage() {
  const [documents] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { value: "all", label: "All Documents" },
    { value: "contracts", label: "Contracts" },
    { value: "evidence", label: "Evidence" },
    { value: "correspondence", label: "Correspondence" },
    { value: "court-filings", label: "Court Filings" },
    { value: "research", label: "Research" },
  ]

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon size={16} className="text-blue-500" />
    if (type.includes("pdf")) return <FileText size={16} className="text-red-500" />
    return <File size={16} className="text-slate-500" />
  }

  const formatFileSize = (size: string) => {
    return size
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <ProtectedRoute allowedRoles={["lawyer"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Back to Dashboard Link */}
          <div className="mb-4 sm:mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 text-sm sm:text-base"
            >
              <ArrowLeft size={16} className="mr-2 flex-shrink-0" />
              Back to Dashboard
            </Link>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="mb-4 sm:mb-6">
            <BreadcrumbNav items={[{ label: "Documents" }]} />
          </div>

          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Documents ({documents.length})</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your legal documents and files</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                <Filter className="h-4 w-4 flex-shrink-0" />
                Filter
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Upload className="h-4 w-4 flex-shrink-0" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 flex-shrink-0" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid/List */}
          {documents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-slate-400 mb-4">
                  <Upload size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No documents yet</h3>
                <p className="text-slate-500 mb-6 text-sm sm:text-base">
                  Upload your first document to get started with document management.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mobile View - List */}
              <div className="block sm:hidden space-y-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getFileIcon(doc.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">{doc.name}</h3>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-slate-500">
                              {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {doc.category}
                              </Badge>
                              {doc.caseName && (
                                <Badge variant="secondary" className="text-xs">
                                  {doc.caseName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Eye size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Download size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-red-600 hover:text-red-700">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop View - Grid */}
              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {getFileIcon(doc.type)}
                          <CardTitle className="text-sm font-medium truncate" title={doc.name}>
                            {doc.name}
                          </CardTitle>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                            <Eye size={12} />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                            <Download size={12} />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-red-600 hover:text-red-700">
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500">
                          {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                          {doc.caseName && (
                            <Badge variant="secondary" className="text-xs">
                              {doc.caseName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
