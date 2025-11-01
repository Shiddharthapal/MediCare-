import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    await connect();

    // Fetch doctors with pagination
    const doctordetails = await DoctorDetails.find();

    const userdetails = await userDetails.find();

    // Get total count for reference
    const totalCountOfDoctor = await DoctorDetails.countDocuments();
    const totalCountOfPatient = await userDetails.countDocuments();

    return new Response(
      JSON.stringify({
        doctordetails,
        totalCountOfDoctor,
        userdetails,
        totalCountOfPatient,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch doctors",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
