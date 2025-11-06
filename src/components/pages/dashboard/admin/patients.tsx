import { useEffect, useState } from "react";
import {
  Info,
  Pill,
  Trash2,
  Phone,
  User2,
  Mail,
  X,
  File,
  FileText,
  Calendar,
  Stethoscope,
  AlertCircle,
  History,
  Activity,
  User,
  Mars,
  MapPinHouse,
  Droplet,
  Venus,
  Anvil,
  PersonStanding,
  Clock,
  FileIcon,
  Download,
  ExternalLink,
  Copy,
  Check,
  InfoIcon,
  CalendarIcon,
  UserIcon,
  HardDriveIcon,
  Image as ImageIcon,
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
  patientName: string;
  documentName: string;
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

interface HealthRecord {
  _id: string;
  weight: string;
  bloodPressure: string;
  heartRate: string;
  date: string;
  temperature: string;
  notes: string;
  createdAt: Date;
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

interface AppointmentData {
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
  appointments: AppointmentData[];
  payment: PaymentMethods;
  upload: FileUpload[];
  healthRecord: HealthRecord[];
  lastTreatmentDate?: Date;
  status?: string;
  createdAt: Date;
}

interface UserRegister {
  _id: string;
  userId: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

interface DetailItemProps {
  label: string;
  value: string;
  isMonospace?: boolean;
}

interface DocumentModalProps {
  document: FileUpload;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentCardProps {
  document: FileUpload;
  onInfo: () => void;
}

// Add your Bunny CDN configuration
const BUNNY_CDN_PULL_ZONE = "mypull-29.b-cdn.net";

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

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function DoctorManagement() {
  const [activeTab, setActiveTab] = useState("details");
  const [registerPatient, setRegisterPatient] = useState<UserRegister[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserDetails | null>(
    null
  );
  const [patientData, setPatientData] = useState<UserDetails[]>([]);
  const [latestPatientData, setLatestPatientData] = useState<UserDetails[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [changedFields, setChangedFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<FileUpload | null>(
    null
  );

  const admin = useAppSelector((state) => state.auth.user);
  const id = admin?._id;

  const getBunnyCDNUrl = (document: FileUpload) => {
    // Remove the storage domain and replace with pull zone
    const path = `${document?.patientId}/${document?.fileType.startsWith("image/") ? "image" : "document"}/${document?.filename}`;

    return `https://${BUNNY_CDN_PULL_ZONE}/${path}`;
  };

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

        // Shuffle register doctors
        const shuffledRegisterpatients = shuffleArray(
          result?.adminstore?.patientRegister || []
        );
        setRegisterPatient(shuffledRegisterpatients);

        setPatientData(result?.adminstore?.patientDetails);
        const latestPats: UserDetails[] = getLatestDoctorsByUserId(
          result?.adminstore?.patientDetails
        );

        // Shuffle latest doctor data
        const shuffledLatestPats = shuffleArray(latestPats);
        setLatestPatientData(shuffledLatestPats);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDataofAdmin();
  }, [admin]);

  //show the details of document
  function DetailItem({ label, value, isMonospace = false }: DetailItemProps) {
    return (
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p
          className={`text-sm text-foreground mt-1 break-words ${isMonospace ? "font-mono text-xs" : ""}`}
        >
          {value}
        </p>
      </div>
    );
  }

  //show the details of document in line
  function DetailItemForFile({
    label,
    value,
    isMonospace = false,
  }: DetailItemProps) {
    return (
      <div className="flex flex-row items-start gap-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide whitespace-nowrap">
          {label}
          {":"}
        </p>
        <p
          className={`text-xs text-foreground font-semibold break-words ${isMonospace ? "font-mono text-xs" : ""}`}
        >
          {value}
        </p>
      </div>
    );
  }

  // Function to get latest doctor details grouped by userId
  const getLatestDoctorsByUserId = (patients: UserDetails[]) => {
    const grouped = {};

    patients.forEach((patient) => {
      const userId = patient.userId;

      if (
        !grouped[userId] ||
        new Date(patient.createdAt) > new Date(grouped[userId].createdAt)
      ) {
        grouped[userId] = patient;
      }
    });

    return Object.values(grouped);
  };

  // Function to get all versions of a doctor by userId
  const getPatientVersionsByUserId = (userId: string) => {
    return patientData
      .filter((doc) => doc.userId === userId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  // Function to detect changed fields between versions
  const detectChangedFields = (currentPat, previousPat) => {
    if (!previousPat) return {};

    const changes = {};
    const fieldsToCompare = [
      "address",
      "contactNumber",
      "gender",
      "bloodGroup",
      "weight",
      "height",
      "payment",
      "fatherName",
      "name",
      "dateOfBirth",
    ];

    fieldsToCompare.forEach((field) => {
      const current = currentPat[field];

      const previous = previousPat[field];

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

  const DocumentCard = ({ document, onInfo }: DocumentCardProps) => {
    const [imageError, setImageError] = useState(false);
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getFileIcon = (fileType: string) => {
      if (fileType.startsWith("image/")) {
        return <ImageIcon className="w-12 h-12 text-primary" />;
      } else if (fileType === "application/pdf") {
        return <FileText className="w-12 h-12 text-primary" />;
      } else {
        return <File className="w-12 h-12 text-primary" />;
      }
    };

    const isImage = document.fileType.startsWith("image/");
    const documentUrl = getBunnyCDNUrl(document);

    return (
      <div className="bg-card border border-primary/80 rounded-lg overflow-hidden hover:shadow-md hover:shadow-primary/20 transition-shadow duration-300">
        {/* Card Header with Icon or Image Preview */}
        <div className="bg-primary/70 px-6 py-5 flex items-start justify-between">
          <div className="flex-1">
            {isImage ? (
              <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={documentUrl}
                    alt={document.originalName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  getFileIcon(document.fileType)
                )}
              </div>
            ) : (
              getFileIcon(document.fileType)
            )}
          </div>
          <button
            onClick={onInfo}
            className="ml-4 p-2 hover:bg-primary/80 rounded-full transition-colors"
            aria-label="View document details"
          >
            <InfoIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground truncate mb-1">
            {document.documentName || document.originalName}
          </h3>
          <p className=" flex flex-row items-center justify-start gap-1 text-sm text-muted-foreground mb-1 line-clamp-2">
            <User className="h-4 w-4 text-gray-700" />
            {document.patientName || document.patientId}
          </p>

          {/* Meta Information */}
          <div className="space-y-1">
            <div className="flex flex-row justify-between ">
              <div className="flex  items-center gap-2 text-sm text-muted-foreground">
                <HardDriveIcon className="w-4 h-4 text-gray-700" />
                <span>{formatFileSize(document.fileSize)}</span>
              </div>
              {/* Category Badge */}
              {document.category && (
                <div className="mt-1 inline-block px-3 py-1 bg-primary/90 text-white text-xs rounded-full">
                  {document.category}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4 text-gray-700" />
              <span>{formatDate(document.uploadedAt)}</span>
            </div>

            {document.doctorName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4 text-gray-700" />
                <span>{document.doctorName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DocumentModal = ({ document, isOpen, onClose }: DocumentModalProps) => {
    const [copied, setCopied] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    if (!isOpen) return null;

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handleCopyChecksum = () => {
      navigator.clipboard.writeText(document.checksum);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const documentUrl = getBunnyCDNUrl(document);
    const extension = document?.fileType.split("/")[1] || "bin";

    // Common image extensions
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "ico",
    ];
    const isImage = imageExtensions.includes(extension);
    const isPDF = document.fileType === "application/pdf";

    const handleDownload = async () => {
      try {
        const response = await fetch(documentUrl);
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

    const handleView = () => {
      window.open(documentUrl, "_blank");
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-2 flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-foreground truncate">
                    {document.originalName}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {document.filename}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors ml-4 flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 pt-3 pb-6 space-y-6">
              {/* File Preview Section */}
              {(isImage || isPDF) && !previewError && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Preview
                    </h3>
                  </div>
                  <div className="p-4 bg-background">
                    {isImage ? (
                      <img
                        src={documentUrl}
                        alt={document.originalName}
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg"
                        onError={() => setPreviewError(true)}
                      />
                    ) : isPDF ? (
                      <iframe
                        src={documentUrl}
                        className="w-full h-96 rounded-lg"
                        title={document.originalName}
                        onError={() => setPreviewError(true)}
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* File Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  File Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItemForFile
                    label="File Type"
                    value={document.fileType || "Unknown"}
                  />
                  <DetailItemForFile
                    label="File Size"
                    value={formatFileSize(document.fileSize)}
                  />
                  <DetailItemForFile
                    label="Upload Date"
                    value={formatDate(document.uploadedAt)}
                  />
                  <DetailItemForFile
                    label="Created"
                    value={formatDate(document.createdAt)}
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="border-t border-border pt-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItemForFile
                    label="Patient ID"
                    value={document.patientId}
                  />
                  <DetailItemForFile
                    label="Doctor Name"
                    value={document.doctorName || "Not specified"}
                  />
                  <DetailItemForFile
                    label="Category"
                    value={document.category || "General"}
                  />
                  {document.appointmentId && (
                    <DetailItemForFile
                      label="Appointment ID"
                      value={document.appointmentId}
                    />
                  )}
                  {document.userIdWHUP && (
                    <DetailItemForFile
                      label="User ID (WHUP)"
                      value={document.userIdWHUP}
                    />
                  )}
                </div>
              </div>

              {/* Security Information Section */}
              <div className="border-t border-border pt-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Security & Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Checksum (SHA-256)
                        {/* checksum is a unique fingerprint and hash*/}
                      </p>
                      <p className="text-sm font-mono text-foreground mt-1 break-all">
                        {document.checksum}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyChecksum}
                      className="mt-1 p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                      title="Copy checksum"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {/* Monospace aslo called fixed width. It is a font here every character
                  take same space horizontally */}
                  <DetailItem label="CDN URL" value={documentUrl} isMonospace />
                </div>
              </div>

              {/* Additional Metadata */}
              <div className="border-t border-border pt-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItemForFile
                    label="Document ID"
                    value={document._id}
                    isMonospace
                  />
                  <DetailItem label="Path" value={document.path} isMonospace />
                  <DetailItemForFile
                    label="Updated"
                    value={formatDate(document.updatedAt)}
                  />
                  <DetailItemForFile
                    label="Status"
                    value={document.deletedAt ? "Deleted" : "Active"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-3 flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary
                   text-primary-foreground hover:text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleView}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border
                   text-foreground rounded-lg hover:text-primary hover:bg-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleViewDetails = (patient: UserDetails) => {
    const versions = getPatientVersionsByUserId(patient.userId);
    const currentVersion = versions[versions.length - 1];
    const previousVersion =
      versions.length > 1 ? versions[versions.length - 2] : null;

    const changes = detectChangedFields(currentVersion, previousVersion);

    setSelectedPatient(currentVersion);
    setChangedFields(changes);
    setShowDetailsModal(true);
  };

  const AppointmentDetailsModal = ({
    appointment,
    onClose,
  }: {
    appointment: AppointmentData;
    onClose: () => void;
  }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "confirmed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        case "completed":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}
              >
                {appointment.status}
              </span>
              <span className="text-gray-500 text-sm">
                Created on {formatDate(appointment.createdAt)}
              </span>
            </div>

            {/* Appointment Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Appointment Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {formatDate(appointment.appointmentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{appointment.appointmentTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultation Type</p>
                  <p className="font-medium">{appointment.consultationType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consulted Type</p>
                  <p className="font-medium">{appointment.consultedType}</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Doctor Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{appointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialist</p>
                  <p className="font-medium">{appointment.doctorSpecialist}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{appointment.doctorEmail}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-medium">{appointment.hospital}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium">{appointment.doctorGender}</p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Patient Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{appointment.patientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{appointment.patientPhone}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Medical Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Reason for Visit</p>
                  <p className="font-medium">{appointment.reasonForVisit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Symptoms</p>
                  <p className="font-medium">{appointment.symptoms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Previous Visit</p>
                  <p className="font-medium">
                    {appointment.previousVisit || "None"}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Emergency Contact
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Contact Name</p>
                  <p className="font-medium">{appointment.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{appointment.emergencyPhone}</p>
                </div>
              </div>
            </div>

            {/* Prescription */}
            {appointment?.prescription && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-600" />
                  Prescription
                </h3>
                <div className="space-y-3">
                  {appointment?.prescription?.medication && (
                    <div>
                      <p className="text-sm text-gray-600">Medications</p>
                      <div className="space-y-3">
                        {appointment.prescription.medication.map((med) => (
                          <div key={med.id} className="font-medium">
                            <p className="font-semibold">{med.medecineName}</p>
                            <div className="text-sm text-gray-700 space-y-1">
                              <p>Dosage: {med.medecineDosage}</p>
                              <p>Frequency: {med.frequency}</p>
                              <p>Duration: {med.duration}</p>
                              <p>Quantity: {med.quantity}</p>
                              {med.route && med.route.length > 0 && (
                                <p>Route: {med.route.join(", ")}</p>
                              )}
                              {med.instructions && (
                                <p>Instructions: {med.instructions}</p>
                              )}
                              {med.startDate && (
                                <p>
                                  Start Date:{" "}
                                  {new Date(med.startDate).toLocaleDateString()}
                                </p>
                              )}
                              {med.endDate && (
                                <p>
                                  End Date:{" "}
                                  {new Date(med.endDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {appointment?.prescription?.primaryDiagnosis && (
                    <div>
                      <p className="text-sm text-gray-600">Primary Diagnosis</p>
                      <p className="font-medium">
                        {appointment?.prescription?.primaryDiagnosis}
                      </p>
                    </div>
                  )}
                  {appointment?.prescription?.symptoms && (
                    <div>
                      <p className="text-sm text-gray-600">Symptoms</p>
                      <p className="font-medium">
                        {appointment?.prescription?.symptoms}
                      </p>
                    </div>
                  )}
                  {appointment?.prescription?.testandReport && (
                    <div>
                      <p className="text-sm text-gray-600">Test & Report</p>
                      <p className="font-medium">
                        {appointment?.prescription?.testandReport}
                      </p>
                    </div>
                  )}
                  {appointment?.prescription?.restrictions && (
                    <div>
                      <p className="text-sm text-gray-600">Restrictions</p>
                      <p className="font-medium">
                        {appointment?.prescription?.restrictions}
                      </p>
                    </div>
                  )}
                  {appointment?.prescription?.additionalNote && (
                    <div>
                      <p className="text-sm text-gray-600">Additional Note</p>
                      <p className="font-medium">
                        {appointment?.prescription?.additionalNote}
                      </p>
                    </div>
                  )}
                  {appointment?.prescription?.followUpDate && (
                    <div>
                      <p className="text-sm text-gray-600">FollowUp Date</p>
                      <p className="font-medium">
                        {appointment?.prescription?.followUpDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents */}
            {appointment.document && appointment.document.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Attached Documents
                </h3>
                <div className="space-y-2">
                  {appointment.document.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      {doc.filename || doc.originalName}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Additional Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{appointment.paymentMethod}</p>
                </div>
                {appointment.specialRequests && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Special Requests</p>
                    <p className="font-medium">{appointment.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
                ID: {prescription.prescriptionId}
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
                <p className="text-lg">{prescription.doctorName}</p>
              </div>
              <div className="bg-gray-100 px-4 py-1 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Date Issued</span>
                </div>
                <p className="text-lg">{formatDate(prescription.createdAt)}</p>
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
                {prescription.reasonForVisit}
              </p>
            </div>

            {/* Vital Signs */}
            {prescription.vitalSign &&
              Object.keys(prescription.vitalSign).length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Activity className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Vital Signs</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {prescription.vitalSign.bloodPressure && (
                      <div className="bg-blue-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                        <p className="font-semibold text-blue-900">
                          {prescription.vitalSign.bloodPressure}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.heartRate && (
                      <div className="bg-red-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="font-semibold text-red-900">
                          {prescription.vitalSign.heartRate}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.temperature && (
                      <div className="bg-orange-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Temperature</p>
                        <p className="font-semibold text-orange-900">
                          {prescription.vitalSign.temperature}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.weight && (
                      <div className="bg-green-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600">Weight</p>
                        <p className="font-semibold text-green-900">
                          {prescription.vitalSign.weight}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.height && (
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
                    {prescription.vitalSign.oxygenSaturation && (
                      <div className="bg-indigo-50 px-3 py-2 rounded">
                        <p className="text-xs text-gray-600"> Saturation</p>
                        <p className="font-semibold text-indigo-900">
                          {prescription.vitalSign.oxygenSaturation}
                        </p>
                      </div>
                    )}
                    {prescription.vitalSign.bmi && (
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
                  {prescription.primaryDiagnosis}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Symptoms</h3>
                <p className="text-gray-800 bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                  {prescription.symptoms}
                </p>
              </div>
            </div>

            {/* Tests and Reports */}
            {prescription.testandReport && (
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
                {prescription.medication.map((med) => (
                  <div
                    key={med.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-900 text-lg">
                        {med.medecineName}
                      </h4>
                      <span className="bg-blue-200 text-blue-900 text-xs px-2 py-1 rounded">
                        {med.medecineDosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="font-medium text-gray-900">
                          {med.frequency}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium text-gray-900">
                          {med.duration}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <p className="font-medium text-gray-900">
                          {med.quantity}
                        </p>
                      </div>
                      {med.route && med.route.length > 0 && (
                        <div>
                          <span className="text-gray-600">Route:</span>
                          <p className="font-medium text-gray-900">
                            {med.route.join(", ")}
                          </p>
                        </div>
                      )}
                      {med.startDate && (
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(med.startDate)}
                          </p>
                        </div>
                      )}
                      {med.endDate && (
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(med.endDate)}
                          </p>
                        </div>
                      )}
                    </div>
                    {med.instructions && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <span className="text-gray-600 text-sm">
                          Instructions:
                        </span>
                        <p className="text-gray-900 mt-1">{med.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            {prescription.restrictions && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg">Restrictions</h3>
                </div>
                <p className="text-gray-800 bg-red-50 px-3 py-2 rounded border border-red-200">
                  {prescription.restrictions}
                </p>
              </div>
            )}

            {/* Follow-up Date */}
            {prescription.followUpDate && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Follow-up Date</h3>
                </div>
                <p className="text-lg text-gray-800 bg-green-50 px-3 py-2rounded border border-green-200">
                  {formatDate(prescription.followUpDate)}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {prescription.additionalNote && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Additional Notes</h3>
                </div>
                <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded">
                  {prescription.additionalNote}
                </p>
              </div>
            )}

            <div className="mb-4 flex flex-row justify-between">
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <h3 className="font-semibold text-lg">Doctor Signature</h3>
                </div>
                <p className="text-blue-600  px-3 py-2rounded">
                  {prescription.doctorName} •{" "}
                  {prescription.createdAt.split("T")[0]}
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
                      {prescription.doctorName}
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
        className={` rounded ${hasChanged ? "bg-yellow-50 border border-yellow-200" : ""}`}
      >
        <div className="flex  items-center justify-between">
          <p className="flex items-center gap-2 flex-wrap">
            <strong className="flex  items-center gap-2">
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
          <p className="text-xs text-yellow-700 mt-1">
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
        <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-lg shadow-sm">
        <Button
          variant={activeTab === "register" ? "default" : "ghost"}
          className={`${activeTab === "register" ? "bg-blue-500 text-white shadow-sm" : "border-2 border-gray-300"}`}
          onClick={() => setActiveTab("register")}
        >
          Register Patient
        </Button>
        <Button
          variant={activeTab === "details" ? "default" : "ghost"}
          className={`${activeTab === "details" ? "bg-blue-500 text-white shadow-sm" : "border-2 border-gray-300"}`}
          onClick={() => setActiveTab("details")}
        >
          Patient Details
        </Button>
      </div>

      {activeTab === "register" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {registerPatient.map((patient) => (
            <div
              key={patient._id}
              className="bg-purple-50 rounded-lg border  p-6 hover:shadow-md hover:shadow-blue-100 transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {getPatientInitials(patient?.email)}
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
                  {patient.email}
                </div>
              </h3>
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
          {latestPatientData && latestPatientData.length > 0 ? (
            latestPatientData.map((patient: UserDetails) => {
              const versions = getPatientVersionsByUserId(patient.userId);
              const hasMultipleVersions = versions.length > 1;

              return (
                <div
                  key={patient._id}
                  className="bg-purple-50 rounded-lg border border-slate-200 px-6 py-3 hover:shadow-md hover:shadow-blue-100  transition-shadow relative"
                >
                  {hasMultipleVersions && (
                    <div className="absolute top-2  right-2">
                      <span className="inline-flex items-center gap-1 px-2  border border-blue-400 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">
                        <History className="h-3 w-3" />
                        {versions.length}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {getPatientInitials(patient.name)}
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

                  <div className="flex flex-row gap-0">
                    <h3 className="font-semibold text-slate-900 mb-0">
                      {patient.name} •
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {" "}
                      {patient?.age} years
                    </p>
                  </div>
                  <div className="space-y-1 mb-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    Appointments:{" "}
                    <span className="font-semibold text-slate-900">
                      {patient.appointments?.length || 0}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1  py-0 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 hover:bg-gradient-to-tl text-white transition-colors"
                      variant="destructive"
                      onClick={() => handleViewDetails(patient)}
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
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {formatDate(selectedPatient.createdAt)}
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
                    setShowDocument(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  View Appointments ({selectedPatient.appointments?.length || 0}
                  )
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPrescriptions(!showPrescriptions);
                    setShowAppointments(false);
                    setShowDocument(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Prescriptions (
                  {selectedPatient.appointments.filter(
                    (appointment) => appointment?.prescription?.reasonForVisit
                  ).length || 0}
                  )
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDocument(!showDocument);
                    setShowAppointments(false);
                    setShowPrescriptions(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <File className="h-4 w-4" />
                  View Document
                </Button>
              </div>

              {/* Appointments Section */}
              {showAppointments && selectedPatient.appointments && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointments
                  </h3>
                  {selectedPatient.appointments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.appointments.map((apt) => (
                        <div
                          key={apt.doctorpatinetId}
                          className="bg-white p-3 rounded border border-gray-200"
                        >
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-1  text-black rounded-lg hover:bg-gray-200 transition font-semibold"
                          >
                            <p className="font-medium">{apt.patientName}</p>
                            <p className="text-sm text-gray-600">
                              {apt.appointmentDate} at {apt.appointmentTime}
                            </p>
                          </button>
                          {isModalOpen && (
                            <AppointmentDetailsModal
                              appointment={apt}
                              onClose={() => setIsModalOpen(false)}
                            />
                          )}
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

              {showPrescriptions && selectedPatient.appointments.length > 0 && (
                <div className="space-y-2 mb-6 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <File className="h-5 w-5" />
                    Prescription
                  </h3>
                  {selectedPatient.appointments.map((apt) =>
                    apt.prescription?.reasonForVisit ? (
                      <div
                        key={apt.prescription.prescriptionId}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-6 py-1 text-black rounded-lg hover:bg-gray-200 transition font-semibold"
                        >
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {apt.prescription.reasonForVisit} at{" "}
                            {apt.prescription.createdAt?.split("T")[0]}
                          </p>
                        </button>
                        {isModalOpen && (
                          <PrescriptionDetailsModal
                            prescription={apt.prescription}
                            onClose={() => setIsModalOpen(false)}
                          />
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {showDocument && selectedPatient?.upload?.length > 0 && (
                <div className="space-y-2 mb-6 px-4 ">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <File className="h-5 w-5" />
                    Document
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedPatient.upload.map((apt) => (
                      <DocumentCard
                        key={apt._id}
                        document={apt}
                        onInfo={() => setSelectedDocument(apt)}
                      />
                    ))}
                  </div>
                  {selectedDocument && (
                    <DocumentModal
                      document={selectedDocument}
                      isOpen={!!selectedDocument}
                      onClose={() => setSelectedDocument(null)}
                    />
                  )}
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Information
                  </h3>
                  <p>
                    <strong>Email:</strong> {selectedPatient.email}
                  </p>
                  <p>
                    <strong>Name:</strong> {selectedPatient.name}
                  </p>

                  <FieldWithChangeIndicator
                    label="Father Name"
                    value={selectedPatient.address}
                    fieldName="fatherName"
                  />
                  <FieldWithChangeIndicator
                    label="Address"
                    value={selectedPatient.address}
                    fieldName="address"
                    icon={MapPinHouse}
                  />
                  <FieldWithChangeIndicator
                    label="Phone"
                    value={selectedPatient.contactNumber}
                    fieldName="contactNumber"
                    icon={Phone}
                  />

                  <FieldWithChangeIndicator
                    label="Date of Birth"
                    value={selectedPatient?.dateOfBirth?.split("T")[0] || "N/A"}
                    fieldName="dateOfBirth"
                    icon={Calendar}
                  />

                  <FieldWithChangeIndicator
                    label="Age"
                    value={selectedPatient.age || "N/A"}
                    fieldName="age"
                    icon={Clock}
                  />

                  <p className="flex items-center gap-2">
                    <strong className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      lastTreatmentDate:
                    </strong>
                    <span>
                      {selectedPatient?.lastTreatmentDate?.split("T")[0] ||
                        "N/A"}
                    </span>
                  </p>
                </div>

                {/* Professional Details */}
                <div className="space-y-3">
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs ${selectedPatient.status === "Active||active" ? "bg-green-100 text-green-800" : "bg-green-100 text-green-800"}`}
                    >
                      {selectedPatient?.status || "Active"}
                    </span>
                  </p>

                  <FieldWithChangeIndicator
                    label="Gender"
                    value={selectedPatient.gender || "N/A"}
                    fieldName="gender"
                    icon={selectedPatient.gender === "Male" ? Mars : Venus}
                  />

                  <FieldWithChangeIndicator
                    label="Blood Group"
                    value={selectedPatient.bloodGroup}
                    fieldName="bloodGroup"
                    icon={Droplet}
                  />

                  <FieldWithChangeIndicator
                    label="Height"
                    value={selectedPatient?.height || "N/A"}
                    fieldName="height"
                    icon={PersonStanding}
                  />

                  <FieldWithChangeIndicator
                    label="Weight"
                    value={selectedPatient.weight}
                    fieldName="weight"
                    icon={Anvil}
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
                      <span className="text-blue-600">
                        {formatDate(selectedPatient.createdAt)}
                      </span>
                    </p>
                    <p>
                      <strong>User ID:</strong> {selectedPatient.userId}
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
