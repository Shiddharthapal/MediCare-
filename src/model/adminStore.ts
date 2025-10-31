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
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
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
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
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
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
  },

  updatedAt: {
    type: Date,
    default: () => {
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
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
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
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

const AppointmentDataDoctorSchema = new mongoose.Schema(
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
      default: () => {
        // Bangladesh is UTC+6
        const now = new Date();
        const offset = 6 * 60; // 6 hours in minutes
        const localTime = new Date(now.getTime() + offset * 60 * 1000);
        return localTime;
      },
    },
  },
  { _id: true }
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
    document: {
      type: [FileUploadSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: () => {
        // Bangladesh is UTC+6
        const now = new Date();
        const offset = 6 * 60; // 6 hours in minutes
        const localTime = new Date(now.getTime() + offset * 60 * 1000);
        return localTime;
      },
    },
  },
  { _id: true }
);

const AdminAppointmentSchema = new mongoose.Schema(
  {
    // Doctor Information
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

    // Patient Information
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

    // Appointment Details
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    consultationType: {
      type: String,
      required: true,
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
      required: true,
    },
    previousVisit: {
      type: String,
      required: true,
    },

    // Emergency Contact
    emergencyContact: {
      type: String,
    },
    emergencyPhone: {
      type: String,
    },

    // Payment & Additional
    paymentMethod: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
    },

    // Medical Records
    prescription: {
      type: PrescriptionSchema,
      default: {},
    },
    document: {
      type: [FileUploadSchema],
      default: [],
    },

    // Timestamp
    createdAt: {
      type: Date,
      default: () => {
        // Bangladesh is UTC+6
        const now = new Date();
        const offset = 6 * 60; // 6 hours in minutes
        const localTime = new Date(now.getTime() + offset * 60 * 1000);
        return localTime;
      },
    },
  },
  { _id: true }
);

const RescheduleAppointmentSchema = new mongoose.Schema(
  {
    // Doctor Information
    doctorpatinetId: {
      type: String,
    },
    doctorUserId: { type: String },
    doctorName: { type: String },
    doctorSpecialist: { type: String },
    doctorGender: { type: String },
    doctorEmail: { type: String },
    hospital: { type: String },

    // Patient Information
    patientId: { type: String },
    patientName: { type: String },
    patientEmail: { type: String },
    patientPhone: { type: String },
    patientGender: { type: String },
    patientAge: { type: Number },
    patientAddress: { type: String },
    patientBloodgroup: { type: String },
    patientBithofday: { type: Date },

    // Appointment Details
    appointmentDate: { type: String },
    prevappointmentDate: { type: String },
    appointmentTime: { type: String },
    prevappointmentTime: { type: String },
    status: {
      type: String,
      default: "pending",
    },
    consultationType: { type: String },
    prevconsultationType: { type: String },
    consultedType: { type: String },
    prevconsultedType: { type: String },
    reasonForVisit: { type: String },
    prevreasonForVisit: { type: String },
    symptoms: { type: String },
    prevsymptoms: { type: String },
    previousVisit: { type: String },

    // Emergency Contact
    emergencyContact: { type: String },
    prevemergencyContact: { type: String },
    emergencyPhone: { type: String },
    prevemergencyPhone: { type: String },

    // Payment & Additional
    paymentMethod: { type: String },
    prevpaymentMethod: { type: String },
    specialRequests: { type: String },
    prevspecialRequests: { type: String },

    // Medical Records
    prescription: { type: PrescriptionSchema },
    document: [FileUploadSchema],

    // Timestamp
    prevcreatedAt: { type: Date },
    createdAt: {
      type: Date,
      default: () => {
        // Bangladesh is UTC+6
        const now = new Date();
        const offset = 6 * 60; // 6 hours in minutes
        const localTime = new Date(now.getTime() + offset * 60 * 1000);
        return localTime;
      },
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
    _id: true,
  }
);

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
  },
  appointments: {
    type: [AppointmentDataDoctorSchema],
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
    default: () => ({}),
  },
  status: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: () => {
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
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
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => {
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
  },
});

const UserRegisterSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },

  role: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => {
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
  },
});

const DoctorRegisterSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  registrationNo: {
    type: Number,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => {
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
  },
});

const adminStoreSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: [true, "Please provide a admin id"],
    unique: true,
  },
  doctorRegister: {
    type: [DoctorRegisterSchema],
    default: [],
  },
  patientRegister: {
    type: [UserRegisterSchema],
    default: [],
  },
  doctorDetails: {
    type: [doctorDetailsSchema],
    default: [],
  },
  patientDetails: {
    type: [userDetailsSchema],
    default: [],
  },
  appointment: {
    type: [AdminAppointmentSchema],
    default: [],
  },
  rescheduleAppointment: {
    type: [RescheduleAppointmentSchema],
    default: [],
  },
  upload: {
    type: [FileUploadSchema],
    default: [],
  },
  healthRecord: {
    type: [HealthRecord],
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => {
      // Bangladesh is UTC+6
      const now = new Date();
      const offset = 6 * 60; // 6 hours in minutes
      const localTime = new Date(now.getTime() + offset * 60 * 1000);
      return localTime;
    },
  },
});

export default mongoose.models.AdminStore ||
  mongoose.model("AdminStore", adminStoreSchema);
