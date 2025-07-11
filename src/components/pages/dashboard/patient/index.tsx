"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  FileText,
  TestTube,
  Calendar,
  Video,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Appointments from "./appionments";
import Doctors from "./doctors";
import Reports from "./report";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Calendar, label: "Appointments", active: false },
  { icon: Users, label: "Doctors", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: TestTube, label: "Lab Results", active: false },
  { icon: Heart, label: "Health Records", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-16" : "lg:w-64"} w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              {!collapsed && (
                <span className="ml-3 font-bold text-lg">MedDash</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant={
                      item.label.toLowerCase() === currentPage
                        ? "default"
                        : "ghost"
                    }
                    className={`w-full justify-start ${collapsed ? "px-2" : "px-4"} ${
                      item.label.toLowerCase() === currentPage
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setCurrentPage(item.label.toLowerCase());
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon
                      className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!collapsed ? (
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      OJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Olivia Johnson
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Patient ID: #12345
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-xs">OJ</AvatarFallback>
                </Avatar>
              </div>
            )}

            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-700 hover:bg-gray-100 mb-2 ${collapsed ? "px-2" : "px-4"}`}
            >
              <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>Logout</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="w-full hidden lg:flex"
            >
              {collapsed ? "→" : "←"}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${collapsed ? "lg:ml-16" : "lg:ml-64"} min-h-screen`}
      >
        {currentPage === "appointments" && (
          <div className="h-screen overflow-y-auto p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Appointments onNavigate={setCurrentPage} />
            </div>
          </div>
        )}

        {currentPage === "doctors" && (
          <div className="h-screen overflow-y-auto p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Doctors onNavigate={setCurrentPage} />
            </div>
          </div>
        )}

        {currentPage === "dashboard" && (
          <main className="h-screen overflow-y-auto p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome Olivia,
                </h1>
                <p className="text-gray-600">
                  You have got no appointments for today
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Consultations Card */}
                <Card className="bg-rose-50 border-rose-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" />
                        <span className="font-medium text-gray-900">
                          Consultations
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Last Consultation 12.02.2023
                      </p>
                      <p className="font-semibold text-gray-900">
                        04 All Time Consultations
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Prescriptions Card */}
                <Card className="bg-purple-50 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <span className="font-medium text-gray-900">
                          Prescriptions
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Last added 12.02.2023
                      </p>
                      <p className="font-semibold text-gray-900">
                        01 available prescription
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Lab Screenings Card */}
                <Card className="bg-pink-50 border-pink-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-pink-500" />
                        <span className="font-medium text-gray-900">
                          Lab Screenings
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">06 Lab tests</p>
                      <p className="font-semibold text-gray-900">
                        Cancer Screening Test
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upcoming Appointments
                  </h2>
                  <Button
                    variant="link"
                    className="text-pink-500 p-0 h-auto font-normal"
                  >
                    View all
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Hormone Therapy Consultation */}
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-gray-900">
                            Hormone Therapy Consultation
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                                TM
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">
                              Dr. Tina Murphy
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              05 Feb, 2024
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              11:00 AM - 11:30 AM
                            </span>
                          </div>
                        </div>
                        <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Anti-Aging Consultation */}
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-gray-900">
                            Anti-Aging Consultation
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                                MH
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">
                              Dr. Micheal Hussey
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              05 Feb, 2024
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              11:00 AM - 11:30 AM
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                          >
                            Cancel Appointment
                          </Button>
                          <Button
                            variant="outline"
                            className="text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                          >
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Medications
                  </h2>
                  <Button
                    variant="link"
                    className="text-pink-500 p-0 h-auto font-normal"
                  >
                    View all
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Loratadin */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            26 Oct, 2023
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Loratadin, 5mg
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">3 days left</span>
                        <span className="text-gray-600">Twice a day</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Brocopan */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            26 Oct, 2023
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Brocopan, 50mg
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">5 days left</span>
                        <span className="text-gray-600">Twice a day</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Myticarin */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            26 Oct, 2023
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Myticarin, 5mg
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">2 days left</span>
                        <span className="text-gray-600">Twice a day</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Add some extra content to demonstrate scrolling */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Card key={i} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Activity item {i + 1} - This is some sample content
                            to demonstrate scrolling behavior
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            2 hours ago
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {currentPage === "appointments" && (
          <div className="h-screen overflow-y-auto p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Appointments />
            </div>
          </div>
        )}

        {currentPage === "doctors" && (
          <div className="h-screen overflow-y-auto p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Doctors />
            </div>
          </div>
        )}

        {currentPage === "reports" && (
          <div className="h-screen overflow-y-auto p-6 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-6xl mx-auto">
              <Reports />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
