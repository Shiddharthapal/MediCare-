import connect from "@/lib/connection";
import adminStore from "@/model/adminStore";
import doctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let { formData, id } = await request.json();
    if (!formData || !id) {
      return new Response(
        JSON.stringify({
          message: "Formdata & userId require",
        }),
        {
          status: 401,
          headers,
        }
      );
    }

    await connect();

    const doctordetails = await doctorDetails.find({ userId: id });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Profile not create",
        }),
        {
          status: 401,
          headers,
        }
      );
    }

    const updatePaymentMethod = await doctorDetails.findOneAndUpdate(
      { userId: id },
      { $set: { payment: formData } },
      { new: true, runValidators: true }
    );

    if (!updatePaymentMethod) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found",
        }),
        { status: 404, headers }
      );
    }

    const updateAdmin = await adminStore.updateOne(
      { "doctorDetails.userId": id }, // Find the document containing the doctor
      {
        $set: {
          "doctorDetails.$[doctor].payment": formData,
        },
      },
      {
        arrayFilters: [
          { "doctor.userId": id }, // Match the specific doctor in the array
        ],
      }
    );

    if (!updateAdmin) {
      return new Response(
        JSON.stringify({
          message: "Can't upload admin",
        }),
        { status: 404, headers }
      );
    }

    return new Response(JSON.stringify({ updatePaymentMethod }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Billing method not set successfully. Error: ${error}`,
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
