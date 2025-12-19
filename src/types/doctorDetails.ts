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

interface Prescription {
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientAge: number;
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

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AppointmentSlot {
  enabled: boolean;
  slots: TimeSlot[]; // Array of time slots
}

interface AppointmentData {
  doctorpatinetId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorUserId: string;
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
  cancelledBy?: string;
  cancelledAt?: Date;
  updatedAt: Date;
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
  upload: FileUpload[];
  prescription?: Prescription[];
  createdAt: Date;
}
