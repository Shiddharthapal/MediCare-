import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
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
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientAge: number;
  patientName: string;
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

interface DoctorDetails {
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
  status?: string;
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
  weight: number;
  height?: number;
  lastTreatmentDate?: Date;
  status?: string;
  createdAt: Date;
}

interface PrescriptionCardProps {
  prescription: Prescription;
  onInfoClick: (prescription: Prescription) => void;
}
export default function PrescriptionSettings({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [prescription, setPrescription] = useState<Prescription[]>([]);
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [patient, setPatient] = useState<UserDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const admin = useAppSelector((state) => state.auth.user);
  let id = admin?._id;

  if (loading) {
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
    const fetchdata = async () => {
      try {
        setLoading(true);
        let response = await fetch(`./api/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        let result = await response.json();
        setPrescription(result?.adminstore?.prescription);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [admin]);

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        setLoading(true);
        id = selectedPrescription?.patientId;
        let responseOfUser = await fetch(`./api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        id = selectedPrescription?.doctorId;

        let responseOfDoctor = await fetch(`./api/doctor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseOfUser.ok)
          throw new Error("Failed to fetch details of patient");
        if (!responseOfDoctor.ok)
          throw new Error("Failed to fetch details of doctor");
        let resultOfUser = await responseOfUser.json();
        let resultOfDoctor = await responseOfDoctor.json();
        console.log("🧞‍♂️  resultOfDoctor --->", resultOfDoctor);
        setPatient(resultOfUser?.userdetails);
        setDoctor(resultOfDoctor?.doctordetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (selectedPrescription) {
      fetchdetails();
    }
  }, [selectedPrescription]);

  // handler escape button - close the topmost open modal first
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (modalOpen) {
        event.preventDefault();
        setSelectedPrescription(null);
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [modalOpen]);

  //handler function that helps to open prescription
  const handleInfoClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalOpen(true);
  };

  //handler functiont close prescription
  const handleClosePrescriptionCompo = () => {
    setSelectedPrescription(null);
    setModalOpen(false);
  };

  const PrescriptionCard = ({
    prescription,
    onInfoClick,
  }: PrescriptionCardProps) => {
    return (
      <Card className="hover:shadow-lg transition-shadow border-gray-700">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
          <div className="flex-1">
            <CardTitle className="text-lg">Appointment Id:</CardTitle>
            <CardDescription>{prescription.doctorpatinetId}</CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => onInfoClick(prescription)}
            aria-label="View prescription details"
            className="border  bg-[hsl(201,96%,32%)] text-white hover:text-black hover:border-[hsl(201,96%,32%)]"
          >
            <Info className="h-4 w-4" />
            <span>About</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Doctor Name:</p>
            <p className="font-medium">{prescription.doctorName}</p>
          </div>
          <div className="grid grid-cols-2 gap-28">
            <div>
              <p className="text-sm text-muted-foreground">
                {prescription.patientName ? "Patient Name" : "Patient Id"}
              </p>
              <p className="font-medium">
                {prescription.patientName || prescription.patientId}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Follow-up Date</p>
              <p className="text-sm font-medium">
                {new Date(prescription.followUpDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diagnosis</p>
            <Badge variant="outline" className="mt-1 bg-pink-100">
              {prescription.primaryDiagnosis}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-0">
              Reason for Visit
            </p>
            <p className="text-sm text-foreground line-clamp-2">
              {prescription.reasonForVisit}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-background pb-5">
      <div className="mx-auto max-w-6xl px-4 md:px-6 ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className=" text-muted-foreground">
            View and manage medical prescriptions. Click the info icon to see
            details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {prescription?.map((prescription) => (
            <PrescriptionCard
              key={prescription?.prescriptionId}
              prescription={prescription}
              onInfoClick={handleInfoClick}
            />
          ))}
        </div>
      </div>

      {modalOpen && selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-white custom-scrollbar">
          <PrescriptionShow
            patientData={{
              // Patient info
              patientId: patient?.userId || "",
              patientName: patient?.name || "",
              patientEmail: patient?.email || "",
              patientPhone: patient?.contactNumber || "",
              patientGender: patient?.gender || "",
              patientAge: patient?.age || 0,
              patientBloodgroup: patient?.bloodGroup || "",

              // Visit info
              reasonForVisit: selectedPrescription?.reasonForVisit || "",
              symptoms: selectedPrescription?.symptoms || "",
              // previousVisit: selectedPatient?.patientInfo?.previousVisit,

              // Medical data
              vitalSign: selectedPrescription?.vitalSign || {},
              primaryDiagnosis: selectedPrescription?.primaryDiagnosis || "",
              testandReport: selectedPrescription?.testandReport || "",
              medication: selectedPrescription?.medication || [],
              restrictions: selectedPrescription?.restrictions || "",
              followUpDate: selectedPrescription?.followUpDate || "",
              additionalNote: selectedPrescription?.additionalNote || "",
              date: selectedPrescription?.createdAt,
              prescriptionId: selectedPrescription?.prescriptionId || " ",

              // Doctor info
              doctorName: doctor?.name || "",
              doctorContact: doctor?.contact || "",
              doctorEmail: doctor?.email || "",
              doctorGender: doctor?.gender || "",
              doctorEducation: doctor?.education || "",
              doctorSpecialist: doctor?.specialist || "",
              hospital: doctor?.hospital || "",
              doctorId: doctor?.userId || "",
              licenseNumber: doctor?.registrationNo || "",
            }}
            onClose={handleClosePrescriptionCompo}
          />
        </div>
      )}
    </main>
  );
}
