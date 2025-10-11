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
  filename: {
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
    default: Date.now,
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
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const PrescriptionSchema = new mongoose.Schema(
  {
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
  },
  { _id: true }
);
// Define the appointment data schema as a subdocument
const appointmentDataSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
    },
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
    prescription: {
      type: PrescriptionSchema,
      default: {},
    },
    createdAt: {
      type: Date,
    },
  },
  { _id: true }
); // This will auto-generate _id for each appointment

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
  payment: {
    type: PaymentMethodsSchema,
  },
  upload: {
    type: [FileUploadSchema],
    default: [],
  },
  lastTreatmentDate: {
    type: Date,
    default: Date.now,
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
