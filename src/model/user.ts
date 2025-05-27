import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
    match: [
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Invalid email address",
    ],
  },

  mobile: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    sparse: true,
    match: [/^(\+88)?01[3-9]\d{8}$/, "Invalid mobile number"],
  },
  registrationMethod: {
    type: String,
    enum: ["email", "mobile"],
    required: [true, "Registration method is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set default name and hash password before saving
userSchema.pre("save", async function (next) {
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

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
