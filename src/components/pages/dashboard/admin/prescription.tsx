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

import {
  Info,
  Clock,
  Pill,
  FileText,
  Activity,
  AlertCircle,
  Stethoscope,
  Calendar,
  User,
  X,
  User2,
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

interface PrescriptionCardProps {
  prescription: Prescription;
  onInfoClick: (prescription: Prescription) => void;
}
export default function Prescription() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [prescription, setPrescription] = useState<Prescription[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

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

  const handleInfoClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PrescriptionDetailsModal = ({
    prescription,
    onClose,
  }: {
    prescription: Prescription;
    onClose: () => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-2 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Prescription Details</h2>
              <p className="text-blue-100 text-sm mt-1">
                ID: {prescription?.prescriptionId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-full p-2 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* Doctor and Date Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Doctor</span>
                </div>
                <p className="text-lg">{prescription?.doctorName}</p>
              </div>
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Date Issued</span>
                </div>
                <p className="text-lg">{formatDate(prescription?.createdAt)}</p>
              </div>
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <User2 className="h-5 w-5" />
                  <span className="font-semibold">Patient Name</span>
                </div>
                <p className="text-lg">
                  {formatDate(prescription?.patientName)} •{" "}
                  {prescription.patientAge}
                </p>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Stethoscope className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Reason for Visit</h3>
              </div>
              <p className="text-gray-800 bg-gray-100 px-3 py-2  rounded">
                {prescription?.reasonForVisit}
              </p>
            </div>

            {/* Vital Signs */}
            {prescription?.vitalSign &&
              Object.keys(prescription?.vitalSign).length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Activity className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Vital Signs</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {prescription?.vitalSign?.bloodPressure && (
                      <div className="bg-blue-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                        <p className="font-semibold text-blue-900">
                          {prescription?.vitalSign?.bloodPressure}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.heartRate && (
                      <div className="bg-red-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="font-semibold text-red-900">
                          {prescription?.vitalSign?.heartRate}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.temperature && (
                      <div className="bg-orange-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Temperature</p>
                        <p className="font-semibold text-orange-900">
                          {prescription?.vitalSign?.temperature}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.weight && (
                      <div className="bg-green-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Weight</p>
                        <p className="font-semibold text-green-900">
                          {prescription?.vitalSign?.weight}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.height && (
                      <div className="bg-purple-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Height</p>
                        <p className="font-semibold text-purple-900">
                          {prescription.vitalSign.height}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.respiratoryRate && (
                      <div className="bg-cyan-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">
                          Respiratory Rate
                        </p>
                        <p className="font-semibold text-cyan-900">
                          {prescription.vitalSign.respiratoryRate}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.oxygenSaturation && (
                      <div className="bg-indigo-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600"> Saturation</p>
                        <p className="font-semibold text-indigo-900">
                          {prescription.vitalSign.oxygenSaturation}
                        </p>
                      </div>
                    )}
                    {prescription?.vitalSign?.bmi && (
                      <div className="bg-pink-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">BMI</p>
                        <p className="font-semibold text-pink-900">
                          {prescription.vitalSign.bmi}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Diagnosis and Symptoms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Primary Diagnosis
                </h3>
                <p className="text-gray-800 bg-red-50 px-3 py-2 rounded border border-red-200">
                  {prescription?.primaryDiagnosis}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Symptoms</h3>
                <p className="text-gray-800 bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                  {prescription?.symptoms}
                </p>
              </div>
            </div>

            {/* Tests and Reports */}
            {prescription?.testandReport && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Tests & Reports</h3>
                </div>
                <p className="text-gray-800 bg-gray-100 px-3 py-2 rounded">
                  {prescription.testandReport}
                </p>
              </div>
            )}

            {/* Medications */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <Pill className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Medications</h3>
              </div>
              <div className="space-y-2">
                {prescription?.medication?.map((med) => (
                  <div
                    key={med?.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-900 text-lg">
                        {med?.medecineName}
                      </h4>
                      <span className="bg-blue-200 text-blue-900 text-xs px-2 py-1 rounded">
                        {med?.medecineDosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="font-medium text-gray-900">
                          {med?.frequency}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium text-gray-900">
                          {med?.duration}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <p className="font-medium text-gray-900">
                          {med?.quantity}
                        </p>
                      </div>
                      {med?.route && med?.route?.length > 0 && (
                        <div>
                          <span className="text-gray-600">Route:</span>
                          <p className="font-medium text-gray-900">
                            {med?.route.join(", ")}
                          </p>
                        </div>
                      )}
                      {med?.startDate && (
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(med?.startDate)}
                          </p>
                        </div>
                      )}
                      {med?.endDate && (
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(med?.endDate)}
                          </p>
                        </div>
                      )}
                    </div>
                    {med?.instructions && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <span className="text-gray-600 text-sm">
                          Instructions:
                        </span>
                        <p className="text-gray-900 mt-1">
                          {med?.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            {prescription?.restrictions && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg">Restrictions</h3>
                </div>
                <p className="text-gray-800 bg-red-50 px-3 py-2 rounded border border-red-200">
                  {prescription?.restrictions}
                </p>
              </div>
            )}

            {/* Follow-up Date */}
            {prescription?.followUpDate && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Follow-up Date</h3>
                </div>
                <p className="text-lg text-gray-800 bg-green-50 px-3 py-2 rounded border border-green-200">
                  {formatDate(prescription?.followUpDate)}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {prescription?.additionalNote && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Additional Notes</h3>
                </div>
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">
                  {prescription?.additionalNote}
                </p>
              </div>
            )}

            <div className="mb-4 flex flex-row justify-between">
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <h3 className="font-semibold text-lg">Doctor Signature</h3>
                </div>
                <p className="text-blue-600  px-3 py-2rounded">
                  {prescription?.doctorName} •{" "}
                  {prescription?.createdAt.split("T")[0]}
                </p>
              </div>
              <div className="h-20 w-20 pt-4">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  {/* <!-- Outer circle --> */}
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="#1e40af"
                    stroke-width="3"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="#1e40af"
                    stroke-width="1.5"
                  />

                  {/* <!-- Medical caduceus symbol in center --> */}
                  <g transform="translate(100, 100)">
                    {/* <!-- Staff --> */}
                    <rect x="-2" y="-45" width="4" height="70" fill="#1e40af" />

                    {/* <!-- Wings --> */}
                    <path
                      d="M -2,-40 Q -25,-50 -35,-35 Q -30,-25 -2,-35 Z"
                      fill="#1e40af"
                    />
                    <path
                      d="M 2,-40 Q 25,-50 35,-35 Q 30,-25 2,-35 Z"
                      fill="#1e40af"
                    />

                    {/* <!-- Serpents --> */}
                    <path
                      d="M -2,-30 Q -15,-20 -2,-10 Q -15,0 -2,10 Q -10,20 -2,25"
                      fill="none"
                      stroke="#1e40af"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    <path
                      d="M 2,-30 Q 15,-20 2,-10 Q 15,0 2,10 Q 10,20 2,25"
                      fill="none"
                      stroke="#1e40af"
                      stroke-width="3"
                      stroke-linecap="round"
                    />

                    {/* <!-- Serpent heads --> */}
                    <circle cx="-2" cy="-30" r="3" fill="#1e40af" />
                    <circle cx="2" cy="-30" r="3" fill="#1e40af" />
                  </g>

                  {/* <!-- Top text curve --> */}
                  <path
                    id="topCurve"
                    d="M 30,100 A 70,70 0 0,1 170,100"
                    fill="none"
                  />
                  <text
                    font-family="Georgia, serif"
                    font-size="16"
                    font-weight="bold"
                    fill="#1e40af"
                  >
                    <textPath
                      href="#topCurve"
                      startOffset="50%"
                      text-anchor="middle"
                    >
                      MediCare+
                    </textPath>
                  </text>

                  {/* <!-- Bottom text curve --> */}
                  <path
                    id="bottomCurve"
                    d="M 30,100 A 70,70 0 0,0 170,100"
                    fill="none"
                  />
                  <text
                    font-family="Georgia, serif"
                    font-size="14"
                    fill="#1e40af"
                  >
                    <textPath
                      href="#bottomCurve"
                      startOffset="50%"
                      text-anchor="middle"
                    >
                      {prescription?.doctorName}
                    </textPath>
                  </text>

                  {/* <!-- Bottom straight text --> */}
                  <text
                    x="100"
                    y="145"
                    font-family="Georgia, serif"
                    font-size="11"
                    fill="#1e40af"
                    text-anchor="middle"
                  >
                    EST. 2025
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PrescriptionCard = ({
    prescription,
    onInfoClick,
  }: PrescriptionCardProps) => {
    return (
      <Card className="hover:shadow-lg transition-shadow border-gray-700">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex-1">
            <CardTitle className="text-lg">Appointment Id:</CardTitle>
            <CardDescription>{prescription.doctorpatinetId}</CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => onInfoClick(prescription)}
            aria-label="View prescription details"
            className="border"
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
            <Badge variant="outline" className="mt-1 bg-pink-50">
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6 ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className=" text-muted-foreground">
            View and manage medical prescriptions. Click the info icon to see
            details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {prescription.map((prescription) => (
            <PrescriptionCard
              key={prescription.prescriptionId}
              prescription={prescription}
              onInfoClick={handleInfoClick}
            />
          ))}
        </div>
      </div>

      {modalOpen && selectedPrescription && (
        <PrescriptionDetailsModal
          prescription={selectedPrescription}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}
