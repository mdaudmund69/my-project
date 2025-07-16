"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  MessageSquare,
  Search,
  Trash2,
  LogOut,
  Sun,
  Moon,
  UploadCloud,
  Menu,
  X,
  Edit3,
  Check,
  Copy,
  MoreVertical,
  Clock,
  CheckCheck,
  Pin,
  Star,
  Scale,
  FileText,
  Briefcase,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"

interface Message {
  id: string
  text: string
  sender: "user" | "mentor"
  timestamp: Date
  editable: boolean
  status?: "sent" | "delivered" | "read"
  isImportant?: boolean
  caseReference?: string
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
  isPinned?: boolean
  isArchived?: boolean
  category?: "general" | "case" | "consultation" | "document"
}

const ChatPage = () => {
  /* ─────────────────────────────── state ─────────────────────────────── */
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [showMessageMenu, setShowMessageMenu] = useState(false)

  const { user, logout } = useAuth()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messageMenuRef = useRef<HTMLDivElement>(null)

  /* ─────────────────────────────── helpers ─────────────────────────────── */
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString()
  }

  const createSession = (title = "New Legal Consultation", category: ChatSession["category"] = "general") => {
    const id = Date.now().toString()
    const welcome: Message = {
      id: id + "_welcome",
      text: "Hello! I'm your legal mentor. How can I assist you with your legal matters today?",
      sender: "mentor",
      timestamp: new Date(),
      editable: false,
      status: "read",
    }
    const session: ChatSession = {
      id,
      title,
      lastMessage: welcome.text,
      timestamp: new Date(),
      messages: [welcome],
      category,
      isPinned: false,
      isArchived: false,
    }
    setSessions((s) => [session, ...s])
    setCurrentId(id)
    setMessages(session.messages)
    setSidebarOpen(false)
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    setSelectedMessage(null)
    setShowMessageMenu(false)
  }

  const toggleMessageImportant = (messageId: string) => {
    const updatedMessages = messages.map((m) => (m.id === messageId ? { ...m, isImportant: !m.isImportant } : m))
    setMessages(updatedMessages)

    setSessions((prev) => prev.map((s) => (s.id === currentId ? { ...s, messages: updatedMessages } : s)))
    setSelectedMessage(null)
    setShowMessageMenu(false)
  }

  /* ─────────────────────────────── init ─────────────────────────────── */
  useEffect(() => {
    if (sessions.length === 0) {
      createSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ─────────────────────────── ui side effects ─────────────────────────── */
  useEffect(() => {
    scrollToBottom()
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [messages, input])

  // Close sidebar and menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      const menuButton = document.getElementById("menu-button")

      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setSidebarOpen(false)
      }

      if (showMessageMenu && messageMenuRef.current && !messageMenuRef.current.contains(event.target as Node)) {
        setShowMessageMenu(false)
        setSelectedMessage(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [sidebarOpen, showMessageMenu])

  /* ────────────────────────────── actions ────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      editable: true,
      status: "sent",
    }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setIsTyping(true)

    // Update message status to delivered after a short delay
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === userMsg.id ? { ...m, status: "delivered" } : m)))
    }, 1000)

    // update current session meta
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentId ? { ...s, lastMessage: userMsg.text, timestamp: new Date(), messages: updated } : s,
      ),
    )

    // mock mentor reply
    setTimeout(() => {
      const mentor: Message = {
        id: Date.now().toString(),
        text: "Thank you for your question. Let me analyze this legal matter and provide you with comprehensive guidance based on current legal precedents and regulations.",
        sender: "mentor",
        timestamp: new Date(),
        editable: false,
        status: "read",
      }
      const final = [...updated, mentor]
      setMessages(final)
      setSessions((prev) =>
        prev.map((s) => (s.id === currentId ? { ...s, lastMessage: mentor.text, messages: final } : s)),
      )
      setIsTyping(false)

      // Mark user message as read
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === userMsg.id ? { ...m, status: "read" } : m)))
      }, 500)
    }, 2000)
  }

  const startEditingChat = (session: ChatSession) => {
    setEditingChatId(session.id)
    setEditingTitle(session.title)
  }

  const saveEditingChat = () => {
    if (editingTitle.trim()) {
      setSessions((prev) => prev.map((s) => (s.id === editingChatId ? { ...s, title: editingTitle.trim() } : s)))
    }
    setEditingChatId(null)
    setEditingTitle("")
  }

  const cancelEditingChat = () => {
    setEditingChatId(null)
    setEditingTitle("")
  }

  const deleteSession = (id: string) => {
    const remaining = sessions.filter((s) => s.id !== id)
    setSessions(remaining)
    if (currentId === id) {
      if (remaining.length) {
        setCurrentId(remaining[0].id)
        setMessages(remaining[0].messages)
      } else {
        createSession()
      }
    }
  }

  const togglePinSession = (id: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s)))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result as string
      const msg: Message = {
        id: Date.now().toString(),
        text: `📎 Document uploaded: ${file.name}\n\n${content.substring(0, 500)}${content.length > 500 ? "..." : ""}`,
        sender: "user",
        timestamp: new Date(),
        editable: true,
        status: "sent",
      }
      setMessages((m) => [...m, msg])
    }
    reader.readAsText(file)
  }

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  const selectSession = (session: ChatSession) => {
    setCurrentId(session.id)
    setMessages(session.messages)
    setSidebarOpen(false)
  }

  const getCategoryIcon = (category: ChatSession["category"]) => {
    switch (category) {
      case "case":
        return <Briefcase className="w-3 h-3" />
      case "consultation":
        return <Scale className="w-3 h-3" />
      case "document":
        return <FileText className="w-3 h-3" />
      default:
        return <MessageSquare className="w-3 h-3" />
    }
  }

  const getCategoryColor = (category: ChatSession["category"]) => {
    switch (category) {
      case "case":
        return "text-red-600 dark:text-red-400"
      case "consultation":
        return "text-blue-600 dark:text-blue-400"
      case "document":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const filtered = sessions
    .filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

  /* ─────────────────────────────── render ─────────────────────────────── */
  return (
    <ProtectedRoute allowedRoles={["client", "lawyer"]}>
      <div className={`${theme === "dark" ? "dark" : ""}`}>
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-gray-200 relative overflow-hidden">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ────────────── sidebar ────────────── */}
          <aside
            id="sidebar"
            className={`
              fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
              w-80 max-w-[90vw] sm:max-w-[85vw] lg:max-w-full
              transform transition-all duration-300 ease-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl
              border-r border-gray-200 dark:border-gray-700
              flex flex-col shadow-2xl lg:shadow-none
            `}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-slate-100 via-gray-100 to-slate-200 dark:from-slate-800 dark:via-gray-800 dark:to-slate-900 text-gray-900 dark:text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200/80 dark:bg-white/10 rounded-xl backdrop-blur-sm border border-slate-300/50 dark:border-white/20 shadow-sm">
                    <Scale className="w-6 h-6 text-slate-700 dark:text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Legal Mentor</h2>
                    <p className="text-slate-600 dark:text-blue-100 text-sm font-medium">Professional Guidance</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => createSession()}
                className="w-full bg-slate-200/60 hover:bg-slate-300/70 dark:bg-slate-700/80 dark:hover:bg-slate-600/90 backdrop-blur-sm border border-slate-300/60 dark:border-white/10 text-gray-900 dark:text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                New Consultation
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-gray-100 dark:bg-gray-800 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-200 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className={`group relative mx-2 mb-2 rounded-xl transition-all duration-200 ${
                    currentId === s.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent"
                  }`}
                >
                  {editingChatId === s.id ? (
                    <div className="p-3">
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-sm font-medium"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditingChat()
                          if (e.key === "Escape") cancelEditingChat()
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveEditingChat}
                          className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={cancelEditingChat}
                          className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 cursor-pointer" onClick={() => selectSession(s)}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {s.isPinned && <Pin className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                          <div className={`${getCategoryColor(s.category)} flex-shrink-0`}>
                            {getCategoryIcon(s.category)}
                          </div>
                          <h3
                            className={`font-medium truncate text-sm leading-5 ${
                              currentId === s.id ? "text-blue-700 dark:text-blue-300" : ""
                            }`}
                          >
                            {s.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditingChat(s)
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePinSession(s.id)
                            }}
                            className={`p-1 rounded transition-colors ${
                              s.isPinned
                                ? "text-blue-600 hover:text-blue-700"
                                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            }`}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSession(s.id)
                            }}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{s.lastMessage}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{formatTime(s.timestamp)}</span>
                        {s.category !== "general" && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 ${getCategoryColor(s.category)}`}
                          >
                            {s.category}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                  title="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    logout()
                    router.push("/")
                  }}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-xl transition-all duration-200 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ────────────── chat panel ────────────── */}
          <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-gray-900">
            {/* header */}
            <header className="h-16 lg:h-14 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6 justify-between bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  id="menu-button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg border border-slate-300/60 dark:border-slate-500/30 shadow-sm">
                    <Scale className="w-4 h-4 text-slate-700 dark:text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-bold truncate text-base lg:text-lg text-gray-900 dark:text-gray-100">
                      {sessions.find((s) => s.id === currentId)?.title || "Legal Consultation"}
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Professional Legal Guidance</p>
                  </div>
                </div>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-xl transition-all duration-200 font-medium">
                <UploadCloud className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Document</span>
                <input type="file" onChange={handleFile} className="hidden" accept=".txt,.md,.pdf,.doc,.docx" />
              </label>
            </header>

            {/* messages */}
            <section className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6 bg-gradient-to-b from-slate-50/40 to-transparent dark:from-gray-800/30">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[75%] lg:max-w-md">
                    {m.sender === "mentor" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-300/60 dark:border-slate-500/30 shadow-sm">
                        <Scale className="w-4 h-4 text-slate-700 dark:text-white" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`relative group rounded-2xl px-4 py-3 whitespace-pre-line text-sm lg:text-base leading-relaxed shadow-sm transition-all duration-200 ${
                          m.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 dark:shadow-blue-900/30"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900/30"
                        } ${m.isImportant ? "ring-2 ring-yellow-400 dark:ring-yellow-500" : ""}`}
                        onClick={() => {
                          setSelectedMessage(m.id)
                          setShowMessageMenu(true)
                        }}
                      >
                        {m.isImportant && (
                          <div className="absolute -top-1 -right-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                        )}
                        {m.text}
                        <button
                          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                            m.sender === "user" ? "hover:bg-white/20" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMessage(m.id)
                            setShowMessageMenu(true)
                          }}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </div>
                      <div
                        className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                          m.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(m.timestamp)}</span>
                        {m.sender === "user" && m.status && (
                          <div className="flex items-center">
                            {m.status === "sent" && <Check className="w-3 h-3" />}
                            {m.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                            {m.status === "read" && <CheckCheck className="w-3 h-3 text-blue-500" />}
                          </div>
                        )}
                      </div>
                    </div>
                    {m.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-300/60 dark:border-slate-500/30 shadow-sm">
                        <svg className="w-4 h-4 text-slate-700 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2ZM8 21L9.5 16.5L14 18L9.5 19.5L8 21ZM16 21L14.5 19.5L10 18L14.5 16.5L16 21Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center border border-slate-300/60 dark:border-slate-500/30 shadow-sm">
                      <Scale className="w-4 h-4 text-slate-700 dark:text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm lg:text-base shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">Legal mentor is analyzing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </section>

            {/* Message Context Menu */}
            {showMessageMenu && selectedMessage && (
              <div
                ref={messageMenuRef}
                className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-2 min-w-[160px]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  onClick={() => copyMessage(messages.find((m) => m.id === selectedMessage)?.text || "")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy Message
                </button>
                <button
                  onClick={() => toggleMessageImportant(selectedMessage)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
                >
                  <Star className="w-4 h-4" />
                  {messages.find((m) => m.id === selectedMessage)?.isImportant ? "Remove Star" : "Add Star"}
                </button>
              </div>
            )}

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6 bg-gray-50/80 dark:bg-gray-900/95 backdrop-blur-sm"
            >
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder="Describe your legal question or concern..."
                    className="w-full resize-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 max-h-32 text-sm lg:text-base transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 overflow-hidden"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 lg:px-5 py-3.5 rounded-2xl flex items-center gap-2 disabled:opacity-50 shrink-0 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-95 min-w-[60px] justify-center"
                >
                  <span className="hidden sm:inline">Send</span>
                  <span className="sm:hidden text-lg">→</span>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ChatPage
