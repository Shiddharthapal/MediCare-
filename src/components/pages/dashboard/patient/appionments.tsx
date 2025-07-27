"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Upload,
  Eye,
  Download,
  X,
  FileText,
} from "lucide-react";

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

const prescriptionsData = {
  9: [
    {
      id: 1,
      medication: "Estradiol",
      dosage: "2mg",
      frequency: "Once daily",
      duration: "30 days",
      instructions: "Take with food in the morning",
      prescribedDate: "2024-01-05",
    },
    {
      id: 2,
      medication: "Progesterone",
      dosage: "100mg",
      frequency: "Once daily at bedtime",
      duration: "30 days",
      instructions: "Take before sleep",
      prescribedDate: "2024-01-05",
    },
  ],
  10: [
    {
      id: 3,
      medication: "Multivitamin",
      dosage: "1 tablet",
      frequency: "Once daily",
      duration: "90 days",
      instructions: "Take with breakfast",
      prescribedDate: "2024-01-03",
    },
  ],
  11: [
    {
      id: 4,
      medication: "Eye Drops",
      dosage: "2 drops",
      frequency: "Twice daily",
      duration: "14 days",
      instructions: "Apply to both eyes morning and evening",
      prescribedDate: "2023-12-28",
    },
  ],
  12: [
    {
      id: 5,
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "7 days",
      instructions: "Take with food for headache relief",
      prescribedDate: "2023-12-20",
    },
  ],
  13: [
    {
      id: 6,
      medication: "Antibiotics",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "10 days",
      instructions: "Complete full course even if feeling better",
      prescribedDate: "2023-12-15",
    },
  ],
  15: [
    {
      id: 7,
      medication: "Fluoride Toothpaste",
      dosage: "As directed",
      frequency: "Twice daily",
      duration: "Ongoing",
      instructions: "Use for daily oral hygiene",
      prescribedDate: "2023-12-05",
    },
  ],
  16: [
    {
      id: 8,
      medication: "Anti-inflammatory",
      dosage: "200mg",
      frequency: "Three times daily",
      duration: "21 days",
      instructions: "Take with meals to reduce joint inflammation",
      prescribedDate: "2023-11-28",
    },
  ],
};

const reportsData = {
  9: [
    {
      id: 1,
      name: "Blood Test Results.pdf",
      uploadDate: "2024-01-04",
      size: "2.3 MB",
      type: "Lab Report",
    },
    {
      id: 2,
      name: "Hormone Panel Results.pdf",
      uploadDate: "2024-01-04",
      size: "1.8 MB",
      type: "Lab Report",
    },
  ],
  10: [
    {
      id: 3,
      name: "Previous Medical History.pdf",
      uploadDate: "2024-01-02",
      size: "1.8 MB",
      type: "Medical History",
    },
  ],
  11: [
    {
      id: 4,
      name: "Eye Exam Results.pdf",
      uploadDate: "2023-12-27",
      size: "3.2 MB",
      type: "Medical Report",
    },
  ],
  12: [
    {
      id: 5,
      name: "MRI Scan Results.pdf",
      uploadDate: "2023-12-19",
      size: "5.4 MB",
      type: "Imaging Report",
    },
  ],
  13: [
    {
      id: 6,
      name: "Urine Test Results.pdf",
      uploadDate: "2023-12-14",
      size: "1.2 MB",
      type: "Lab Report",
    },
  ],
  14: [
    {
      id: 7,
      name: "Child Growth Chart.pdf",
      uploadDate: "2023-12-09",
      size: "2.1 MB",
      type: "Medical Report",
    },
  ],
  15: [
    {
      id: 8,
      name: "Dental X-rays.pdf",
      uploadDate: "2023-12-04",
      size: "4.7 MB",
      type: "Imaging Report",
    },
  ],
  16: [
    {
      id: 9,
      name: "Joint X-ray Results.pdf",
      uploadDate: "2023-11-27",
      size: "3.8 MB",
      type: "Imaging Report",
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
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>(
    {}
  );

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
    console.log("Navigating to doctors page to book new appointment");
    if (onNavigate) {
      onNavigate("doctors");
    }
  };

  const handleViewPrescription = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  const handleViewReports = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReportsModal(true);
  };

  const handleFileUpload = (appointmentId: number, files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [appointmentId]: [...(prev[appointmentId] || []), ...fileArray],
    }));
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
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

          <div className="flex gap-2 flex-wrap">
            {/* Appointment Management Actions (only for upcoming/today) */}
            {showActions && (
              <>
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
                      onClick={() =>
                        handleRescheduleAppointment(appointment.id)
                      }
                    >
                      Reschedule
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Prescription and Reports options (always visible) */}
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
              onClick={() => handleViewPrescription(appointment)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Prescription
            </Button>
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
              onClick={() => handleViewReports(appointment)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
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
          className={`px-4 py-2 ${activeTab === "upcoming" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({appointmentsData.future.length})
        </Button>
        <Button
          variant={activeTab === "today" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "today" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("today")}
        >
          Today ({appointmentsData.today.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "past" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
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
                    showActions={false}
                  />
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Prescription - {selectedAppointment.type}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {selectedAppointment.doctor} •{" "}
                  {formatDate(selectedAppointment.date)}
                </p>
              </div>

              {selectedAppointment.status === "completed" &&
              prescriptionsData[selectedAppointment.id] ? (
                <div className="space-y-4">
                  {prescriptionsData[selectedAppointment.id].map(
                    (prescription: any) => (
                      <Card
                        key={prescription.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {prescription.medication}
                            </h3>
                            <Badge variant="outline">
                              {prescription.dosage}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Frequency:</strong>{" "}
                              {prescription.frequency}
                            </p>
                            <p>
                              <strong>Duration:</strong> {prescription.duration}
                            </p>
                            <p>
                              <strong>Instructions:</strong>{" "}
                              {prescription.instructions}
                            </p>
                            <p>
                              <strong>Prescribed:</strong>{" "}
                              {prescription.prescribedDate}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Prescription Available
                  </h3>
                  <p className="text-gray-600">
                    {selectedAppointment.status === "completed"
                      ? "No prescription was provided for this appointment."
                      : "Prescription will be available after the appointment is completed."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reports - {selectedAppointment.type}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReportsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {selectedAppointment.doctor} •{" "}
                  {formatDate(selectedAppointment.date)}
                </p>
              </div>

              {/* Upload Section for Upcoming Appointments */}
              {selectedAppointment.status !== "completed" && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Upload Reports
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload medical reports, lab results, or other documents
                      for your doctor
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) =>
                        e.target.files &&
                        handleFileUpload(selectedAppointment.id, e.target.files)
                      }
                      className="hidden"
                      id={`file-upload-${selectedAppointment.id}`}
                    />
                    <label
                      htmlFor={`file-upload-${selectedAppointment.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>

                  {/* Show uploaded files */}
                  {uploadedFiles[selectedAppointment.id] &&
                    uploadedFiles[selectedAppointment.id].length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Uploaded Files:
                        </h4>
                        <div className="space-y-2">
                          {uploadedFiles[selectedAppointment.id].map(
                            (file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <span className="text-sm text-gray-700">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Existing Reports */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {selectedAppointment.status === "completed"
                    ? "Uploaded Reports"
                    : "Previously Uploaded"}
                </h3>

                {reportsData[selectedAppointment.id] ? (
                  <div className="space-y-3">
                    {reportsData[selectedAppointment.id].map((report: any) => (
                      <Card key={report.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-500" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {report.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {report.type} • Uploaded {report.uploadDate} •{" "}
                                  {report.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No reports uploaded yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
