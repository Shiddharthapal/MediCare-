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
    console.log("🧞‍♂️  body --->", body);

    let { patientData, prescriptionData } = body;
    let { doctorpatinetId, patientId, doctorId, doctorName, reasonForVisit } =
      patientData;
    let {
      vitalSign,
      primaryDiagnosis,
      testandReport,
      medication,
      symptoms,
      restrictions,
      followUpDate,
      additionalNote,
      prescriptionId,
    } = prescriptionData;
    //console.log("🧞‍♂️prescriptionForm --->", prescriptionForm);
    await connect();

    let userdetails = await userDetails.findById({ _id: patientId });
    //console.log("🧞‍♂️userdetails --->", userdetails);
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
    userdetails.appointments.status = "completed";
    userdetails.save();
    const newPrescriptionPatient = {
      doctorpatinetId,
      patientId,
      doctorName,
      doctorId,
      vitalSign,
      reasonForVisit,
      primaryDiagnosis,
      testandReport,
      symptoms,
      medication,
      restrictions,
      followUpDate,
      additionalNote,
      prescriptionId,
      createdAt: new Date(),
    };
    //console.log("🧞‍♂️newPrescriptionPatient --->", newPrescriptionPatient);
    const createUserPrescription = await userDetails.findOneAndUpdate(
      {
        _id: userdetails._id,
        "appointments.doctorpatinetId": doctorpatinetId,
      },
      {
        $set: {
          "appointments.$.prescription": newPrescriptionPatient,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    let doctordetails = await doctorDetails.findOne({ userId: doctorId });
    //console.log("🧞‍♂️  doctordetails --->", doctordetails);

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
    doctordetails.appointments.status = "completed";
    doctordetails.save();

    const newPrescriptionDoctor = {
      doctorpatinetId,
      patientId,
      doctorName,
      doctorId,
      vitalSign,
      reasonForVisit,
      primaryDiagnosis,
      testandReport,
      medication,
      symptoms,
      restrictions,
      followUpDate,
      additionalNote,
      prescriptionId,
      createdAt: new Date(),
    };
    //console.log("🧞‍♂️newPrescriptionDoctor --->", newPrescriptionDoctor);

    const createDoctorPrescription = await doctorDetails.findOneAndUpdate(
      {
        _id: doctordetails._id,
        "appointments.doctorpatinetId": doctorpatinetId,
      },
      {
        $set: {
          "appointments.$.prescription": newPrescriptionDoctor,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // console.log("🧞‍♂️  createDoctorPrescription --->", createDoctorPrescription);

    return new Response(JSON.stringify({ createDoctorPrescription }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Prescription not created. Error: ${error}`,
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
