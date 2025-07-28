import mongoose from "mongoose";
const appoinmentDataSchema = new mongoose.Schema({
  patientName: {
    type: String,
    require: true,
  },
  patientEmail: {
    type: String,
    require: true,
  },
  patientPhone: {
    type: String,
    require: true,
  },
  appointmentDate: {
    type: String,
    require: true,
  },
  appointmentTime: {
    type: String,
    require: true,
  },
  consultationType: {
    type: String,
    require: true,
  },
  reasonForVisit: {
    type: String,
  },
  symptoms: {
    type: String,
    require: true,
  },
  previousVisit: {
    type: String,
    require: true,
  },
  emergencyContact: {
    type: String,
  },
  emergencyPhone: {
    type: String,
  },
  paymentMethod: {
    type: String,
    require: true,
  },
  specialRequests: {
    type: String,
  },
});

export default mongoose.models.AppoinmentDataSchema ||
  mongoose.model("AppoinmentDataSchema", appoinmentDataSchema);
