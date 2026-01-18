import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import Doctor from "@/model/doctor";
import adminStore from "@/model/adminStore";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    // console.log("body ==> ", body);

    const { email, password, registrationNo } = body;
    // Connect to database
    await connect();

    let token = null;
    // Check if user already exists
    if (!registrationNo) {
      const existingUser = await User.findOne({
        email: email,
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
      const users = new User({
        email: email,
        role: "user",
        password,
      });
      users.email = email;
      users.password = password;

      await users.save();

      try {
        await adminStore.updateMany(
          {}, // Empty filter = update all admin documents
          {
            $push: {
              patientRegister: {
                userId: users._id,
                email: users.email,
                role: "user",
                createdAt: users.createdAt || new Date(),
                status: "active",
              },
            },
          }
        );
        console.log("User added to all admin stores");
      } catch (error) {
        console.error("Error updating admin stores:", error);
        // Continue even if admin update fails
      }

      // Generate JWT token
      token = jwt.sign(
        { userId: users._id },
        import.meta.env.JWT_SECRET ||
          import.meta.env.PUBLIC_JWT_SECRET ||
          "your-secret-key",
        { expiresIn: "24h" }
      );

      let _id = users._id;
      return new Response(
        JSON.stringify({
          _id,
          user: "user",
          token,
          message: "Registration successful",
        }),
        {
          status: 200,
          headers,
        }
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
        user: "doctor",
        password,
        registrationNo: registrationNo,
      });
      await doctor.save();

      try {
        await adminStore.updateMany(
          {}, // Empty filter = update all admin documents
          {
            $push: {
              doctorRegister: {
                userId: doctor._id,
                email: doctor.email,
                registrationNo: doctor.registrationNo,
                role: "doctor",
                createdAt: doctor.createdAt || new Date(),
                status: "active",
              },
            },
          }
        );
        console.log("User added to all admin stores");
      } catch (error) {
        console.error("Error updating admin stores:", error);
        // Continue even if admin update fails
      }

      token = jwt.sign(
        { userId: doctor._id },
        import.meta.env.JWT_SECRET ||
          import.meta.env.PUBLIC_JWT_SECRET ||
          "your-secret-key",
        { expiresIn: "24h" }
      );
      let _id = doctor._id;
      return new Response(
        JSON.stringify({
          _id,
          user: "doctor",
          token,
          message: "Registration successful",
        }),
        {
          status: 200,
          headers,
        }
      );
    }
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
