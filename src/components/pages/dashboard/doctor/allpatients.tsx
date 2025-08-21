"use client";

import { useEffect, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatInTimeZone } from "date-fns-tz";
import {
  Search,
  Bell,
  Calendar,
  Users,
  UserRoundPlus,
  ChevronRight,
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
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
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

interface AppointmentData {
  _id: string;
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
  vitalSign: mockVitalsign,
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
      patientAge: string;
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
    patientAge: string;
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
    patientAge: "",
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

export default function PatientsPage({ onNavigate }: PatientsPageProps) {
  const [selectedPatient, setSelectedPatient] =
    useState<PatientData>(mockPatientData);
  const [showPatientList, setShowPatientList] = useState(true);
  const [patientData, setPatientData] = useState<GroupedPatientData>({});
  const [appointmentData, setAppointmentData] =
    useState<DoctorDetails>(mockDoctorDetails);
  const [activeTab, setActiveTab] = useState("overview");

  let doctor = useAppSelector((state) => state.auth.user);

  const groupAppointmentsByPatientId = (responseData: DoctorDetails) => {
    console.log("🧞‍♂️  responseData2 --->", responseData);
    if (!responseData.appointments || responseData.appointments.length === 0)
      return;

    const groupedData: GroupedPatientData = {};

    responseData.appointments.forEach((appointment: AppointmentData) => {
      const { patientId } = appointment;
      //console.log("🧞‍♂️  appointment-group  --->", appointment);

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
            patientAge: (
              new Date().getFullYear() -
              new Date(appointment.patientBithofday).getFullYear()
            ).toString(),
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
      console.log("🧞‍♂️  today --->", today);
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

    console.log("=>", groupedData);
    // Update the state with grouped data
    setPatientData(groupedData);
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

      let responseData = await response.json();
      console.log("🧞‍♂️  responseData --->", responseData.doctordetails);
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

  const getPatientInitials = (patientName: string) => {
    console.log("🧞‍♂️  patientName --->", patientName);
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Fixed */}
      <aside className="w-min-44 border-r border-gray-100 bg-white overflow-y-auto">
        {/* Patient List */}
        {showPatientList && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Patient Lists ({Object.entries(patientData).length})
              </h3>
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {Object.entries(patientData).map(([id, patient]) => (
                <div
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
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
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 pl-6 pr-6 pb-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>
                {getPatientInitials(selectedPatient?.patientInfo?.patientName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="grid grid-cols-4 md:gap-10 px-6 py-3 border-b border-gray-100 bg-white">
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Scrollable Content */}
            <main className="flex-1 w-full overflow-y-auto ">
              {activeTab === "overview" && (
                <div className="p-6">
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
                              {selectedPatient?.patientInfo?.patientName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Patient ID</p>
                            <p className="font-medium">
                              {selectedPatient.id.slice(
                                selectedPatient.id.length - 10,
                                selectedPatient.id.length
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientPhone}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientGender}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">
                              {selectedPatient?.patientInfo?.patientAge} years
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="font-medium text-blue-600">
                              {selectedPatient?.patientInfo?.patientEmail}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of Birth
                            </p>
                            <p className="font-medium">
                              {new Date(
                                selectedPatient?.patientInfo?.patientBithofday
                              ).toLocaleDateString()}
                            </p>
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
                              {selectedPatient?.patientInfo?.patientAddress}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Medical Summary and Active Conditions */}
                  <div className="mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Previous Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedPatient?.reasonForVisit.map(
                            (values, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
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
                                <Badge
                                  className={getSeverityColor(values?.reason)}
                                >
                                  {values?.reason}
                                </Badge>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Upcoming Appointments */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Check if patient has upcoming appointments */}
                        {(selectedPatient?.upcomingAppointments).length > 0 ? (
                          selectedPatient?.upcomingAppointments.map(
                            (value, index) => (
                              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-300">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                  <Calendar className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold">
                                      {value?.consultedType}
                                    </h3>
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      Confirmed
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
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
                                    className="text-xs bg-yellow-300 hover:bg-yellow-500"
                                  >
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs bg-transparent text-red-600 hover:text-red-700"
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
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Last Appointment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient?.latestAppointment ? (
                          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {
                                  selectedPatient?.latestAppointment
                                    ?.reasonForVisit
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                Blood work - All values within normal range
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                selectedPatient?.latestAppointment?.appointmentDate
                              ).toLocaleDateString()}
                            </p>
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
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Medical History - All Conditions (Severity: High to Low)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedPatient?.reasonForVisit.map(
                          (disease, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(disease.reason)}
                                  <h3 className="font-semibold text-lg">
                                    {disease.reason}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={getSeverityColor(disease.reason)}
                                  >
                                    {getSeverityLevel(disease.reason)} Severity
                                  </Badge>
                                  <Badge
                                    variant={
                                      new Date(
                                        disease.appointment.prescription.followUpDate
                                      ).toLocaleDateString() >=
                                      new Date().toLocaleDateString()
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {new Date(
                                      disease.appointment.prescription.followUpDate
                                    ).toLocaleDateString() >=
                                    new Date().toLocaleDateString()
                                      ? "Active"
                                      : "Completed"}
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
                                <div className="pl-10">
                                  <p className="text-gray-500">
                                    Current Status
                                  </p>
                                  <p className="font-medium text-green-600">
                                    {Math.ceil(
                                      (new Date(
                                        disease.appointment.prescription.followUpDate
                                      ) -
                                        new Date()) /
                                        (24 * 60 * 60 * 1000)
                                    ) > 0
                                      ? "Active"
                                      : "Completed"}
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
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Previous Appointments History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(selectedPatient?.previousAppointments).length > 0 ? (
                          selectedPatient?.previousAppointments?.map(
                            (appointment, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
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
                                    className="bg-green-100 text-green-800"
                                  >
                                    {appointment?.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
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
                                  <div className="pl-11">
                                    <p className="text-gray-500">Status</p>
                                    <p className="font-medium text-green-600">
                                      {appointment.status}
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
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Patient Documents
                        </CardTitle>
                        <div className="">
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
                        {selectedPatient?.previousAppointments.map(
                          (document, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  {/* Document Icon */}
                                  <div className="p-3 rounded-lg bg-blue-50">
                                    {document.prescription && (
                                      <Pill className="h-6 w-6 text-blue-600" />
                                    )}
                                    {/* {document.type === "Lab Report" && (
                                      <ClipboardList className="h-6 w-6 text-green-600" />
                                    )}
                                    {document.type === "Imaging Report" && (
                                      <ImageIcon className="h-6 w-6 text-purple-600" />
                                    )}
                                    {document.type ===
                                      "Consultation Report" && (
                                      <FileText className="h-6 w-6 text-orange-600" />
                                    )}
                                    {document.type === "Study Report" && (
                                      <ClipboardList className="h-6 w-6 text-indigo-600" />
                                    )}
                                    {document.type === "Treatment Plan" && (
                                      <FileText className="h-6 w-6 text-teal-600" />
                                    )} */}
                                    {/* {![
                                      "Prescription",
                                      "Lab Report",
                                      "Imaging Report",
                                      "Consultation Report",
                                      "Study Report",
                                      "Treatment Plan",
                                    ].includes(document.type) && (
                                      <FileText className="h-6 w-6 text-gray-600" />
                                    )} */}
                                  </div>

                                  {/* Document Details */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-lg">
                                        {document.reasonForVisit}
                                      </h3>
                                      <Badge
                                        variant={
                                          document?.prescription
                                            ? "default"
                                            : "secondary"
                                        }
                                        className={
                                          document?.prescription
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {document?.prescription
                                          ? "Active"
                                          : "Reviewed"}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                      <div className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span>{document.type}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                          {new Date(
                                            document.prescription.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {formatInTimeZone(
                                            document?.prescription?.createdAt,
                                            "Etc/UTC",
                                            "hh:mm a"
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <UserRoundPlus className="h-5 w-5" />
                                        <span>{document?.doctorName}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                      <strong>Description:</strong>{" "}
                                      {document?.prescription?.primaryDiagnosis}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>Size: {document.size}</span>
                                      <span>Format: {document.format}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col  gap-2 ml-4 mt-6">
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
                          )
                        )}
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
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
