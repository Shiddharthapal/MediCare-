import mongoose from "mongoose";

const appointmentDataSchema = new mongoose.Schema(
  {
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
  },
  { _id: true }
); // This will auto-generate _id for each appointment
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
  availableSlots: {
    type: [String],
    require: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "Available slot must contain at least one slot",
    },
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const doctorDetails =
  mongoose.models.DoctorDetails ||
  mongoose.model("DoctorDetails", doctorDetailsSchema);
export default doctorDetails;
