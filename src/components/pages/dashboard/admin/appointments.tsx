"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Download,
  Eye,
  User,
  Stethoscope,
  ClipboardPlus,
  Check,
} from "lucide-react";

interface Prescription {
  reasonForVisit: string;
  primaryDiagnosis: string;
  symptoms: string;
  prescriptionId: string;
  createdAt: Date;
}

interface FileUpload {
  _id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  filename: string;
  originalName: string;
  documentName: string;
  fileType: string;
  fileSize: number;
  path: string;
  url: string;
  checksum: string;
  uploadedAt: Date;
  doctorName?: string;
  category?: string;
  userIdWHUP?: string;
  appointmentId?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
  document?: FileUpload[];
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
      return <Video className="h-4 w-4 text-gray-800" />;
    case "phone":
      return <Phone className="h-4 w-4 text-gray-800" />;
    case "in-person":
      return <MapPin className="h-4 w-4 text-gray-800" />;
    default:
      return <Calendar className="h-4 w-4 text-gray-800" />;
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

// Add your Bunny CDN configuration
const BUNNY_CDN_PULL_ZONE = "side-effects-pull.b-cdn.net";

export default function Appointments({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
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
        console.log("🧞‍♂️  result --->", result);
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

  //For escape button
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDetailsModal(false);
      }
    };
    // Add event listener when modal is shown
    if (showDetailsModal) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    // Cleanup: remove event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showDetailsModal]);

