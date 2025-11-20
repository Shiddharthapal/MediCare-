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
  reasonForVisit: string;
  doctorpatinetId: string;
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

interface CardMethodSchema {
  cardholderName: string;
  type: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isPrimary: boolean;
}

interface MobileBankingMethodSchema {
  provider: string;
  mobileNumber: string;
  accountName: string;
  isPrimary: boolean;
}

interface PaymentMethods {
  cardMethods: CardMethodSchema[];
  mobileBankingMethods: MobileBankingMethodSchema[];
}

interface UserImage {
  userId: string;
  filename: string;
  documentName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  path: string;
  url: string;
  checksum: string;
  uploadedAt: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface FileUpload {
  _id: string;
  patientId: string;
  doctorId?: string;
  patientName: string;
  documentName: string;
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
  cancelledBy?: string;
  cancelledAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

export interface UserDetails {
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
  image: UserImage;
  healthRecord: HealthRecord[];
  lastTreatmentDate?: Date;
  createdAt: Date;
}
