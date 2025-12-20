"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  Eye,
  Download,
  Video,
  FileEdit,
  MessageCircle,
  ImageIcon,
  FileText,
  File,
} from "lucide-react";
import Prescription from "./prescription";
import Document from "./appointmentDocument";
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
import { Input } from "@/components/ui/input";

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
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let id = doctor?._id;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/doctor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responsedata = await response.json();
        setAppointmentData(responsedata.doctordetails);
      } catch (error) {
        console.error("No doctor data. Error is:", error);
      } finally {
        setIsLoading(false);
      }
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

  //handler function to view report of appointment
  const handleViewReports = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowReportsModal(true);
  };

  // for set file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  //handle file upload when you upload reports
  const handleFileUpload = (appointmentId: string, files: FileList) => {
    const newFiles = Array.from(files).map((file) => {
      const fileData: any = {
        name: file.name,
        documentName: file.name.replace(/\.[^/.]+$/, ""), // Default to filename without extension
        size: file.size,
        type: file.type,
        file: file,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileData.preview = e.target?.result;
          setUploadedFiles((prev) => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      return fileData;
    });
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  //Handle the file rename function with Debouncing
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

  const handleDocumentNameChange = (index: number, newName: string) => {
    // Clear existing timer for this index
    if (debounceTimersRef.current[index]) {
      clearTimeout(debounceTimersRef.current[index]);
    }

    // Immediately update the input field (optimistic update)
    setUploadedFiles((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, documentName: newName } : file
      )
    );

    // Set new debounced timer
    const timerId = setTimeout(() => {
      // This is where you could make an API call if needed
      console.log(`Document name updated for index ${index}: ${newName}`);
    }, 500); // 500ms delay

    debounceTimersRef.current[index] = timerId;
  };

  //remove file when you trying to upload
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //user trying to save document
  const handleSaveDocuments = async () => {
    if (!selectedAppointment) return;
    if (uploadedFiles.length === 0) {
      alert("Please select at least one file to upload");
      return;
    }
    setIsUploading(true);
    setIsLoading(true);
    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("doctorpatinetId", selectedAppointment.doctorpatinetId);
      formData.append("patientName", selectedAppointment.patientName);
      formData.append("patientId", selectedAppointment.patientId);
      formData.append("consultedType", selectedAppointment.consultedType);
      formData.append("userIdWHUP", selectedAppointment.doctorpatinetId);
      formData.append("userId", doctor?._id || "");
      // Append all files
      uploadedFiles.forEach((fileData, index) => {
        formData.append(`files`, fileData.file);
        formData.append(`documentNames`, fileData.documentName);
        formData.append(`originalNames`, fileData.name);
      });
      // Call the upload API
      const response = await fetch("/api/doctor/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("[v0] Upload successful:", result);

      // Clear uploaded files for this appointment
      setShowReportsModal(false);
      setIsUploading(false);
      setUploadedFiles([]);

      alert("Documents uploaded successfully!");
    } catch (error) {
      console.error("[v0] Upload error:", error);
      setIsUploading(false);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload documents. Please try again."
      );
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointment: any) => {
    let id = doctor?._id;
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const isAppointmentToday = (appointmentDate: string) => {
    return appointmentDate === getTodayDate();
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
  }) => {
    const consultationType = (
      appointment?.consultationType || ""
    ).toLowerCase();
    const isVideoConsult = consultationType === "video";
    const isAudioConsult =
      consultationType === "phone" || consultationType === "audio";
    const isToday = isAppointmentToday(appointment?.appointmentDate);
    const isCancelled =
      (appointment?.status || "").toLowerCase() === "cancelled";
    const canStartSession = isToday && !isCancelled && status !== "completed";

    return (
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
                      <span className="truncate">
                        {appointment.patientPhone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="truncate">
                        {appointment.patientEmail}
                      </span>
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
                    <Button
                      size="sm"
                      className="text-xs bg-green-500 hover:bg-green-600 hover:text-black text-white w-full xs:flex-1"
                      onClick={() => handleViewReports(appointment)}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
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

                    {isVideoConsult && canStartSession && (
                      <Button
                        size="sm"
                        className="text-xs bg-blue-500 hover:bg-blue-600 hover:text-black text-white w-full xs:flex-1"
                        onClick={() => setShowRoomDialog(true)}
                        disabled={!canStartSession}
                      >
                        <Video className="h-3 w-3 mr-1" />
                        Join Video
                      </Button>
                    )}
                    {isAudioConsult && canStartSession && (
                      <Button
                        size="sm"
                        className="text-xs bg-blue-500 hover:bg-blue-600 hover:text-black text-white w-full xs:flex-1"
                        onClick={() => setShowAudioRoomDialog(true)}
                        disabled={!canStartSession}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Join Audio
                      </Button>
                    )}
                    {canStartSession && (
                      <Button
                        size="sm"
                        className="text-xs bg-green-500 hover:bg-green-600 hover:text-black text-white w-full xs:flex-1"
                        onClick={() => handleCreatePrescription(appointment)}
                        disabled={!canStartSession}
                      >
                        <FileEdit className="h-3 w-3 mr-1" />
                        Create
                      </Button>
                    )}
                    {canStartSession && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-2 border-purple-400 transition-all hover:border-purple-600
                     hover:bg-purple-50 text-purple-700 bg-transparent w-full xs:flex-1"
                        onClick={() => setShowMessageModal(true)}
                        disabled={!canStartSession}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    )}
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
                      variant="outline"
                      onClick={() => handleSeeDocument(appointment)}
                      className="text-xs border-2 border-gray-400 transition-all hover:border-primary/50 w-full xs:flex-1"
                    >
                      Document
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-2 border-purple-400 transition-all hover:border-purple-600 hover:bg-purple-50 text-purple-700 bg-transparent w-full xs:flex-1"
                      onClick={() => setShowMessageModal(true)}
                      disabled={isCancelled}
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
        <Dialog
          open={showAudioRoomDialog}
          onOpenChange={setShowAudioRoomDialog}
        >
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
  };

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
              className="border border-gray-300 bg-[hsl(201,95%,41%)]
               hover:bg-[hsl(201,95%,31%)] text-white hover:text-white px-6 py-2.5 transition-all hover:border-blue-500 hover:shadow-md rounded-md"
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
      {/* Reports Modal add */}
      {showReportsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] custom-scrollbar">
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
                  {selectedAppointment.patientName} •{" "}
                  {formatDate(selectedAppointment.appointmentDate)}
                </p>
              </div>

              {/* Upload Section for Upcoming Appointments */}
              {selectedAppointment.status !== "completed" && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Upload Reports
                  </h3>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg 
                  p-6 text-center hover:border-blue-400 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload medical reports, lab results, or other documents
                      for your doctor
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per
                      file)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) =>
                        e.target.files &&
                        handleFileUpload(
                          selectedAppointment._id,
                          e.target.files
                        )
                      }
                      className="hidden"
                      id={`file-upload-${selectedAppointment._id}`}
                    />
                    <label
                      htmlFor={`file-upload-${selectedAppointment._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
                       text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>

                  {/* Show uploaded files with preview */}
                  {uploadedFiles.length > 0 && (
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

                            {/* File details */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Document Name
                                </label>
                                <Input
                                  type="text"
                                  value={file.documentName}
                                  onChange={(e) =>
                                    handleDocumentNameChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter document name"
                                  className="w-full border-2 transition-all hover:border-primary/50 hover:shadow-lg"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  File: {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                  {file.type || "Unknown type"}•{" "}
                                  {new Date().toISOString().split("T")[0]}•{" "}
                                  {new Date().toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Remove button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFile(index)}
                              className="flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={handleSaveDocuments}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Save Documents"}
                      </Button>
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
