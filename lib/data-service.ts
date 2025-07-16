// Enhanced data models
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  accountType: "lawyer" | "client" | "admin"
  barNumber?: string
  specialization?: string
  yearsOfExperience?: number
  bio?: string
  avatar?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  dateFormat: string
  notifications: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  caseUpdates: boolean
  appointmentReminders: boolean
  invoiceAlerts: boolean
  teamUpdates: boolean
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  description: string
  status: "active" | "pending" | "completed" | "on-hold" | "archived"
  priority: "high" | "medium" | "low"
  category: string
  client: Client
  assignedLawyers: string[]
  court: string
  courtHall?: string
  floorNo?: string
  classification?: string
  dateCreated: string
  dateOfFiling?: string
  lastUpdated: string
  nextHearing?: string
  estimatedCompletion?: string
  documents: Document[]
  activities: Activity[]
  timeEntries: TimeEntry[]
  expenses: Expense[]
  billingInfo: BillingInfo
  tags: string[]
  relatedCases: string[]
  notes: Note[]
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  company?: string
  contactPerson?: string
  clientType: "individual" | "business"
  dateAdded: string
  cases: string[]
  totalBilled: number
  outstandingBalance: number
  paymentTerms: string
  preferredContact: "email" | "phone" | "mail"
  isActive: boolean
  notes: string
  documents: string[]
  emergencyContact?: EmergencyContact
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface Document {
  id: string
  name: string
  type: string
  category: "petition" | "affidavit" | "evidence" | "judgment" | "order" | "contract" | "correspondence" | "other"
  size: number
  uploadDate: string
  uploadedBy: string
  caseId?: string
  clientId?: string
  url: string
  version: number
  isConfidential: boolean
  expiryDate?: string
  tags: string[]
  description?: string
}

export interface Activity {
  id: string
  title: string
  description: string
  date: string
  type: "meeting" | "call" | "document" | "court" | "research" | "email" | "task" | "note"
  caseId?: string
  clientId?: string
  userId: string
  duration?: number
  billable: boolean
  status: "completed" | "pending" | "cancelled"
  location?: string
  attendees: string[]
  attachments: string[]
}

export interface TimeEntry {
  id: string
  caseId: string
  userId: string
  description: string
  date: string
  startTime: string
  endTime: string
  duration: number
  hourlyRate: number
  billable: boolean
  invoiced: boolean
  invoiceId?: string
  category: string
}

export interface Expense {
  id: string
  caseId: string
  userId: string
  description: string
  amount: number
  date: string
  category: string
  receipt?: string
  billable: boolean
  invoiced: boolean
  invoiceId?: string
}

export interface BillingInfo {
  hourlyRate: number
  totalHours: number
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  lastInvoiceDate?: string
  paymentTerms: string
}

export interface Appointment {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: "meeting" | "court" | "call" | "consultation" | "deposition" | "mediation"
  clientId?: string
  caseId?: string
  location: string
  attendees: string[]
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  isRecurring: boolean
  recurringPattern?: RecurringPattern
  reminders: Reminder[]
  meetingLink?: string
  agenda?: string
  notes?: string
}

export interface RecurringPattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  endDate?: string
  occurrences?: number
}

export interface Reminder {
  id: string
  type: "email" | "push" | "sms"
  minutesBefore: number
  sent: boolean
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  caseId?: string
  amount: number
  taxAmount: number
  totalAmount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: string
  dueDate: string
  paidDate?: string
  createdDate: string
  items: InvoiceItem[]
  timeEntries: string[]
  expenses: string[]
  notes?: string
  paymentMethod?: string
  paymentReference?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  taxable: boolean
}

export interface Note {
  id: string
  title: string
  content: string
  caseId?: string
  clientId?: string
  userId: string
  createdAt: string
  updatedAt: string
  isPrivate: boolean
  tags: string[]
}

export interface TeamMember {
  id: string
  userId: string
  role: "partner" | "associate" | "paralegal" | "secretary" | "intern"
  permissions: Permission[]
  joinDate: string
  isActive: boolean
  hourlyRate?: number
  specializations: string[]
  cases: string[]
}

