import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import type { Token } from "@/types/token";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { password, loginMethod } = body;
    const identifier = body[loginMethod];
    const identifierType = loginMethod;

    // Connect to database
    await connect();

    // Find user by email
    const user = await User.findOne({
      [identifierType]: identifier,
      loginMethod,
    });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payload: Token = {
      userId: user._id,
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      import.meta.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    return new Response(
      JSON.stringify({
        _id: user._id,
        token,
        message: "Login successful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
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
