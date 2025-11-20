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
const MedicationSchema = new mongoose.Schema(
  {
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
  },
  { _id: true }
);

const CardMethodSchema = new mongoose.Schema(
  {
    cardholderName: {
      type: String,
    },
    type: {
      type: String,
    },
    cardNumber: {
      type: String,
    },
    expiryMonth: {
      type: String,
    },
    expiryYear: {
      type: String,
    },
    cvv: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// Mobile Banking Method Sub-Schema
const MobileBankingMethodSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    accountName: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

// Main Payment Methods Schema
const PaymentMethodsSchema = new mongoose.Schema(
  {
    cardMethods: {
      type: [CardMethodSchema],
      default: [],
    },
    mobileBankingMethods: {
      type: [MobileBankingMethodSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

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

const HealthRecord = new mongoose.Schema({
  weight: {
    type: String,
  },
  bloodPressure: {
    type: String,
  },
  heartRate: {
    type: String,
  },
  date: {
    type: String,
  },
  temperature: {
    type: String,
  },
  notes: {
    type: String,
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

const PrescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
    },
    doctorName: {
      type: String,
    },
    patientId: {
      type: String,
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

// Define the appointment data schema as a subdocument
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
    doctorGender: {
      type: String,
    },
    doctorEmail: {
      type: String,
    },
    hospital: {
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
    },
    specialRequests: {
      type: String,
    },
    prescription: {
      type: PrescriptionSchema,
      default: {},
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
); // This will auto-generate _id for each appointment

//schema for profile picture of user
const UserImageSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  filename: {
    type: String,
  },
  documentName: {
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
  },
  deletedAt: {
    type: Date,
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
  image: {
    type: UserImageSchema,
  },
  appointments: {
    type: [appointmentDataSchema], // Changed from [String] to [appointmentDataSchema]
    default: [], // Optional: set default empty array
  },
  payment: {
    type: PaymentMethodsSchema,
  },
  upload: {
    type: [FileUploadSchema],
    default: [],
  },
  healthRecord: {
    type: [HealthRecord],
    default: [],
  },
  lastTreatmentDate: {
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
});

const userDetails =
  mongoose.models.UserDetails ||
  mongoose.model("UserDetails", userDetailsSchema);

export default userDetails;
