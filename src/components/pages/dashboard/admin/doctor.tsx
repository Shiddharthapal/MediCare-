import { useEffect, useState } from "react";
import {
  Info,
  Edit,
  Trash2,
  Phone,
  Mail,
  X,
  Languages,
  MapPin,
  GraduationCap,
  FileText,
  Calendar,
  Stethoscope,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";

interface DoctorRegister {
  _id: string;
  userId: string;
  email: String;
  registrationNo: Number;
  status: string;
  role: String;
  createdAt: Date;
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

interface AppointmentDataDoctor {
  doctorpatinetId: string;
  doctorName: string;
  doctorUserId: string;
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
  document?: FileUpload[];
  createdAt: Date;
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
  payment?: PaymentMethods;
  availableSlots: Map<string, AppointmentSlot>;
  appointments: AppointmentDataDoctor[];
  practiceSettingData?: PracticeSettingData[];
  consultationModes: string[];
  prescription?: Prescription;
  status?: string;
  createdAt: Date;
}

const doctorsData = [
  {
    id: 1,
    name: "Dr Ruben Bothman",
    specialty: "General Surgery",
    email: "ruben@hospital.com",
    phone: "+1-234-567-8900",
    status: "Available",
    patients: 24,
  },
  {
    id: 2,
    name: "Dr Kierra GA",
    specialty: "Neurology",
    email: "kierra@hospital.com",
    phone: "+1-234-567-8901",
    status: "Absent",
    patients: 18,
  },
  {
    id: 3,
    name: "Dr Anika Septimus",
    specialty: "ENT",
    email: "anika@hospital.com",
    phone: "+1-234-567-8902",
    status: "Available",
    patients: 31,
  },
  {
    id: 4,
    name: "Dr Jakob Passol",
    specialty: "Cardiology",
    email: "jakob@hospital.com",
    phone: "+1-234-567-8903",
    status: "Available",
    patients: 27,
  },
  {
    id: 5,
    name: "Dr Allison Curtis",
    specialty: "Pediatrics",
    email: "allison@hospital.com",
    phone: "+1-234-567-8904",
    status: "Available",
    patients: 35,
  },
];

export default function Doctors({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [doctors, setDoctors] = useState(doctorsData);
  const [activeTab, setActiveTab] = useState("register");
  const [registerDoctor, setRegisterDoctor] = useState<DoctorRegister[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetails | null>(
    null
  );
  const [doctorData, setDoctorData] = useState<DoctorDetails[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);

  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

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

        setRegisterDoctor(result?.adminstore?.doctorRegister);
        setDoctorData(result?.adminstore?.doctorDetails);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDataofAdmin();
  }, [admin]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //Get function that return name initial of patient
  const getPatientInitials = (patientName: String) => {
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

  const handleViewDetails = (appointment: DoctorDetails) => {
    setSelectedDoctor(appointment);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Doctors</h1>
      </div>

      <div className=" grid grid-cols-2 space-x-1 bg-gray-100 p-1 rounded-lg w-full">
        <Button
          variant={activeTab === "register" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "register" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("register")}
        >
          Register Doctor
        </Button>
        <Button
          variant={activeTab === "details" ? "default" : "ghost"}
          className={`px-4 py-2 ${activeTab === "details" ? "bg-blue-500 shadow-sm" : "border-2 border-gray-800"}`}
          onClick={() => setActiveTab("details")}
        >
          Doctor Details
        </Button>
      </div>

      {activeTab === "register" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {registerDoctor.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {getPatientInitials(doctor?.email)}
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${doctor.status === "Available" ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                  {doctor.status}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {doctor.email}
                </div>
              </h3>
              <div className="space-y-2 mb-4 text-sm text-slate-600">
                {doctor?.registrationNo?.toString()}
              </div>
              <div className="flex ">
                <button className="flex-1 text-red-600 hover:text-red-700 py-2 border border-red-200 rounded hover:bg-red-50 transition-colors">
                  <Trash2 size={18} className="mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "details" && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-7">
          {doctorData && doctorData.length > 0 ? (
            doctorData?.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${doctor.status === "Available" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {doctor?.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {doctor?.specialist}
                </p>
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {doctor.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {doctor.contact}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Patients:{" "}
                  <span className="font-semibold text-slate-900">
                    {doctor.patients}
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 text-blue-600 hover:text-blue-700 py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(doctor)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <button className="flex-1 text-red-600 hover:text-red-700 py-2 border border-red-200 rounded hover:bg-red-50 transition-colors">
                    <Trash2 size={18} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              No doctors found
            </div>
          )}
        </div>
      )}

      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedDoctor.name}
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span className="font-medium">
                        {selectedDoctor.specialist}
                      </span>
                      {selectedDoctor.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {selectedDoctor.rating}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAppointments(!showAppointments);
                    setShowPrescriptions(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  View Appointments ({selectedDoctor.appointments?.length || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPrescriptions(!showPrescriptions);
                    setShowAppointments(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Prescriptions
                </Button>
              </div>

              {/* Appointments Section */}
              {showAppointments && selectedDoctor.appointments && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointments
                  </h3>
                  <div className="space-y-2">
                    {selectedDoctor.appointments.map((apt) => (
                      <div
                        key={apt.doctorpatinetId}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-gray-600">
                          {apt.appointmentDate} at {apt.appointmentTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescriptions Section */}
              {showPrescriptions && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Prescriptions
                  </h3>
                  {selectedDoctor.prescription ? (
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-600">
                        Prescription details would appear here
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No prescriptions available
                    </p>
                  )}
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong> {selectedDoctor.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedDoctor.contact}
                    </p>
                    <p>
                      <strong>Registration No:</strong>{" "}
                      {selectedDoctor.registrationNo}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedDoctor.gender}
                    </p>
                  </div>
                </div>

                {/* Professional Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Professional Details
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Degree:</strong> {selectedDoctor.degree}
                    </p>
                    <p>
                      <strong>Education:</strong> {selectedDoctor.education}
                    </p>
                    <p>
                      <strong>Experience:</strong> {selectedDoctor.experience}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs ${selectedDoctor.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {selectedDoctor.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Hospital & Practice */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Hospital & Practice
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Hospital:</strong> {selectedDoctor.hospital}
                    </p>
                    <p>
                      <strong>Consultation Fee:</strong> ${selectedDoctor.fees}
                    </p>
                    <p>
                      <strong>Consultation Modes:</strong>{" "}
                      {selectedDoctor?.consultationModes}
                    </p>
                  </div>
                </div>

                {/* Languages & Specializations */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Languages & Specializations
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Languages:</strong>{" "}
                      {selectedDoctor?.language?.map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </p>
                    <div>
                      <strong>Specializations:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedDoctor?.specializations?.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDoctor.about}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Member Since:</strong>{" "}
                      {formatDate(selectedDoctor.createdAt)}
                    </p>
                    <p>
                      <strong>User ID:</strong> {selectedDoctor.userId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
