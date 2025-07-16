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
        <div className="min-h-screen flex bg-white text-black dark:bg-[#0d0d0d] dark:text-gray-200 relative overflow-hidden">
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
              border-r border-gray-200 dark:border-gray-700 
              bg-gray-50/95 dark:bg-[#111]/95 backdrop-blur-sm
              flex flex-col shadow-xl lg:shadow-none
            `}
          >
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Chats</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => createSession(prompt("Chat title?", "New Chat") || "New Chat")}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 active:scale-[0.98] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-4 h-4" />
                New Chat
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-gray-100 dark:bg-[#1d1d1d] pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-200 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-start mx-2 mb-1 px-3 py-3 cursor-pointer rounded-xl transition-all duration-200 ${
                    currentId === s.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-[#222] border border-transparent"
                  }`}
                  onClick={() => selectSession(s)}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p
                      className={`font-medium truncate text-sm leading-5 ${
                        currentId === s.id ? "text-blue-700 dark:text-blue-300" : ""
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1 leading-4">{s.lastMessage}</p>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(s.id)
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-[#111]/50">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-[#222] transition-all duration-200 hover:scale-105"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Log out</span>
              </button>
            </div>
          </aside>

          {/* ────────────── chat panel ────────────── */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* header */}
            <header className="h-16 lg:h-14 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6 justify-between bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  id="menu-button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#222] transition-all duration-200 hover:scale-105"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="font-semibold truncate text-base lg:text-lg text-gray-900 dark:text-gray-100">
                  {sessions.find((s) => s.id === currentId)?.title || "Chat"}
                </h1>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-[#222] px-3 py-2 rounded-xl transition-all duration-200 font-medium">
                <UploadCloud className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
                <input type="file" onChange={handleFile} className="hidden" accept=".txt,.md,.pdf,.doc,.docx" />
              </label>
            </header>

            {/* messages */}
            <section className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] sm:max-w-[75%] lg:max-w-md whitespace-pre-line text-sm lg:text-base leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200 dark:shadow-blue-900/30"
                        : "bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900/30"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm lg:text-base shadow-sm">
                    <span className="animate-pulse text-gray-600 dark:text-gray-400">Mentor is typing…</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </section>

            {/* input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6 bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-sm"
            >
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder="Type your message…"
                    className="w-full resize-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 max-h-32 text-sm lg:text-base transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
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
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 lg:px-5 py-3.5 rounded-2xl flex items-center gap-2 disabled:opacity-50 shrink-0 transition-all duration-200 font-medium shadow-lg hover:shadow-xl active:scale-95 min-w-[60px] justify-center"
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
