"use client";

import { useEffect, useState, useMemo } from "react";
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
  Eye,
  Download,
  Video,
  FileEdit,
  MessageCircle,
} from "lucide-react";
import Prescription from "./prescription";
import Document from "./document";
import { useAppSelector } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RoomCreationForm } from "./roomCreationForm";
import { MessageModal } from "./message-modal";

interface AppointmentData {
  _id: string;
  doctorName: string;
  doctorpatinetId: string;
  doctorSpecialist: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
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
  _id: "",
  doctorName: "",
  doctorpatinetId: "",
  doctorSpecialist: "",
  doctorEmail: "",
  patientId: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientGender: "",
  appointmentDate: "",
  appointmentTime: "",
  status: "",
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

// Interface for categorized appointments
interface CategorizedAppointments {
  today: AppointmentData[];
  future: AppointmentData[];
  past: AppointmentData[];
}

// Interface for grouped appointments by date
interface GroupedAppointments {
  [date: string]: AppointmentData[];
}

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper function to compare dates
const compareDates = (
  appointmentDate: string,
  todayDate: string
): "past" | "today" | "future" => {
  if (appointmentDate < todayDate) return "past";
  if (appointmentDate === todayDate) return "today";
  return "future";
};

// Function to categorize appointments
const categorizeAppointments = (
  appointments: AppointmentData[]
): CategorizedAppointments => {
  const todayDate = getTodayDate();
  console.log("appointments=>", appointments);

  const categorized: CategorizedAppointments = {
    today: [],
    future: [],
    past: [],
  };

  appointments.forEach((appointment) => {
    const category = compareDates(appointment.appointmentDate, todayDate);
    categorized[category].push(appointment);
  });

  // Sort appointments within each category
  categorized.today.sort((a, b) =>
    a.appointmentTime.localeCompare(b.appointmentTime)
  );
  categorized.future.sort((a, b) => {
    if (a.appointmentDate === b.appointmentDate) {
      return a.appointmentTime.localeCompare(b.appointmentTime);
    }
    return a.appointmentDate.localeCompare(b.appointmentDate);
  });
  categorized.past.sort((a, b) => {
    if (b.appointmentDate === a.appointmentDate) {
      return b.appointmentTime.localeCompare(a.appointmentTime);
    }
    return b.appointmentDate.localeCompare(a.appointmentDate);
  });

  return categorized;
};

// Function to group appointments by date
const groupAppointmentsByDate = (
  appointments: AppointmentData[]
): GroupedAppointments => {
  return appointments.reduce((grouped: GroupedAppointments, appointment) => {
    const date = appointment.appointmentDate;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(appointment);

    // Sort appointments within the same date by time
    grouped[date].sort((a, b) =>
      a.appointmentTime.localeCompare(b.appointmentTime)
    );

    return grouped;
  }, {});
};
interface PatientsPageProps {
  onNavigate?: (page: string) => void;
}

export default function AppointmentsPage({ onNavigate }: PatientsPageProps) {
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [edit, setEdit] = useState(false);
  const [appointmentData, setAppointmentData] =
    useState<DoctorDetails>(mockDoctorDetails);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const doctor = useAppSelector((state) => state.auth.user);
  // console.log("🧞‍♂️doctor --->", doctor);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [showAudioRoomDialog, setShowAudioRoomDialog] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const email = user?.email;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-200 text-blue-800 border-blue-200";
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

  const categorizedAppointments = useMemo(() => {
    let appointmentdata = appointmentData.appointments;
    return categorizeAppointments(
      appointmentdata
        ? Array.isArray(appointmentdata)
          ? appointmentdata
          : []
        : []
    );
  }, [appointmentData]);

  useEffect(() => {
    let id = doctor?._id;
    const fetchData = async () => {
      const response = await fetch(`/api/doctor/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responsedata = await response.json();
      setAppointmentData(responsedata.doctordetails);
    };

    fetchData();
  }, [doctor]);

  let todayGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.today);
  }, [categorizedAppointments.today]);

  if (todayGrouped) {
    Object.keys(todayGrouped).forEach(
      (date) =>
        (todayGrouped[date] = todayGrouped[date].map(
          (appointment: AppointmentData) => ({
            ...appointment,
            status: "confirmed",
          })
        ))
    );
  }

  const futureGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.future);
  }, [categorizedAppointments.future]);

  const pastGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.past);
  }, [categorizedAppointments.past]);

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

  //handler function to show prescription
  const handleCreatePrescription = (patient: any) => {
    setSelectedPatient(patient);
    setShowPrescription(true);
    setEdit(true);
  };

  //handler function to show document
  const handleSeeDocument = (patient: any) => {
    setSelectedPatient(patient);
    setShowDocument(true);
  };

  //handler function to show prescription
  const handleShowPrescription = (patient: any) => {
    setSelectedPatient(patient);
    setShowPrescription(true);
    setEdit(false);
  };

  //handler function to close prescription
  const handleClosePrescription = () => {
    setShowPrescription(false);
    setSelectedPatient(null);
  };

  //handler function to close document
  const handleCloseDocument = () => {
    setShowDocument(false);
    setSelectedPatient(null);
  };

  //handler function to send message
  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    setShowMessageModal(false);
  };

  const handleCancelAppointment = async (appointment: any) => {
    let id = doctor?._id;
    try {
      const response = await fetch("/api/doctor/cancelAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment: appointment,
          doctorId: id,
          patientId: appointment.patientId,
        }),
      });

      if (response.ok) {
        // Refresh the appointment data
        const fetchData = async () => {
          const response = await fetch(`/api/doctor/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responsedata = await response.json();
          setAppointmentData(responsedata.doctordetails);
        };
        fetchData();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getPatientInitials = (patientName: string) => {
    if (!patientName) return "AB";

    const cleanName = patientName.trim();

    if (!cleanName) return "AB";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "AB";
    }
  };

  // If prescription is shown, render only the prescription component
  if (showPrescription && selectedPatient) {
    let id = doctor?._id;
    return (
      <Prescription
        patientData={{
          ...selectedPatient,
          hospital: appointmentData.hospital,
          doctorContact: appointmentData.contact,
          doctorEmail: appointmentData.email,
          doctorGender: appointmentData.gender,
          doctorId: id,
        }}
        edit={edit}
        onClose={handleClosePrescription}
      />
    );
  }

  // If prescription is shown, render only the prescription component
  if (showDocument) {
    let id = doctor?._id;
    console.log("selected patient=>", selectedPatient);
    return (
      <Document
        DocumentData={{
          ...selectedPatient,
          hospital: appointmentData.hospital,
          doctorContact: appointmentData.contact,
          doctorEmail: appointmentData.email,
          doctorGender: appointmentData.gender,
          doctorId: id,
        }}
        onClose={handleCloseDocument}
      />
    );
  }

  const AppointmentCard = ({
    status,
    appointment,
    showDate,
    isPrevious = false,
  }: {
    status: string;
    appointment: any;
    showDate: boolean;
    isPrevious?: boolean;
  }) => (
    <>
      <Card className="mb-4 border border-gray-600 bg-blue-0 transition-all hover:shadow-lg w-full">
        <CardContent className="p-4">
          {/* Mobile and Tablet Layout */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar */}
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-1 flex-shrink-0">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>
                  {getPatientInitials(appointment?.patientName)}
                </AvatarFallback>
              </Avatar>

              {/* Patient Details */}
              <div className="flex-1 min-w-0">
                {/* Name and Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {appointment?.patientName}
                  </h3>
                  <Badge className={`${getStatusColor(status)}`}>
                    {status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {appointment.patientGender}
                  </Badge>
                </div>

                {/* Contact and Appointment Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[hsl(273,100%,60%)] flex-shrink-0" />
                    {showDate && (
                      <span className="truncate">
                        {appointment?.appointmentDate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="truncate">
                      {appointment.appointmentTime} • 30 Minutes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate">
                      {appointment.consultationType === "video" ||
                      appointment.consultationType === "phone"
                        ? "In home (online)"
                        : appointmentData.hospital}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                    <span className="truncate">{appointment.patientPhone}</span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{appointment.patientEmail}</span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-1 mb-3 text-sm">
                  <p>
                    <strong>Type:</strong> {appointment?.consultationType}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {appointment?.doctorName}
                  </p>
                  <p>
                    <strong>Reason:</strong> {appointment.reasonForVisit}
                  </p>
                  {isPrevious && appointment.outcome && (
                    <p>
                      <strong>Outcome:</strong> {appointment.outcome}
                    </p>
                  )}
                </div>

                {/* Patient Age/Gender */}
                <div className="text-xs text-gray-500">
                  Patient: {appointment?.patientAge} years old,{" "}
                  {appointment?.patientGender}
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-col gap-2 ml-4">
              {status !== "completed" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSeeDocument(appointment)}
                    className="text-xs border-2 border-gray-400 transition-all hover:border-primary/50 w-full xs:flex-1"
                  >
                    Document
                  </Button>

                  {status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-2 border-gray-400 transition-all hover:border-0 hover:bg-red-200 hover:shadow-lg w-full xs:flex-1"
                      onClick={() => handleCancelAppointment(appointment)}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    size="sm"
                    className="text-xs bg-blue-500 hover:bg-blue-600 hover:text-black text-white w-full xs:flex-1"
                    onClick={() => setShowAudioRoomDialog(true)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-2 border-purple-400 transition-all hover:border-purple-600
           hover:bg-purple-50 text-purple-700 bg-transparent w-full xs:flex-1"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col xs:flex-row gap-2 w-full">
                  <Button
                    size="sm"
                    className="text-xs bg-green-500 hover:bg-green-600 text-white w-full xs:flex-1"
                    onClick={() => handleShowPrescription(appointment)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    See Prescription
                  </Button>

                  <Button
                    size="sm"
                    className="text-xs bg-green-500 hover:bg-green-600 hover:text-black text-white w-full xs:flex-1"
                    onClick={() => handleCreatePrescription(appointment)}
                  >
                    <FileEdit className="h-3 w-3 mr-1" />
                    Create
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-2 border-purple-400 transition-all hover:border-purple-600 hover:bg-purple-50 text-purple-700 bg-transparent w-full xs:flex-1"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Enter a room number to start the consultation
            </DialogDescription>
          </DialogHeader>
          <RoomCreationForm
            onSuccess={() => setShowRoomDialog(false)}
            emailId={email || ""}
          />
        </DialogContent>
      </Dialog>

      {/*for audio call */}
      <Dialog open={showAudioRoomDialog} onOpenChange={setShowAudioRoomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Audio Room</DialogTitle>
            <DialogDescription>
              Enter a room number to start the consultation
            </DialogDescription>
          </DialogHeader>
          <RoomCreationForm
            mode="audio"
            onSuccess={() => setShowAudioRoomDialog(false)}
            emailId={email || ""}
          />
        </DialogContent>
      </Dialog>

      <MessageModal
        open={showMessageModal}
        onOpenChange={setShowMessageModal}
        doctorName={appointment?.doctorName}
        patientName={appointment.patientName}
        doctorEmail={appointment?.doctorEmail || email}
        patientEmail={appointment.patientEmail}
        senderRole="doctor"
      />
    </>
  );

  return (
    <div className="flex-1 flex flex-col mx-auto  pb-5 w-full max-w-7xl overflow-hidden min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pb-2 pt-4 bg-white ">
        <div className="flex flex-row justify-between gap-4 md:gap-8 w-full">
          <div className="relative border border-gray-300 rounded-md transition-all hover:border-blue-500 hover:shadow-md flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              className="border border-gray-300 bg-[hsl(201,95%,41%)] hover:bg-[hsl(201,95%,31%)] text-white hover:text-white px-6 py-2.5 transition-all hover:border-blue-500 hover:shadow-md rounded-md"
            >
              Search
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 custom-scrollbar px-6 py-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border border-gray-400 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="px-4 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {"Today's Appointments"}
                  </p>
                  <p className="text-2xl font-bold">
                    {Object.entries(todayGrouped).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          {/* <Card>
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
          </Card> */}
          <Card className="border border-gray-400 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="px-4 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming (7 days)</p>
                  <p className="text-2xl font-bold">
                    {Object.entries(futureGrouped).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-[hsl(273,100%,60%)]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-400 transition-all hover:border-primary/50 hover:shadow-lg">
            <CardContent className="px-4 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {Object.entries(pastGrouped).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-300">
            <TabsTrigger value="today">Today</TabsTrigger>
            {/* <TabsTrigger value="requests">
              Requests
              {requests.filter((r) => r.status === "pending").length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                  {requests.filter((r) => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger> */}
            <TabsTrigger value="upcoming">Upcoming (7 days)</TabsTrigger>
            <TabsTrigger value="previous">Previous</TabsTrigger>
          </TabsList>

          {/* Today's Appointments */}
          <TabsContent value="today" className="mt-1">
            <Card className="border border-gray-600 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader className="py-2 bg-gradient-to-r  from-green-100 to-emerald-100">
                <CardTitle className="flex items-center text-xl lg:text-2xl gap-2 font-semibold">
                  <Calendar className="h-5 w-5 text-green-700" />
                  {`Today's Appointments - ${new Date().toISOString().split("T")[0]}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(todayGrouped).length > 0 ? (
                  Object.entries(todayGrouped).map(
                    ([date, appointments]: [string, AppointmentData[]]) =>
                      appointments.map((appointment: AppointmentData) => {
                        // Add individual appointment validation
                        if (!appointment || !appointment._id) {
                          console.warn(
                            "Invalid appointment data:",
                            appointment
                          );
                          return null;
                        }

                        if (appointment.status !== "cancelled") {
                          return (
                            <AppointmentCard
                              status="confirmed"
                              key={appointment._id}
                              appointment={appointment}
                              showDate={true}
                            />
                          );
                        }
                      })
                  )
                ) : (
                  <Card>
                    <CardContent className="px-8 py-0 lg:p-8 text-center">
                      <Calendar className="h-10 lg:h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No appointments
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You don't have any appointments scheduled for today.
                      </p>
                      {/* <Button onClick={handleBookNewAppointment}>
                  Book New Appointment
                </Button> */}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Request Appointments */}
          {/* <TabsContent value="requests" className="mt-6">
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
*/}
          {/* Processed Requests Section */}
          {/* {requests.filter((r) => r.status !== "pending").length > 0 && (
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
            )} */}
          {/* </TabsContent> */}

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="mt-1">
            <div className="space-y-3">
              <Card className="border border-gray-400">
                <CardHeader className="flex items-center gap-2 text-2xl  font-semibold bg-gradient-to-r py-2 from-yellow-100 to-orange-100 pb-2">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  Upcoming Appointments
                </CardHeader>

                <CardContent>
                  {Object.keys(futureGrouped).length > 0 ? (
                    Object.entries(futureGrouped).map(
                      ([date, appointments]: [string, AppointmentData[]]) => (
                        <div key={date} className="mb-6">
                          <div className="flex items-center gap-2 pb-2 border-b mb-4">
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
                            <Badge
                              variant="outline"
                              className="ml-2 bg-[hsl(273,100%,60%)] text-white"
                            >
                              {appointments.length} appointment
                              {appointments.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>

                          {appointments && appointments.length > 0 ? (
                            <div className="space-y-3">
                              {appointments.map(
                                (appointment: AppointmentData) => {
                                  // Add individual appointment validation
                                  if (!appointment || !appointment._id) {
                                    console.warn(
                                      "Invalid appointment data:",
                                      appointment
                                    );
                                    return null;
                                  }

                                  if (appointment.status !== "cancelled") {
                                    return (
                                      <AppointmentCard
                                        status="pending"
                                        key={appointment._id}
                                        appointment={appointment}
                                        showDate={true}
                                      />
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center py-4">
                              No appointments found for this date
                            </div>
                          )}
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
                          You don't have any appointments scheduled for the next
                          7 days.
                        </p>
                        {/* <Button onClick={handleBookNewAppointment}>
            Book New Appointment
          </Button> */}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Previous Appointments */}
          <TabsContent value="previous" className="mt-1">
            <Card className="border border-gray-400">
              <CardHeader className="bg-gradient-to-r py-2 from-purple-100 to-pink-100">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                  Previous Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(pastGrouped).length > 0 ? (
                  Object.entries(pastGrouped).map(
                    ([date, appointments]: [string, AppointmentData[]]) =>
                      appointments.map((appointment: AppointmentData) => {
                        // Add individual appointment validation
                        if (!appointment || !appointment._id) {
                          console.warn(
                            "Invalid appointment data:",
                            appointment
                          );
                          return null;
                        }

                        if (appointment.status !== "cancelled") {
                          return (
                            <AppointmentCard
                              status="completed"
                              key={appointment._id}
                              appointment={appointment}
                              showDate={true}
                              isPrevious={true}
                            />
                          );
                        }
                      })
                  )
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No previous appointments
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You don't have any previous appointments.
                      </p>
                      {/* <Button onClick={handleBookNewAppointment}>
                  Book New Appointment
                </Button> */}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
