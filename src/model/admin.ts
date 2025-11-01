import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true,
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

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;
