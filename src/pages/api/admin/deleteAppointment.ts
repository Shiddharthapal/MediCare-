import connect from "@/lib/connection";
import doctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request }) => {
  const headers = {
    "Content-type": "application/json",
  };
  try {
    let body = await request.json();
    const { appointment } = body;
    const doctorpatinetId = appointment.doctorpatinetId;
    const doctorUserId = appointment.doctorUserId;
    const patientId = appointment.patientId;

    await connect();
    let userdetails = await userDetails.findOne({ userId: patientId });
    // console.log("🧞‍♂️userdetails --->", userdetails);
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 404,
          headers,
        }
      );
    }
    const updatedUser = await userDetails.findByIdAndUpdate(
      userdetails._id,
      {
        $pull: { appointments: { doctorpatinetId: doctorpatinetId } },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          message: "Failed to update user",
        }),
        {
          status: 500,
          headers,
        }
      );
    }

    //for doctor
    let doctordetails = await doctorDetails.findOne({ userId: doctorUserId });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found",
        }),
        {
          status: 404,
          headers,
        }
      );
    }
    const updatedDoctor = await doctorDetails.findByIdAndUpdate(
      doctordetails._id,
      {
        $pull: { appointments: { doctorpatinetId: doctorpatinetId } },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedDoctor) {
      return new Response(
        JSON.stringify({
          message: "Failed to update doctor",
        }),
        {
          status: 500,
          headers,
        }
      );
    }

    userdetails = await userDetails.findOne({ userId: patientId });
    doctordetails = await doctorDetails.findOne({ userId: doctorUserId });

    return new Response(JSON.stringify({ userdetails, doctordetails }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't create book appoinment  ",

        error:
          error instanceof Error ? error.message : "Token verification failed",
      }),

      {
        status: 400,

        headers,
      }
    );
  }
};
