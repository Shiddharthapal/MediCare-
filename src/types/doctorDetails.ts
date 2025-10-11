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
interface Prescription {
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
  appointmentDuration: string;
  bufferTime: string;
  allowOnlineBooking: boolean;
  sendReminders: boolean;
  workingHours: {
    [key: string]: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
}
interface AppointmentData {
  appointmentId: string;
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
  payment: PaymentMethods[];
  availableSlots: string[];
  appointments: AppointmentData[];
  practiceSettingData: PracticeSettingData[];
  consultationModes: string[];
  createdAt: Date;
}
