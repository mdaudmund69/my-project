"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Scale, FileText, Calendar, DollarSign, ActivityIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/components/protected-route"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

interface ActivityItem {
  id: string
  type: "case" | "document" | "meeting" | "payment" | "court"
  action: string
  info: string
  time: string
  date: string
  relatedId?: string
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      // Mock data for activities
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "case",
          action: "Case created",
          info: "Property Dispute - Smith vs. Johnson",
          time: "2 hours ago",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          type: "document",
          action: "Document uploaded",
          info: "Contract Agreement #12456",
          time: "4 hours ago",
          date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "meeting",
          action: "Client meeting",
          info: "Consultation with Robert Smith",
          time: "Yesterday",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          type: "payment",
          action: "Invoice paid",
          info: "Payment received from ABC Corp",
          time: "2 days ago",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "5",
          type: "court",
          action: "Court hearing",
          info: "Preliminary hearing scheduled",
          time: "3 days ago",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "6",
          type: "case",
          action: "Case updated",
          info: "Status changed to Active - Corporate Merger Case",
          time: "1 week ago",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "7",
          type: "document",
          action: "Document reviewed",
          info: "Legal Brief #789 reviewed and approved",
          time: "1 week ago",
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "8",
          type: "meeting",
          action: "Team meeting",
          info: "Weekly case review with legal team",
          time: "2 weeks ago",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setActivities(mockActivities)
    } catch (error) {
      console.error("Error loading activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "case":
        return <Scale size={16} />
      case "document":
        return <FileText size={16} />
      case "meeting":
        return <Calendar size={16} />
      case "payment":
        return <DollarSign size={16} />
      case "court":
        return <ActivityIcon size={16} />
      default:
        return <ActivityIcon size={16} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "case":
        return "bg-blue-100 text-blue-600"
      case "document":
        return "bg-green-100 text-green-600"
      case "meeting":
        return "bg-purple-100 text-purple-600"
      case "payment":
        return "bg-emerald-100 text-emerald-600"
      case "court":
        return "bg-amber-100 text-amber-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const filteredAndSortedActivities = activities
    .filter((activity) => {
      const matchesSearch =
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.info.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === "all" || activity.type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["lawyer"]}>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-base sm:text-lg">Loading activities...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
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
            <BreadcrumbNav items={[{ label: "Activity" }]} />
          </div>

          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Activity Log</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Track all your recent activities and updates</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="case">Cases</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="court">Court</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activities List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Recent Activities ({filteredAndSortedActivities.length})
              </CardTitle>
              <CardDescription>Your complete activity history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {filteredAndSortedActivities.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-slate-400 mb-4">
                      <ActivityIcon size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No activities found</h3>
                    <p className="text-slate-500">
                      {searchTerm || filterType !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Your activities will appear here as you use the system."}
                    </p>
                  </div>
                ) : (
                  filteredAndSortedActivities.map((activity) => (
                    <div key={activity.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-150">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-slate-800 mb-1">{activity.action}</h3>
                              <p className="text-sm text-slate-600 mb-2">{activity.info}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{activity.time}</span>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {activity.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
