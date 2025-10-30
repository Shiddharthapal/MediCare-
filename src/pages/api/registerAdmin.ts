import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import jwt from "jsonwebtoken";
import adminDetails from "@/model/adminDetails";
import Admin from "@/model/admin";
import adminStore from "@/model/adminStore";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();
    console.log("🧞‍♂️  body --->", body);

    const { email, adminId, name, password } = body;
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

    // Connect to database
    await connect();

    //check adminId is valid or not
    const adminExistence = await Admin.findOne({
      Id: adminId,
    });

    // Have a option to add admin registered
    // if (!adminExistence) {
    //   const idofadmin = new Admin({
    //     Id: adminId,
    //   });

    //   await idofadmin.save();
    // }

    if (!adminExistence) {
      return new Response(
        JSON.stringify({
          message: "Invalid adminId",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    let token = null;

    // Check  admin already exists or not
    const existingUser = await adminDetails.findOne({
      adminId: adminId,
    });

    const existingUserdata = await adminStore.findOne({
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

    if (existingUserdata) {
      return new Response(
        JSON.stringify({
          message: "User data already store",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    // Create new user
    const admin = new adminDetails({
      email: email,
      name: name,
      adminId: adminId,
      role: "admin",
      password,
    });
    admin.email = email;
    admin.password = password;

    await admin.save();

    const admindata = new adminStore({
      email: email,
      name: name,
      adminId: adminId,
    });

    await admindata.save();

    // Generate JWT token
    token = jwt.sign(
      { IdOfAdmin: admin.adminId },
      import.meta.env.JWT_SECRET ||
        import.meta.env.PUBLIC_JWT_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" }
    );
    let _id = admin.adminId;
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
