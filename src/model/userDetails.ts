import { date } from "astro:schema";
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
  birthofday: {
    type: Date,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userDetails =
  mongoose.models.UserDetails ||
  mongoose.model("UserDetails", userDetailsSchema);

export default userDetails;
