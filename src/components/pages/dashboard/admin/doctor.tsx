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
  AlertCircle,
  History,
  Hospital,
  BadgeDollarSign,
  Video,
  Target,
  BookText,
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

interface DoctorRegister {
  _id: string;
  userId: string;
  email: String;
  registrationNo: Number;
  status: string;
  role: String;
  createdAt: Date;
}

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default function DoctorManagement() {
  const [activeTab, setActiveTab] = useState("details");
  const [registerDoctor, setRegisterDoctor] = useState<DoctorRegister[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetails | null>(
    null
  );
  const [doctorData, setDoctorData] = useState<DoctorDetails[]>([]);
  const [latestDoctorData, setLatestDoctorData] = useState<DoctorDetails[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [changedFields, setChangedFields] = useState({});

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
        const latestDocs: DoctorDetails[] = getLatestDoctorsByUserId(
          result?.adminstore?.doctorDetails
        );
        setLatestDoctorData(latestDocs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDataofAdmin();
  }, [admin]);

  // Function to get latest doctor details grouped by userId
  const getLatestDoctorsByUserId = (doctors: DoctorDetails[]) => {
    const grouped = {};

    doctors.forEach((doctor) => {
      const userId = doctor.userId;

      if (
        !grouped[userId] ||
        new Date(doctor.createdAt) > new Date(grouped[userId].createdAt)
      ) {
        grouped[userId] = doctor;
      }
    });

    return Object.values(grouped);
  };

  // Function to get all versions of a doctor by userId
  const getDoctorVersionsByUserId = (userId: string) => {
    return doctorData
      .filter((doc) => doc.userId === userId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  // Function to detect changed fields between versions
  const detectChangedFields = (currentDoc, previousDoc) => {
    if (!previousDoc) return {};

    const changes = {};
    const fieldsToCompare = [
      "contact",
      "specialist",
      "specializations",
      "hospital",
      "fees",
      "experience",
      "degree",
      "language",
      "about",
      "consultationModes",
    ];

    fieldsToCompare.forEach((field) => {
      const current = currentDoc[field];

      const previous = previousDoc[field];

      // Handle arrays
      if (Array.isArray(current) && Array.isArray(previous)) {
        if (
          JSON.stringify(current.sort()) !== JSON.stringify(previous.sort())
        ) {
          changes[field] = { current, previous };
        }
      }
      // Handle primitives
      else if (current !== previous) {
        changes[field] = { current, previous };
      }
    });

    return changes;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const handleViewDetails = (doctor: DoctorDetails) => {
    const versions = getDoctorVersionsByUserId(doctor.userId);
    const currentVersion = versions[versions.length - 1];
    const previousVersion =
      versions.length > 1 ? versions[versions.length - 2] : null;

    const changes = detectChangedFields(currentVersion, previousVersion);

    setSelectedDoctor(currentVersion);
    setChangedFields(changes);
    setShowDetailsModal(true);
  };

  // Component to render field with change indicator
  interface FieldWithChangeIndicatorProps {
    label: string;
    value: string | number | string[];
    fieldName: string;
    icon?: React.ComponentType<{ className?: string }>;
  }

  const FieldWithChangeIndicator: React.FC<FieldWithChangeIndicatorProps> = ({
    label,
    value,
    fieldName,
    icon: Icon,
  }) => {
    const hasChanged = changedFields[fieldName];

    return (
      <div
        className={`p-2 rounded ${hasChanged ? "bg-yellow-50 border border-yellow-200" : ""}`}
      >
        <div className="flex items-start justify-between">
          <p>
            <strong className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {label}:
            </strong>{" "}
            <span className={hasChanged ? "text-yellow-900 font-medium" : ""}>
              {Array.isArray(value) ? value.join(", ") : value}
            </span>
          </p>
          {hasChanged && (
            <div className="flex items-center gap-1 text-xs text-yellow-700">
              <AlertCircle className="h-3 w-3" />
              <span>Updated</span>
            </div>
          )}
        </div>
        {hasChanged && (
          <p className="text-xs text-gray-500 mt-1">
            Previous:{" "}
            {Array.isArray(hasChanged.previous)
              ? hasChanged.previous.join(", ")
              : hasChanged.previous}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto space-y-6  min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Doctors</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-lg shadow-sm">
        <Button
          variant={activeTab === "register" ? "default" : "ghost"}
          className={`${activeTab === "register" ? "bg-blue-500 text-white shadow-sm" : "border-2 border-gray-300"}`}
          onClick={() => setActiveTab("register")}
        >
          Register Doctor
        </Button>
        <Button
          variant={activeTab === "details" ? "default" : "ghost"}
          className={`${activeTab === "details" ? "bg-blue-500 text-white shadow-sm" : "border-2 border-gray-300"}`}
          onClick={() => setActiveTab("details")}
        >
          Doctor Details
        </Button>
      </div>

      {activeTab === "register" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {registerDoctor.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-purple-50 rounded-lg border  p-6 hover:shadow-md hover:shadow-blue-100 transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {getDoctorInitials(doctor?.email)}
                </div>
                <span
                  className={`inline-flex border border-green-400 items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700`}
                >
                  <span className={`w-2 h-2 rounded-full  bg-green-500`}></span>
                  Active
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
              <div className="flex">
                <button className="flex-1 text-red-600 hover:text-red-700 py-2 border border-red-500 rounded hover:bg-red-50 transition-colors">
                  <Trash2 size={18} className="mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "details" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestDoctorData && latestDoctorData.length > 0 ? (
            latestDoctorData.map((doctor: DoctorDetails) => {
              const versions = getDoctorVersionsByUserId(doctor.userId);
              const hasMultipleVersions = versions.length > 1;

              return (
                <div
                  key={doctor._id}
                  className="bg-purple-50 rounded-lg border border-slate-200 px-6 py-3 hover:shadow-md hover:shadow-blue-100  transition-shadow relative"
                >
                  {hasMultipleVersions && (
                    <div className="absolute top-2  right-2">
                      <span className="inline-flex items-center gap-1 px-2  border border-blue-400 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">
                        <History className="h-3 w-3" />v{versions.length}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {getDoctorInitials(doctor.name)}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-green-400 bg-green-100 text-green-700`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full bg-green-500`}
                      ></span>
                      Active
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-0">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {doctor?.specialist}
                  </p>

                  <div className="space-y-2 mb-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      {doctor.contact}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    Appointments:{" "}
                    <span className="font-semibold text-slate-900">
                      {doctor.appointments?.length || 0}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1  py-0 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 hover:bg-gradient-to-tl text-white transition-colors"
                      variant="destructive"
                      onClick={() => handleViewDetails(doctor)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <button className="flex-1 text-red-600 hover:text-red-700 py-0 border border-red-200  rounded-lg bg-red-200 hover:bg-red-300 transition-colors">
                      <Trash2 size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-gray-500 text-center py-8 bg-white rounded-lg">
              No doctors found
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
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
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {formatDate(selectedDoctor.createdAt)}
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

              {/* Change Indicator */}
              {Object.keys(changedFields).length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">
                      {Object.keys(changedFields).length} field(s) updated from
                      previous version
                    </p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Highlighted fields show recent changes
                  </p>
                </div>
              )}

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
                  {selectedDoctor.appointments.length > 0 ? (
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
                  ) : (
                    <p className="text-sm text-gray-500">
                      No appointments scheduled
                    </p>
                  )}
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
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <p>
                    <strong>Email:</strong> {selectedDoctor.email}
                  </p>
                  <FieldWithChangeIndicator
                    label="Phone"
                    value={selectedDoctor.contact}
                    fieldName="contact"
                    icon={Phone}
                  />
                  <p>
                    <strong>Registration No:</strong>{" "}
                    {selectedDoctor.registrationNo}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedDoctor.gender}
                  </p>
                </div>

                {/* Professional Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Professional Details
                  </h3>
                  <FieldWithChangeIndicator
                    label="Degree"
                    value={selectedDoctor.degree}
                    fieldName="degree"
                    icon={BookText}
                  />
                  <p>
                    <strong>Education:</strong> {selectedDoctor.education}
                  </p>
                  <FieldWithChangeIndicator
                    label="Experience"
                    value={selectedDoctor.experience}
                    fieldName="experience"
                    icon={GraduationCap}
                  />
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs ${selectedDoctor.status === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {selectedDoctor.status}
                    </span>
                  </p>
                </div>

                {/* Hospital & Practice */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Hospital & Practice
                  </h3>
                  <FieldWithChangeIndicator
                    label="Hospital"
                    value={selectedDoctor.hospital}
                    fieldName="hospital"
                    icon={Hospital}
                  />
                  <FieldWithChangeIndicator
                    label="Consultation Fee"
                    value={`$${selectedDoctor.fees}`}
                    fieldName="fees"
                    icon={BadgeDollarSign}
                  />
                  <FieldWithChangeIndicator
                    label="Consultation Modes"
                    value={selectedDoctor.consultationModes}
                    fieldName="consultationModes"
                    icon={Video}
                  />
                </div>

                {/* Languages & Specializations */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Languages & Specializations
                  </h3>
                  <FieldWithChangeIndicator
                    label="Languages"
                    value={selectedDoctor.language}
                    fieldName="language"
                    icon={Languages}
                  />
                  <FieldWithChangeIndicator
                    label="Specializations"
                    value={selectedDoctor.specializations}
                    fieldName="specializations"
                    icon={Target}
                  />
                  <FieldWithChangeIndicator
                    label="Specialist"
                    value={selectedDoctor.specialist}
                    fieldName="specialist"
                    icon={Stethoscope}
                  />
                </div>

                {/* About */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                  <FieldWithChangeIndicator
                    label=""
                    value={selectedDoctor.about}
                    fieldName="about"
                    icon={Info}
                  />
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
