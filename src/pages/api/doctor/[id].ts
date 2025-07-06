import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

const GET: APIRoute = async ({ params }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const { _id } = params;
    await connect();
    const doctordetails = await DoctorDetails.findOne({ userId: _id });

    return new Response(
      JSON.stringify({
        doctordetails,
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
