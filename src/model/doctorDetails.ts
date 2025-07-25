import mongoose from "mongoose";

const doctorDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    require: true,
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const doctorDetails =
  mongoose.models.DoctorDetails ||
  mongoose.model("DoctorDetails", doctorDetailsSchema);
export default doctorDetails;