export interface Permission {
  resource: string
  actions: string[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  category: "case" | "appointment" | "invoice" | "system" | "team"
  read: boolean
  createdAt: string
  actionUrl?: string
  metadata?: any
}

// Mock data with enhanced structure
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    address: "123 Legal St, Law City, LC 12345",
    company: "Doe & Associates",
    accountType: "lawyer",
    barNumber: "BAR123456",
    specialization: "Corporate Law",
    yearsOfExperience: 15,
    bio: "Experienced corporate lawyer with expertise in mergers and acquisitions.",
    isActive: true,
    lastLogin: "2025-02-25T10:30:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-02-25T10:30:00Z",
    preferences: {
      theme: "light",
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      notifications: {
        email: true,
        push: true,
        caseUpdates: true,
        appointmentReminders: true,
        invoiceAlerts: true,
        teamUpdates: false,
      },
    },
  },
]

const mockClients: Client[] = [
  {
    id: "1",
    name: "Robert Smith",
    email: "robert.smith@email.com",
    phone: "+1-555-0123",
    address: "123 Main St, City, State 12345",
    clientType: "individual",
    dateAdded: "2025-01-15",
    cases: ["1"],
    totalBilled: 15000,
    outstandingBalance: 5000,
    paymentTerms: "Net 30",
    preferredContact: "email",
    isActive: true,
    notes: "Prefers morning appointments",
    documents: [],
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1-555-0124",
      email: "jane.smith@email.com",
    },
  },
  {
    id: "2",
    name: "ABC Corporation",
    email: "legal@abccorp.com",
    phone: "+1-555-0456",
    address: "456 Business Ave, City, State 12345",
    company: "ABC Corporation",
    contactPerson: "Sarah Johnson",
    clientType: "business",
    dateAdded: "2025-02-01",
    cases: ["2"],
    totalBilled: 8500,
    outstandingBalance: 0,
    paymentTerms: "Net 15",
    preferredContact: "email",
    isActive: true,
    notes: "Large corporate client, priority handling",
    documents: [],
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1-555-0789",
    address: "789 Oak St, City, State 12345",
    clientType: "individual",
    dateAdded: "2025-02-10",
    cases: [],
    totalBilled: 0,
    outstandingBalance: 0,
    paymentTerms: "Net 30",
    preferredContact: "phone",
    isActive: true,
    notes: "",
    documents: [],
  },
]

const mockCases: Case[] = [
  {
    id: "1",
    caseNumber: "CASE-2025-001",
    title: "Property Dispute - Smith vs. Johnson",
    description: "Boundary dispute between neighboring properties involving a fence line and easement rights.",
    status: "active",
    priority: "high",
    category: "Real Estate",
    client: mockClients[0],
    assignedLawyers: ["John Doe", "Jane Smith"],
    court: "District Court",
    courtHall: "3B",
    floorNo: "2",
    classification: "Civil",
    dateCreated: "2025-01-15",
    dateOfFiling: "2025-01-20",
    lastUpdated: "2025-02-20",
    nextHearing: "2025-03-15T10:00:00",
    estimatedCompletion: "2025-06-30",
    documents: [],
    activities: [],
    timeEntries: [],
    expenses: [],
    billingInfo: {
      hourlyRate: 300,
      totalHours: 50,
      totalAmount: 15000,
      paidAmount: 10000,
      outstandingAmount: 5000,
      lastInvoiceDate: "2025-02-01",
      paymentTerms: "Net 30",
    },
    tags: ["property", "dispute", "urgent"],
    relatedCases: [],
    notes: [],
  },
  {
    id: "2",
    caseNumber: "CASE-2025-002",
    title: "Contract Review - ABC Corp Service Agreement",
    description: "Comprehensive review and negotiation of multi-year service agreement with vendor.",
    status: "pending",
    priority: "medium",
    category: "Corporate",
    client: mockClients[1],
    assignedLawyers: ["Jane Smith"],
    court: "N/A",
    dateCreated: "2025-02-01",
    lastUpdated: "2025-02-18",
    documents: [],
    activities: [],
    timeEntries: [],
    expenses: [],
    billingInfo: {
      hourlyRate: 250,
      totalHours: 34,
      totalAmount: 8500,
      paidAmount: 8500,
      outstandingAmount: 0,
      paymentTerms: "Net 15",
    },
    tags: ["contract", "corporate", "review"],
    relatedCases: [],
    notes: [],
  },
]

