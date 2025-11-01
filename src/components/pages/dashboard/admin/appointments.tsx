"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Upload,
  ImageIcon,
  File,
  X,
  FileText,
  Info,
  MoreVertical,
  User,
  Stethoscope,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const appointmentsData = [
  {
    id: 1,
    doctor: "Dr Allison Curtis",
    patient: "Makenna Press",
    date: "18/04/2023",
    time: "10:00 AM",
    disease: "Allergies",
    status: "Confirmed",
  },
  {
    id: 2,
    doctor: "Dr Zaire Herwizt",
    patient: "Lincoln Lubin",
    date: "21/04/2023",
    time: "02:30 PM",
    disease: "Headaches",
    status: "Pending",
  },
  {
    id: 3,
    doctor: "Dr Maria Cultha",
    patient: "Tiana Botor",
    date: "24/04/2023",
    time: "11:15 AM",
    disease: "Allergies",
    status: "Confirmed",
  },
  {
    id: 4,
    doctor: "Dr Glana Botos",
    patient: "Polyn Lipshutz",
    date: "26/04/2023",
    time: "03:45 PM",
    disease: "Allergies",
    status: "Confirmed",
  },
  {
    id: 5,
    doctor: "Dr Ruben Bothman",
    patient: "Sarah Johnson",
    date: "27/04/2023",
    time: "09:00 AM",
    disease: "Flu",
    status: "Pending",
  },
];

interface Prescription {
  reasonForVisit: string;
  primaryDiagnosis: string;
  symptoms: string;
  prescriptionId: string;
  createdAt: Date;
}

interface appointmentdata {
  _id: string;
  doctorUserId: string;
  doctorName: string;
  doctorSpecialist: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
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
  status: string;
  meetLink?: string;
}

interface AppointmentData {
  _id: string;
  doctorpatinetId: string;
  doctorUserId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorGender: string;
  doctorEmail: string;
  hospital: string;
  patientName: string;
  patientEmail: string;
  patientId: string;
  patientPhone: string;
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
  prescription: Prescription;
  createdAt: Date;
}

interface UserDetails {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  dateOfBirth: Date;
  contactNumber: string;
  age: number;
  gender: string;
  bloodGroup: string;
  appointments: AppointmentData[];
  lastTreatmentDate?: Date;
  createdAt: Date;
}

interface RescheduleAppointment {
  _id?: string;

  // Doctor Information
  doctorpatinetId?: string;
  doctorUserId?: string;
  doctorName?: string;
  doctorSpecialist?: string;
  doctorGender?: string;
  doctorEmail?: string;
  hospital?: string;

  // Patient Information
  patientId?: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientGender?: string;
  patientAge?: number;
  patientAddress?: string;
  patientBloodgroup?: string;
  patientBithofday?: Date;

  // Appointment Details
  appointmentDate: string;
  prevappointmentDate?: string;
  appointmentTime: string;
  prevappointmentTime?: string;
  status?: string;
  consultationType: string;
  prevconsultationType?: string;
  consultedType: string;
  prevconsultedType?: string;
  reasonForVisit: string;
  prevreasonForVisit?: string;
  symptoms: string;
  prevsymptoms?: string;
  previousVisit: string;

  // Emergency Contact
  emergencyContact?: string;
  prevemergencyContact?: string;
  emergencyPhone?: string;
  prevemergencyPhone?: string;

  // Payment & Additional
  paymentMethod: string;
  prevpaymentMethod?: string;
  specialRequests?: string;
  prevspecialRequests?: string;

  // Medical Records
  prescription?: Prescription;
  // Timestamp
  prevcreatedAt?: Date;
  createdAt?: Date;
}

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
  today: appointmentdata[];
  future: appointmentdata[];
  past: appointmentdata[];
  cancelled: appointmentdata[];
}

