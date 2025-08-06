"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Video,
  FileEdit,
} from "lucide-react";
import Prescription from "./prescription";
import { useAppSelector } from "@/redux/hooks";

interface AppointmentData {
  doctorName: string;
  doctorSpecialist: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: string;
  specialRequests: string;
  createdAt: Date;
}
export interface DoctorDetails {
  userId: string;
  name: string;
  email: string;
  contact: string;
  gender: string;
  registrationNo: string;
  specialist: string;
  specializations: string[];
  hospital: string;
  fees: number;
  rating?: number;
  experience: string;
  education: string;
  degree: string;
  language: string[];
  about: string;
  availableSlots: string[];
  appointments: AppointmentData[];
  consultationModes: string[];
  createdAt: Date;
}

const mockAppointmentData: AppointmentData = {
  doctorName: "",
  doctorSpecialist: "",
  doctorEmail: "",
  patientId: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientGender: "",
  appointmentDate: "",
  appointmentTime: "",
  consultationType: "",
  consultedType: "",
  reasonForVisit: "",
  symptoms: "",
  previousVisit: "",
  emergencyContact: "",
  emergencyPhone: "",
  paymentMethod: "",
  specialRequests: "",
  createdAt: new Date(),
};

// Mock DoctorDetails with empty strings
const mockDoctorDetails: DoctorDetails = {
  userId: "",
  name: "",
  email: "",
  contact: "",
  gender: "",
  registrationNo: "",
  specialist: "",
  specializations: [],
  hospital: "",
  fees: 0,
  rating: 0,
  experience: "",
  education: "",
  degree: "",
  language: [],
  about: "",
  availableSlots: [],
  appointments: [],
  consultationModes: [],
  createdAt: new Date(),
};

