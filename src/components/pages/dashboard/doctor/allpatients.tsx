"use client";

import { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatInTimeZone } from "date-fns-tz";
import {
  Search,
  Calendar,
  Users,
  ClipboardList,
  ChevronRight,
  CheckCircle,
  FileText,
  Download,
  Eye,
  Pill,
  Clock,
  Heart,
  Airplay,
  Brain,
  User,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Activity,
  Shield,
  Phone,
  Transgender,
  ScanEye,
  Mail,
  Cake,
  MapPinHouse,
  BookUser,
  Droplet,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import PrescriptionShow from "./prescriptionShow";

interface VitalSign {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  bmi?: number;
}

interface Medication {
  id: string;
  medecineName: string;
  medecineDosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: string;
  route?: string[];
  startDate?: Date;
  endDate?: Date;
}
interface Prescription {
  vitalSign: VitalSign;
  doctorName: string;
  reasonForVisit: string;
  primaryDiagnosis: string;
  testandReport: string;
  medication: Medication[];
  symptoms: string;
  restrictions: string;
  followUpDate: string;
  additionalNote: string;
  prescriptionId: string;
  createdAt: Date;
}

interface AppointmentDataPatient {
  doctorpatinetId: string;
  doctorUserId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorGender: string;
  doctorEmail: string;
  hospital: string;
  patientName: string;
  patientId: string;
  patientEmail: string;
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
  cancelledBy?: string;
  cancelledAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

interface AppointmentData {
  _id: string;
  doctorpatinetId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  patientAddress: string;
  patientBithofday: Date;
  patientBloodgroup: string;
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
  document: FileUpload[];
  createdAt: Date;
}

interface DoctorDetails {
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

const mockFileUpload: FileUpload = {
  _id: "",
  filename: "",
  originalName: "",
  fileType: "",
  fileSize: 0,
  path: "",
  url: "",
  checksum: "",
  uploadedAt: new Date(),
  doctorName: "",
  category: "",
  userIdWHUP: "",
  appointmentId: "",
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockVitalsign: VitalSign = {
  bloodPressure: " ",
  heartRate: "",
  temperature: "",
  weight: "",
  height: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  bmi: 0,
};

const mockMedication: Medication = {
  id: "1",
  medecineName: "",
  medecineDosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  quantity: "",
  route: [], // Route of administration
  startDate: new Date(),
  endDate: new Date(),
};

const mockPrescription: Prescription = {
  doctorName: "",
  vitalSign: mockVitalsign,
  reasonForVisit: "",
  primaryDiagnosis: "",
  testandReport: "",
  medication: [mockMedication],
  restrictions: "",
  symptoms: "",
  followUpDate: "",
  additionalNote: "",
  prescriptionId: "",
  createdAt: new Date(),
};

const mockAppointmentData: AppointmentData = {
  _id: "",
  doctorName: "",
  doctorSpecialist: "",
  doctorEmail: "",
  patientId: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  patientGender: "",
  patientAddress: "",
  patientBithofday: new Date(),
  patientBloodgroup: "",
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
  prescription: mockPrescription,
  document: mockFileUpload,
  createdAt: new Date(),
};

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

interface FileUpload {
  _id: string;
  filename: string;
  originalName: string;
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

// Mock data for patients

interface ReasonForVisit {
  appointment: AppointmentData;
  reason: string;
  createdAt: Date;
}

interface GroupedPatientData {
  [patientId: string]: {
    id: string;
    patientInfo: {
      patientId: string;
      patientName: string;
      patientEmail: string;
      patientPhone: string;
      patientGender: string;
      patientAddress: string;
      patientBithofday: Date;
      patientAge: number; // Changed from string to number
      patientBloodgroup: string;
      symptoms: string;
      emergencyContact: string;
    };
    appointments: AppointmentData[];
    reasonForVisit: ReasonForVisit[];
    totalAppointments: number;
    latestAppointment: AppointmentData;
    upcomingAppointments: AppointmentData[];
    previousAppointments: AppointmentData[];
  };
}

interface PatientData {
  id: string;
  patientInfo: {
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientGender: string;
    patientAddress: string;
    patientBithofday: Date;
    patientAge: number; // Changed from string to number
    patientBloodgroup: string;
    symptoms: string;
    emergencyContact: string;
  };
  appointments: AppointmentDataPatient[];
  reasonForVisit: ReasonForVisit[];
  totalAppointments: number;
  latestAppointment: AppointmentData;
  upcomingAppointments: AppointmentData[];
  previousAppointments: AppointmentData[];
}

const mockPatientData: PatientData = {
  id: "",
  patientInfo: {
    patientId: "",
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientGender: "",
    patientAddress: "",
    patientBithofday: new Date("08-08-1900"),
    patientAge: 0,
    patientBloodgroup: "",
    symptoms: "",
    emergencyContact: "",
  },
  appointments: [],
  reasonForVisit: [],
  totalAppointments: 0,
  latestAppointment: mockAppointmentData,
  upcomingAppointments: [],
  previousAppointments: [],
};

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
  onNavigate: (page: string) => void;
}

// Add your Bunny CDN configuration
const BUNNY_CDN_PULL_ZONE = "side-effects-pull.b-cdn.net";

//Starting portion of the function
export default function PatientsPage({ onNavigate }: PatientsPageProps) {
  const [selectedPatient, setSelectedPatient] =
    useState<PatientData>(mockPatientData);
  const [showPatientList, setShowPatientList] = useState(true);
  const [activeDocTab, setActiveDocTab] = useState("documents");
  const [edit, setEdit] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionDocument, setPrescriptionDocument] = useState(null);
  const [document, setDocument] = useState<Prescription | null>(null);
  const [patientData, setPatientData] = useState<GroupedPatientData>({});
  const [doctorData, setDoctorData] = useState<DoctorDetails | null>(null);
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  //Helper function to  construct proper bunny cdn url for fetch document
  const getBunnyCDNUrl = (document: FileUpload) => {
    // Remove the storage domain and replace with pull zone
    const path = `${document?.patientId}/${document?.fileType.startsWith("image/") ? "image" : "document"}/${document?.filename}`;

    return `https://${BUNNY_CDN_PULL_ZONE}/${path}`;
  };

  let doctor = useAppSelector((state) => state.auth.user);
  //Group appointment by patientid
  const groupAppointmentsByPatientId = (responseData: DoctorDetails) => {
    if (!responseData.appointments || responseData.appointments.length === 0)
      return;
    const groupedData: GroupedPatientData = {};
    responseData.appointments.forEach((appointment: AppointmentData) => {
      const { patientId } = appointment;

      if (!groupedData[patientId]) {
        // Create new patient entry with first appointment
        groupedData[patientId] = {
          id: patientId,
          patientInfo: {
            patientId: appointment.patientId,
            patientName: appointment.patientName,
            patientEmail: appointment.patientEmail,
            patientPhone: appointment.patientPhone,
            patientGender: appointment.patientGender,
            patientAddress: appointment.patientAddress,
            patientBithofday: appointment.patientBithofday,
            patientBloodgroup: appointment.patientBloodgroup,
            patientAge:
              new Date().getFullYear() -
              new Date(appointment.patientBithofday).getFullYear(),
            symptoms: appointment.symptoms,
            emergencyContact: appointment.emergencyContact,
          },
          reasonForVisit: [
            {
              appointment: appointment,
              reason: appointment.reasonForVisit,
              createdAt: appointment.createdAt,
            },
          ],
          appointments: [appointment],
          totalAppointments: 1,
          latestAppointment: appointment,
          upcomingAppointments: [],
          previousAppointments: [],
        };
      } else {
        // Add appointment to existing patient
        groupedData[patientId].appointments.push(appointment);
        groupedData[patientId].totalAppointments += 1;
        groupedData[patientId].reasonForVisit.push({
          appointment: appointment,
          reason: appointment.reasonForVisit,
          createdAt: appointment.createdAt,
        });

        // Update latest appointment based on createdAt date
        if (
          new Date(appointment.createdAt) >
          new Date(groupedData[patientId].latestAppointment.createdAt)
        ) {
          groupedData[patientId].latestAppointment = appointment;
        }
      }
    });

    Object.keys(groupedData).forEach((patientId) => {
      // Sort appointments by appointment date
      groupedData[patientId].appointments.sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );

      // Filter upcoming appointments
      const today = new Date();
      groupedData[patientId].upcomingAppointments = groupedData[
        patientId
      ].appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= today;
      });

      //Filter previous appointments
      groupedData[patientId].previousAppointments = groupedData[
        patientId
      ].appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        // console.log(
        //   `Appointment: ${appointment.appointmentDate}, Parsed: ${appointmentDate}, Is Previous: ${appointmentDate < today}`
        // );
        return appointmentDate < today;
      });
    });
    // Update the state with grouped data
    setPatientData(groupedData);
  };

  // If prescription is shown, render only the prescription component

  // // Safely extract documents
  // const documents = Array.isArray(appointment.document)
  //   ? appointment.document
  //   : [];

  //Categorized appointments
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

      let responseData = await response.json();
      setDoctorData(responseData?.doctordetails);
      groupAppointmentsByPatientId(responseData.doctordetails);
    };
    fetchData();
  }, [doctor]);

  const futureGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.future);
  }, [categorizedAppointments.future]);

  const todayGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.today);
  }, [categorizedAppointments.today]);

  const pastGrouped = useMemo(() => {
    return groupAppointmentsByDate(categorizedAppointments.past);
  }, [categorizedAppointments.past]);

  //Tunction to cancel appointment
  const handleCancelAppointment = async (appointment: any) => {
    let id = doctor?._id;
    try {
      const response = await fetch("/api/doctor/cancelAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          doctorId: id,
          patientId: appointment.patientId,
        }),
      });

      if (response.ok) {
        //update the selected state
        setSelectedPatient((prev) => ({
          ...prev,
          upcomingAppointments: prev.upcomingAppointments.filter(
            (apt) => apt._id !== appointment._id
          ),
        }));
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getSeverityLevel = (reason: string): string => {
    switch (reason.toLowerCase()) {
      // CRITICAL/HIGH SEVERITY
      case "chest pain evaluation":
      case "heart palpitations":
      case "shortness of breath":
      case "breathing difficulties":
      case "severe abdominal pain":
      case "severe headache/migraine":
      case "severe allergic reactions":
        return "high";

      // MEDIUM-HIGH SEVERITY
      case "high blood pressure management":
      case "asthma management":
      case "diabetes management":
      case "anxiety symptoms":
      case "depression screening":
      case "back pain":
      case "joint pain":
      case "muscle strain":
      case "sports injury":
        return "medium-high";

      // MEDIUM SEVERITY
      case "cough and cold symptoms":
      case "stomach pain/abdominal pain":
      case "nausea and vomiting":
      case "diarrhea":
      case "constipation":
      case "fever":
      case "fatigue/weakness":
      case "skin rash":
      case "headache/migraine":
      case "sinus infection":
      case "allergic reactions":
      case "menstrual irregularities":
        return "medium";

      // LOW-MEDIUM SEVERITY
      case "routine heart checkup":
      case "medication review":
      case "treatment follow-up":
      case "post-surgery follow-up":
      case "lab result discussion":
      case "arthritis management":
      case "acid reflux/heartburn":
      case "weight loss/gain":
      case "stress management":
      case "mental health consultation":
      case "pregnancy consultation":
        return "low-medium";

      // LOW SEVERITY
      case "annual physical examination":
      case "routine checkup":
      case "health screening":
      case "vaccination/immunization":
      case "well-child visit":
      case "sports physical":
      case "annual gynecological exam":
      case "pap smear":
      case "birth control consultation":
        return "low";

      default:
        return "medium";
    }
  };

  const getSeverityColor = (reason: string) => {
    const severity = getSeverityLevel(reason);

    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium-high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low-medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (reason: string) => {
    switch (reason.toLowerCase()) {
      // Preventive Care
      case "annual physical examination":
      case "routine checkup":
      case "health screening":
      case "vaccination/immunization":
      case "well-child visit":
      case "sports physical":
        return <Shield className="h-4 w-4 text-blue-500" />;

      // Cardiovascular
      case "routine heart checkup":
      case "chest pain evaluation":
      case "high blood pressure management":
      case "heart palpitations":
      case "shortness of breath":
        return <Heart className="h-4 w-4 text-red-500" />;

      // Respiratory
      case "cough and cold symptoms":
      case "breathing difficulties":
      case "asthma management":
      case "allergic reactions":
      case "sinus infection":
        return <Airplay className="h-4 w-4 text-cyan-500" />;

      // Digestive
      case "stomach pain/abdominal pain":
      case "nausea and vomiting":
      case "diarrhea":
      case "constipation":
      case "acid reflux/heartburn":
        return <Activity className="h-4 w-4 text-orange-500" />;

      // Musculoskeletal
      case "back pain":
      case "joint pain":
      case "muscle strain":
      case "arthritis management":
      case "sports injury":
        return <Users className="h-4 w-4 text-purple-500" />;

      // Mental Health
      case "anxiety symptoms":
      case "depression screening":
      case "stress management":
      case "mental health consultation":
        return <Brain className="h-4 w-4 text-indigo-500" />;

      // Women's Health
      case "annual gynecological exam":
      case "pap smear":
      case "menstrual irregularities":
      case "pregnancy consultation":
      case "birth control consultation":
        return <User className="h-4 w-4 text-pink-500" />;

      // General Symptoms
      case "headache/migraine":
      case "fever":
      case "fatigue/weakness":
      case "skin rash":
      case "weight loss/gain":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;

      // Follow-up
      case "post-surgery follow-up":
      case "medication review":
      case "lab result discussion":
      case "treatment follow-up":
        return <RefreshCw className="h-4 w-4 text-green-500" />;

      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  //Get function that return name initial of patient
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

  let result = useMemo(() => {
    if (!selectedPatient) {
      return { prescriptions: [], documents: [] };
    }
    console.log("🧞‍♂️  selectedPatient --->", selectedPatient);

    const prescriptions = [];
    const documents = [];

    // Filter appointments where doctorId matches doctor._id
    doctorData?.appointments
      .filter(
        (appointment) =>
          appointment?.patientId === selectedPatient?.patientInfo?.patientId
      )
      .forEach((appointment) => {
        const prescription = appointment.prescription;

        // Only add prescription if it has a prescriptionId
        if (prescription?.prescriptionId) {
          prescriptions.push({
            doctorpatinetId: appointment?.doctorpatinetId,
            prescriptionId: prescription.prescriptionId,
            vitalSign: prescription.vitalSign || {},
            primaryDiagnosis: prescription.primaryDiagnosis || "",
            symptoms: prescription.symptoms || "",
            testandReport: prescription.testandReport || "",
            medication: prescription.medication || [],
            restrictions: prescription.restrictions || "",
            followUpDate: prescription.followUpDate || null,
            additionalNote: prescription.additionalNote || "",
            createdAt: prescription.createdAt || null,
          });
        }

        // Add all documents
        const appointmentDocuments = Array.isArray(appointment.document)
          ? appointment.document
          : [];

        appointmentDocuments.forEach((d) => {
          documents.push({
            documentId: d._id || "",
            filename: d.filename || "",
            patientId: selectedPatient?.patientInfo?.patientId || " ",
            originalName: d.originalName || "",
            fileType: d.fileType || "",
            fileSize: d.fileSize || 0,
            url: d.url || "",
            uploadedAt: d.uploadedAt || null,
            category: d.category || "",
          });
        });
      });

    return { prescriptions, documents };
  }, [selectedPatient, doctor?._id]);

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

  const seePrescription = (document) => {
    console.log("🧞‍♂️  document --->", document);
    setDocument(document);
    setShowPrescription(true);
  };

  const handleClosePrescription = () => {
    setShowPrescription(false);
    setPrescriptionDocument(null);
    setSelectedPatient(mockPatientData);
  };

  if (showPrescription && document) {
    return (
      <PrescriptionShow
        patientData={{
          // Patient info
          patientId: selectedPatient?.patientInfo?.patientId || "",
          patientName: selectedPatient?.patientInfo?.patientName || "",
          patientEmail: selectedPatient?.patientInfo?.patientEmail || "",
          patientPhone: selectedPatient?.patientInfo?.patientPhone || "",
          patientGender: selectedPatient?.patientInfo?.patientGender || "",
          patientAge: selectedPatient?.patientInfo?.patientAge || 0,
          patientBloodgroup:
            selectedPatient?.patientInfo?.patientBloodgroup || "",

          // Visit info
          reasonForVisit: document?.reasonForVisit || "",
          symptoms: document?.symptoms || "",
          // previousVisit: selectedPatient?.patientInfo?.previousVisit,

          // Medical data
          vitalSign: document?.vitalSign || {},
          primaryDiagnosis: document?.primaryDiagnosis || "",
          testandReport: document?.testandReport || "",
          medication: document?.medication || [],
          restrictions: document?.restrictions || "",
          followUpDate: document?.followUpDate || "",
          additionalNote: document?.additionalNote || "",
          date: document?.createdAt,
          prescriptionId: document.prescriptionId,

          // Doctor info
          doctorName: doctorData?.name || "",
          doctorContact: doctorData?.contact || "",
          doctorEmail: doctorData?.email || "",
          doctorGender: doctorData?.gender || "",
          doctorEducation: doctorData?.education || "",
          doctorSpecialist: doctorData?.specialist || "",
          hospital: doctorData?.hospital || "",
          doctorId: doctor?._id || "",
          licenseNumber: doctorData?.registrationNo || "",
        }}
        onClose={handleClosePrescription}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <aside
        className={`bg-white border-b border-gray-200 lg:border-r lg:border-b-0 w-full lg:w-80 lg:max-w-sm shrink-0 custom-scrollbar ${
          showPatientList ? "block" : "hidden lg:block"
        }`}
      >
        {/* Patient List */}
        <div className="p-2 custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-500">
              Patient Lists ({Object.entries(patientData).length})
            </h3>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-[60vh] lg:h-full custom-scrollbar">
            {Object.entries(patientData).map(([id, patient]) => (
              <div
                key={id}
                className={`flex items-center gap-3 px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  selectedPatient?.id === id
                    ? "bg-blue-100 border border-blue-300"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                  <AvatarFallback className="text-xs">
                    {getPatientInitials(patient?.patientInfo?.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {patient?.patientInfo?.patientName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {patient?.patientInfo?.patientAddress}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 pt-3 pl-3 pr-6 pb-3 bg-white">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="w-10 h-10 ring-4 ring-blue-200">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>
                {getPatientInitials(selectedPatient?.patientInfo?.patientName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedPatient?.patientInfo?.patientName}
              </h2>
              <p className="text-sm text-gray-500">
                ID:{" "}
                {selectedPatient.id.slice(
                  selectedPatient.id.length - 10,
                  selectedPatient.id.length
                )}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto border lg:hidden bg-[hsl(201,96%,32%)] text-gray-100 hover:text-black
            hover:border-[hsl(201,96%,32%)]"
            onClick={() => setShowPatientList((prev) => !prev)}
          >
            <Users className="h-4 w-4 mr-2" />
            {showPatientList ? "Hide Patients" : "Show Patients"}
          </Button>
        </header>

        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-10 px-3 sm:px-6 py-1 border-b border-gray-400 bg-white">
          <button
            className={`pb-2 border-b-4 transition-colors font-semibold ${
              activeTab === "overview"
                ? "border-[hsl(201,96%,32%)] text-[hsl(201,96%,32%)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`pb-2 border-b-4 font-semibold transition-colors ${
              activeTab === "history"
                ? "border-[hsl(201,96%,32%)] text-[hsl(201,96%,32%)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Medical History
          </button>
          <button
            className={` border-b-4 font-semibold transition-colors ${
              activeTab === "appointments"
                ? "border-[hsl(201,96%,32%)] text-[hsl(201,96%,32%)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments History
          </button>
          <button
            className={`pb-2 border-b-4 font-semibold transition-colors ${
              activeTab === "documents"
                ? "border-[hsl(201,96%,32%)] text-[hsl(201,96%,32%)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden ">
          <div className="flex h-full">
            {/* Scrollable Content */}
            <main className="flex-1 w-full custom-scrollbar scrollbar-thin scrollbar-thumb-gray-600  hover:scrollbar-thumb-gray-500">
              {activeTab === "overview" && (
                <div className="py-3">
                  {/* Personal Information */}
                  <div className="mb-4 px-1">
                    <Card className="border border-gray-400">
                      <CardHeader className="bg-gradient-to-r py-2 from-blue-100 to-indigo-100 border-b border-gray-200/60">
                        <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <div className="flex flex-row gap-1">
                              <User className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">Full Name</p>
                            </div>

                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientName}
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row gap-1">
                              <BookUser className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">
                                Patient ID
                              </p>
                            </div>
                            <p className="font-medium">
                              {selectedPatient.id.slice(
                                selectedPatient.id.length - 10,
                                selectedPatient.id.length
                              )}
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row gap-1">
                              <Phone className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">
                                Phone Number
                              </p>
                            </div>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientPhone}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <div className="flex flex-row gap-1">
                              <Transgender className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">Gender</p>
                            </div>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientGender}
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row gap-1">
                              <ScanEye className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">Age</p>
                            </div>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientAge} years
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row gap-1">
                              <Mail className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">
                                Email Address
                              </p>
                            </div>
                            <p className="font-medium text-blue-600">
                              {selectedPatient?.patientInfo?.patientEmail}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <div className="flex flex-row gap-1">
                              <Cake className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">
                                Date of Birth
                              </p>
                            </div>
                            <p className="font-medium">
                              {new Date(
                                selectedPatient?.patientInfo?.patientBithofday
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row gap-1">
                              <Droplet className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">
                                Blood Type
                              </p>
                            </div>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientBloodgroup}
                            </p>
                          </div>
                          <div>
                            <div className="flex flex-row gap-1">
                              <MapPinHouse className="h-4 w-4 text-gray-600" />
                              <p className="text-sm text-gray-500">
                                Home Address
                              </p>
                            </div>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientAddress}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Medical Summary and Active Conditions */}
                  <div className="mb-4 px-1">
                    <Card className="border border-gray-400">
                      <CardHeader className="bg-gradient-to-r py-2 from-purple-100 to-pink-100 border-b border-gray-200/60">
                        <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Activity className="h-5 w-5 text-purple-600" />
                          Previous Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPatient?.reasonForVisit.map(
                            (values, index) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-2 lg:p-4 
                                bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-l-4 border-pink-300"
                              >
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(values?.reason)}
                                  <div>
                                    <p className="font-medium">
                                      {values?.reason}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Since:{" "}
                                      {new Date(
                                        values?.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {/* <Badge
                                  className={getSeverityColor(values?.reason)}
                                >
                                  {values?.appointment?.status}
                                </Badge> */}
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Upcoming Appointments */}
                  <Card className="mb-4 mx-1 border-gray-400">
                    <CardHeader className="bg-gradient-to-r py-2 from-yellow-100 to-orange-100 border-b border-gray-200/60">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-yellow-600" />
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {/* Check if patient has upcoming appointments */}
                        {(selectedPatient?.upcomingAppointments).length > 0 ? (
                          selectedPatient?.upcomingAppointments.map(
                            (value, index) => (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-l-4 border-yellow-300">
                                <div className="p-2 bg-yellow-200 rounded-lg">
                                  <Calendar className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                    <h3 className="font-semibold">
                                      {value?.consultedType}
                                    </h3>
                                    <Badge className="bg-yellow-200 text-yellow-800">
                                      Confirmed
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {value?.appointmentDate}{" "}
                                        {value?.appointmentTime}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>{value?.doctorName}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-2">
                                    {value?.reasonForVisit}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs bg-transparent text-red-600 hover:bg-yellow-300 hover:text-red-600"
                                    onClick={() =>
                                      handleCancelAppointment(value)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="text-center  rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 py-2 lg:py-8 text-gray-800">
                            <Calendar className="h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                              No Upcoming Appointments
                            </p>
                            <p className="text-sm">
                              This patient has no scheduled appointments at this
                              time.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="mx-1 border border-gray-400">
                    <CardHeader className="py-2 bg-gradient-to-r  from-green-100 to-emerald-100 border-b border-gray-200/60">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        Last Appointment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <div className="space-y-2 border border-l-4 border-green-500 rounded-lg">
                        {selectedPatient?.latestAppointment ? (
                          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {
                                  selectedPatient?.latestAppointment
                                    ?.consultedType
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                {
                                  selectedPatient?.latestAppointment
                                    ?.reasonForVisit
                                }
                              </p>
                            </div>
                            <Badge className="text-sm text-gray-100 bg-green-600">
                              {new Date(
                                selectedPatient?.latestAppointment?.appointmentDate
                              ).toLocaleDateString()}
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">
                                No appointment available
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-6 my-4 px-1">
                  <Card className="border border-gray-400">
                    <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200/60">
                      <CardTitle className="text-xl py-2 font-bold text-gray-900">
                        Medical History - All Conditions (Severity: High to Low)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient?.reasonForVisit.map(
                          (disease, index) =>
                            disease?.appointment?.prescription?.medication
                              ?.length > 0 && (
                              <div
                                key={index}
                                className="border border-gray-400 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-3">
                                    {getStatusIcon(disease.reason)}
                                    <h3 className="font-semibold text-lg">
                                      {disease.reason}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className={getSeverityColor(
                                        disease.reason
                                      )}
                                    >
                                      {getSeverityLevel(disease.reason)}{" "}
                                      Severity
                                    </Badge>
                                    <Badge
                                      variant={(() => {
                                        let followupdate =
                                          disease?.appointment?.prescription
                                            ?.medication.length > 0
                                            ? disease?.appointment?.prescription
                                                ?.followUpDate
                                            : disease?.appointment
                                                ?.appointmentDate;
                                        const daysDiff = Math.ceil(
                                          (new Date(
                                            followupdate as string
                                          ).getTime() -
                                            new Date().getTime()) /
                                            (24 * 60 * 60 * 1000)
                                        );
                                        return daysDiff >= 0
                                          ? "destructive"
                                          : "default";
                                      })()}
                                    >
                                      {(() => {
                                        let followupdate =
                                          disease?.appointment?.prescription
                                            ?.medication.length > 0
                                            ? disease?.appointment?.prescription
                                                ?.followUpDate
                                            : disease?.appointment
                                                ?.appointmentDate;
                                        const daysDiff = Math.ceil(
                                          (new Date(
                                            followupdate as string
                                          ).getTime() -
                                            new Date().getTime()) /
                                            (24 * 60 * 60 * 1000)
                                        );
                                        return daysDiff >= 0
                                          ? "Active"
                                          : "Completed";
                                      })()}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">
                                      Diagnosed Date
                                    </p>
                                    <p className="font-medium">
                                      {new Date(
                                        disease.appointment.prescription.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="sm:pl-10">
                                    <p className="text-gray-500">
                                      Current Status
                                    </p>
                                    <p className="font-medium text-green-600">
                                      {(() => {
                                        let followupdate =
                                          disease?.appointment?.prescription
                                            ?.medication.length > 0
                                            ? disease?.appointment?.prescription
                                                ?.followUpDate
                                            : disease?.appointment
                                                ?.appointmentDate;
                                        const daysDiff = Math.ceil(
                                          (new Date(
                                            followupdate as string
                                          ).getTime() -
                                            new Date().getTime()) /
                                            (24 * 60 * 60 * 1000)
                                        );
                                        return daysDiff >= 0
                                          ? "Active"
                                          : "Completed";
                                      })()}
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

              {activeTab === "appointments" && (
                <div className="space-y-6 my-2 px-1">
                  <Card className="border border-gray-400">
                    <CardHeader className="bg-gradient-to-r py-2 from-blue-100 to-cyan-100 border-b border-gray-200/60">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Previous Appointments History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(selectedPatient?.previousAppointments).length > 0 ? (
                          selectedPatient?.previousAppointments?.map(
                            (appointment, index) => (
                              <div
                                key={index}
                                className="border border-gray-400 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-cyan-50"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">
                                        {appointment?.consultedType}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        with {appointment?.doctorName}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-200 text-green-800"
                                  >
                                    {appointment?.status &&
                                      (appointment.status.charAt(0) ===
                                      appointment.status.charAt(0).toUpperCase()
                                        ? appointment.status
                                        : appointment.status
                                            .charAt(0)
                                            .toUpperCase() +
                                          appointment.status.slice(1))}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Date</p>
                                    <p className="font-medium">
                                      {appointment?.appointmentDate}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Time</p>
                                    <p className="font-medium">
                                      {appointment?.appointmentTime}
                                    </p>
                                  </div>
                                  <div className="sm:pl-11">
                                    <p className="text-gray-500">Status</p>
                                    <p className="font-medium text-green-600">
                                      {appointment?.status &&
                                        (appointment.status.charAt(0) ===
                                        appointment.status
                                          .charAt(0)
                                          .toUpperCase()
                                          ? appointment.status
                                          : appointment.status
                                              .charAt(0)
                                              .toUpperCase() +
                                            appointment.status.slice(1))}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                              No Previous Appointments
                            </p>
                            <p className="text-sm">
                              This patient has no previous appointments at this
                              time.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-6 my-2 px-1">
                  <div className="border border-gray-400 rounded-lg">
                    {/* Header */}
                    <div className="bg-gradient-to-r py-3 px-6 from-violet-100 to-purple-100 border-b border-gray-200/60 rounded-t-lg">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-violet-600" />
                          Patient Documents & Prescriptions
                        </h2>
                        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md px-4 py-2 rounded-md flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download All
                        </button>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setActiveDocTab("documents")}
                          className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeDocTab === "documents"
                              ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Documents
                            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                              {result?.documents?.length || 0}
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveDocTab("prescriptions")}
                          className={`px-6 py-3 font-medium text-sm transition-all ${
                            activeDocTab === "prescriptions"
                              ? "border-b-2 border-green-600 text-green-600 bg-white"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4" />
                            Prescriptions
                            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                              {result?.prescriptions?.length || 0}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Documents Tab Content */}
                      {activeDocTab === "documents" && (
                        <div className="space-y-4">
                          {result?.documents && result.documents.length > 0 ? (
                            result.documents.map((document, index) => (
                              <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-violet-50 to-purple-50"
                              >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                  <div className="flex items-start gap-4 flex-1">
                                    {/* Document Icon */}
                                    <div className="p-3 rounded-lg bg-blue-100">
                                      {document.category === "Lab Report" && (
                                        <ClipboardList className="h-6 w-6 text-green-600" />
                                      )}
                                      {!document.category && (
                                        <FileText className="h-6 w-6 text-blue-600" />
                                      )}
                                    </div>

                                    {/* Document Details */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg">
                                          {document.filename ||
                                            document.originalName}
                                        </h3>
                                        <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800">
                                          {document.category || "Document"}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                          <FileText className="h-4 w-4" />
                                          <span className="font-semibold">
                                            {document.fileType || "File"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>
                                            {document.uploadedAt
                                              ? new Date(
                                                  document.uploadedAt
                                                ).toLocaleDateString()
                                              : "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          <span>
                                            {document.uploadedAt
                                              ? new Date(
                                                  document.uploadedAt
                                                ).toLocaleTimeString()
                                              : "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        <strong>File Size:</strong>{" "}
                                        {(document.fileSize / 1024).toFixed(2)}{" "}
                                        KB
                                      </p>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-col gap-2 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        window.open(
                                          getBunnyCDNUrl(document),
                                          "_blank"
                                        )
                                      }
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <button
                                      onClick={() => handleDownload(document)}
                                      className="px-3 py-2 text-xs bg-gradient-to-r from-blue-500
                                     to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-md flex items-center gap-1"
                                    >
                                      <Download className="h-3 w-3" />
                                      Download
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                              <p className="text-lg">No documents found</p>
                              <p className="text-sm">
                                Documents will appear here once uploaded
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prescriptions Tab Content */}
                      {activeDocTab === "prescriptions" && (
                        <div className="space-y-4">
                          {result?.prescriptions &&
                          result.prescriptions.length > 0 ? (
                            result.prescriptions.map((prescription, index) => (
                              <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-emerald-50"
                              >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                  <div className="flex items-start gap-4 flex-1">
                                    {/* Prescription Icon */}
                                    <div className="p-3 rounded-lg bg-green-100">
                                      <Pill className="h-6 w-6 text-green-600" />
                                    </div>

                                    {/* Prescription Details */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg">
                                          {prescription.primaryDiagnosis ||
                                            "Prescription"}
                                        </h3>
                                        <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800">
                                          Active
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                          <FileText className="h-4 w-4" />
                                          <span className="font-semibold">
                                            Prescription
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>
                                            {prescription.createdAt
                                              ? new Date(
                                                  prescription.createdAt
                                                ).toLocaleDateString()
                                              : "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          <span>
                                            {prescription.createdAt
                                              ? new Date(
                                                  prescription.createdAt
                                                ).toLocaleTimeString()
                                              : "N/A"}
                                          </span>
                                        </div>
                                        {prescription.followUpDate && (
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                              Follow-up:{" "}
                                              {new Date(
                                                prescription.followUpDate
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {prescription.symptoms && (
                                        <p className="text-sm text-gray-700 mb-2">
                                          <strong>Symptoms:</strong>{" "}
                                          {prescription.symptoms}
                                        </p>
                                      )}
                                      {prescription.medication &&
                                        prescription.medication.length > 0 && (
                                          <p className="text-sm text-gray-700 mb-2">
                                            <strong>Medications:</strong>{" "}
                                            {prescription.medication.length}{" "}
                                            prescribed
                                          </p>
                                        )}
                                      {prescription.additionalNote && (
                                        <p className="text-sm text-gray-700">
                                          <strong>Notes:</strong>{" "}
                                          {prescription.additionalNote}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-col gap-2 ml-4">
                                    <button
                                      onClick={() =>
                                        seePrescription(prescription)
                                      }
                                      className="px-3 py-2 text-xs border border-gray-400 bg-green-100 hover:bg-green-200 rounded-md flex items-center gap-1"
                                    >
                                      <Eye className="h-3 w-3 text-green-600" />
                                      View
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                              <p className="text-lg">No prescriptions found</p>
                              <p className="text-sm">
                                Prescriptions will appear here once created
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
