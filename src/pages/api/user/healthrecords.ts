import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    // Parse request body
    const { formData, id } = await request.json();
    console.log("🧞‍♂️  formData --->", formData);

    // Validate required fields
    if (!formData) {
      return new Response(JSON.stringify({ error: "Form data is required" }), {
        status: 400,
        headers,
      });
    }

    // Validation rules
    if (!formData.weight) {
      return new Response(
        JSON.stringify({
          error: "Invalid weight value",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    if (!formData.heartRate) {
      return new Response(
        JSON.stringify({
          error: "Invalid weight value",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    if (!formData.temperature) {
      return new Response(
        JSON.stringify({
          error: "Invalid temperature value",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    //Connect with db
    await connect();

    // Update existing record
    const existingUser = await userDetails.findOne({
      userId: id,
    });

    if (!existingUser) {
      return new Response(
        JSON.stringify({
          error: "User not found",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    //Create new entries
    const newHealthRecoard = {
      weight: formData.weight,
      bloodPressure: formData.bloodPressure,
      heartRate: formData.heartRate,
      date: new Date().toISOString().split("T")[0],
      temperature: formData.temperature,
      notes: formData.notes,
      createdAt: new Date(),
    };

    //Update the api
    const updatedRecord = await userDetails.findByIdAndUpdate(
      existingUser._id,
      {
        $push: { healthRecord: newHealthRecoard },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return new Response(
      JSON.stringify({
        updatedRecord,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error in health records API:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};
