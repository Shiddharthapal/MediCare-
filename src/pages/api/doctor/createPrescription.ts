import connect from "@/lib/connection";
import doctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let body = await request.json();
    console.log("🧞‍♂️body --->", body);

    let { patientData, prescriptionForm } = body;
    let { patientId, doctorid } = patientData;
    let {
      vitalSign,
      primaryDiagnosis,
      testandReport,
      medication,
      restrictions,
      followUpDate,
      additionalNote,
    } = prescriptionForm;
    await connect();

    let userdetails = await userDetails.findById({ userId: patientId });
    if (!userdetails) {
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

    const newPrescriptionPatient = {
      vitalSign,
      primaryDiagnosis,
      testandReport,
      medication,
      restrictions,
      followUpDate,
      additionalNote,
      createdAt: new Date(),
    };
    const createUserPrescription = await userDetails.findByIdAndUpdate(
      userdetails._id,
      {
        $push: { "appointments.prescription": newPrescriptionPatient },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    let doctordetails = await doctorDetails.findById({ userId: doctorid });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Profile not create",
        }),
        {
          status: 402,
          headers,
        }
      );
    }
    const newPrescriptionDoctor = {
      vitalSign,
      primaryDiagnosis,
      testandReport,
      medication,
      restrictions,
      followUpDate,
      additionalNote,
      createdAt: new Date(),
    };

    const createDoctorPrescription = await doctorDetails.findByIdAndUpdate(
      doctordetails._id,
      {
        $push: { "appointments.prescription": newPrescriptionDoctor },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return new Response(JSON.stringify({ createDoctorPrescription }), {
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
