"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsCharts } from "./reports-charts";
import { DiagnosisTable } from "./diagnosis-table";
import { PatientAnalytics } from "./patient-analytics";
import { MedicalCharts } from "./medical-charts";
import { FinancialCharts } from "./financial-charts";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

interface PaymentMethods {
  acceptCreditCards: boolean;
  acceptDebitCards: boolean;
  acceptBkash: boolean;
  acceptNagad: boolean;
  acceptRocket: boolean;
  creditCardNumber?: string;
  debitAccountNumber?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
}

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
  doctorId: string;
  doctorName: string;
  patientId: string;
  doctorpatinetId: string;
  reasonForVisit: string;
  vitalSign: VitalSign;
  primaryDiagnosis: string;
  symptoms: string;
  testandReport: string;
  medication: Medication[];
  restrictions: string;
  followUpDate: string;
  additionalNote: string;
  prescriptionId: string;
  createdAt: Date;
}

interface FileUpload {
  _id: string;
  patientId: string;
  doctorId: string;
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

interface PracticeSettingData {
  practiceName: string;
  specialty: string;
  address: string;
  phone: string;
  fax: string;
  appointmentDuration?: string;
  bufferTime?: string;
  allowOnlineBooking?: boolean;
  sendReminders?: boolean;
}

interface AppointmentSlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface AppointmentData {
  doctorpatinetId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorEmail: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  patientAge: number;
  patientAddress: string;
  patientBloodgroup: string;
  patientBithofday: Date;
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
export interface DoctorDetails {
  _id: string;
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
  payment?: PaymentMethods;
  availableSlots: Map<string, AppointmentSlot>;
  appointments: AppointmentData[];
  practiceSettingData?: PracticeSettingData[];
  consultationModes: string[];
  prescription?: Prescription;
  createdAt: Date;
}

interface SettingPageProps {
  onNavigate: (page: string) => void;
}
export default function ReportsPage({ onNavigate }: SettingPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [doctordata, setDoctordata] = useState<DoctorDetails>();
  let doctor = useAppSelector((state) => state.auth.user);
  let id = doctor?._id;

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch(`/api/doctor/${id}`);
      let result = await response.json();
      setDoctordata(result.doctordetails);
    };
    fetchData();
  }, [doctor]);

  return (
    <>
      <div className="">
        {/* Tabs for Different Report Views */}
        <Tabs
          defaultValue="overview"
          className="space-y-4 mx-14 mt-4 width: 100%"
        >
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-0 bg-gray-300">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <ReportsCharts
              appointment={doctordata?.appointments}
              fees={doctordata?.fees}
            />
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <MedicalCharts appointment={doctordata?.appointments} />
          </TabsContent>

          <TabsContent value="diagnoses" className="space-y-4">
            <DiagnosisTable />
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <PatientAnalytics appointment={doctordata?.appointments} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <FinancialCharts
              appointment={doctordata?.appointments}
              fees={doctordata?.fees}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
