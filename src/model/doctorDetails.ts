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

const FileUploadSchema = new mongoose.Schema({
  patientId: {
    type: String,
  },
  filename: {
    type: String,
  },
  patientName: {
    type: String,
  },
  documentName: {
    type: String,
  },

  doctorId: {
    type: String,
  },

  originalName: {
    type: String,
  },

  fileType: {
    type: String,
  },

  fileSize: {
    type: Number,
  },

  path: {
    type: String,
  },

  url: {
    type: String,
  },

  checksum: {
    type: String,
  },

  uploadedAt: {
    type: Date,
    default: () => {
      // Get current time in Bangladesh timezone (UTC+6)
      const now = new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      );
      return bdTime;
    },
  },
  doctorName: {
    type: String,
  },
  category: {
    type: String,
  },
  userIdWHUP: {
    type: String,
  },
  appointmentId: {
    type: String,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: () => {
      // Get current time in Bangladesh timezone (UTC+6)
      const now = new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      );
      return bdTime;
    },
  },

  updatedAt: {
    type: Date,
    default: () => {
      // Get current time in Bangladesh timezone (UTC+6)
      const now = new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      );
      return bdTime;
    },
  },
});

const PrescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: String,
  },
  doctorName: {
    type: String,
  },
  patientId: {
    type: String,
  },
  patientName: {
    type: String,
  },
  patientAge: {
    type: Number,
  },
  doctorpatinetId: {
    type: String,
  },
  vitalSign: {
    type: VitalSignSchema,
  },
  reasonForVisit: {
    type: String,
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

const AppointmentSlotSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format validation
    },
    endTime: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format validation
    },
  },
  { _id: false } // Disable _id for subdocuments
);

const appointmentDataSchema = new mongoose.Schema(
  {
    doctorpatinetId: {
      type: String,
    },
    doctorUserId: {
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
    },
    appointmentTime: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
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
      required: true, // Fixed: was 'require'
    },
    specialRequests: {
      type: String,
    },
    prescription: {
      type: PrescriptionSchema,
    },
    document: {
      type: [FileUploadSchema],
      default: [],
    },
    cancelledBy: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
      default: () => {
        // Get current time in Bangladesh timezone (UTC+6)
        const now = new Date();
        const bdTime = new Date(
          now.toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          })
        );
        return bdTime;
      },
    },
    createdAt: {
      type: Date,
      default: () => {
        // Get current time in Bangladesh timezone (UTC+6)
        const now = new Date();
        const bdTime = new Date(
          now.toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          })
        );
        return bdTime;
      },
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
  },
  specializations: {
    type: [String],

    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "Specializations must contain at least one Specializations",
    },
  },
  hospital: {
    type: String,
  },
  fees: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  experience: {
    type: String,
  },
  education: {
    type: String,
  },
  degree: {
    type: String,
  },
  language: {
    type: [String],

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
    default: () => ({}),
  },

  availableSlots: {
    type: Map,
    of: AppointmentSlotSchema,
    default: () =>
      new Map([
        ["Monday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
        ["Tuesday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
        ["Wednesday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
        ["Thursday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
        ["Friday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
        ["Saturday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
        ["Sunday", { enabled: false, startTime: "09:00", endTime: "17:00" }],
      ]),
  },
  appointments: {
    type: [appointmentDataSchema],
    default: [],
  },
  consultationModes: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "consultation Modes slot must contain at least one Modes",
    },
  },
  prescription: {
    type: [PrescriptionSchema],
    default: [],
  },

  practiceSettingData: {
    type: practiceSettingData,
  },

  createdAt: {
    type: Date,
    default: () => {
      // Get current time in Bangladesh timezone (UTC+6)
      const now = new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      );
      return bdTime;
    },
  },
});

const doctorDetails =
  mongoose.models.DoctorDetails ||
  mongoose.model("DoctorDetails", doctorDetailsSchema);
export default doctorDetails;
