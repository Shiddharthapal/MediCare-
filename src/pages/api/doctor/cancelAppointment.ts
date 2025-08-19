import connect from "@/lib/connection";
import User from "@/model/userDetails";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    await connect();
    const { appointmentId, doctorId, patientId } = await request.json();

    // Find the doctor and update the appointment status
    let doctordetails = await DoctorDetails.findOneAndUpdate(
      { userId: doctorId, "appointments._id": appointmentId },
      { $set: { "appointments.$.status": "cancelled" } }
    );

    // Find the user and update the appointment status
    let userdetails = await User.findOneAndUpdate(
      { _id: patientId, "appointments._id": appointmentId },
      { $set: { "appointments.$.status": "cancelled" } }
    );

    return new Response(
      JSON.stringify({
        message: "Appointments cancel successfully",
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Can't cancel appointment. Error: ${error}`,
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
