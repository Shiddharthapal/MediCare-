import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        if (this.registrationMethod === "email") {
          if (!v) return false;
          return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v);
        }
        return true;
      },
      message: (props) =>
        !props.value
          ? "Email is required for email registration"
          : "Invalid email address",
    },
  },

  mobile: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        if (this.registrationMethod === "mobile") {
          if (!v) return false;
          return /^(\+88)?01[3-9]\d{8}$/.test(v);
        }
        return true;
      },
      message: (props) =>
        !props.value
          ? "Mobile number is required for mobile registration"
          : "Invalid mobile number format",
    },
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

    // Ensure unused field is undefined based on registration method
    if (this.registrationMethod === "email") {
      this.mobile = undefined;
    } else if (this.registrationMethod === "mobile") {
      this.email = undefined;
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
