"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MapPin, Phone } from "lucide-react";
import Doctors from "./doctors";

// Mock appointment data
const appointmentsData = {
  future: [
    {
      id: 1,
      date: "2024-01-09",
      time: "09:00 AM - 09:30 AM",
      doctor: "Dr. Sarah Wilson",
      specialty: "Cardiologist",
      type: "Heart Checkup",
      status: "confirmed",
      mode: "video",
      avatar: "SW",
    },
    {
      id: 2,
      date: "2024-01-09",
      time: "02:00 PM - 02:45 PM",
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      type: "Skin Consultation",
      status: "confirmed",
      mode: "in-person",
      avatar: "MC",
    },
    {
      id: 3,
      date: "2024-01-10",
      time: "11:00 AM - 11:30 AM",
      doctor: "Dr. Tina Murphy",
      specialty: "Endocrinologist",
      type: "Hormone Therapy Consultation",
      status: "confirmed",
      mode: "video",
      avatar: "TM",
    },
    {
      id: 4,
      date: "2024-01-11",
      time: "03:30 PM - 04:00 PM",
      doctor: "Dr. James Rodriguez",
      specialty: "Orthopedist",
      type: "Knee Pain Assessment",
      status: "pending",
      mode: "in-person",
      avatar: "JR",
    },
    {
      id: 5,
      date: "2024-01-12",
      time: "10:00 AM - 10:30 AM",
      doctor: "Dr. Lisa Thompson",
      specialty: "Nutritionist",
      type: "Diet Consultation",
      status: "confirmed",
      mode: "phone",
      avatar: "LT",
    },
    {
      id: 6,
      date: "2024-01-15",
      time: "01:00 PM - 01:30 PM",
      doctor: "Dr. Micheal Hussey",
      specialty: "Anti-Aging Specialist",
      type: "Anti-Aging Consultation",
      status: "confirmed",
      mode: "video",
      avatar: "MH",
    },
  ],
  today: [
    {
      id: 7,
      date: "2024-01-08",
      time: "10:00 AM - 10:30 AM",
      doctor: "Dr. Emily Davis",
      specialty: "General Physician",
      type: "Regular Checkup",
      status: "confirmed",
      mode: "video",
      avatar: "ED",
    },
    {
      id: 8,
      date: "2024-01-08",
      time: "03:00 PM - 03:30 PM",
      doctor: "Dr. Robert Kim",
      specialty: "Psychiatrist",
      type: "Mental Health Session",
      status: "confirmed",
      mode: "in-person",
      avatar: "RK",
    },
  ],
  past: [
    {
      id: 9,
      date: "2024-01-05",
      time: "11:00 AM - 11:30 AM",
      doctor: "Dr. Tina Murphy",
      specialty: "Endocrinologist",
      type: "Hormone Therapy Follow-up",
      status: "completed",
      mode: "video",
      avatar: "TM",
    },
    {
      id: 10,
      date: "2024-01-03",
      time: "02:00 PM - 02:30 PM",
      doctor: "Dr. Amanda Foster",
      specialty: "Gynecologist",
      type: "Annual Checkup",
      status: "completed",
      mode: "in-person",
      avatar: "AF",
    },
    {
      id: 11,
      date: "2023-12-28",
      time: "09:30 AM - 10:00 AM",
      doctor: "Dr. David Park",
      specialty: "Ophthalmologist",
      type: "Eye Examination",
      status: "completed",
      mode: "in-person",
      avatar: "DP",
    },
    {
      id: 12,
      date: "2023-12-20",
      time: "04:00 PM - 04:30 PM",
      doctor: "Dr. Maria Garcia",
      specialty: "Neurologist",
      type: "Headache Consultation",
      status: "completed",
      mode: "video",
      avatar: "MG",
    },
    {
      id: 13,
      date: "2023-12-15",
      time: "01:30 PM - 02:00 PM",
      doctor: "Dr. Kevin Lee",
      specialty: "Urologist",
      type: "Routine Checkup",
      status: "completed",
      mode: "in-person",
      avatar: "KL",
    },
    {
      id: 14,
      date: "2023-12-10",
      time: "11:00 AM - 11:30 AM",
      doctor: "Dr. Rachel Green",
      specialty: "Pediatrician",
      type: "Child Health Checkup",
      status: "completed",
      mode: "in-person",
      avatar: "RG",
    },
    {
      id: 15,
      date: "2023-12-05",
      time: "02:30 PM - 03:00 PM",
      doctor: "Dr. Thomas Brown",
      specialty: "Dentist",
      type: "Dental Cleaning",
      status: "completed",
      mode: "in-person",
      avatar: "TB",
    },
    {
      id: 16,
      date: "2023-11-28",
      time: "09:00 AM - 09:30 AM",
      doctor: "Dr. Jennifer White",
      specialty: "Rheumatologist",
      type: "Joint Pain Consultation",
      status: "completed",
      mode: "video",
      avatar: "JW",
    },
  ],
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
};

