"use client";

import { useState } from "react";
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
} from "lucide-react";

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

interface AppointmentsPageProps {
  onNavigate: (page: string) => void;
}

export default function AppointmentsPage({
  onNavigate,
}: AppointmentsPageProps) {
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => onNavigate("dashboard")}
              className="hover:text-gray-700"
            >
              Dashboard
            </button>
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
                  <p className="text-sm text-gray-600">Today's Appointments</p>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {
                      [
                        ...appointmentsData.today,
                        ...appointmentsData.upcoming.flatMap(
                          (day) => day.appointments
                        ),
                      ].filter((apt) => apt.status === "pending").length
                    }
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming (7 days)</TabsTrigger>
            <TabsTrigger value="previous">Previous</TabsTrigger>
          </TabsList>

          {/* Today's Appointments */}
          <TabsContent value="today" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Appointments - December 9, 2024
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
