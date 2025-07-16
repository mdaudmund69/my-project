"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileText,
  Calendar,
  MessageSquare,
  PlusCircle,
  LogOut,
  Settings,
  ChevronRight,
  Clock,
  ArrowUp,
  Scale,
  BookOpen,
  Users,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  User,
  Building,
  Phone,
  Mail,
  Menu,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { GlobalSearch } from "@/components/global-search"
import { NotificationSystem } from "@/components/notification-system"
import { dataService, type Case, type Appointment, type Client } from "@/lib/data-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStatsVisible, setIsStatsVisible] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [recentCases, setRecentCases] = useState<Case[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    loadDashboardData()

    // Animation for stats
    setTimeout(() => {
      setIsStatsVisible(true)
    }, 300)

    return () => clearInterval(timer)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [stats, cases, appointments, clients] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getCases(),
        dataService.getAppointments(),
        dataService.getClients(),
      ])

      setDashboardStats(stats)
      setRecentCases(cases.slice(0, 5))
      setUpcomingAppointments(
        appointments
          .filter((apt) => new Date(apt.startDate) > new Date())
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 5),
      )
      setRecentClients(clients.slice(0, 3))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCaseClick = (caseId: string) => {
    router.push(`/cases/${caseId}`)
  }

  const handleAppointmentClick = (appointmentId: string) => {
    router.push(`/calendar?appointment=${appointmentId}`)
  }

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["lawyer"]}>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-base sm:text-lg">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["lawyer"]}>
      <div className="min-h-screen bg-slate-50">
        {/* Enhanced Navbar */}
        <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/dashboard" className="text-indigo-600 font-bold text-lg sm:text-xl">
                  Legal<span className="text-slate-800">Mentor</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <GlobalSearch className="w-48 xl:w-64" />
                <NotificationSystem userId={user?.id || "1"} />
                <Button variant="ghost" size="sm" onClick={() => router.push("/settings")} className="p-2">
                  <Settings size={18} />
                </Button>
                <div className="border-l border-slate-200 h-6 mx-2"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm mr-2">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 mr-2">{user?.name || "User"}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center py-2 px-3 text-sm font-medium text-slate-700 hover:bg-indigo-500 hover:text-white rounded-md transition duration-200"
                >
                  <LogOut size={16} className="mr-2" />
                  Log Out
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden flex items-center space-x-2">
                <NotificationSystem userId={user?.id || "1"} />
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu size={20} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 p-0">
                    <div className="flex flex-col h-full">
                      {/* Mobile Menu Header */}
                      <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium mr-3">
                              {user?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{user?.name || "User"}</p>
                              <p className="text-sm text-slate-500">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Search */}
                      <div className="p-4 border-b border-slate-200">
                        <GlobalSearch className="w-full" />
                      </div>

                      {/* Mobile Menu Items */}
                      <div className="flex-1 p-4 space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            router.push("/settings")
                            setMobileMenuOpen(false)
                          }}
                        >
                          <Settings size={18} className="mr-3" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            handleLogout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut size={18} className="mr-3" />
                          Log Out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}
                </h1>
                <p className="text-slate-500 text-sm sm:text-base">{formatDate(currentTime)}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                    <MessageSquare size={16} className="mr-2" />
                    Start Chat
                  </Button>
                </Link>
                <Link href="/add-case" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    <PlusCircle size={16} className="mr-2" />
                    New Case
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Link href="/cases">
              <Card
                className={`hover:shadow-lg transition-all duration-300 transform cursor-pointer ${isStatsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: "100ms" }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                        <FileText size={20} className="text-indigo-600 sm:w-6 sm:h-6" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Active Cases</p>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-800">
                          {dashboardStats?.activeCases || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500 text-xs sm:text-sm font-medium ml-2">
                      <ArrowUp size={12} className="mr-1" />
                      <span>8%</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">This month</span>
                      <span className="text-slate-700 font-medium">+3 new cases</span>
                    </div>
                    <Progress value={75} className="mt-2 h-1.5 sm:h-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/clients">
              <Card
                className={`hover:shadow-lg transition-all duration-300 transform cursor-pointer ${isStatsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="bg-emerald-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                        <Users size={20} className="text-emerald-600 sm:w-6 sm:h-6" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Total Clients</p>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-800">
                          {dashboardStats?.totalClients || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500 text-xs sm:text-sm font-medium ml-2">
                      <ArrowUp size={12} className="mr-1" />
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Active clients</span>
                      <span className="text-slate-700 font-medium">{dashboardStats?.totalClients || 0}</span>
                    </div>
                    <Progress value={85} className="mt-2 h-1.5 sm:h-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/calendar">
              <Card
                className={`hover:shadow-lg transition-all duration-300 transform cursor-pointer ${isStatsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: "300ms" }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="bg-purple-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                        <Calendar size={20} className="text-purple-600 sm:w-6 sm:h-6" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Upcoming Events</p>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-800">
                          {dashboardStats?.upcomingAppointments || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500 text-xs sm:text-sm font-medium ml-2">
                      <Clock size={12} className="mr-1" />
                      <span>Today</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Next event</span>
                      <span className="text-slate-700 font-medium truncate ml-2">
                        {upcomingAppointments[0] ? formatTime(upcomingAppointments[0].startDate) : "None"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/billing">
              <Card
                className={`hover:shadow-lg transition-all duration-300 transform cursor-pointer ${isStatsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: "400ms" }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="bg-amber-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                        <DollarSign size={20} className="text-amber-600 sm:w-6 sm:h-6" />
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Total Revenue</p>
                        <p className="text-lg sm:text-2xl font-semibold text-slate-800 truncate">
                          {formatCurrency(dashboardStats?.totalRevenue || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500 text-xs sm:text-sm font-medium ml-2">
                      <TrendingUp size={12} className="mr-1" />
                      <span>15%</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Outstanding</span>
                      <span className="text-slate-700 font-medium truncate ml-2">
                        {formatCurrency(dashboardStats?.outstandingRevenue || 0)}
                      </span>
                    </div>
                    <Progress value={60} className="mt-2 h-1.5 sm:h-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
              {/* Enhanced Recent Cases */}
              <Card className="transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Recent Cases</CardTitle>
                    <CardDescription className="text-sm">Your most recently updated cases</CardDescription>
                  </div>
                  <Link href="/cases">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      View All
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {recentCases.length === 0 ? (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="text-slate-400 mb-4">
                          <Scale size={32} className="mx-auto" />
                        </div>
                        <p className="text-slate-500 mb-2">No recent cases</p>
                        <p className="text-sm text-slate-400">Your recent cases will appear here</p>
                      </div>
                    ) : (
                      recentCases.map((caseItem) => (
                        <div
                          key={caseItem.id}
                          className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleCaseClick(caseItem.id)}
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                              <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-medium text-slate-800 truncate">{caseItem.title}</h3>
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    #{caseItem.caseNumber}
                                  </Badge>
                                  <Badge className={`${getPriorityColor(caseItem.priority)} text-xs flex-shrink-0`}>
                                    {caseItem.priority}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500">
                                  <span className="flex items-center">
                                    <User size={12} className="mr-1 flex-shrink-0" />
                                    <span className="truncate">{caseItem.client.name}</span>
                                  </span>
                                  <span className="flex items-center">
                                    <Scale size={12} className="mr-1 flex-shrink-0" />
                                    <span className="truncate">{caseItem.court}</span>
                                  </span>
                                  <span className="flex items-center">
                                    <Clock size={12} className="mr-1 flex-shrink-0" />
                                    {new Date(caseItem.lastUpdated).toLocaleDateString()}
                                  </span>
                                </div>
                                {caseItem.nextHearing && (
                                  <div className="flex items-center text-xs sm:text-sm text-amber-600">
                                    <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                                    <span className="truncate">
                                      Next hearing: {new Date(caseItem.nextHearing).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-2">
                                <Badge className={`${getStatusColor(caseItem.status)} text-xs flex-shrink-0`}>
                                  {caseItem.status}
                                </Badge>
                                <div className="text-sm font-medium text-slate-700 flex-shrink-0">
                                  {formatCurrency(caseItem.billingInfo.totalAmount)}
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

              {/* Enhanced Calendar Section */}
              <Card className="transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription className="text-sm">Your scheduled meetings and court dates</CardDescription>
                  </div>
                  <Link href="/calendar">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      View Calendar
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {upcomingAppointments.length === 0 ? (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="text-slate-400 mb-4">
                          <Calendar size={32} className="mx-auto" />
                        </div>
                        <p className="text-slate-500 mb-2">No upcoming appointments</p>
                        <p className="text-sm text-slate-400">Your scheduled appointments will appear here</p>
                      </div>
                    ) : (
                      upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleAppointmentClick(appointment.id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 self-start">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-lg flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-medium text-indigo-600">
                                  {new Date(appointment.startDate).toLocaleDateString("en-US", { month: "short" })}
                                </span>
                                <span className="text-sm sm:text-lg font-bold text-indigo-700">
                                  {new Date(appointment.startDate).getDate()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium text-slate-800 truncate">{appointment.title}</h3>
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  {appointment.type}
                                </Badge>
                                <div className="flex items-center text-xs text-slate-500 flex-shrink-0">
                                  <Clock size={10} className="mr-1" />
                                  {formatTime(appointment.startDate)}
                                </div>
                              </div>
                              {appointment.description && (
                                <p className="text-sm text-slate-600 line-clamp-2">{appointment.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500">
                                <span className="flex items-center">
                                  <Building size={12} className="mr-1 flex-shrink-0" />
                                  <span className="truncate">{appointment.location}</span>
                                </span>
                                {appointment.attendees.length > 0 && (
                                  <span className="flex items-center flex-shrink-0">
                                    <Users size={12} className="mr-1" />
                                    {appointment.attendees.length} attendee(s)
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 self-start">
                              <Badge
                                className={`text-xs ${
                                  appointment.status === "scheduled"
                                    ? "bg-blue-100 text-blue-800"
                                    : appointment.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Clients */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Recent Clients</CardTitle>
                  <Link href="/clients">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {recentClients.length === 0 ? (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="text-slate-400 mb-4">
                          <Users size={32} className="mx-auto" />
                        </div>
                        <p className="text-slate-500 mb-2">No recent clients</p>
                        <p className="text-sm text-slate-400">Your recent clients will appear here</p>
                      </div>
                    ) : (
                      recentClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-3 sm:p-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleClientClick(client.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 font-semibold text-xs sm:text-sm">
                                {client.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate">{client.name}</p>
                              <p className="text-sm text-slate-500 truncate">{client.email}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-medium text-slate-700">{formatCurrency(client.totalBilled)}</p>
                              <Badge variant="outline" className="text-xs">
                                {client.cases.length} case{client.cases.length !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/activity")}
                    className="w-full sm:w-auto"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {!dashboardStats?.recentActivities || dashboardStats.recentActivities.length === 0 ? (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="text-slate-400 mb-4">
                          <Activity size={32} className="mx-auto" />
                        </div>
                        <p className="text-slate-500 mb-2">No recent activity</p>
                        <p className="text-sm text-slate-400">Your recent activities will appear here</p>
                      </div>
                    ) : (
                      dashboardStats.recentActivities.map((activity: any) => (
                        <div key={activity.id} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors duration-150">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div
                                className={`p-1.5 sm:p-2 rounded-lg ${
                                  activity.type === "case"
                                    ? "bg-blue-100 text-blue-600"
                                    : activity.type === "document"
                                      ? "bg-green-100 text-green-600"
                                      : activity.type === "meeting"
                                        ? "bg-purple-100 text-purple-600"
                                        : activity.type === "payment"
                                          ? "bg-emerald-100 text-emerald-600"
                                          : "bg-amber-100 text-amber-600"
                                }`}
                              >
                                {activity.type === "case" && <Scale size={12} />}
                                {activity.type === "document" && <FileText size={12} />}
                                {activity.type === "meeting" && <Calendar size={12} />}
                                {activity.type === "payment" && <DollarSign size={12} />}
                                {activity.type === "court" && <Activity size={12} />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 text-sm">{activity.action}</p>
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{activity.info}</p>
                              <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6 sm:space-y-8">
              {/* Enhanced User Profile Card */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-16 sm:h-24"></div>
                <CardContent className="px-4 sm:px-6 py-4 flex flex-col items-center -mt-8 sm:-mt-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg sm:text-xl">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-slate-800 mt-3 text-center">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-sm text-slate-500 text-center">{user?.specialization || "Attorney at Law"}</p>
                  {user?.company && <p className="text-sm text-slate-500 text-center">{user.company}</p>}
                  <div className="flex flex-wrap items-center justify-center mt-3 gap-2">
                    <Badge variant="outline" className="text-xs">
                      {user?.specialization || "Corporate Law"}
                    </Badge>
                    {user?.yearsOfExperience && (
                      <Badge variant="outline" className="text-xs">
                        {user.yearsOfExperience} years exp.
                      </Badge>
                    )}
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {user?.email && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    )}
                    {user?.phone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full bg-transparent"
                    onClick={() => router.push("/settings")}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                  <Link href="/chat" className="block">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 justify-start">
                      <MessageSquare size={16} className="mr-2 flex-shrink-0" />
                      Start AI Chat
                    </Button>
                  </Link>
                  <Link href="/add-case" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <PlusCircle size={16} className="mr-2 flex-shrink-0" />
                      Create New Case
                    </Button>
                  </Link>
                  <Link href="/documents" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText size={16} className="mr-2 flex-shrink-0" />
                      Upload Documents
                    </Button>
                  </Link>
                  <Link href="/calendar" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      Schedule Meeting
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Enhanced Case Management */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">Case Management</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    <Link
                      href="/cases"
                      className="flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                    >
                      <div className="bg-blue-100 rounded-lg p-2 mr-3 group-hover:bg-blue-200 transition-colors flex-shrink-0">
                        <Scale size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">All Cases</p>
                        <p className="text-sm text-slate-500">{dashboardStats?.activeCases || 0} active cases</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                    </Link>

                    <Link
                      href="/case-diary"
                      className="flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                    >
                      <div className="bg-purple-100 rounded-lg p-2 mr-3 group-hover:bg-purple-200 transition-colors flex-shrink-0">
                        <BookOpen size={14} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">Case Diary</p>
                        <p className="text-sm text-slate-500">Track activities & notes</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                    </Link>

                    <Link
                      href="/documents"
                      className="flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                    >
                      <div className="bg-green-100 rounded-lg p-2 mr-3 group-hover:bg-green-200 transition-colors flex-shrink-0">
                        <FileText size={14} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">Documents</p>
                        <p className="text-sm text-slate-500">Upload & manage files</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                    </Link>

                    <Link
                      href="/team-members"
                      className="flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                    >
                      <div className="bg-orange-100 rounded-lg p-2 mr-3 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                        <Users size={14} className="text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">Team Members</p>
                        <p className="text-sm text-slate-500">Manage your team</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                    </Link>

                    <Link
                      href="/todos"
                      className="flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                    >
                      <div className="bg-yellow-100 rounded-lg p-2 mr-3 group-hover:bg-yellow-200 transition-colors flex-shrink-0">
                        <CheckSquare size={14} className="text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">To-dos</p>
                        <p className="text-sm text-slate-500">Manage tasks & deadlines</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard
