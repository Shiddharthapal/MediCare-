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
  patientName: string;
  doctorId: string;
  filename: string;
  originalName: string;
  documentName: string;
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

interface AdminPrescription {
  doctorId: string;
  doctorName: string;
  patientId: string;
  doctorHospital: string;
  doctorContact: string;
  doctorSpecializations: string;
  doctorSpecialist: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientContact: string;
  patientBloodGroup: string;
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

interface Appointment {
  _id?: string;

  // Doctor Information
  doctorpatinetId?: string;
  doctorUserId?: string;
  doctorName?: string;
  doctorSpecialist?: string;
  doctorGender?: string;
  doctorEmail?: string;
  hospital?: string;

  // Patient Information
  patientId?: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientGender?: string;
  patientAge?: number;
  patientAddress?: string;
  patientBloodgroup?: string;
  patientBithofday?: Date;

  // Appointment Details
  appointmentDate: string;
  appointmentTime: string;
  status?: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit?: string;
  symptoms: string;
  previousVisit: string;

  // Emergency Contact
  emergencyContact?: string;
  emergencyPhone?: string;

  // Payment & Additional
  paymentMethod: string;
  specialRequests?: string;

  // Medical Records
  prescription?: Prescription;
  document?: FileUpload[];
  cancelledBy?: string;
  cancelledAt?: Date;
  updatedAt: Date;
  // Timestamp
  createdAt?: Date;
}

interface RescheduleAppointment {
  _id?: string;
  // Doctor Information
  doctorpatinetId?: string;
  doctorUserId?: string;
  doctorName?: string;
  doctorSpecialist?: string;
  doctorGender?: string;
  doctorEmail?: string;
  hospital?: string;

  // Patient Information
  patientId?: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientGender?: string;
  patientAge?: number;
  patientAddress?: string;
  patientBloodgroup?: string;
  patientBithofday?: Date;

  // Appointment Details
  appointmentDate: string;
  prevappointmentDate?: string;
  appointmentTime: string;
  prevappointmentTime?: string;
  status?: string;
  consultationType: string;
  prevconsultationType?: string;
  consultedType: string;
  prevconsultedType?: string;
  reasonForVisit: string;
  prevreasonForVisit?: string;
  symptoms: string;
  prevsymptoms?: string;
  previousVisit: string;

  // Emergency Contact
  emergencyContact?: string;
  prevemergencyContact?: string;
  emergencyPhone?: string;
  prevemergencyPhone?: string;

  // Payment & Additional
  paymentMethod: string;
  prevpaymentMethod?: string;
  specialRequests?: string;
  prevspecialRequests?: string;

  // Medical Records
  prescription?: Prescription;
  document?: FileUpload[];
  // Timestamp
  prevcreatedAt?: Date;
  createdAt?: Date;
}

interface UserImage {
  userId: string;
  userName: string;
  email: string;
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
  prescription?: AdminPrescription[];
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

interface DoctorRegister {
  _id: string;
  userId: string;
  email: String;
  registrationNo: Number;
  status: string;
  role: String;
  createdAt: Date;
}

export interface AdminStore {
  _id: String;
  email: String;
  name: string;
  adminId: string;
  doctorRegister: DoctorRegister[];
  patientRegister: UserRegister[];
  doctorDetails: DoctorDetails[];
  patientDetails: UserDetails[];
  appointment: Appointment[];
  rescheduleAppointment: RescheduleAppointment[];
  cancelAppointment: Appointment[];
  upload: FileUpload[];
  prescription: AdminPrescription[];
  healthRecord: HealthRecord[];
  createdAt: Date;
}
