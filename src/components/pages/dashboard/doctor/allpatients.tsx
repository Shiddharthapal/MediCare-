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
  FileText,
  Plus,
  Download,
  Eye,
  Pill,
  ClipboardList,
  ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

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
    documents: [
      {
        id: 1,
        name: "Blood Pressure Prescription",
        type: "Prescription",
        doctor: "Dr. Edward Bailey",
        date: "December 1, 2024",
        time: "12:45 PM",
        size: "245 KB",
        format: "PDF",
        description:
          "Lisinopril 10mg daily prescription for hypertension management",
        status: "Active",
      },
      {
        id: 2,
        name: "Lab Results - Complete Blood Count",
        type: "Lab Report",
        doctor: "Dr. Sarah Johnson",
        date: "November 28, 2024",
        time: "09:30 AM",
        size: "1.2 MB",
        format: "PDF",
        description: "Complete blood count analysis with normal values",
        status: "Reviewed",
      },
      {
        id: 3,
        name: "Chest X-Ray Report",
        type: "Imaging Report",
        doctor: "Dr. Michael Chen",
        date: "November 25, 2024",
        time: "02:15 PM",
        size: "3.4 MB",
        format: "PDF",
        description:
          "Chest X-ray showing clear lungs, no abnormalities detected",
        status: "Reviewed",
      },
      {
        id: 4,
        name: "Diabetes Medication Prescription",
        type: "Prescription",
        doctor: "Dr. Edward Bailey",
        date: "November 20, 2024",
        time: "11:00 AM",
        size: "198 KB",
        format: "PDF",
        description:
          "Metformin 500mg twice daily for Type 2 diabetes management",
        status: "Active",
      },
      {
        id: 5,
        name: "Cardiology Consultation Report",
        type: "Consultation Report",
        doctor: "Dr. Lisa Wong",
        date: "November 15, 2024",
        time: "03:30 PM",
        size: "567 KB",
        format: "PDF",
        description: "Comprehensive cardiac evaluation and recommendations",
        status: "Reviewed",
      },
      {
        id: 6,
        name: "Sleep Study Results",
        type: "Study Report",
        doctor: "Dr. Amanda Lee",
        date: "November 10, 2024",
        time: "08:00 AM",
        size: "2.1 MB",
        format: "PDF",
        description: "Polysomnography results showing moderate sleep apnea",
        status: "Reviewed",
      },
      {
        id: 7,
        name: "Physical Therapy Plan",
        type: "Treatment Plan",
        doctor: "Dr. Robert Kim",
        date: "November 5, 2024",
        time: "10:30 AM",
        size: "324 KB",
        format: "PDF",
        description: "12-week physical therapy program for lower back pain",
        status: "Active",
      },
      {
        id: 8,
        name: "Allergy Test Results",
        type: "Lab Report",
        doctor: "Dr. Sarah Johnson",
        date: "October 28, 2024",
        time: "01:45 PM",
        size: "892 KB",
        format: "PDF",
        description:
          "Comprehensive allergy panel showing reactions to peanuts and shellfish",
        status: "Reviewed",
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
    documents: [
      {
        id: 1,
        name: "Blood Pressure Prescription",
        type: "Prescription",
        doctor: "Dr. Edward Bailey",
        date: "December 1, 2024",
        time: "12:45 PM",
        size: "245 KB",
        format: "PDF",
        description:
          "Lisinopril 10mg daily prescription for hypertension management",
        status: "Active",
      },
      {
        id: 2,
        name: "Lab Results - Complete Blood Count",
        type: "Lab Report",
        doctor: "Dr. Sarah Johnson",
        date: "November 28, 2024",
        time: "09:30 AM",
        size: "1.2 MB",
        format: "PDF",
        description: "Complete blood count analysis with normal values",
        status: "Reviewed",
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
    documents: [
      {
        id: 1,
        name: "Blood Pressure Prescription",
        type: "Prescription",
        doctor: "Dr. Edward Bailey",
        date: "December 1, 2024",
        time: "12:45 PM",
        size: "245 KB",
        format: "PDF",
        description:
          "Lisinopril 10mg daily prescription for hypertension management",
        status: "Active",
      },
    ],
  },
];

export default function AllPatientsPage() {
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
      <div className="mx-auto max-w-full bg-white shadow-sm overflow-hidden">
        {/* Header - Fixed */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold text-green-600">
              Helsi
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-700">
                Dashboard
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

        <div className="flex pt-20">
          {/* Left Sidebar - Fixed */}
          <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 border-r border-gray-100 bg-white overflow-y-auto">
            {/* Navigation */}
            <div className="p-6 border-b border-gray-100">
              <nav className="space-y-2">
                <Link
                  to="/dashboard"
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

          {/* Main Content - Scrollable */}
          <main className="flex-1 ml-64 mr-80">
            {/* Patient Header - Sticky */}
            <div className="sticky top-20 z-40 bg-white p-6 border-b border-gray-100 shadow-sm">
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
                    <p className="text-sm text-gray-500">ID: #78146284/201</p>
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
                <button
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === "documents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("documents")}
                >
                  Documents
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 min-h-screen">
              {/* Keep all the existing tab content exactly the same */}
              {activeTab === "overview" && (
                <div className="">
                  {/* Personal Information */}
                  <div className="mb-6">
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

                  {/* Medical Summary and Active Conditions */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
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

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Current Active Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
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

              {/* Keep the existing history and appointments tabs exactly the same */}
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
                              severityOrder[
                                b.severity as keyof typeof severityOrder
                              ] -
                              severityOrder[
                                a.severity as keyof typeof severityOrder
                              ]
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

              {activeTab === "documents" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Patient Documents
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Document Filters */}
                      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Filter by type:
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-transparent"
                          >
                            All
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Prescriptions
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Lab Reports
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Imaging
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Consultation
                          </Button>
                        </div>
                      </div>

                      {/* Documents List */}
                      <div className="space-y-4">
                        {selectedPatient.documents?.map((document, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Document Icon */}
                                <div className="p-3 rounded-lg bg-blue-50">
                                  {document.type === "Prescription" && (
                                    <Pill className="h-6 w-6 text-blue-600" />
                                  )}
                                  {document.type === "Lab Report" && (
                                    <ClipboardList className="h-6 w-6 text-green-600" />
                                  )}
                                  {document.type === "Imaging Report" && (
                                    <ImageIcon className="h-6 w-6 text-purple-600" />
                                  )}
                                  {document.type === "Consultation Report" && (
                                    <FileText className="h-6 w-6 text-orange-600" />
                                  )}
                                  {document.type === "Study Report" && (
                                    <ClipboardList className="h-6 w-6 text-indigo-600" />
                                  )}
                                  {document.type === "Treatment Plan" && (
                                    <FileText className="h-6 w-6 text-teal-600" />
                                  )}
                                  {![
                                    "Prescription",
                                    "Lab Report",
                                    "Imaging Report",
                                    "Consultation Report",
                                    "Study Report",
                                    "Treatment Plan",
                                  ].includes(document.type) && (
                                    <FileText className="h-6 w-6 text-gray-600" />
                                  )}
                                </div>

                                {/* Document Details */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                      {document.name}
                                    </h3>
                                    <Badge
                                      variant={
                                        document.status === "Active"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        document.status === "Active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {document.status}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-4 w-4" />
                                      <span>{document.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>{document.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{document.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>{document.doctor}</span>
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-700 mb-2">
                                    <strong>Description:</strong>{" "}
                                    {document.description}
                                  </p>

                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Size: {document.size}</span>
                                    <span>Format: {document.format}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs bg-transparent"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs bg-transparent"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Document Statistics */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-3">Document Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-lg text-blue-600">
                              {selectedPatient.documents?.filter(
                                (d) => d.type === "Prescription"
                              ).length || 0}
                            </p>
                            <p className="text-gray-600">Prescriptions</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-lg text-green-600">
                              {selectedPatient.documents?.filter(
                                (d) => d.type === "Lab Report"
                              ).length || 0}
                            </p>
                            <p className="text-gray-600">Lab Reports</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-lg text-purple-600">
                              {selectedPatient.documents?.filter(
                                (d) => d.type === "Imaging Report"
                              ).length || 0}
                            </p>
                            <p className="text-gray-600">Imaging Reports</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-lg text-gray-600">
                              {selectedPatient.documents?.length || 0}
                            </p>
                            <p className="text-gray-600">Total Documents</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Fixed */}
          <aside className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 border-l border-gray-100 bg-white overflow-y-auto">
            <div className="p-6">
              {/* Patient Quick Info */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" />
                      <AvatarFallback className="text-lg">
                        {selectedPatient.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      ID: #78146284/201
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500">Age</p>
                        <p className="font-medium">{selectedPatient.age}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-gray-500">Gender</p>
                        <p className="font-medium">{selectedPatient.gender}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Medical Records
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Latest Vital Signs</CardTitle>
                  <p className="text-sm text-gray-500">
                    Last updated: Dec 1, 2024
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Blood Pressure</span>
                    <span className="font-medium text-red-600">
                      140/90 mmHg
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Heart Rate</span>
                    <span className="font-medium">72 bpm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Temperature</span>
                    <span className="font-medium">98.6°F</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Weight</span>
                    <span className="font-medium">185 lbs</span>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="font-medium text-sm">
                      Follow-up Consultation
                    </p>
                    <p className="text-xs text-gray-500">
                      Dec 15, 2024 at 2:30 PM
                    </p>
                    <p className="text-xs text-gray-500">Dr. Edward Bailey</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3 py-2">
                    <p className="font-medium text-sm">Lab Work</p>
                    <p className="text-xs text-gray-500">
                      Dec 20, 2024 at 9:00 AM
                    </p>
                    <p className="text-xs text-gray-500">Lab Department</p>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Sarah Miles (Spouse)</p>
                    <p className="text-sm text-gray-600">(603) 555-0124</p>
                    <p className="text-sm text-gray-600">
                      sarah.miles@email.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
