import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { password, registrationMethod } = body;
  const identifier = body[registrationMethod];
  const identifierType = registrationMethod;
  try {
    // Connect to database
    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({
      [identifierType]: identifier,
      registrationMethod,
    });
    console.log("existingUser --->", existingUser);
    if (existingUser) {
      const errorMessage =
        registrationMethod === "email"
          ? "Email already registered"
          : "Mobile number already registered";
      return new Response(
        JSON.stringify({
          message: errorMessage,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create new user
    const user = new User({
      registrationMethod,
      password,
      [identifierType]: identifier, // Only add the active identifier
    });
    console.log("🧞‍♂️user --->", user);

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      import.meta.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    return new Response(
      JSON.stringify({
        token,
        message: "Registration successful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
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
        registrationMethod === "email" ? "email address" : "mobile number";
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
