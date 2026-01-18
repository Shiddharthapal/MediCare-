import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Please provide a valid email"
    ]
  },
  name: {
    type: String,
    required: true
  },
  adminId: {
    type: String,
    required: [true, "Please provide a admin id"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => {
      const now = /* @__PURE__ */ new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka"
        })
      );
      return bdTime;
    }
  }
});
adminDetailsSchema.pre("save", async function(next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});
adminDetailsSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const adminDetails = mongoose.models.AdminDetails || mongoose.model("AdminDetails", adminDetailsSchema);

export { adminDetails as a };