const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Client Consultation - Robert Smith",
    description: "Initial consultation regarding property dispute case",
    startDate: "2025-02-26T10:00:00",
    endDate: "2025-02-26T11:00:00",
    type: "meeting",
    clientId: "1",
    caseId: "1",
    location: "Office Conference Room A",
    attendees: ["John Doe", "Robert Smith"],
    status: "scheduled",
    isRecurring: false,
    reminders: [
      {
        id: "1",
        type: "email",
        minutesBefore: 60,
        sent: false,
      },
    ],
    agenda: "Discuss case strategy and next steps",
  },
  {
    id: "2",
    title: "Court Hearing - Smith vs. Johnson",
    description: "Preliminary hearing for property dispute case",
    startDate: "2025-03-15T10:00:00",
    endDate: "2025-03-15T12:00:00",
    type: "court",
    clientId: "1",
    caseId: "1",
    location: "District Court, Room 205",
    attendees: ["John Doe", "Jane Smith", "Robert Smith"],
    status: "scheduled",
    isRecurring: false,
    reminders: [
      {
        id: "2",
        type: "email",
        minutesBefore: 1440,
        sent: false,
      },
    ],
  },
]

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    clientId: "1",
    caseId: "1",
    amount: 7500,
    taxAmount: 750,
    totalAmount: 8250,
    status: "sent",
    issueDate: "2025-02-15",
    dueDate: "2025-03-15",
    createdDate: "2025-02-15",
    items: [
      {
        id: "1",
        description: "Legal consultation and case preparation",
        quantity: 25,
        rate: 300,
        amount: 7500,
        taxable: true,
      },
    ],
    timeEntries: [],
    expenses: [],
    notes: "Payment due within 30 days",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    clientId: "2",
    caseId: "2",
    amount: 4250,
    taxAmount: 425,
    totalAmount: 4675,
    status: "paid",
    issueDate: "2025-02-01",
    dueDate: "2025-02-16",
    paidDate: "2025-02-14",
    createdDate: "2025-02-01",
    items: [
      {
        id: "2",
        description: "Contract review and analysis",
        quantity: 17,
        rate: 250,
        amount: 4250,
        taxable: true,
      },
    ],
    timeEntries: [],
    expenses: [],
    paymentMethod: "Bank Transfer",
    paymentReference: "TXN123456",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "New Document Uploaded",
    message: "A new document has been uploaded to Case #CASE-2025-001",
    type: "info",
    category: "case",
    read: false,
    createdAt: "2025-02-25T09:30:00Z",
    actionUrl: "/cases/1",
  },
  {
    id: "2",
    userId: "1",
    title: "Appointment Reminder",
    message: "You have a client meeting in 1 hour",
    type: "warning",
    category: "appointment",
    read: false,
    createdAt: "2025-02-25T09:00:00Z",
    actionUrl: "/calendar",
  },
  {
    id: "3",
    userId: "1",
    title: "Invoice Payment Received",
    message: "Payment received for Invoice #INV-2025-002",
    type: "success",
    category: "invoice",
    read: true,
    createdAt: "2025-02-24T14:30:00Z",
    actionUrl: "/billing",
  },
]

