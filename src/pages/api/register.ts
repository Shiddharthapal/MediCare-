import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("🧞‍♂️body --->", body);
    const { password, registrationMethod } = body;
    const identifier = body[registrationMethod];
    console.log("🧞‍♂️identifier --->", identifier);
    const identifierType = registrationMethod;

    // Connect to database
    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({
      [identifierType]: identifier,
      registrationMethod,
    });
    console.log("existingUser --->", existingUser);
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "Email already registered",
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
      [identifierType]: identifier,
      registrationMethod,
      password, // Password will be hashed by mongoose pre-save hook
    });
    console.log("user --->", user);

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
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