// Interface for grouped appointments by date
interface GroupedAppointments {
  [date: string]: appointmentdata[];
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
  appointments: appointmentdata[]
): CategorizedAppointments => {
  const todayDate = getTodayDate();

  const categorized: CategorizedAppointments = {
    today: [],
    future: [],
    past: [],
    cancelled: [], // Added cancelled array
  };

  appointments.forEach((appointment) => {
    // First check if appointment is cancelled
    if (appointment.status === "cancelled") {
      categorized.cancelled.push(appointment);
    } else {
      // If not cancelled, categorize by date
      const category = compareDates(appointment.appointmentDate, todayDate);
      categorized[category].push(appointment);
    }
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

  categorized.cancelled.sort((a, b) => {
    if (b.appointmentDate === a.appointmentDate) {
      return b.appointmentTime.localeCompare(a.appointmentTime);
    }
    return b.appointmentDate.localeCompare(a.appointmentDate);
  });

  return categorized;
};

// Function to group appointments by date
const groupAppointmentsByDate = (
  appointments: appointmentdata[]
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

export default function Appointments({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReschedule, setIsReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<Partial<
    appointmentdata[]
  > | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [rescheduleappointment, setRescheduleappointment] = useState<
    RescheduleAppointment[]
  >([]);

  const [selectedrescheduleappointment, setSelectedrescheduleappointment] =
    useState<RescheduleAppointment | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<UserDetails[]>([]);
  const [appointmentsData, setAppointmentsData] =
    useState<appointmentdata | null>(null);

  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/api/admin/fetchdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Not fetch patient and doctor details successfully");
        }
        let result = await response.json();
        setPatientData(result.userdetails);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    // Then fetch every 30 seconds
    const interval = setInterval(fetchData, 60000);

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(interval);
  }, [admin]);

  const allAppointments = useMemo(() => {
    return patientData.flatMap((patient) => patient?.appointments || []);
  }, [patientData]);

  const categorizedAppointments = useMemo(() => {
    return categorizeAppointments(
      allAppointments
        ? Array.isArray(allAppointments)
          ? allAppointments
          : []
        : []
    );
  }, [allAppointments]);

  useEffect(() => {
    const fetchDataofAdmin = async () => {
      try {
        let response = await fetch(`/api/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Not fetch patient and doctor details successfully");
        }
        let result = await response.json();

        setRescheduleappointment(result?.adminstore?.rescheduleAppointment);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDataofAdmin();
  }, [admin]);

  // Group appointments by date
  const todayGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.today);
  }, [categorizedAppointments.today]);

  const futureGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.future);
  }, [categorizedAppointments.future]);

  const pastGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.past);
  }, [categorizedAppointments.past]);

  const cancelledGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.cancelled);
  }, [categorizedAppointments.cancelled]);

  //Handle to join in video conferrance
  const handleJoinSession = async (appointment: appointmentdata) => {
    // If meet link exists, open it
    if (appointment.meetLink) {
      window.open(appointment.meetLink, "_blank");
      return;
    }

    // If no meet link, try to create one
    try {
      const response = await fetch("/api/google/create-meet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          doctorName: appointment.doctorName,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          reasonForVisit: appointment.reasonForVisit,
        }),
      });

      const result = await response.json();

      if (result.success && result.meetLink) {
        // Update appointment with new meet link
        appointment.meetLink = result.meetLink;

        // Open the meet link
        window.open(result.meetLink, "_blank");

        // Show success message
        alert("Google Meet link created successfully!");
      } else {
        throw new Error(result.error || "Failed to create Meet link");
      }
    } catch (error) {
      console.error("[v0] Error creating Meet link:", error);
      alert(
        "Failed to create video call link. Please try again or contact support."
      );
    }
  };

  //Cancel the appointment
  const handleCancelAppointment = async (appointment: AppointmentData) => {
    let appointmentDeleteResponse = await fetch(
      "./api/admin/deleteAppointment",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment,
        }),
      }
    );
    let appointmentdeleteresponse = await appointmentDeleteResponse.json();
    setAppointmentsData(appointmentdeleteresponse?.userdetails?.appointments);
  };

  //handle bokking when user reschedule appointment booking
  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setIsReschedule(false);
    setRescheduleData(null);
  };

  const handleRescheduleAppointment = (appointment: appointmentdata) => {
    setRescheduleData(appointment);
    setIsReschedule(true);
    setIsBookingOpen(true);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-green-600";
      case "pending":
        return "border-yellow-600";
      case "completed":
        return "border-blue-600";
      default:
        return "border-gray-600";
    }
  };

  const handleViewDetails = (appointment: appointmentdata) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleViewRescheduleAppointmentDetails = (
    appointment: RescheduleAppointment
  ) => {
    setSelectedrescheduleappointment(appointment);
    setShowDetailsModal(true);
  };

  const handleViewPrescription = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  const handleViewReports = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReportsModal(true);
  };

  const getDoctorInitials = (doctorName: string) => {
    if (!doctorName) return "DR";

    // Remove DR/Dr prefix and clean the name
    const cleanName = doctorName
      .replace(/^(DR\.?|Dr\.?)\s*/i, "") // Remove DR/Dr at the beginning
      .trim();

    if (!cleanName) return "DR";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "DR";
    }
  };

  return (
    <div className="px-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-blue-900">
                  {/* {Object.keys(futureGrouped).length} */}
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
                  {/* {Object.keys(todayGrouped).length} */}
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
                  {/* {Object.keys(pastGrouped).length} */}
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
      <div className=" grid grid-cols-5 space-x-1 bg-gray-100 p-1 rounded-lg w-full">
        <Button
          variant={activeTab === "upcoming" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "upcoming" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({Object.keys(futureGrouped).length})
        </Button>
        <Button
          variant={activeTab === "today" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "today" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("today")}
        >
          Today ({Object.keys(todayGrouped).length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "past" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("past")}
        >
          Past ({Object.keys(pastGrouped).length})
        </Button>
        <Button
          variant={activeTab === "reschedule" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "reschedule" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("reschedule")}
        >
          Reschedule ({rescheduleappointment?.length})
        </Button>
        <Button
          variant={activeTab === "cancelled" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "cancelled" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled ({Object.keys(cancelledGrouped).length})
        </Button>
      </div>

      {/* Content */}
      {activeTab === "upcoming" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Badge variant="outline" className="bg-blue-600 text-white">
              {Object.keys(futureGrouped).length} scheduled
            </Badge>
          </div>

          {Object.keys(futureGrouped).length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Patient
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Reason
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(futureGrouped)
                  .sort(
                    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
                  )
                  .map(([date, appointments]: [string, appointmentdata[]]) =>
                    appointments.map((apt) => (
                      <tr
                        key={apt._id}
                        className={`border-b border-slate-100 hover:bg-slate-50 ${
                          apt.status === "cancelled" ? "opacity-60" : ""
                        }`}
                      >
                        <td className="py-4 px-3 text-slate-900">
                          {apt.doctorName}
                        </td>
                        <td className="py-4 px-3 text-slate-900">
                          {apt?.patientName}
                        </td>
                        <td className="py-4 px-3 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {apt?.appointmentDate} • {apt?.appointmentTime}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-slate-600">
                          {apt?.reasonForVisit || "N/A"}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              apt.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : apt.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>

                        <td className="py-4 ">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                              >
                                <MoreVertical className="h-4 w-4 mr-2" />
                                Actions
                              </Button>
                            </DialogTrigger>

                            {/* Modal Content */}

                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Appointment Actions</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                  Choose an action for this appointment
                                </DialogDescription>
                              </DialogHeader>

                              {apt.status === "cancelled" ? (
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                  <Button
                                    variant="outline"
                                    className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                    onClick={() => {
                                      handleViewReports(apt);
                                    }}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Reports
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                                    onClick={() => {
                                      handleViewPrescription(apt);
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Prescription
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                    onClick={() => {
                                      handleViewDetails(apt);
                                    }}
                                  >
                                    <Info className="h-4 w-4 mr-2" />
                                    See Details
                                  </Button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                  <Button
                                    variant="outline"
                                    className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                                    onClick={() => {
                                      handleCancelAppointment(apt);
                                    }}
                                  >
                                    Cancel
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                                    onClick={() => {
                                      handleRescheduleAppointment(apt);
                                    }}
                                  >
                                    Reschedule
                                  </Button>

                                  <Button
                                    className="bg-pink-500 hover:bg-pink-600 text-white"
                                    onClick={() => {
                                      handleJoinSession(apt);
                                    }}
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    Join
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                    onClick={() => {
                                      handleViewReports(apt);
                                    }}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Reports
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                                    onClick={() => {
                                      handleViewPrescription(apt);
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Prescription
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                    onClick={() => {
                                      handleViewDetails(apt);
                                    }}
                                  >
                                    <Info className="h-4 w-4 mr-2" />
                                    See Details
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center py-8 border border-slate-200 rounded-lg">
              No upcoming appointments
            </div>
          )}
        </div>
      )}

      {activeTab === "today" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Appointments
            </h2>
            <Badge variant="outline" className="bg-green-700 text-white">
              {Object.keys(todayGrouped).length} appointments
            </Badge>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Doctor
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Patient
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Date & Time
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Disease
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(todayGrouped)
                .sort(
                  ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
                )
                .map(([date, appointments]: [string, any[]]) =>
                  appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-3 text-slate-900">
                        {apt.doctorName}
                      </td>
                      <td className="py-4 px-1 text-slate-900">
                        {apt?.patientName}
                      </td>
                      <td className="py-4 px-1 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {apt?.appointmentDate}•{apt?.appointmentTime}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-slate-600">
                        {apt?.reasonForVisit ||
                          apt.prescription?.prescription?.symptoms}
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 ">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-gray-600 border-gray-200 hover:bg-gray-50"
                            >
                              <MoreVertical className="h-4 w-4 mr-2" />
                              Actions
                            </Button>
                          </DialogTrigger>

                          {/* Modal Content */}

                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Appointment Actions</DialogTitle>
                              <DialogDescription className="text-sm text-gray-500 mt-1">
                                Choose an action for this appointment
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                              <Button
                                variant="outline"
                                className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                                onClick={() => {
                                  handleCancelAppointment(apt);
                                }}
                              >
                                Cancel
                              </Button>

                              <Button
                                variant="outline"
                                className="text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                                onClick={() => {
                                  handleRescheduleAppointment(apt);
                                }}
                              >
                                Reschedule
                              </Button>

                              <Button
                                className="bg-pink-500 hover:bg-pink-600 text-white"
                                onClick={() => {
                                  handleJoinSession(apt);
                                }}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join
                              </Button>

                              <Button
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                onClick={() => {
                                  handleViewReports(apt);
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Reports
                              </Button>

                              <Button
                                variant="outline"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                                onClick={() => {
                                  handleViewPrescription(apt);
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Prescription
                              </Button>

                              <Button
                                variant="outline"
                                className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                onClick={() => {
                                  handleViewDetails(apt);
                                }}
                              >
                                <Info className="h-4 w-4 mr-2" />
                                See Details
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "past" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment History
            </h2>
            <Badge variant="outline" className="bg-purple-700 text-white">
              {Object.keys(pastGrouped).length} completed
            </Badge>
          </div>

          {Object.keys(pastGrouped).length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Patient
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Disease
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pastGrouped)
                  .sort(
                    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
                  )
                  .map(([date, appointments]: [string, any[]]) =>
                    appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-4 px-3 text-slate-900">
                          {apt.doctorName}
                        </td>
                        <td className="py-4 px-3 text-slate-900">
                          {apt?.patientName}
                        </td>
                        <td className="py-4 px-3 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {apt?.appointmentDate}•{apt?.appointmentTime}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-slate-600">
                          {apt?.reasonForVisit ||
                            apt.prescription?.prescription?.symptoms}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              apt.status === "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                              >
                                <MoreVertical className="h-4 w-4 mr-2" />
                                Actions
                              </Button>
                            </DialogTrigger>

                            {/* Modal Content */}

                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Appointment Actions</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                  Choose an action for this appointment
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid grid-cols-2 gap-3 mt-4">
                                <Button
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                  onClick={() => {
                                    handleViewReports(apt);
                                  }}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Reports
                                </Button>

                                <Button
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                                  onClick={() => {
                                    handleViewPrescription(apt);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Prescription
                                </Button>

                                <Button
                                  variant="outline"
                                  className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                  onClick={() => {
                                    handleViewDetails(apt);
                                  }}
                                >
                                  <Info className="h-4 w-4 mr-2" />
                                  See Details
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center py-8 border border-slate-200 rounded-lg">
              No appointment data available
            </div>
          )}
        </div>
      )}

      {activeTab === "reschedule" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              All Rescheduled Appointment History
            </h2>
            <Badge variant="outline" className="bg-purple-700 text-white">
              {rescheduleappointment.length} completed
            </Badge>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Doctor
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Patient
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Date & Time
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Disease
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rescheduleappointment &&
                rescheduleappointment.length > 0 &&
                rescheduleappointment
                  .sort((a, b) => {
                    const dateA = new Date(a.appointmentDate).getTime();
                    const dateB = new Date(b.appointmentDate).getTime();
                    return dateB - dateA;
                  })

                  .map((apt) => (
                    <tr
                      key={apt._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-3 text-slate-900">
                        {apt.doctorName}
                      </td>
                      <td className="py-4 px-3 text-slate-900">
                        {apt?.patientName}
                      </td>
                      <td className="py-4 px-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {apt?.appointmentDate}•{apt?.appointmentTime}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-slate-600">
                        {apt?.reasonForVisit || apt.prescription?.symptoms}
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-gray-600 border-gray-200 hover:bg-gray-50"
                            >
                              <MoreVertical className="h-4 w-4 mr-2" />
                              Actions
                            </Button>
                          </DialogTrigger>

                          {/* Modal Content */}

                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Appointment Actions</DialogTitle>
                              <DialogDescription className="text-sm text-gray-500 mt-1">
                                Choose an action for this appointment
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 gap-3 mt-4">
                              <Button
                                variant="outline"
                                className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                onClick={() => {
                                  handleViewRescheduleAppointmentDetails(apt);
                                }}
                              >
                                <Info className="h-4 w-4 mr-2" />
                                See Details
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "cancelled" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              All Cancelled Appointment
            </h2>
            <Badge variant="outline" className="bg-purple-700 text-white">
              {Object.keys(cancelledGrouped).length} completed
            </Badge>
          </div>

          {Object.keys(cancelledGrouped).length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Patient
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Disease
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-slate-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cancelledGrouped)
                  .sort(
                    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
                  )
                  .map(([date, appointments]: [string, any[]]) =>
                    appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-4 px-3 text-slate-900">
                          {apt.doctorName}
                        </td>
                        <td className="py-4 px-3 text-slate-900">
                          {apt?.patientName}
                        </td>
                        <td className="py-4 px-3 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {apt?.appointmentDate}•{apt?.appointmentTime}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-slate-600">
                          {apt?.reasonForVisit ||
                            apt.prescription?.prescription?.symptoms}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              apt.status === "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                              >
                                <MoreVertical className="h-4 w-4 mr-2" />
                                Actions
                              </Button>
                            </DialogTrigger>

                            {/* Modal Content */}

                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Appointment Actions</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                  Choose an action for this appointment
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid grid-cols-2 gap-3 mt-4">
                                <Button
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                  onClick={() => {
                                    handleViewReports(apt);
                                  }}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Reports
                                </Button>

                                <Button
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                                  onClick={() => {
                                    handleViewPrescription(apt);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Prescription
                                </Button>

                                <Button
                                  variant="outline"
                                  className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                                  onClick={() => {
                                    handleViewDetails(apt);
                                  }}
                                >
                                  <Info className="h-4 w-4 mr-2" />
                                  See Details
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center py-8 border border-slate-200 rounded-lg">
              No appointment data available
            </div>
          )}
        </div>
      )}

      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Appointment Details - {selectedAppointment.reasonForVisit}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-4">
                <p>
                  <strong>AppointmentId:</strong>{" "}
                  {selectedAppointment.doctorpatinetId}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedAppointment.appointmentDate)}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Patient Information
                  </h3>
                  <p>
                    <strong>Name:</strong> {selectedAppointment.patientName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedAppointment.patientEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedAppointment.patientPhone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Doctor Information
                  </h3>
                  <p>
                    <strong>Name:</strong> {selectedAppointment.doctorName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedAppointment.doctorEmail}
                  </p>
                  <p>
                    <strong>Specialist:</strong>{" "}
                    {selectedAppointment.doctorSpecialist}
                  </p>
                  <p>
                    <strong>Hospital:</strong> {selectedAppointment.hospital}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Appointment Specifics
                  </h3>
                  <p>
                    <strong>Date:</strong> {selectedAppointment.appointmentDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedAppointment.appointmentTime}
                  </p>
                  <p>
                    <strong>Consultation Type:</strong>{" "}
                    {selectedAppointment.consultedType}
                  </p>
                  <p>
                    <strong>Mode:</strong>{" "}
                    {selectedAppointment.consultationType}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedAppointment.status}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Medical Details
                  </h3>
                  <p>
                    <strong>Reason for Visit:</strong>{" "}
                    {selectedAppointment.reasonForVisit}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {selectedAppointment.symptoms}
                  </p>
                  <p>
                    <strong>Previous Visit:</strong>{" "}
                    {selectedAppointment.previousVisit}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Emergency Contact
                  </h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedAppointment.emergencyContact}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedAppointment.emergencyPhone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Other Information
                  </h3>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedAppointment.paymentMethod}
                  </p>
                  <p>
                    <strong>Special Requests:</strong>{" "}
                    {selectedAppointment.specialRequests}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedrescheduleappointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Rescheduled Appointment Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Changed fields are highlighted in yellow
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Appointment ID */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm">
                  <strong>Appointment ID:</strong>{" "}
                  {selectedrescheduleappointment.doctorpatinetId}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedrescheduleappointment.appointmentDate)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {/* Patient Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedrescheduleappointment.patientName}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedrescheduleappointment.patientEmail || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedrescheduleappointment.patientPhone}
                    </p>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Doctor Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedrescheduleappointment.doctorName}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedrescheduleappointment.doctorEmail || "N/A"}
                    </p>
                    <p>
                      <strong>Specialist:</strong>{" "}
                      {selectedrescheduleappointment.doctorSpecialist}
                    </p>
                    <p>
                      <strong>Hospital:</strong>{" "}
                      {selectedrescheduleappointment.hospital || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Appointment Specifics */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointment Details
                  </h3>
                  <div className="space-y-2">
                    {/* Date */}
                    <div
                      className={
                        selectedrescheduleappointment.prevappointmentDate &&
                        selectedrescheduleappointment.appointmentDate !==
                          selectedrescheduleappointment.prevappointmentDate
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Date:</strong>{" "}
                        {selectedrescheduleappointment.appointmentDate}
                      </p>
                      {selectedrescheduleappointment.prevappointmentDate &&
                        selectedrescheduleappointment.appointmentDate !==
                          selectedrescheduleappointment.prevappointmentDate && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevappointmentDate}
                          </p>
                        )}
                    </div>

                    {/* Time */}
                    <div
                      className={
                        selectedrescheduleappointment.prevappointmentTime &&
                        selectedrescheduleappointment.appointmentTime !==
                          selectedrescheduleappointment.prevappointmentTime
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Time:</strong>{" "}
                        {selectedrescheduleappointment.appointmentTime}
                      </p>
                      {selectedrescheduleappointment.prevappointmentTime &&
                        selectedrescheduleappointment.appointmentTime !==
                          selectedrescheduleappointment.prevappointmentTime && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevappointmentTime}
                          </p>
                        )}
                    </div>

                    {/* Consultation Type */}
                    <div
                      className={
                        selectedrescheduleappointment.prevconsultedType &&
                        selectedrescheduleappointment.consultedType !==
                          selectedrescheduleappointment.prevconsultedType
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Consultation Type:</strong>{" "}
                        {selectedrescheduleappointment.consultedType}
                      </p>
                      {selectedrescheduleappointment.prevconsultedType &&
                        selectedrescheduleappointment.consultedType !==
                          selectedrescheduleappointment.prevconsultedType && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevconsultedType}
                          </p>
                        )}
                    </div>

                    {/* Mode */}
                    <div
                      className={
                        selectedrescheduleappointment.prevconsultationType &&
                        selectedrescheduleappointment.consultationType !==
                          selectedrescheduleappointment.prevconsultationType
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Mode:</strong>{" "}
                        {selectedrescheduleappointment.consultationType}
                      </p>
                      {selectedrescheduleappointment.prevconsultationType &&
                        selectedrescheduleappointment.consultationType !==
                          selectedrescheduleappointment.prevconsultationType && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevconsultationType}
                          </p>
                        )}
                    </div>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          selectedrescheduleappointment.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : selectedrescheduleappointment.status ===
                                "rescheduled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedrescheduleappointment.status || "Rescheduled"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Medical Details */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Medical Details
                  </h3>
                  <div className="space-y-2">
                    {/* Reason for Visit */}
                    <div
                      className={
                        selectedrescheduleappointment.prevreasonForVisit &&
                        selectedrescheduleappointment.reasonForVisit !==
                          selectedrescheduleappointment.prevreasonForVisit
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Reason for Visit:</strong>{" "}
                        {selectedrescheduleappointment.reasonForVisit}
                      </p>
                      {selectedrescheduleappointment.prevreasonForVisit &&
                        selectedrescheduleappointment.reasonForVisit !==
                          selectedrescheduleappointment.prevreasonForVisit && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevreasonForVisit}
                          </p>
                        )}
                    </div>

                    {/* Symptoms */}
                    <div
                      className={
                        selectedrescheduleappointment.prevsymptoms &&
                        selectedrescheduleappointment.symptoms !==
                          selectedrescheduleappointment.prevsymptoms
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Symptoms:</strong>{" "}
                        {selectedrescheduleappointment.symptoms}
                      </p>
                      {selectedrescheduleappointment.prevsymptoms &&
                        selectedrescheduleappointment.symptoms !==
                          selectedrescheduleappointment.prevsymptoms && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevsymptoms}
                          </p>
                        )}
                    </div>

                    <p>
                      <strong>Previous Visit:</strong>{" "}
                      {selectedrescheduleappointment.previousVisit}
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    {/* Emergency Contact Name */}
                    <div
                      className={
                        selectedrescheduleappointment.prevemergencyContact &&
                        selectedrescheduleappointment.emergencyContact !==
                          selectedrescheduleappointment.prevemergencyContact
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Name:</strong>{" "}
                        {selectedrescheduleappointment.emergencyContact ||
                          "N/A"}
                      </p>
                      {selectedrescheduleappointment.prevemergencyContact &&
                        selectedrescheduleappointment.emergencyContact !==
                          selectedrescheduleappointment.prevemergencyContact && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevemergencyContact}
                          </p>
                        )}
                    </div>

                    {/* Emergency Phone */}
                    <div
                      className={
                        selectedrescheduleappointment.prevemergencyPhone &&
                        selectedrescheduleappointment.emergencyPhone !==
                          selectedrescheduleappointment.prevemergencyPhone
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedrescheduleappointment.emergencyPhone || "N/A"}
                      </p>
                      {selectedrescheduleappointment.prevemergencyPhone &&
                        selectedrescheduleappointment.emergencyPhone !==
                          selectedrescheduleappointment.prevemergencyPhone && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevemergencyPhone}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Other Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Other Information
                  </h3>
                  <div className="space-y-2">
                    {/* Payment Method */}
                    <div
                      className={
                        selectedrescheduleappointment.prevpaymentMethod &&
                        selectedrescheduleappointment.paymentMethod !==
                          selectedrescheduleappointment.prevpaymentMethod
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedrescheduleappointment.paymentMethod}
                      </p>
                      {selectedrescheduleappointment.prevpaymentMethod &&
                        selectedrescheduleappointment.paymentMethod !==
                          selectedrescheduleappointment.prevpaymentMethod && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevpaymentMethod}
                          </p>
                        )}
                    </div>

                    {/* Special Requests */}
                    <div
                      className={
                        selectedrescheduleappointment.prevspecialRequests &&
                        selectedrescheduleappointment.specialRequests !==
                          selectedrescheduleappointment.prevspecialRequests
                          ? "bg-yellow-100 p-2 rounded"
                          : ""
                      }
                    >
                      <p>
                        <strong>Special Requests:</strong>{" "}
                        {selectedrescheduleappointment.specialRequests ||
                          "None"}
                      </p>
                      {selectedrescheduleappointment.prevspecialRequests &&
                        selectedrescheduleappointment.specialRequests !==
                          selectedrescheduleappointment.prevspecialRequests && (
                          <p className="text-xs text-gray-500 line-through mt-1">
                            Previous:{" "}
                            {selectedrescheduleappointment.prevspecialRequests}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span>Changed Field</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="line-through">Strikethrough</span>
                    <span>= Previous Value</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Prescription - {selectedAppointment.consultedType}
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
                  {selectedAppointment.doctorName} •{" "}
                  {formatDate(selectedAppointment.appointmentDate)}
                </p>
              </div>

              {selectedAppointment.status === "completed" &&
              prescriptionsData[selectedAppointment._id] ? (
                <div className="space-y-4">
                  {prescriptionsData[selectedAppointment._id].map(
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

      {/* Reports Modal add */}
      {showReportsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reports - {selectedAppointment.consultedType}
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
                  {selectedAppointment.doctorName} •
                  {selectedAppointment.patientName}•{" "}
                  {formatDate(selectedAppointment.appointmentDate)}
                </p>
              </div>

              {/* Upload Section for Upcoming Appointments */}
              {selectedAppointment.status !== "completed" && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Upload Reports
                  </h3>

                  {/* Show uploaded files with preview */}
                  {uploadedFiles.length > 0 ? (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Uploaded Files ({uploadedFiles.length}):
                      </h4>
                      <div className="space-y-3">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            {/* File preview or icon */}
                            <div className="flex-shrink-0">
                              {file.preview ? (
                                <img
                                  src={file.preview || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                  {getFileIcon(file)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Save Documents"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No File Available
                      </h3>
                      <p className="text-gray-600">
                        No file, reports, document was uploaded for this
                        appointment.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
