import { date, Schema } from "astro:schema";
import mongoose from "mongoose";

// Define the appointment data schema as a subdocument
const appointmentDataSchema = new mongoose.Schema(
  {
    doctorUserId: {
      type: String,
    },
    doctorName: {
      type: String,
    },
    doctorSpecialist: {
      type: String,
    },
    doctorGender: {
      type: String,
    },
    patientName: {
      type: String,
    },
    patientEmail: {
      type: String,
    },
    patientPhone: {
      type: String,
    },
    appointmentDate: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    appointmentTime: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    consultationType: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    consultedType: {
      type: String,
      required: true,
    },
    reasonForVisit: {
      type: String,
    },
    symptoms: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    previousVisit: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    emergencyContact: {
      type: String,
    },
    emergencyPhone: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    specialRequests: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  { _id: true }
); // This will auto-generate _id for each appointment

const VitalSignSchema = new mongoose.Schema({
  bloodPressure: {
    type: String,
  },
  heartRate: {
    type: String,
  },
  temperature: {
    type: String,
  },
  weight: {
    type: String,
  },
  height: {
    type: String,
  },
  respiratoryRate: {
    type: String,
  },
  oxygenSaturation: {
    type: String,
  },
  bmi: {
    type: Number,
  },
});
const MedicationSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  medecineName: {
    type: String,
  },
  medecineDosage: {
    type: String,
  },
  frequency: {
    type: String,
  },
  duration: {
    type: String,
  },
  instructions: {
    type: String,
  },
  quantity: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});
const PrescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: String,
  },
  doctorName: {
    type: String,
  },
  doctorSpecialist: {
    type: String,
  },
  doctorEmail: {
    type: String,
  },
  doctorGender: {
    type: String,
  },
  doctorContact: {
    type: String,
  },
  patientId: {
    type: String,
  },
  patientName: {
    type: String,
  },
  patientEmail: {
    type: String,
  },
  patientPhone: {
    type: String,
  },
  patientGender: {
    type: String,
  },
  patientAge: {
    type: String,
  },
  patientAddress: {
    type: String,
  },
  hospital: {
    type: String,
  },
  patientBloodgroup: {
    type: String,
  },
  patientBithofday: {
    type: Date,
  },
  appointmentDate: {
    type: String,
  },
  appointmentTime: {
    type: String,
  },
  consultationType: {
    type: String,
  },
  consultedType: {
    type: String,
  },
  reasonForVisit: {
    type: String,
  },
  symptoms: {
    type: String,
  },
  previousVisit: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  emergencyPhone: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  specialRequests: {
    type: String,
  },
  patientdateOfBirth: {
    type: String,
  },
  vitalSign: {
    type: VitalSignSchema,
  },
  primaryDiagnosis: {
    type: String,
  },
  testandReport: {
    type: String,
  },
  medication: {
    type: [MedicationSchema],
    default: [],
  },
  restrictions: {
    type: String,
  },
  followUpDate: {
    type: String,
  },
  additionalNote: {
    type: String,
  },
  specialist: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  appointments: {
    type: [appointmentDataSchema], // Changed from [String] to [appointmentDataSchema]
    default: [], // Optional: set default empty array
  },
  lastTreatmentDate: {
    type: Date,
    default: Date.now,
  },
  prescription: {
    type: [PrescriptionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userDetails =
  mongoose.models.UserDetails ||
  mongoose.model("UserDetails", userDetailsSchema);

export default userDetails;
