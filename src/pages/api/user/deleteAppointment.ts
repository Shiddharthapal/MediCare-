import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request }) => {
  const headers = {
    "Content-type": "application/json",
  };
  try {
    let body = await request.json();
    const { appointmentId, userId } = body;
    //console.log("🧞‍♂️body --->", body);
    await connect();
    let userdetails = await userDetails.findOne({ userId: userId });
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
        $pull: { appointments: { _id: appointmentId } },
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

    userdetails = await userDetails.findOne({ userId: userId });

    return new Response(JSON.stringify({ userdetails }), {
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
