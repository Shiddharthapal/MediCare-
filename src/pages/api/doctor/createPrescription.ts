import connect from "@/lib/connection";
import doctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";
import adminStore from "@/model/adminStore";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let body = await request.json();

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

    let userdetails = await userDetails.findOne({ userId: patientId });
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

    const createUserPrescription = await userDetails.findOneAndUpdate(
      {
        userId: patientId,
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
      patientName: userdetails.name,
      patientAge: userdetails.age,
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

    const createDoctorPrescription = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorId,
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

    const createprescription = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorId,
      },
      {
        $push: {
          prescription: newPrescriptionDoctor,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    //store the prescription deatils to adminStorage
    await adminStore.updateMany(
      {}, // Update all admin documents
      {
        $push: {
          prescription: {
            doctorpatinetId,
            patientId,
            patientName: userdetails.name,
            patientAge: userdetails.age,
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
          },
        },
      }
    );

    //add prescription data to doctorDetails of adminStore
    await adminStore.updateOne(
      { "doctorDetails.userId": doctorId },
      {
        $set: {
          "doctorDetails.$[doctor].appointments.$[appointment].prescription": {
            doctorpatinetId,
            patientId,
            doctorName,
            patientName: userdetails.name,
            patientAge: userdetails.age,
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
          },
        },
      },
      {
        arrayFilters: [
          { "doctor.userId": doctorId }, // Match all patients with this ID
          { "appointment.doctorpatinetId": doctorpatinetId }, // Match all patients with this ID
        ],
      }
    );

    //add prescription data to patientDetails of adminStore
    await adminStore.updateOne(
      { "patientDetails.userId": patientId },
      {
        $set: {
          "patientDetails.$[patient].appointments.$[appointment].prescription":
            {
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
            },
        },
      },
      {
        arrayFilters: [
          { "patient.userId": patientId }, // Match all patients with this ID
          { "appointment.doctorpatinetId": doctorpatinetId }, // Match all patients with this ID
        ],
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