// Mock data for appointments
const appointmentsData = {
  today: [
    {
      id: 1,
      patient: {
        name: "Floyd Miles",
        avatar: "FM",
        phone: "(603) 555-0123",
        email: "floydmiles@gmail.com",
        age: 54,
        gender: "Male",
      },
      time: "09:30 AM",
      duration: "30 min",
      type: "Regular Checkup",
      doctor: "Dr. Edward Bailey",
      status: "confirmed",
      location: "Room 101",
      notes: "Follow-up for hypertension management",
    },
    {
      id: 2,
      patient: {
        name: "Annette Black",
        avatar: "AB",
        phone: "(555) 123-4567",
        email: "annette.black@email.com",
        age: 42,
        gender: "Female",
      },
      time: "11:00 AM",
      duration: "45 min",
      type: "Consultation",
      doctor: "Dr. Sarah Johnson",
      status: "in-progress",
      location: "Room 203",
      notes: "Asthma review and medication adjustment",
    },
    {
      id: 3,
      patient: {
        name: "Guy Hawkins",
        avatar: "GH",
        phone: "(555) 987-6543",
        email: "guy.hawkins@email.com",
        age: 38,
        gender: "Male",
      },
      time: "02:15 PM",
      duration: "30 min",
      type: "Physical Therapy",
      doctor: "Dr. Amanda Lee",
      status: "confirmed",
      location: "PT Room 1",
      notes: "Lower back pain treatment session",
    },
    {
      id: 4,
      patient: {
        name: "Kristina Stokes",
        avatar: "KS",
        phone: "(555) 456-7890",
        email: "kristina.stokes@email.com",
        age: 29,
        gender: "Female",
      },
      time: "04:30 PM",
      duration: "30 min",
      type: "Consultation",
      doctor: "Dr. Edward Bailey",
      status: "pending",
      location: "Room 101",
      notes: "General health checkup",
    },
  ],
  upcoming: [
    {
      id: 5,
      date: "Tomorrow",
      fullDate: "December 10, 2024",
      appointments: [
        {
          id: 51,
          patient: {
            name: "Robert Johnson",
            avatar: "RJ",
            phone: "(555) 111-2222",
            email: "robert.j@email.com",
            age: 45,
            gender: "Male",
          },
          time: "10:00 AM",
          duration: "30 min",
          type: "Follow-up",
          doctor: "Dr. Edward Bailey",
          status: "confirmed",
          location: "Room 101",
          notes: "Diabetes management follow-up",
        },
        {
          id: 52,
          patient: {
            name: "Maria Garcia",
            avatar: "MG",
            phone: "(555) 333-4444",
            email: "maria.garcia@email.com",
            age: 35,
            gender: "Female",
          },
          time: "02:00 PM",
          duration: "45 min",
          type: "Consultation",
          doctor: "Dr. Michael Chen",
          status: "confirmed",
          location: "Room 205",
          notes: "Cardiology consultation",
        },
      ],
    },
    {
      id: 6,
      date: "2 days after",
      fullDate: "December 11, 2024",
      appointments: [
        {
          id: 61,
          patient: {
            name: "James Wilson",
            avatar: "JW",
            phone: "(555) 555-6666",
            email: "james.wilson@email.com",
            age: 52,
            gender: "Male",
          },
          time: "09:15 AM",
          duration: "30 min",
          type: "Lab Results Review",
          doctor: "Dr. Sarah Johnson",
          status: "confirmed",
          location: "Room 203",
          notes: "Blood work results discussion",
        },
      ],
    },
    {
      id: 7,
      date: "3 days after",
      fullDate: "December 12, 2024",
      appointments: [
        {
          id: 71,
          patient: {
            name: "Linda Davis",
            avatar: "LD",
            phone: "(555) 777-8888",
            email: "linda.davis@email.com",
            age: 48,
            gender: "Female",
          },
          time: "11:30 AM",
          duration: "30 min",
          type: "Routine Checkup",
          doctor: "Dr. Edward Bailey",
          status: "confirmed",
          location: "Room 101",
          notes: "Annual physical examination",
        },
        {
          id: 72,
          patient: {
            name: "David Brown",
            avatar: "DB",
            phone: "(555) 999-0000",
            email: "david.brown@email.com",
            age: 41,
            gender: "Male",
          },
          time: "03:45 PM",
          duration: "45 min",
          type: "Specialist Consultation",
          doctor: "Dr. Lisa Wong",
          status: "pending",
          location: "Room 301",
          notes: "Sleep disorder evaluation",
        },
      ],
    },
    {
      id: 8,
      date: "4 days after",
      fullDate: "December 13, 2024",
      appointments: [
        {
          id: 81,
          patient: {
            name: "Sarah Miller",
            avatar: "SM",
            phone: "(555) 123-9876",
            email: "sarah.miller@email.com",
            age: 33,
            gender: "Female",
          },
          time: "10:15 AM",
          duration: "30 min",
          type: "Prenatal Checkup",
          doctor: "Dr. Amanda Lee",
          status: "confirmed",
          location: "Room 401",
          notes: "20-week pregnancy checkup",
        },
      ],
    },
  ],
  previous: [
    {
      id: 101,
      patient: {
        name: "Floyd Miles",
        avatar: "FM",
        phone: "(603) 555-0123",
        email: "floydmiles@gmail.com",
        age: 54,
        gender: "Male",
      },
      date: "December 1, 2024",
      time: "12:45 PM",
      duration: "30 min",
      type: "Regular Checkup",
      doctor: "Dr. Edward Bailey",
      status: "completed",
      location: "Room 101",
      notes: "Blood pressure monitoring, medication adjustment",
      outcome: "Prescribed new medication for hypertension",
    },
    {
      id: 102,
      patient: {
        name: "Annette Black",
        avatar: "AB",
        phone: "(555) 123-4567",
        email: "annette.black@email.com",
        age: 42,
        gender: "Female",
      },
      date: "November 28, 2024",
      time: "03:30 PM",
      duration: "45 min",
      type: "Asthma Review",
      doctor: "Dr. Robert Kim",
      status: "completed",
      location: "Room 203",
      notes: "Asthma control assessment",
      outcome: "Inhaler technique reviewed, no changes needed",
    },
    {
      id: 103,
      patient: {
        name: "Guy Hawkins",
        avatar: "GH",
        phone: "(555) 987-6543",
        email: "guy.hawkins@email.com",
        age: 38,
        gender: "Male",
      },
      date: "November 25, 2024",
      time: "01:00 PM",
      duration: "45 min",
      type: "Physical Therapy",
      doctor: "Dr. Amanda Lee",
      status: "completed",
      location: "PT Room 1",
      notes: "Lower back pain treatment",
      outcome: "Significant improvement, continue exercises",
    },
    {
      id: 104,
      patient: {
        name: "Robert Johnson",
        avatar: "RJ",
        phone: "(555) 111-2222",
        email: "robert.j@email.com",
        age: 45,
        gender: "Male",
      },
      date: "November 20, 2024",
      time: "10:30 AM",
      duration: "30 min",
      type: "Diabetes Consultation",
      doctor: "Dr. Michael Chen",
      status: "completed",
      location: "Room 205",
      notes: "Blood sugar levels review",
      outcome: "Good control, continue current medication",
    },
    {
      id: 105,
      patient: {
        name: "Maria Garcia",
        avatar: "MG",
        phone: "(555) 333-4444",
        email: "maria.garcia@email.com",
        age: 35,
        gender: "Female",
      },
      date: "November 15, 2024",
      time: "02:15 PM",
      duration: "45 min",
      type: "Cardiology Consultation",
      doctor: "Dr. Sarah Johnson",
      status: "completed",
      location: "Room 203",
      notes: "Heart palpitations evaluation",
      outcome: "ECG normal, lifestyle modifications recommended",
    },
  ],
};