const groupAppointmentsByDate = (appointments: any[]) => {
  return appointments.reduce((groups: any, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "in-person":
      return <MapPin className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

export default function Appointments({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const futureGrouped = groupAppointmentsByDate(appointmentsData.future);
  const pastGrouped = groupAppointmentsByDate(appointmentsData.past);

  const handleJoinSession = (appointmentId: number) => {
    console.log(`Joining session for appointment ${appointmentId}`);
    // Add video call logic here
  };

  const handleCancelAppointment = (appointmentId: number) => {
    console.log(`Cancelling appointment ${appointmentId}`);
    // Add cancellation logic here
  };

  const handleRescheduleAppointment = (appointmentId: number) => {
    console.log(`Rescheduling appointment ${appointmentId}`);
    // Add reschedule logic here
  };

  const handleBookNewAppointment = () => {
    if (onNavigate) {
      onNavigate("doctors");
    }
  };

  const AppointmentCard = ({
    appointment,
    showActions = false,
  }: {
    appointment: any;
    showActions?: boolean;
  }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {appointment.avatar}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {appointment.type}
                </h3>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                {appointment.doctor} • {appointment.specialty}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {appointment.time}
                </div>
                <div className="flex items-center gap-1">
                  {getModeIcon(appointment.mode)}
                  {appointment.mode === "in-person"
                    ? "In-person"
                    : appointment.mode === "video"
                      ? "Video Call"
                      : "Phone Call"}
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2">
              {appointment.status === "confirmed" &&
                appointment.mode === "video" && (
                  <Button
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => handleJoinSession(appointment.id)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                )}
              {appointment.status === "confirmed" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                    onClick={() => handleRescheduleAppointment(appointment.id)}
                  >
                    Reschedule
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleBookNewAppointment}
        >
          Book New Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-blue-900">
                  {appointmentsData.future.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Today</p>
                <p className="text-2xl font-bold text-green-900">
                  {appointmentsData.today.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-purple-900">
                  {appointmentsData.past.length}
                </p>
              </div>
              <Badge className="h-8 w-8 text-purple-500 bg-transparent p-0">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "upcoming" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "upcoming" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({appointmentsData.future.length})
        </Button>
        <Button
          variant={activeTab === "today" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "today" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("today")}
        >
          Today ({appointmentsData.today.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "past" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past ({appointmentsData.past.length})
        </Button>
      </div>

      {/* Content */}
      {activeTab === "upcoming" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Next 7 Days</h2>
          </div>

          {Object.keys(futureGrouped).length > 0 ? (
            Object.entries(futureGrouped).map(
              ([date, appointments]: [string, any]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <h3 className="text-lg font-medium text-gray-800">
                      {formatDate(date)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {appointments.length} appointment
                      {appointments.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {appointments.map((appointment: any) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showActions={true}
                    />
                  ))}
                </div>
              )
            )
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't have any appointments scheduled for the next 7 days.
                </p>
                <Button onClick={handleBookNewAppointment}>
                  Book New Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "today" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Appointments
            </h2>
            <Badge className="bg-green-100 text-green-800">
              {appointmentsData.today.length} appointments
            </Badge>
          </div>

          {appointmentsData.today.length > 0 ? (
            appointmentsData.today.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showActions={true}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments today
                </h3>
                <p className="text-gray-600">
                  You have a free day! Enjoy your time.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "past" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment History
            </h2>
            <Badge variant="outline">
              {appointmentsData.past.length} completed
            </Badge>
          </div>

          {Object.entries(pastGrouped)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, appointments]: [string, any]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <h3 className="text-lg font-medium text-gray-800">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  <Badge variant="outline" className="ml-2">
                    {appointments.length} appointment
                    {appointments.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {appointments.map((appointment: any) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
