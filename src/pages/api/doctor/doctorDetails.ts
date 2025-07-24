import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    await connect();
    let doctordetails = await DoctorDetails.find();
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Empty doctor details",
        }),
        {
          status: 200,
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
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Can't fetch doctor details",
        error:
          err instanceof Error ? err.message : "Can't fetch doctor details",
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