const appointmentRequests = [
  {
    id: 1,
    patient: {
      name: "Sarah Wilson",
      avatar: "SW",
      phone: "(555) 234-5678",
      email: "sarah.wilson@email.com",
      age: 31,
      gender: "Female",
    },
    requestedDate: "December 12, 2024",
    requestedTime: "10:30 AM",
    alternativeTime: "2:00 PM",
    duration: "30 min",
    type: "General Consultation",
    reason: "Persistent headaches and fatigue for the past 2 weeks",
    urgency: "Medium",
    requestDate: "December 8, 2024",
    status: "pending",
    notes: "Patient reports difficulty sleeping and increased stress levels",
  },
  {
    id: 2,
    patient: {
      name: "Michael Brown",
      avatar: "MB",
      phone: "(555) 345-6789",
      email: "michael.brown@email.com",
      age: 45,
      gender: "Male",
    },
    requestedDate: "December 13, 2024",
    requestedTime: "9:15 AM",
    alternativeTime: "11:00 AM",
    duration: "45 min",
    type: "Follow-up Consultation",
    reason: "Blood pressure medication review and adjustment",
    urgency: "High",
    requestDate: "December 7, 2024",
    status: "pending",
    notes: "Patient experiencing side effects from current medication",
  },
  {
    id: 3,
    patient: {
      name: "Emily Davis",
      avatar: "ED",
      phone: "(555) 456-7890",
      email: "emily.davis@email.com",
      age: 28,
      gender: "Female",
    },
    requestedDate: "December 14, 2024",
    requestedTime: "3:30 PM",
    alternativeTime: "4:15 PM",
    duration: "30 min",
    type: "Routine Checkup",
    reason: "Annual physical examination and health screening",
    urgency: "Low",
    requestDate: "December 6, 2024",
    status: "pending",
    notes: "Patient is due for annual wellness visit",
  },
  {
    id: 4,
    patient: {
      name: "Robert Johnson",
      avatar: "RJ",
      phone: "(555) 567-8901",
      email: "robert.johnson@email.com",
      age: 52,
      gender: "Male",
    },
    requestedDate: "December 15, 2024",
    requestedTime: "1:45 PM",
    alternativeTime: "3:00 PM",
    duration: "30 min",
    type: "Diabetes Management",
    reason: "Quarterly diabetes check and blood sugar monitoring",
    urgency: "Medium",
    requestDate: "December 5, 2024",
    status: "pending",
    notes: "Patient reports fluctuating blood sugar levels",
  },
  {
    id: 5,
    patient: {
      name: "Lisa Anderson",
      avatar: "LA",
      phone: "(555) 678-9012",
      email: "lisa.anderson@email.com",
      age: 38,
      gender: "Female",
    },
    requestedDate: "December 16, 2024",
    requestedTime: "11:30 AM",
    alternativeTime: "2:30 PM",
    duration: "45 min",
    type: "Specialist Consultation",
    reason: "Chronic back pain evaluation and treatment options",
    urgency: "High",
    requestDate: "December 4, 2024",
    status: "pending",
    notes: "Patient unable to perform daily activities due to pain",
  },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState(appointmentRequests);
  const [appointmentData, setAppointmentData] = useState<DoctorDetails | null>(
    null
  );
  const [showPrescription, setShowPrescription] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const doctor = useAppSelector((state) => state.auth.user);
  console.log("🧞‍♂️doctor --->", doctor);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    let id = doctor?._id;
    console.log("🧞‍♂️id --->", id);
    const fetchData = async () => {
      const response = await fetch(`/api/doctor/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responsedata = await response.json();
      console.log("🧞‍♂️responsedata --->", responsedata);
      setAppointmentData(responsedata.doctordetails);
    };

    fetchData();
  }, [doctor]);

  const handleAcceptRequest = (
    requestId: number,
    timeSlot: "primary" | "alternative"
  ) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "accepted",
              confirmedTime:
                timeSlot === "primary"
                  ? request.requestedTime
                  : request.alternativeTime,
            }
          : request
      )
    );
    alert(`Appointment request accepted and confirmation sent to patient!`);
  };

  const handleRejectRequest = (requestId: number) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, status: "rejected" } : request
      )
    );
    alert(`Appointment request rejected and notification sent to patient.`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
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

  const handleCreatePrescription = (patient: any) => {
    setSelectedPatient(patient);
    setShowPrescription(true);
  };

  const handleClosePrescription = () => {
    setShowPrescription(false);
    setSelectedPatient(null);
  };

  // If prescription is shown, render only the prescription component
  if (showPrescription && selectedPatient) {
    return (
      <Prescription
        patientData={selectedPatient}
        onClose={handleClosePrescription}
      />
    );
  }

  const AppointmentCard = ({
    appointment,
    showDate = false,
    isPrevious = false,
  }: any) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>{appointment.patient.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">
                  {appointment.patient.name}
                </h3>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {showDate && <span>{appointment.date} - </span>}
                  <span>
                    {appointment.time} ({appointment.duration})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{appointment.patient.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{appointment.patient.email}</span>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-sm">
                  <strong>Type:</strong> {appointment.type}
                </p>
                <p className="text-sm">
                  <strong>Doctor:</strong> {appointment.doctor}
                </p>
                <p className="text-sm">
                  <strong>Notes:</strong> {appointment.notes}
                </p>
                {isPrevious && appointment.outcome && (
                  <p className="text-sm">
                    <strong>Outcome:</strong> {appointment.outcome}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Patient: {appointment.patient.age} years old,{" "}
                {appointment.patient.gender}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            {getStatusIcon(appointment.status)}
            {!isPrevious && (
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs bg-transparent"
                >
                  Edit
                </Button>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white flex-1"
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-green-500 hover:bg-green-600 text-white flex-1"
                    onClick={() =>
                      handleCreatePrescription(appointment.patient)
                    }
                  >
                    <FileEdit className="h-3 w-3 mr-1" />
                    Create
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button className="hover:text-gray-700">Dashboard</button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Appointments</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {"Today's Appointments"}
                  </p>
                  <p className="text-2xl font-bold">
                    {appointmentsData.today.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold">
                    {requests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming (7 days)</p>
                  <p className="text-2xl font-bold">
                    {appointmentsData.upcoming.reduce(
                      (total, day) => total + day.appointments.length,
                      0
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {appointmentsData.previous.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {requests.filter((r) => r.status === "pending").length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                  {requests.filter((r) => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming (7 days)</TabsTrigger>
            <TabsTrigger value="previous">Previous</TabsTrigger>
          </TabsList>

          {/* Today's Appointments */}
          <TabsContent value="today" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {"Today's Appointments - December 9, 2024"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsData.today.length > 0 ? (
                  <div className="space-y-4">
                    {appointmentsData.today.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Request Appointments */}
          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Appointment Requests - Pending Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.filter((r) => r.status === "pending").length > 0 ? (
                  <div className="space-y-4">
                    {requests
                      .filter((request) => request.status === "pending")
                      .map((request) => (
                        <Card
                          key={request.id}
                          className="border-l-4 border-l-blue-500"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                                  <AvatarFallback>
                                    {request.patient.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">
                                      {request.patient.name}
                                    </h3>
                                    <Badge
                                      className={getUrgencyColor(
                                        request.urgency
                                      )}
                                    >
                                      {request.urgency} Priority
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      <span>{request.patient.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-4 w-4" />
                                      <span>{request.patient.email}</span>
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <p className="text-sm">
                                      <strong>Appointment Type:</strong>{" "}
                                      {request.type}
                                    </p>
                                    <p className="text-sm">
                                      <strong>Reason:</strong> {request.reason}
                                    </p>
                                    <p className="text-sm">
                                      <strong>Duration:</strong>{" "}
                                      {request.duration}
                                    </p>
                                    <p className="text-sm">
                                      <strong>Notes:</strong> {request.notes}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                    <p className="text-sm font-medium mb-2">
                                      Requested Time Slots:
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <div>
                                          <p className="text-sm font-medium">
                                            Primary Choice
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {request.requestedDate} at{" "}
                                            {request.requestedTime}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                        <Clock className="h-4 w-4 text-green-500" />
                                        <div>
                                          <p className="text-sm font-medium">
                                            Alternative
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {request.requestedDate} at{" "}
                                            {request.alternativeTime}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Patient: {request.patient.age} years old,{" "}
                                    {request.patient.gender} • Request
                                    submitted: {request.requestDate}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-xs"
                                    onClick={() =>
                                      handleAcceptRequest(request.id, "primary")
                                    }
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Accept Primary
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 text-xs"
                                    onClick={() =>
                                      handleAcceptRequest(
                                        request.id,
                                        "alternative"
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Accept Alt.
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="text-xs"
                                    onClick={() =>
                                      handleRejectRequest(request.id)
                                    }
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending appointment requests</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Processed Requests Section */}
            {requests.filter((r) => r.status !== "pending").length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Recently Processed Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {requests
                      .filter((request) => request.status !== "pending")
                      .slice(0, 3)
                      .map((request) => (
                        <div
                          key={request.id}
                          className={`p-3 rounded-lg border-l-4 ${
                            request.status === "accepted"
                              ? "bg-green-50 border-l-green-500"
                              : "bg-red-50 border-l-red-500"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback className="text-xs">
                                  {request.patient.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {request.patient.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  request.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {request.status === "accepted"
                                  ? "Accepted"
                                  : "Rejected"}
                              </Badge>
                              {request.status === "accepted" &&
                                (request as any).confirmedTime && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Confirmed: {(request as any).confirmedTime}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-6">
              {appointmentsData.upcoming.map((dayData) => (
                <Card key={dayData.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {dayData.date} - {dayData.fullDate}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dayData.appointments.length > 0 ? (
                      <div className="space-y-4">
                        {dayData.appointments.map((appointment) => (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No appointments scheduled for this day</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Previous Appointments */}
          <TabsContent value="previous" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Previous Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsData.previous.length > 0 ? (
                  <div className="space-y-4">
                    {appointmentsData.previous.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        showDate={true}
                        isPrevious={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No previous appointments found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