  //For escape button
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowReportsModal(false);
      }
    };
    // Add event listener when modal is shown
    if (showReportsModal) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    // Cleanup: remove event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showReportsModal]);

  //For escape button
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPrescriptionModal(false);
      }
    };
    // Add event listener when modal is shown
    if (showPrescriptionModal) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    // Cleanup: remove event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showPrescriptionModal]);

  //Helper function to  construct proper bunny cdn url for fetch document
  const getBunnyCDNUrl = (document: FileUpload) => {
    // Remove the storage domain and replace with pull zone
    const path = `${document?.patientId}/${document?.fileType.startsWith("image/") ? "image" : "document"}/${document?.filename}`;

    return `https://${BUNNY_CDN_PULL_ZONE}/${path}`;
  };

  const allAppointments = useMemo(() => {
    return patientData.flatMap((patient) => patient?.appointments || []);
  }, [patientData]);

  //categorize the appointment into the browser memo
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
  // Group today appointments by date
  const todayGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.today);
  }, [categorizedAppointments.today]);

  // Group future appointments by date
  const futureGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.future);
  }, [categorizedAppointments.future]);

  // Group past appointments by date
  const pastGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.past);
  }, [categorizedAppointments.past]);

  // Group canclled appointments
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

  const handleRescheduleAppointment = (appointment: appointmentdata) => {
    setRescheduleData(appointment);
    setIsReschedule(true);
    setIsBookingOpen(true);
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

  //handler function to view details of appointment
  const handleViewDetails = (appointment: appointmentdata) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  //handler function to reschedule appointment
  const handleViewRescheduleAppointmentDetails = (
    appointment: RescheduleAppointment
  ) => {
    setSelectedrescheduleappointment(appointment);
    setShowDetailsModal(true);
  };

  //handler function to view prescription of appointment
  const handleViewPrescription = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  //handler function to view report of appointment
  const handleViewReports = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReportsModal(true);
  };

  //handler function to findout the doctor initial
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

  //add the download handler function
  const handleDownload = async (document: FileUpload) => {
    try {
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.originalName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };

  //appointment card
  const AppointmentCard = ({
    status,
    appointment,
    showActions = false,
    type,
  }: {
    status: string;
    appointment: any;
    showActions?: boolean;
    type?: string;
  }) => (
    <Card
      className={`mb-4 border-l-4 ${getBorderColor(status)} hover:shadow-md transition-shadow`}
    >
      <CardContent className="">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {getDoctorInitials(appointment.doctorName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {appointment.reasonForVisit}
                </h3>
                <Badge className={getStatusColor(status)}>{status}</Badge>
              </div>

              <p className="text-sm font-semibold text-gray-800 mb-1">
                {appointment.doctorName} • {appointment.doctorSpecialist}
              </p>

              <p className="text-sm font-semibold text-gray-800 mb-1">
                Patient• {appointment.patientName}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-800 " />
                  {appointment.appointmentTime}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-800" />
                  {appointment.appointmentDate}
                </div>
                <div className="flex items-center gap-1">
                  {getModeIcon(appointment.consultationType)}
                  {appointment.consultationType === "in-person"
                    ? "In-person"
                    : appointment.consultationType === "video"
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
                {/* {status === "confirmed" &&
                  appointment.consultationType === "video" && (
                    <Button
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={() => handleJoinSession(appointment)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  )} */}
                {type === "upcoming" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 bg-transparent"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                      onClick={() => handleRescheduleAppointment(appointment)}
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
            {type === "reschedule" ? (
              <Button
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                onClick={() =>
                  handleViewRescheduleAppointmentDetails(appointment)
                }
              >
                <Info className="h-4 w-4 mr-2" />
                See Details
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                onClick={() => handleViewDetails(appointment)}
              >
                <Info className="h-4 w-4 mr-2" />
                See Details
              </Button>
            )}
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
              onClick={() => handleViewReports(appointment)}
            >
              <ClipboardPlus className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container w-full mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className=" px-4 py-0 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-blue-900">
                  {Object.keys(futureGrouped).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="px-4 py-0 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Today</p>
                <p className="text-2xl font-bold text-green-900">
                  {Object.keys(todayGrouped).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="px-4 py-0 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Object.keys(pastGrouped).length}
                </p>
              </div>
              <Check className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="w-full ">
        <div className="grid min-w-[320px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === "upcoming" ? "default" : "ghost"}
            className={`w-full text-sm sm:text-base px-4 py-2 ${activeTab === "upcoming" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({Object.keys(futureGrouped).length})
          </Button>
          <Button
            variant={activeTab === "today" ? "default" : "ghost"}
            className={`w-full text-sm sm:text-base px-4 py-2 ${activeTab === "today" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
            onClick={() => setActiveTab("today")}
          >
            Today ({Object.keys(todayGrouped).length})
          </Button>
          <Button
            variant={activeTab === "past" ? "default" : "ghost"}
            className={`w-full text-sm sm:text-base px-4 py-2 ${activeTab === "past" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
            onClick={() => setActiveTab("past")}
          >
            Past ({Object.keys(pastGrouped).length})
          </Button>
          <Button
            variant={activeTab === "reschedule" ? "default" : "ghost"}
            className={`w-full text-sm sm:text-base px-4 py-2 ${activeTab === "reschedule" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
            onClick={() => setActiveTab("reschedule")}
          >
            Reschedule ({rescheduleappointment?.length})
          </Button>
          <Button
            variant={activeTab === "cancelled" ? "default" : "ghost"}
            className={`w-full text-sm sm:text-base px-4 py-2 ${activeTab === "cancelled" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({Object.keys(cancelledGrouped).length})
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "upcoming" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Badge variant="outline" className="bg-blue-600 text-white">
              {Object.keys(futureGrouped).length} scheduled
            </Badge>
          </div>

          {Object.keys(futureGrouped).length > 0 ? (
            Object.entries(futureGrouped).map(
              ([date, appointments]: [string, appointmentdata[]]) => (
                <div key={date} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
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

                  {appointments && appointments.length > 0 ? (
                    appointments.map((appointment: appointmentdata) => {
                      // Add individual appointment validation
                      if (!appointment || !appointment._id) {
                        console.warn("Invalid appointment data:", appointment);
                        return null;
                      }

                      if (appointment.status !== "cancelled") {
                        return (
                          <AppointmentCard
                            status="pending"
                            key={appointment._id}
                            appointment={appointment}
                            showActions={true}
                            type="upcoming"
                          />
                        );
                      }
                    })
                  ) : (
                    <Card>
                      <CardContent className="px-8 py-4 lg:p-8  text-center">
                        <div className="bg-blue-300 rounded-lg p-2">
                          <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No upcoming appointments
                          </h3>
                          <p className="text-gray-600 mb-4">
                            You don't have any appointments scheduled for the
                            next 7 days.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )
            )
          ) : (
            <Card>
              <CardContent className="px-8 py-4 lg:p-8  text-center">
                <div className="bg-blue-50 rounded-lg p-2">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any appointments scheduled for the next 7
                    days.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "today" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Clock className="h-5 w-5 text-green-600 " />
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Appointments
            </h2>
            <Badge variant="outline" className="bg-green-700 text-white">
              {Object.keys(todayGrouped).length} appointments
            </Badge>
          </div>

          {Object.keys(todayGrouped).length > 0 ? (
            todayGrouped && Object.keys(todayGrouped).length > 0 ? (
              Object.entries(todayGrouped).map(
                ([date, appointments]: [string, appointmentdata[]]) =>
                  appointments.map((appointment: appointmentdata) => {
                    // Add individual appointment validation
                    if (!appointment || !appointment._id) {
                      console.warn("Invalid appointment data:", appointment);
                      return null;
                    }

                    if (appointment.status !== "cancelled") {
                      return (
                        <AppointmentCard
                          status="confirmed"
                          key={appointment._id}
                          appointment={appointment}
                          showActions={true}
                          type="today"
                        />
                      );
                    }
                  })
              )
            ) : (
              <Card>
                <CardContent className="px-8 py-4 lg:p-8  text-center">
                  <div className="bg-blue-300 rounded-lg p-2">
                    <Calendar className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No today appointments
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You don't have any appointments scheduled for today.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="px-8 py-4 lg:p-8  text-center">
                <div className="bg-green-50 rounded-lg p-2">
                  <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No today appointments
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any appointments scheduled for today.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "past" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment History
            </h2>
            <Badge variant="outline" className="bg-purple-700 text-white">
              {Object.keys(pastGrouped).length} completed
            </Badge>
          </div>

          {Object.keys(pastGrouped).length > 0 ? (
            Object.entries(pastGrouped)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, appointments]: [string, any]) => (
                <div key={date} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
                    <h3 className="text-lg font-medium text-gray-800">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                    <Badge variant="outline" className="ml-2 bg-purple-200">
                      {appointments.length} appointment
                      {appointments.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {appointments.map((appointment: any) => {
                    if (appointment.status !== "cancelled") {
                      return (
                        <AppointmentCard
                          status="completed"
                          key={appointment.id}
                          appointment={appointment}
                          showActions={false}
                          type="past"
                        />
                      );
                    }
                  })}
                </div>
              ))
          ) : (
            <Card>
              <CardContent className="px-8 py-4 lg:p-8  text-center">
                <div className="bg-purple-50 rounded-lg p-2">
                  <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No previous appointments
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any previous appointments.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "reschedule" && (
        <div className="space-y-6 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-900" />
            <h2 className="text-xl font-semibold text-gray-900">
              All Rescheduled Appointment History
            </h2>
            <Badge variant="outline" className="bg-gray-800 text-white">
              {rescheduleappointment.length} completed
            </Badge>
          </div>

          {Object.keys(rescheduleappointment).length > 0 ? (
            rescheduleappointment
              .sort((a, b) => {
                const dateA = new Date(a.appointmentDate).getTime();
                const dateB = new Date(b.appointmentDate).getTime();
                return dateB - dateA;
              })

              .map((apt) => {
                if (!apt || !apt._id) {
                  console.warn("Invalid appointment data:", apt);
                  return null;
                }

                return (
                  <AppointmentCard
                    status="reschedule"
                    key={apt._id}
                    appointment={apt}
                    showActions={true}
                    type="reschedule"
                  />
                );
              })
          ) : (
            <Card>
              <CardContent className="px-8 py-4 lg:p-8  text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <Calendar className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reschedule appointments
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any reschedule appointments.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "cancelled" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-5 w-5 text-red-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              All Cancelled Appointment
            </h2>
            <Badge variant="outline" className="bg-red-700 text-white">
              {Object.keys(cancelledGrouped).length} completed
            </Badge>
          </div>

          {Object.keys(cancelledGrouped).length > 0 ? (
            Object.entries(cancelledGrouped)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, appointments]: [string, any[]]) =>
                appointments.map((apt) => {
                  if (!apt || !apt._id) {
                    console.warn("Invalid appointment data:", apt);
                    return null;
                  }

                  return (
                    <AppointmentCard
                      status="cancelled"
                      key={apt._id}
                      appointment={apt}
                      showActions={true}
                      type="cancelled"
                    />
                  );
                })
              )
          ) : (
            <Card>
              <CardContent className="px-8 py-4 lg:p-8  text-center">
                <div className="bg-red-50 rounded-lg p-2">
                  <Calendar className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any appointments scheduled for the next 7
                    days.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl mt-6 sm:mt-10">
            <div className="p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Appointment Details - {selectedAppointment.reasonForVisit}
                </h2>
                <Button
                  variant="default"
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-screen-sm sm:max-w-3xl mt-6 sm:mt-10">
            <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Rescheduled Appointment Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Changed fields are highlighted in yellow
                  </p>
                </div>
                <Button
                  variant="default"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-screen-sm sm:max-w-2xl mt-6 sm:mt-10">
            <div className="p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Prescription - {selectedAppointment.consultedType}
                </h2>
                <Button
                  variant="default"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-screen-sm sm:max-w-2xl mt-6 sm:mt-10">
            <div className="p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reports - {selectedAppointment.consultedType}
                </h2>
                <Button
                  variant="default"
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

                  {/* New Section: Uploaded Documents/Reports */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Uploaded Documents & Reports
                    </h3>
                    {selectedAppointment?.document &&
                    selectedAppointment?.document?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedAppointment?.document?.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {file?.documentName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {file.fileSize &&
                                    `${(file.fileSize / 1024).toFixed(2)} KB`}{" "}
                                  • Uploaded on{" "}
                                  {file?.updatedAt
                                    ? new Date(
                                        file.updatedAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(getBunnyCDNUrl(file), "_blank")
                                }
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <button
                                onClick={() => handleDownload(file)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary
                                 text-primary-foreground hover:text-black rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No documents uploaded for this appointment
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
