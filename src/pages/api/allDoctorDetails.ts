import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    await connect();

    let doctordetails = await DoctorDetails.find();
    // console.log("🧞‍♂️doctordetails --->", doctordetails);

    if (!doctordetails || doctordetails.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No doctor details found",
          doctordetails: [],
          count: 0,
        }),
        {
          status: 404,
          headers,
        }
      );
    }

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
