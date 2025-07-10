"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  User,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AppointmentsPage from "./appoinments";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Calendar, label: "Appointments", active: false },
  { icon: Users, label: "Patients", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const datagender = [
  { name: "Male", value: 145, color: "#3b82f6" },
  { name: "Female", value: 113, color: "#ec4899" },
];

const COLORS = ["#3b82f6", "#ec4899"];

const data = [
  { name: "Mon", appointments: 12 },
  { name: "Tue", appointments: 19 },
  { name: "Wed", appointments: 15 },
  { name: "Thu", appointments: 25 },
  { name: "Fri", appointments: 22 },
  { name: "Sat", appointments: 18 },
  { name: "Sun", appointments: 8 },
];

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const stats = [
    {
      title: "Appointments",
      value: "28",
      change: "-2.5%",
      trend: "down",
      icon: Calendar,
    },
    {
      title: "Revenue",
      value: "$982",
      change: "-1%",
      trend: "down",
      icon: CreditCard,
    },
    {
      title: "Total Patients",
      value: "258",
      change: "-1.8%",
      trend: "down",
      icon: Users,
    },
    {
      title: "New Patients",
      value: "32",
      change: "+3.7%",
      trend: "up",
      icon: User,
    },
  ];

  const todaysAppointments = [
    {
      id: 1,
      patient: "Kristina Stokes",
      service: "Consultation",
      date: "05/02/2022",
      time: "09:30",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
    },
    {
      id: 2,
      patient: "Alexander Preston",
      service: "Consultation",
      date: "05/02/2022",
      time: "12:00",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "pending",
    },
    {
      id: 3,
      patient: "Johnathan Mcgee",
      service: "Consultation",
      date: "05/02/2022",
      time: "15:30",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "pending",
    },
  ];

  const requests = [
    {
      id: 1,
      patient: "Kevin Mitchell",
      type: "Standard Consultation",
      date: "07/02/2022",
      time: "09:30 - 10:30",
    },
    {
      id: 2,
      patient: "Adeline Hughes",
      type: "Standard Consultation",
      date: "07/02/2022",
      time: "14:00 - 15:00",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
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
          <nav className="flex-1 p-4">
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
                    onClick={() => setCurrentPage(item.label.toLowerCase())}
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
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>EB</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Dr. Edward Bailey
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    edward@hospital.com
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-xs">EB</AvatarFallback>
                </Avatar>
              </div>
            )}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-700 hover:bg-gray-100 ${collapsed ? "px-2" : "px-4"}`}
            >
              <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>Logout</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="w-full mt-2"
            >
              {collapsed ? "→" : "←"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentPage === "dashboard" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="xl:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <div className="flex items-center mt-1">
                              {stat.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                              )}
                              <span
                                className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                              >
                                {stat.change}
                              </span>
                            </div>
                          </div>
                          <stat.icon className="h-8 w-8 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Appointments</CardTitle>
                        <Tabs defaultValue="week" className="w-auto">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorAppointments"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="appointments"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorAppointments)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={datagender}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {datagender.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value, entry) => (
                                <span
                                  style={{
                                    color: entry.color,
                                    fontWeight: 500,
                                  }}
                                >
                                  {value}: {entry?.payload?.value || 0}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>{"Today's Appointments"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              PATIENT
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              SERVICE
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              DATE
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              TIME
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              ACTION
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {todaysAppointments.map((appointment) => (
                            <tr key={appointment.id} className="border-b">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        appointment.avatar || "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback>
                                      {appointment.patient
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {appointment.patient}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {appointment.service}
                              </td>
                              <td className="py-3 px-4">{appointment.date}</td>
                              <td className="py-3 px-4">{appointment.time}</td>
                              <td className="py-3 px-4">
                                <Button
                                  size="sm"
                                  className={
                                    appointment.status === "active"
                                      ? "bg-green-500 hover:bg-green-600"
                                      : "bg-gray-400 hover:bg-gray-500"
                                  }
                                >
                                  Start
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Doctor Profile */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback className="text-lg">EB</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl mb-2">
                      Dr. Edward Bailey
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Gastroenterologist
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-center mb-4">
                      <div className="p-2">
                        <p className="text-xs text-gray-500 uppercase mb-1">
                          Experience
                        </p>
                        <p className="font-bold text-lg">5 yrs</p>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-500 uppercase mb-1">
                          Rating
                        </p>
                        <p className="font-bold text-lg">5.0</p>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-500 uppercase mb-1">
                          License
                        </p>
                        <p className="font-bold text-lg">№419</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requests */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Requests</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          3+
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 text-xs"
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback className="text-sm">
                              {request.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {request.patient}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {request.type}
                          </p>
                          <div className="flex flex-col space-y-1 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span>{request.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span>{request.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 flex-1 text-xs py-2"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1 text-xs py-2"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Appointments Page */}
      {currentPage === "appointments" && (
        <AppointmentsPage onNavigate={setCurrentPage} />
      )}

      {/* Other Pages Placeholder */}
      {currentPage !== "dashboard" && currentPage !== "appointments" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              {currentPage}
            </h2>
            <p className="text-gray-600">This page is under construction.</p>
          </div>
        </div>
      )}
    </div>
  );
}
