import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import jwt from "jsonwebtoken";
import Admin from "@/model/admin";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();

    const { email, adminId, name, password } = body;
    // Connect to database
    await connect();

    let token = null;
    // Check if user already exists
    if (!adminId) {
      return new Response(
        JSON.stringify({
          message: "AdminId is required",
        }),
        {
          status: 401,
          headers,
        }
      );
    }
    const existingUser = await Admin.findOne({
      adminId: adminId,
    });

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
    const admin = new Admin({
      email: email,
      name: name,
      adminId: adminId,
      role: "admin",
      password,
    });
    admin.email = email;
    admin.password = password;

    await admin.save();

    // Generate JWT token
    token = jwt.sign(
      { IdOfAdmin: admin._id },
      import.meta.env.JWT_SECRET ||
        import.meta.env.PUBLIC_JWT_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" }
    );
    let _id = admin._id;
    return new Response(
      JSON.stringify({
        _id,
        admin: "admin",
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
