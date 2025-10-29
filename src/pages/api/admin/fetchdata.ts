import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    await connect();

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch doctors with pagination
    const doctordetails = await DoctorDetails.find()
      .skip(skip)
      .limit(limit)
      .lean();

    const userdetails = await userDetails.find().skip(skip).limit(limit).lean();

    // Get total count for reference
    const totalCountOfDoctor = await DoctorDetails.countDocuments();
    const totalCountOfPatient = await userDetails.countDocuments();

    return new Response(
      JSON.stringify({
        doctordetails,
        userdetails, // Added this line
        pagination: {
          currentPage: page,
          totalPagesOfDoctor: Math.ceil(totalCountOfDoctor / limit),
          totalpagesofPatient: Math.ceil(totalCountOfPatient / limit),
          totalCountOfDoctor,
          totalCountOfPatient, // Added this
          hasMoreDoctors: skip + doctordetails.length < totalCountOfDoctor,
          hasMorePatients: skip + userdetails.length < totalCountOfPatient, // Added this
        },
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
