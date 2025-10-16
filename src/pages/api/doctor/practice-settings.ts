import type { APIRoute } from "astro";
import doctorDetails from "@/model/doctorDetails";
import connect from "@/lib/connection";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const { formData, id } = await request.json();
    //console.log("🧞‍♂️  formData --->", formData);

    if (!formData || !id) {
      return new Response(
        JSON.stringify({
          message: "Formdata & Userid required",
        }),
        {
          status: 401,
          headers,
        }
      );
    }

    //Connection
    await connect();

    const doctor = await doctorDetails.find({ userId: id });
    if (!doctor) {
      return new Response(
        JSON.stringify({
          message: "Inavlid account!!!. Create an account",
        }),
        {
          status: 403,
          headers,
        }
      );
    }

    // Update doctor's practice settings
    const updatedDoctor = await doctorDetails.findOneAndUpdate(
      { userId: id },
      { $set: { practiceSettingData: formData } },
      { new: true, runValidators: true }
      // upsert: true,
    );
    // console.log("🧞‍♂️  updatedDoctor --->", updatedDoctor);

    if (!updatedDoctor) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found",
        }),
        { status: 404, headers }
      );
    }

    // Return updated practice settings
    return new Response(
      JSON.stringify({
        message: "Practice Data updated successfully",
        data: updatedDoctor,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error updating practice Data:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update practice data",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
