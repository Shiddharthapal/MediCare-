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
  createdAt: Date;
}
interface User {
  _id: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface Doctor {
  _id: String;
  email: String;
  registrationNo: Number;
  role: String;
  createdAt: Date;
}

export interface AdminStore {
  _id: String;
  email: String;
  name: string;
  adminId: string;
  doctorRegister: Doctor[];
  patientRegister: User[];
  doctorDetails: DoctorDetails[];
  patientDetails: UserDetails[];
  createdAt: Date;
}
