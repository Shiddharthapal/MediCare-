import connect from "@/lib/connection";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let body = await request.json();
    console.log("🧞‍♂️body --->", body);

    let {
      patientId,
      patientName,
      patientEmail,
      patientPhone,
      patientGender,
      patinetAge,
      patientAddress,
      patientdateOfBirth,
      doctorName,
      doctorContact,
      doctorEmail,
      doctorGender,
      hospital,
      specialist,
      consultationType,
      consultedType,
      reasonForVisit,
      symptoms,
      paymentMethod,
      specialRequests,
      vitalSign,
      primaryDiagnosis,
      testandReport,
      medication,
      restrictions,
      followUpDate,
      additionalNote,
      date,
      licenseNumber,
    } = body;

    await connect();

    return new Response(JSON.stringify({}), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Prescription not created.",
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
