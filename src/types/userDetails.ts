interface AppointmentData {
  doctorUserId: string;
  doctorName: string;
  doctorSpecialist: string;
  doctorGender: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: string;
  consultedType: string;
  reasonForVisit: string;
  symptoms: string;
  previousVisit: string;
  emergencyContact: string;
  emergencyPhone: string;
  paymentMethod: string;
  specialRequests: string;
  createdAt: Date;
}
export interface UserDetails {
  _id: string;
  userId: string;
  email: string;
  name: string;
  fatherName?: string;
  address: string;
  contactNumber: string;
  age: number;
  gender: string;
  bloodGroup: string;
  weight: number;
  height?: number;
  appoinments: AppointmentData[];
  lastTreatmentDate?: Date;
  createdAt: Date;
}
