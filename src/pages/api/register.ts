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

    // Create new user with only the required fields
    const userData: Record<string, any> = {
      registrationMethod,
      password, // Password will be hashed by mongoose pre-save hook
    };

    // Only add the identifier being used
    userData[identifierType] = identifier;

    const user = new User(userData);
    console.log("🧞‍♂️user --->", user);

    await user.save();
    console.log("🧞‍♂️user saved --->");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      import.meta.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    console.log("🧞‍♂️token --->", token);

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
  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "Internal server error";
    let statusCode = 500;

    // Handle MongoDB duplicate key error
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      statusCode = 400;
      errorMessage = `This ${registrationMethod} is already registered`;
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
