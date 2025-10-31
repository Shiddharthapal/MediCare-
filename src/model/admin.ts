import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true,
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

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;
