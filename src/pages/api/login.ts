import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import type { Token } from "@/types/token";
import Doctor from "@/model/doctor";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    // console.log("🧞‍♂️body --->", body);
    const { email, password, loginType } = body;
    //console.log("email=>", email);
    ///console.log("pass=>", password);
    //console.log("registrationMethod=>", loginType);

    // Connect to database
    await connect();

    //check login for user or doctor
    if (loginType === "user") {
      const user = await User.findOne({
        email: email,
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
        userId: user._id,
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
    } else {
      const doctor = await Doctor.findOne({
        email: email,
      }).select("+password");
      //console.log("doctor=>", doctor);
      if (!doctor) {
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
      const ispasswordValid = await doctor.comparePassword(password);
      //console.log("🧞‍♂️isPasswordValid --->", ispasswordValid);
      if (!ispasswordValid) {
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
        userId: doctor._id,
      };

      //console.log("payload=>", payload);
      // Generate JWT token
      const token = jwt.sign(
        payload,
        import.meta.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      // console.log("token=>", token);

      return new Response(
        JSON.stringify({
          _id: doctor._id,
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
    }
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
