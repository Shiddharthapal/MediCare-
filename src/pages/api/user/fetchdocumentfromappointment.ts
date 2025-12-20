import connect from "@/lib/connection";
import doctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let { id, doctorpatinetId } = await request.json();
    await connect();

    let userdetails = await userDetails.findOne({ userId: id });
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "Invalid user",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    if (!userdetails?.appointments || userdetails?.appointments.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No appointments found for this user",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    let appointmentDate = userdetails?.appointments.find(
      (appointment) => appointment.doctorpatinetId === doctorpatinetId
    );

    return new Response(
      JSON.stringify({
        appointmentDate,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't fetch data",
        error:
          error instanceof Error ? error.message : "Token varification failed",
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
