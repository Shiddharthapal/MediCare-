"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  LayoutDashboard,
  Calendar,
  Users,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

// Mock data for patients
const patients = [
  {
    id: 1,
    name: "Floyd Miles",
    address: "7529 E. Pecan St.",
    avatar: "FM",
    isActive: true,
    age: 54,
    gender: "Male",
    phone: "(603) 555-0123",
    email: "floydmiles@gmail.com",
    fullAddress: "7529 E. Pecan St.",
    insurance:
      "Member ID: 78146284/201, Wellbeing Medicare New York, United States of America",
    language: "English",
    diseases: [
      {
        name: "Hypertension",
        severity: "High",
        status: "Active",
        diagnosedDate: "2020-03-15",
      },
      {
        name: "Type 2 Diabetes",
        severity: "High",
        status: "Active",
        diagnosedDate: "2019-08-22",
      },
      {
        name: "Sleep Apnea",
        severity: "Medium",
        status: "Active",
        diagnosedDate: "2021-01-10",
      },
      {
        name: "Gastritis",
        severity: "Medium",
        status: "Treated",
        diagnosedDate: "2018-11-05",
      },
      {
        name: "Seasonal Allergies",
        severity: "Low",
        status: "Active",
        diagnosedDate: "2017-04-12",
      },
      {
        name: "Migraine",
        severity: "Low",
        status: "Treated",
        diagnosedDate: "2016-09-18",
      },
    ],
    appointments: [
      {
        date: "12/01/2024",
        time: "12:45 PM",
        type: "Regular Checkup",
        doctor: "Dr. Edward Bailey",
        status: "Completed",
      },
      {
        date: "11/15/2024",
        time: "10:30 AM",
        type: "Blood Test Follow-up",
        doctor: "Dr. Sarah Johnson",
        status: "Completed",
      },
      {
        date: "10/28/2024",
        time: "2:15 PM",
        type: "Diabetes Consultation",
        doctor: "Dr. Michael Chen",
        status: "Completed",
      },
      {
        date: "10/10/2024",
        time: "9:00 AM",
        type: "Hypertension Check",
        doctor: "Dr. Edward Bailey",
        status: "Completed",
      },
      {
        date: "09/22/2024",
        time: "11:20 AM",
        type: "Sleep Study Review",
        doctor: "Dr. Lisa Wong",
        status: "Completed",
      },
    ],
  },
  {
    id: 2,
    name: "Annette Black",
    address: "7529 E. Pecan St.",
    avatar: "AB",
    isActive: false,
    age: 42,
    gender: "Female",
    phone: "(555) 123-4567",
    email: "annette.black@email.com",
    diseases: [
      {
        name: "Asthma",
        severity: "Medium",
        status: "Active",
        diagnosedDate: "2015-06-20",
      },
      {
        name: "Anxiety Disorder",
        severity: "Medium",
        status: "Active",
        diagnosedDate: "2020-02-14",
      },
    ],
    appointments: [
      {
        date: "11/28/2024",
        time: "3:30 PM",
        type: "Asthma Review",
        doctor: "Dr. Robert Kim",
        status: "Completed",
      },
    ],
  },
  {
    id: 3,
    name: "Guy Hawkins",
    address: "775 Rolling Green Rd.",
    avatar: "GH",
    isActive: false,
    age: 38,
    gender: "Male",
    phone: "(555) 987-6543",
    email: "guy.hawkins@email.com",
    diseases: [
      {
        name: "Lower Back Pain",
        severity: "Medium",
        status: "Active",
        diagnosedDate: "2022-01-15",
      },
    ],
    appointments: [
      {
        date: "12/05/2024",
        time: "1:00 PM",
        type: "Physical Therapy",
        doctor: "Dr. Amanda Lee",
        status: "Completed",
      },
    ],
  },
];

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [showPatientList, setShowPatientList] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "treated":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-green-600">
              Helsi
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">
                Patients
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">Patients Information</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-100">
            {/* Navigation */}
            <div className="p-6 border-b border-gray-100">
              <nav className="space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Calendar className="h-5 w-5" />
                  Calendar
                </div>
                <div
                  className="flex items-center gap-3 px-3 py-2 bg-green-50 text-green-700 font-medium rounded-lg cursor-pointer"
                  onClick={() => setShowPatientList(!showPatientList)}
                >
                  <Users className="h-5 w-5" />
                  Patients
                  {showPatientList ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </div>
              </nav>
            </div>

            {/* Patient List */}
            {showPatientList && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    Patient Lists (817)
                  </h3>
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedPatient.id === patient.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                        />
                        <AvatarFallback className="text-xs">
                          {patient.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {patient.address}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Patient Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>{selectedPatient.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-sm text-gray-500">was # 78146284/201</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mt-6">
                <button
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "history"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Medical History
                </button>
                <button
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "appointments"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  Appointments History
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="">
                  {/* Basic Patient Information */}
                  <div className="mb-4 ">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">
                              {selectedPatient.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Patient ID</p>
                            <p className="font-medium">#78146284/201</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="font-medium">
                              {selectedPatient.phone}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">
                              {selectedPatient.gender}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">
                              {selectedPatient.age} years
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="font-medium text-blue-600">
                              {selectedPatient.email}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of Birth
                            </p>
                            <p className="font-medium">March 15, 1970</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Blood Type</p>
                            <p className="font-medium">O+</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Home Address
                            </p>
                            <p className="font-medium">
                              {selectedPatient.fullAddress}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Insurance & Medical Information */}
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    {/* Medical Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Medical Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Primary Care Physician
                          </p>
                          <p className="font-medium">Dr. Edward Bailey</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Allergies</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700"
                            >
                              Peanuts
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700"
                            >
                              Shellfish
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700"
                            >
                              Pollen
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Medications
                          </p>
                          <div className="space-y-1 mt-1">
                            <p className="text-sm font-medium">
                              • Lisinopril 10mg (Daily)
                            </p>
                            <p className="text-sm font-medium">
                              • Metformin 500mg (Twice daily)
                            </p>
                            <p className="text-sm font-medium">
                              • Atorvastatin 20mg (Daily)
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Visit</p>
                          <p className="font-medium">December 1, 2024</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Active Conditions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Current Active Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedPatient.diseases
                            ?.filter((d) => d.status === "Active")
                            .map((disease, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(disease.status)}
                                  <div>
                                    <p className="font-medium">
                                      {disease.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Since: {disease.diagnosedDate}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={getSeverityColor(disease.severity)}
                                >
                                  {disease.severity}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Appointment Completed</p>
                            <p className="text-sm text-gray-500">
                              Regular checkup with Dr. Edward Bailey
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">Dec 1, 2024</p>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Lab Results Received</p>
                            <p className="text-sm text-gray-500">
                              Blood work - All values within normal range
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">Nov 28, 2024</p>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Medication Refill Due</p>
                            <p className="text-sm text-gray-500">
                              Metformin prescription expires in 5 days
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">Nov 25, 2024</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Medical History - All Conditions (Severity: High to Low)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient.diseases
                          ?.sort((a, b) => {
                            const severityOrder = {
                              High: 3,
                              Medium: 2,
                              Low: 1,
                            };
                            return (
                              severityOrder[b.severity] -
                              severityOrder[a.severity]
                            );
                          })
                          .map((disease, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(disease.status)}
                                  <h3 className="font-semibold text-lg">
                                    {disease.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={getSeverityColor(
                                      disease.severity
                                    )}
                                  >
                                    {disease.severity} Severity
                                  </Badge>
                                  <Badge
                                    variant={
                                      disease.status === "Active"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {disease.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">
                                    Diagnosed Date
                                  </p>
                                  <p className="font-medium">
                                    {disease.diagnosedDate}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">
                                    Current Status
                                  </p>
                                  <p className="font-medium">
                                    {disease.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "appointments" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Previous Appointments History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient.appointments?.map(
                          (appointment, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      {appointment.type}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      with {appointment.doctor}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800"
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Date</p>
                                  <p className="font-medium">
                                    {appointment.date}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Time</p>
                                  <p className="font-medium">
                                    {appointment.time}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Status</p>
                                  <p className="font-medium text-green-600">
                                    {appointment.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
