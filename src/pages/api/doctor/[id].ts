import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let { id } = params;
    await connect();
    let doctordetails = await DoctorDetails.findOne({ userId: id });
    console.log("🧞‍♂️doctordetails --->", doctordetails);

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