// Enhanced data service with comprehensive functionality
export const dataService = {
  // Authentication
  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password") {
      return { ...user, lastLogin: new Date().toISOString() }
    }
    return null
  },

  register: async (userData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone,
      address: userData.address,
      company: userData.company,
      accountType: userData.accountType || "lawyer",
      barNumber: userData.barNumber,
      specialization: userData.specialization,
      yearsOfExperience: userData.yearsOfExperience,
      bio: userData.bio,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        theme: "light",
        language: "en",
        timezone: "UTC-5",
        dateFormat: "MM/DD/YYYY",
        notifications: {
          email: true,
          push: true,
          caseUpdates: true,
          appointmentReminders: true,
          invoiceAlerts: true,
          teamUpdates: false,
        },
      },
    }
    mockUsers.push(newUser)
    return newUser
  },

  // Cases
  getCases: async (filters?: any): Promise<Case[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    let filteredCases = [...mockCases]

    if (filters?.status) {
      filteredCases = filteredCases.filter((c) => c.status === filters.status)
    }
    if (filters?.priority) {
      filteredCases = filteredCases.filter((c) => c.priority === filters.priority)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredCases = filteredCases.filter(
        (c) =>
          c.title.toLowerCase().includes(search) ||
          c.caseNumber.toLowerCase().includes(search) ||
          c.client.name.toLowerCase().includes(search),
      )
    }

    return filteredCases
  },

  getCaseById: async (id: string): Promise<Case | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockCases.find((c) => c.id === id) || null
  },

  createCase: async (caseData: Partial<Case>): Promise<Case> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newCase: Case = {
      id: Date.now().toString(),
      caseNumber: `CASE-2025-${String(mockCases.length + 1).padStart(3, "0")}`,
      title: caseData.title || "",
      description: caseData.description || "",
      status: "active",
      priority: caseData.priority || "medium",
      category: caseData.category || "General",
      client: caseData.client || mockClients[0],
      assignedLawyers: caseData.assignedLawyers || [],
      court: caseData.court || "",
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      documents: [],
      activities: [],
      timeEntries: [],
      expenses: [],
      billingInfo: {
        hourlyRate: 300,
        totalHours: 0,
        totalAmount: 0,
        paidAmount: 0,
        outstandingAmount: 0,
        paymentTerms: "Net 30",
      },
      tags: [],
      relatedCases: [],
      notes: [],
    }
    mockCases.push(newCase)
    return newCase
  },

  updateCase: async (id: string, updates: Partial<Case>): Promise<Case | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockCases.findIndex((c) => c.id === id)
    if (index === -1) return null

    mockCases[index] = {
      ...mockCases[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    }
    return mockCases[index]
  },

  deleteCase: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockCases.findIndex((c) => c.id === id)
    if (index === -1) return false

    mockCases.splice(index, 1)
    return true
  },

  // Clients
  getClients: async (filters?: any): Promise<Client[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    let filteredClients = [...mockClients]

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filteredClients = filteredClients.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          (c.company && c.company.toLowerCase().includes(search)),
      )
    }
    if (filters?.clientType) {
      filteredClients = filteredClients.filter((c) => c.clientType === filters.clientType)
    }

    return filteredClients
  },

  getClientById: async (id: string): Promise<Client | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockClients.find((c) => c.id === id) || null
  },

  createClient: async (clientData: Partial<Client>): Promise<Client> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newClient: Client = {
      id: Date.now().toString(),
      name: clientData.name || "",
      email: clientData.email || "",
      phone: clientData.phone || "",
      address: clientData.address || "",
      company: clientData.company,
      contactPerson: clientData.contactPerson,
      clientType: clientData.clientType || "individual",
      dateAdded: new Date().toISOString(),
      cases: [],
      totalBilled: 0,
      outstandingBalance: 0,
      paymentTerms: "Net 30",
      preferredContact: "email",
      isActive: true,
      notes: "",
      documents: [],
    }
    mockClients.push(newClient)
    return newClient
  },

  updateClient: async (id: string, updates: Partial<Client>): Promise<Client | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockClients.findIndex((c) => c.id === id)
    if (index === -1) return null

    mockClients[index] = { ...mockClients[index], ...updates }
    return mockClients[index]
  },

  deleteClient: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockClients.findIndex((c) => c.id === id)
    if (index === -1) return false

    mockClients.splice(index, 1)
    return true
  },

  // Appointments
  getAppointments: async (filters?: any): Promise<Appointment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    let filteredAppointments = [...mockAppointments]

    if (filters?.date) {
      filteredAppointments = filteredAppointments.filter((a) => a.startDate.startsWith(filters.date))
    }
    if (filters?.type) {
      filteredAppointments = filteredAppointments.filter((a) => a.type === filters.type)
    }
    if (filters?.status) {
      filteredAppointments = filteredAppointments.filter((a) => a.status === filters.status)
    }

    return filteredAppointments
  },

  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAppointments.find((a) => a.id === id) || null
  },

  createAppointment: async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      title: appointmentData.title || "",
      description: appointmentData.description || "",
      startDate: appointmentData.startDate || new Date().toISOString(),
      endDate: appointmentData.endDate || new Date().toISOString(),
      type: appointmentData.type || "meeting",
      clientId: appointmentData.clientId,
      caseId: appointmentData.caseId,
      location: appointmentData.location || "",
      attendees: appointmentData.attendees || [],
      status: "scheduled",
      isRecurring: false,
      reminders: [],
    }
    mockAppointments.push(newAppointment)
    return newAppointment
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockAppointments.findIndex((a) => a.id === id)
    if (index === -1) return null

    mockAppointments[index] = { ...mockAppointments[index], ...updates }
    return mockAppointments[index]
  },

  deleteAppointment: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockAppointments.findIndex((a) => a.id === id)
    if (index === -1) return false

    mockAppointments.splice(index, 1)
    return true
  },

  // Invoices
  getInvoices: async (filters?: any): Promise<Invoice[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    let filteredInvoices = [...mockInvoices]

    if (filters?.status) {
      filteredInvoices = filteredInvoices.filter((i) => i.status === filters.status)
    }
    if (filters?.clientId) {
      filteredInvoices = filteredInvoices.filter((i) => i.clientId === filters.clientId)
    }

    return filteredInvoices
  },

  getInvoiceById: async (id: string): Promise<Invoice | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockInvoices.find((i) => i.id === id) || null
  },

  createInvoice: async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2025-${String(mockInvoices.length + 1).padStart(3, "0")}`,
      clientId: invoiceData.clientId || "",
      caseId: invoiceData.caseId,
      amount: invoiceData.amount || 0,
      taxAmount: (invoiceData.amount || 0) * 0.1,
      totalAmount: (invoiceData.amount || 0) * 1.1,
      status: "draft",
      issueDate: new Date().toISOString(),
      dueDate: invoiceData.dueDate || new Date().toISOString(),
      createdDate: new Date().toISOString(),
      items: invoiceData.items || [],
      timeEntries: [],
      expenses: [],
    }
    mockInvoices.push(newInvoice)
    return newInvoice
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<Invoice | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockInvoices.findIndex((i) => i.id === id)
    if (index === -1) return null

    mockInvoices[index] = { ...mockInvoices[index], ...updates }
    return mockInvoices[index]
  },

  // Notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockNotifications.filter((n) => n.userId === userId)
  },

  markNotificationAsRead: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const notification = mockNotifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      return true
    }
    return false
  },

  createNotification: async (notificationData: Partial<Notification>): Promise<Notification> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: notificationData.userId || "",
      title: notificationData.title || "",
      message: notificationData.message || "",
      type: notificationData.type || "info",
      category: notificationData.category || "system",
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: notificationData.actionUrl,
      metadata: notificationData.metadata,
    }
    mockNotifications.push(newNotification)
    return newNotification
  },

  // Dashboard stats
  getDashboardStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const activeCases = mockCases.filter((c) => c.status === "active").length
    const totalClients = mockClients.length
    const upcomingAppointments = mockAppointments.filter(
      (a) => new Date(a.startDate) > new Date() && a.status === "scheduled",
    ).length
    const pendingInvoices = mockInvoices.filter((i) => i.status === "sent").length
    const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const paidRevenue = mockInvoices.filter((i) => i.status === "paid").reduce((sum, inv) => sum + inv.totalAmount, 0)

    return {
      activeCases,
      totalClients,
      upcomingAppointments,
      pendingInvoices,
      totalRevenue,
      paidRevenue,
      outstandingRevenue: totalRevenue - paidRevenue,
      recentActivities: [
        {
          id: "1",
          action: "Case created",
          info: "Property Dispute - Smith vs. Johnson",
          time: "2 hours ago",
          type: "case",
        },
        {
          id: "2",
          action: "Document uploaded",
          info: "Contract Agreement #12456",
          time: "4 hours ago",
          type: "document",
        },
        {
          id: "3",
          action: "Client meeting",
          info: "Consultation with Robert Smith",
          time: "Yesterday",
          type: "meeting",
        },
        {
          id: "4",
          action: "Invoice paid",
          info: "Payment received from ABC Corp",
          time: "2 days ago",
          type: "payment",
        },
        { id: "5", action: "Court hearing", info: "Preliminary hearing scheduled", time: "3 days ago", type: "court" },
      ],
      casesByStatus: {
        active: mockCases.filter((c) => c.status === "active").length,
        pending: mockCases.filter((c) => c.status === "pending").length,
        completed: mockCases.filter((c) => c.status === "completed").length,
        onHold: mockCases.filter((c) => c.status === "on-hold").length,
      },
      monthlyRevenue: [
        { month: "Jan", revenue: 25000 },
        { month: "Feb", revenue: 32000 },
        { month: "Mar", revenue: 28000 },
        { month: "Apr", revenue: 35000 },
        { month: "May", revenue: 42000 },
        { month: "Jun", revenue: 38000 },
      ],
    }
  },

  // Search
  globalSearch: async (query: string): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const results = {
      cases: mockCases.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()),
      ),
      clients: mockClients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()) ||
          (c.company && c.company.toLowerCase().includes(query.toLowerCase())),
      ),
      appointments: mockAppointments.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()),
      ),
      invoices: mockInvoices.filter((i) => i.invoiceNumber.toLowerCase().includes(query.toLowerCase())),
    }
    return results
  },
}
