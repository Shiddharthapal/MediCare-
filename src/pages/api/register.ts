import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import Doctor from "@/model/doctor";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  console.log("🧞‍♂️body --->", body);
  const { email, password, registrationType } = body;
  const identifier = body[registrationType];
  console.log("🧞‍♂️identifier --->", identifier);
  const identifierType = registrationType;
  console.log("🧞‍♂️identifierType --->", identifierType);
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    // Connect to database
    await connect();

    let token = null;
    // Check if user already exists
    if (identifierType === "user") {
      const existingUser = await User.findOne({
        email: email,
      });
      console.log("existingUser --->", existingUser);
      if (existingUser) {
        return new Response(
          JSON.stringify({
            message: "User already register",
          }),
          {
            status: 400,
            headers,
          }
        );
      }

      // Create new user
      const user = new User({
        email: email, // Only add the active identifier
        password,
      });

      await user.save();

      // Generate JWT token
      token = jwt.sign(
        { userId: user._id },
        import.meta.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );
    } else {
      const existingDoctor = await Doctor.findOne({
        email: email,
      });

      if (existingDoctor) {
        return new Response(
          JSON.stringify({
            message: "Doctor already register",
          }),
          {
            status: 401,
            headers,
          }
        );
      }

      //create new user
      const doctor = new Doctor({
        email: email,
        password,
      });
      console.log("doctor=>", doctor);
      await doctor.save();

      token = jwt.sign(
        { userId: doctor._id },
        import.meta.env.JWT_SECRET ||
          import.meta.env.PUBLIC_JWT_SECRET ||
          "your-secret-key",
        { expiresIn: "24h" }
      );
      console.log("token=>", token);
    }
    return new Response(
      JSON.stringify({
        token,
        message: "Registration successful",
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    let errorMessage = "Internal server error";
    let statusCode = 500;

    // Handle validation errors
    if (error.name === "ValidationError") {
      statusCode = 400;
      const validationError = error as {
        errors: { [key: string]: { message: string } };
      };
      errorMessage = Object.values(validationError.errors)[0].message;
    }
    // Handle duplicate key errors
    else if (error.code === 11000) {
      statusCode = 400;
      const field =
        registrationType === "email" ? "email address" : "mobile number";
      errorMessage = `This ${field} is already registered`;
    }

    return new Response(
      JSON.stringify({
        message: errorMessage,
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
