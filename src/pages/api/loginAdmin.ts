import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import jwt from "jsonwebtoken";
import type { Token } from "@/types/token";
import adminDetails from "@/model/adminDetails";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { adminId, password } = body;

    // Connect to database
    await connect();

    //check admin's existence
    const admin = await adminDetails.findOne({
      adminId: adminId,
    });

    //Admin not exits
    if (!admin) {
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
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Incorrect Passeord",
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
      userId: admin.adminId,
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      import.meta.env.JWT_SECRET ||
        import.meta.env.PUBLIC_JWR_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" }
    );

    return new Response(
      JSON.stringify({
        _id: admin.adminId,
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
