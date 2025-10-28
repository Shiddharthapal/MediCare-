import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Please provide a valid email",
    ],
  },
  name: {
    type: String,
    required: true,
  },
  adminId: {
    type: Number,
    required: [true, "Please provide a admin id"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set default name and hash password before saving
adminSchema.pre("save", async function (next) {
  try {
    // Hash password if modified
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};
export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
