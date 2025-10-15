import mongoose from "mongoose";

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

const PaymentMethods = new mongoose.Schema({
  acceptCreditCards: {
    type: Boolean,
    default: false,
  },
  acceptDebitCards: {
    type: Boolean,
    default: false,
  },
  acceptBkash: {
    type: Boolean,
    default: false,
  },
  acceptNagad: {
    type: Boolean,
    default: false,
  },
  acceptRocket: {
    type: Boolean,
    default: false,
  },

  // Payment account details (conditional validation)
  creditCardNumber: {
    type: String,
  },
  debitAccountNumber: {
    type: String,
  },
  bkashNumber: {
    type: String,
  },
  nagadNumber: {
    type: String,
  },
  rocketNumber: {
    type: String,
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
  vitalSign: {
    type: VitalSignSchema,
  },
  primaryDiagnosis: {
    type: String,
  },
  symptoms: {
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
  prescriptionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const practiceSettingData = new mongoose.Schema({
  practiceName: {
    type: String,
  },
  specialty: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  fax: {
    type: String,
  },
  appointmentDuration: {
    type: String,
  },
  bufferTime: {
    type: String,
  },
  allowOnlineBooking: {
    type: Boolean,
  },
  sendReminders: {
    type: Boolean,
  },
  workingHours: {
    type: Map,
    of: {
      enabled: {
        type: Boolean,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  },
});

const appointmentSlot = new mongoose.Schema({
  type: Map,
  of: {
    enabled: {
      type: Boolean,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
  },
});

const appointmentDataSchema = new mongoose.Schema(
  {
    doctorpatinetId: {
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
    patientId: {
      type: String,
    },
    patientName: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    patientEmail: {
      type: String,
    },
    patientPhone: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    patientGender: {
      type: String,
    },
    patientAge: {
      type: Number,
    },
    patientAddress: {
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
      required: true, // Fixed: was 'require'
    },
    appointmentTime: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    status: {
      type: String,
      default: "pending",
    },
    consultationType: {
      type: String,
      required: true, // Fixed: was 'require'
    },
    consultedType: {
      type: String,
      required: true, // Fixed: was 'require'
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
    prescription: {
      type: PrescriptionSchema,
      default: {},
    },
    createdAt: {
      type: Date,
    },
  },
  { _id: true }
);

// This will auto-generate _id for each appointment
const doctorDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  contact: {
    type: String,
  },
  registrationNo: {
    type: Number,
    unique: true,
  },
  specialist: {
    type: String,
    require: true,
  },
  specializations: {
    type: [String],
    require: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "Specializations must contain at least one Specializations",
    },
  },
  hospital: {
    type: String,
    require: true,
  },
  fees: {
    type: Number,
    require: true,
  },
  rating: {
    type: Number,
  },
  experience: {
    type: String,
    require: true,
  },
  education: {
    type: String,
    require: true,
  },
  degree: {
    type: String,
    require: true,
  },
  language: {
    type: [String],
    require: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "Atleast one language",
    },
  },
  about: {
    type: String,
  },

  payment: {
    type: PaymentMethods,
  },

  availableSlots: {
    type: appointmentSlot,
    default: {},
  },
  appointments: {
    type: [appointmentDataSchema],
    default: [],
  },
  consultationModes: {
    type: [String],
    require: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "consultation Modes slot must contain at least one Modes",
    },
  },

  practiceSettingData: {
    type: practiceSettingData,
    default: () => ({}),
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const doctorDetails =
  mongoose.models.DoctorDetails ||
  mongoose.model("DoctorDetails", doctorDetailsSchema);
export default doctorDetails;
