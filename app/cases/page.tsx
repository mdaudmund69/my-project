"use client"
import { useState } from "react"
import { Filter, Plus, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProtectedRoute from "@/components/protected-route"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

interface Case {
  id: string
  court: string
  caseNumber: string
  title: string
  teamMembers: string[]
  clients: string[]
  hearingDate: string
  stage: string
}

export default function CasesPage() {
  const [cases] = useState<Case[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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
            <BreadcrumbNav items={[{ label: "Cases" }]} />
          </div>

          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Running Cases ({cases.length})</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage and track your legal cases</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                <Filter className="h-4 w-4 flex-shrink-0" />
                Filter
              </Button>
              <Link href="/add-case" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  Add Case
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Mobile View */}
            <div className="block sm:hidden">
              {cases.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-slate-500">
                    <div className="mb-4">
                      <div className="mx-auto h-12 w-12 text-slate-400">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-slate-900 mb-2">No cases yet</p>
                    <p className="text-slate-500 mb-4 text-sm">
                      You haven't added any cases yet.{" "}
                      <Link href="/add-case" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Click here
                      </Link>{" "}
                      to add your first one.
                    </p>
                    <Link href="/add-case">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Case
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {cases.map((caseItem) => (
                    <div key={caseItem.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 truncate">{caseItem.title}</h3>
                            <p className="text-sm text-slate-500">Case: {caseItem.caseNumber}</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-2 flex-shrink-0 bg-transparent">
                            View
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-slate-700">Court:</span>
                            <span className="ml-2 text-slate-600">{caseItem.court}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Team:</span>
                            <span className="ml-2 text-slate-600">{caseItem.teamMembers.join(", ")}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Clients:</span>
                            <span className="ml-2 text-slate-600">{caseItem.clients.join(", ")}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Hearing:</span>
                            <span className="ml-2 text-slate-600">{caseItem.hearingDate}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Stage:</span>
                            <span className="ml-2 text-slate-600">{caseItem.stage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Court
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Case
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Team Member(s)
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Client(s) / External Advocate(s)
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Hearing Date
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Action(s)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {cases.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="text-slate-500">
                          <div className="mb-4">
                            <div className="mx-auto h-12 w-12 text-slate-400">
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          </div>
                          <p className="text-lg font-medium text-slate-900 mb-2">No cases yet</p>
                          <p className="text-slate-500 mb-4">
                            You haven't added any cases yet.{" "}
                            <Link href="/add-case" className="text-indigo-600 hover:text-indigo-500 font-medium">
                              Click here
                            </Link>{" "}
                            to add your first one.
                          </p>
                          <Link href="/add-case">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Your First Case
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-slate-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-900">{caseItem.court}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {caseItem.caseNumber}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-900 max-w-xs">
                          <div className="truncate" title={caseItem.title}>
                            {caseItem.title}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-900 max-w-xs">
                          <div className="truncate" title={caseItem.teamMembers.join(", ")}>
                            {caseItem.teamMembers.join(", ")}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-900 max-w-xs">
                          <div className="truncate" title={caseItem.clients.join(", ")}>
                            {caseItem.clients.join(", ")}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {caseItem.hearingDate}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-900">{caseItem.stage}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
