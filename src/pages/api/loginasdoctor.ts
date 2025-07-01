import connect from "@/lib/connection";
import type { APIRoute } from "astro";
import Doctor from "@/model/doctor";
import type { Token } from "@/types/token";
import jwt from "jsonwebtoken";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    const { password, registrationMethod } = body;
    const identifier = body[registrationMethod];
    const identifierType = registrationMethod;
    await connect();
    const doctor = await Doctor.findOne({
      [identifierType]: identifier,
      registrationMethod,
    });
    if (!doctor) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials",
        }),
        {
          status: 401,
          headers,
        }
      );
    }
    const comparepassword = await doctor.comparePassword(password);
    if (!comparepassword) {
      return new Response(
        JSON.stringify({
          message: "Incorrect password",
        }),
        {
          status: 402,
          headers,
        }
      );
    }
    const payload: Token = {
      userId: doctor._id,
    };

    let token = jwt.sign(
      payload,
      import.meta.env.JWE_SECRET ||
        import.meta.env.PUBLIC_JWT_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" }
    );

    return new Response(
      JSON.stringify({
        token,
        message: "Login successfully",
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {}
  return new Response(
    JSON.stringify({
      message: "Internal server error",
    }),
    {
      status: 400,
      headers,
    }
  );
};
