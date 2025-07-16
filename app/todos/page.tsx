"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Search, Users, X, CheckSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProtectedRoute from "@/components/protected-route"
import Link from "next/link"

export default function CreateTodos() {
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("2025-02-26T08:30")
  const [endDate, setEndDate] = useState("2025-02-26T09:00")
  const [isPrivate, setIsPrivate] = useState(false)
  const [showTeamSelect, setShowTeamSelect] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      description,
      startDate,
      endDate,
      isPrivate,
    })
  }

  return (
    <ProtectedRoute allowedRoles={["lawyer"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <CheckSquare className="h-8 w-8 mr-3 text-indigo-600" />
              Create To-dos
            </h1>
            <p className="text-slate-600 mt-1">Manage your tasks and deadlines efficiently</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Task Description</label>
                <div className="relative">
                  <textarea
                    placeholder="Click here to write to-do description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700">Please select due date</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                  <span className="text-slate-500 self-center">to</span>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Mark as private */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                />
                <label htmlFor="private" className="text-sm text-slate-700">
                  Mark as private
                </label>
              </div>

              {/* Auto Reminders */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-700">Please set your auto reminders</h3>
                <button type="button" className="text-indigo-600 hover:underline text-sm">
                  Click here
                </button>
                <span className="text-slate-500 text-sm ml-1">to add auto reminders</span>
              </div>

              {/* Relate to */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Relate to</label>
                <Select defaultValue="none">
                  <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Please select</SelectItem>
                    <SelectItem value="case1">Case 1</SelectItem>
                    <SelectItem value="case2">Case 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assign to */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign to</label>
                <div className="relative">
                  <Button
                    type="button"
                    onClick={() => setShowTeamSelect(true)}
                    className="w-full justify-start bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    You have selected 1 Team Member(s)
                  </Button>

                  {showTeamSelect && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-slate-700">Select Team Members</div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowTeamSelect(false)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={true}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-slate-700">Team Member 1</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Submit
              </Button>
            </form>
          </div>

          {/* Todos List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white">
                    All <span className="ml-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs">0</span>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-white">
                    Pending <span className="ml-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs">0</span>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
                    Upcoming <span className="ml-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs">0</span>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-white">
                    Completed <span className="ml-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs">0</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 flex justify-between items-center">
                  <Select defaultValue="my">
                    <SelectTrigger className="w-[200px] focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="my">My to-dos</SelectItem>
                      <SelectItem value="all">All to-dos</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Input placeholder="Search..." className="focus:ring-indigo-500 focus:border-indigo-500" />
                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Search</Button>
                  </div>
                </div>

                <TabsContent value="all" className="mt-4">
                  <div className="text-slate-500 text-center py-8">There are no pending or upcoming to-dos.</div>
                </TabsContent>
                <TabsContent value="pending" className="mt-4">
                  <div className="text-slate-500 text-center py-8">There are no pending to-dos.</div>
                </TabsContent>
                <TabsContent value="upcoming" className="mt-4">
                  <div className="text-slate-500 text-center py-8">There are no upcoming to-dos.</div>
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                  <div className="text-slate-500 text-center py-8">There are no completed to-dos.</div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
