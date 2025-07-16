"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Search, Trash2, LogOut, Sun, Moon, UploadCloud, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"

interface Message {
  id: string
  text: string
  sender: "user" | "mentor"
  timestamp: Date
  editable: boolean
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
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

  const { user, logout } = useAuth()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /* ─────────────────────────────── helpers ─────────────────────────────── */
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" })

  const createSession = (title = "New Chat") => {
    // Prevent creating duplicate sessions if one already exists
    if (sessions.length > 0 && !title.includes("New Chat")) {
      const id = Date.now().toString()
      const welcome: Message = {
        id,
        text: "Hello! How can I assist you today?",
        sender: "mentor",
        timestamp: new Date(),
        editable: false,
      }
      const session: ChatSession = {
        id,
        title,
        lastMessage: welcome.text,
        timestamp: new Date(),
        messages: [welcome],
      }
      setSessions((s) => [session, ...s])
      setCurrentId(id)
      setMessages(session.messages)
      setSidebarOpen(false) // Close sidebar on mobile after creating session
    } else if (sessions.length === 0) {
      const id = Date.now().toString()
      const welcome: Message = {
        id,
        text: "Hello! How can I assist you today?",
        sender: "mentor",
        timestamp: new Date(),
        editable: false,
      }
      const session: ChatSession = {
        id,
        title,
        lastMessage: welcome.text,
        timestamp: new Date(),
        messages: [welcome],
      }
      setSessions((s) => [session, ...s])
      setCurrentId(id)
      setMessages(session.messages)
    }
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

  // Close sidebar when clicking outside on mobile
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
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [sidebarOpen])

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
    }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setIsTyping(true)

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
        text: "I'm processing your request and will respond shortly with legal guidance.",
        sender: "mentor",
        timestamp: new Date(),
        editable: false,
      }
      const final = [...updated, mentor]
      setMessages(final)
      setSessions((prev) =>
        prev.map((s) => (s.id === currentId ? { ...s, lastMessage: mentor.text, messages: final } : s)),
      )
      setIsTyping(false)
    }, 1500)
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result as string
      const msg: Message = {
        id: Date.now().toString(),
        text: `File uploaded: ${file.name}\n\n${content}`,
        sender: "user",
        timestamp: new Date(),
        editable: true,
      }
      setMessages((m) => [...m, msg])
    }
    reader.readAsText(file)
  }

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  const selectSession = (session: ChatSession) => {
    setCurrentId(session.id)
    setMessages(session.messages)
    setSidebarOpen(false) // Close sidebar on mobile after selecting
  }

  const filtered = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  /* ─────────────────────────────── render ─────────────────────────────── */
  return (
    <ProtectedRoute allowedRoles={["client", "lawyer"]}>
      <div className={`${theme === "dark" ? "dark" : ""}`}>
        <div className="min-h-screen flex bg-white text-black dark:bg-[#0d0d0d] dark:text-gray-200 relative">
          {/* Mobile overlay */}
          {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />}

          {/* ────────────── sidebar ────────────── */}
          <aside
            id="sidebar"
            className={`
              fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
              w-80 max-w-[85vw] lg:max-w-full
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              border-r border-gray-200 dark:border-gray-700 
              bg-gray-50 dark:bg-[#111] 
              flex flex-col
            `}
          >
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => createSession(prompt("Chat title?", "New Chat") || "New Chat")}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                New Chat
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-gray-100 dark:bg-[#1d1d1d] pl-9 pr-3 py-2 rounded-md focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-start px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#222] transition-colors ${
                    currentId === s.id ? "bg-gray-200 dark:bg-[#222]" : ""
                  }`}
                  onClick={() => selectSession(s)}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-medium truncate text-sm">{s.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{s.lastMessage}</p>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(s.id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </aside>

          {/* ────────────── chat panel ────────────── */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* header */}
            <header className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6 justify-between bg-white dark:bg-[#0d0d0d]">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  id="menu-button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="font-semibold truncate text-sm lg:text-base">
                  {sessions.find((s) => s.id === currentId)?.title || "Chat"}
                </h1>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1 text-sm hover:bg-gray-100 dark:hover:bg-[#222] px-2 py-1 rounded transition-colors">
                <UploadCloud className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
                <input type="file" onChange={handleFile} className="hidden" accept=".txt,.md,.pdf,.doc,.docx" />
              </label>
            </header>

            {/* messages */}
            <section className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-3 lg:px-4 py-2 max-w-[85%] lg:max-w-xs whitespace-pre-line text-sm lg:text-base ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-[#222] text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-[#222] rounded-lg px-3 lg:px-4 py-2 text-sm lg:text-base">
                    <span className="animate-pulse">Mentor is typing…</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </section>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 dark:border-gray-700 p-4 lg:p-4 bg-white dark:bg-[#0d0d0d]"
            >
              <div className="flex items-end gap-2 lg:gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder="Type your message…"
                  className="flex-1 resize-none bg-gray-100 dark:bg-[#1d1d1d] rounded-lg p-3 focus:outline-none max-h-32 text-sm lg:text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 lg:px-4 py-3 rounded-lg flex items-center gap-1 disabled:opacity-50 shrink-0 transition-colors text-sm lg:text-base font-medium"
                >
                  <span className="hidden sm:inline">Send</span>
                  <span className="sm:hidden">→</span>
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
