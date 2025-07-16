"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Bold, Italic, Underline, Strikethrough, List, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProtectedRoute from "@/components/protected-route"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function AddCaseForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    court: "",
    caseNumber: "",
    year: "2025",
    dateOfFiling: "",
    courtHall: "",
    floorNo: "",
    classification: "",
    title: "",
    description: "",
    beforeJudge: "",
    referredBy: "",
    sectionCategory: "",
    priority: "",
    underActs: "",
    underSections: "",
    firPoliceStation: "",
    firNumber: "",
    firYear: "",
    isAffidavitFiled: "no",
    selectedTeamMembers: "1",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Here you would typically save the case data
    router.push("/cases")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <ProtectedRoute allowedRoles={["lawyer"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <BreadcrumbNav items={[{ label: "Cases", href: "/cases" }, { label: "Add Case" }]} />
            <h1 className="text-3xl font-bold text-slate-800">Add / Import Case</h1>
            <p className="text-slate-600 mt-1">Create a new case record</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-bold text-slate-800 mb-3 uppercase text-sm">Upcoming Hearing Dates</h2>
                <p className="text-slate-500 text-sm">There are no upcoming hearing dates.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-bold text-slate-800 mb-3 uppercase text-sm">Pending/Upcoming To-Dos</h2>
                <p className="text-slate-500 text-sm">There are no pending/upcoming To-dos</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-bold text-slate-800 mb-3 uppercase text-sm">FAQs</h2>
                <div className="text-sm text-slate-600">
                  <h3 className="font-semibold mb-2 text-slate-800">How can I manage my cases?</h3>
                  <p>
                    Please click on Cases and you will see all of your cases. You can add, edit, and delete from the
                    list page if you have permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-8"
            >
              <div className="space-y-8">
                {/* Court and Case Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Court <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="court"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.court}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Please select</option>
                      <option value="supreme">Supreme Court</option>
                      <option value="high">High Court</option>
                      <option value="district">District Court</option>
                      <option value="sessions">Sessions Court</option>
                      <option value="magistrate">Magistrate Court</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Case Number</label>
                      <Input
                        name="caseNumber"
                        placeholder="Case number"
                        value={formData.caseNumber}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                      <select
                        name="year"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.year}
                        onChange={handleInputChange}
                      >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date of Filing and Court Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Filing</label>
                    <div className="relative">
                      <Input
                        type="date"
                        name="dateOfFiling"
                        value={formData.dateOfFiling}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Court Hall #</label>
                      <Input
                        name="courtHall"
                        value={formData.courtHall}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Floor #</label>
                      <Input
                        name="floorNo"
                        value={formData.floorNo}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Classification</label>
                  <Input
                    name="classification"
                    value={formData.classification}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <div className="mt-2 flex space-x-2 border-b border-slate-200 pb-2">
                    {[Bold, Italic, Underline, Strikethrough, List, ListOrdered].map((Icon, index) => (
                      <button
                        key={index}
                        type="button"
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Please enter primary details about the case, client, etc"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Judge and Referred By */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Before Hon'ble Judge(s)</label>
                    <Input
                      name="beforeJudge"
                      value={formData.beforeJudge}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Referred By</label>
                    <Input
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* FIR Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">FIR Police Station</label>
                    <Input
                      name="firPoliceStation"
                      value={formData.firPoliceStation}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">FIR Number</label>
                    <Input
                      name="firNumber"
                      value={formData.firNumber}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">FIR Year</label>
                    <Input
                      name="firYear"
                      value={formData.firYear}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Affidavit Filed */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Is the affidavit/vakalath filed?
                  </label>
                  <div className="flex space-x-6">
                    {["yes", "no", "notapplicable"].map((option) => (
                      <label key={option} className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600 h-4 w-4"
                          name="isAffidavitFiled"
                          value={option}
                          checked={formData.isAffidavitFiled === option}
                          onChange={handleInputChange}
                        />
                        <span className="ml-2 text-slate-700 capitalize">
                          {option === "notapplicable" ? "Not Applicable" : option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team Selection */}
                <div>
                  <h3 className="text-lg font-medium text-slate-800 mb-4">Your Team</h3>
                  <select
                    name="selectedTeamMembers"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.selectedTeamMembers}
                    onChange={handleInputChange}
                  >
                    <option value="1">You have selected 1 team member.</option>
                    <option value="2">You have selected 2 team members.</option>
                    <option value="3">You have selected 3 team members.</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex justify-start space-x-4 pt-6 border-t border-slate-200">
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                    Submit Case
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
