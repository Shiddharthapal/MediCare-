import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import doctorDetails from "@/model/doctorDetails";
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    // console.log("🧞‍♂️body --->", body);
    const { formData, doctor, id } = body;
    const {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      consultationType,
      reasonForVisit,
      symptoms,
      previousVisit,
      emergencyContac,
      emergencyPhone,
      paymentMethod,
      specialRequests,
    } = formData;
    //console.log("🧞‍♂️formData --->", formData);

    if (
      !patientName ||
      !patientEmail ||
      !patientPhone ||
      !appointmentDate ||
      !appointmentTime ||
      !consultationType ||
      !symptoms ||
      !previousVisit ||
      !paymentMethod
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            patientName: !patientName ? "patient name is required" : null,
            patientEmail: !patientEmail ? "patient email is required" : null,
            patientPhone: !patientPhone ? "patient phone is required" : null,
            appointmentDate: !appointmentDate
              ? "Appointment date is required"
              : null,
            appointmentTime: !appointmentTime
              ? "Appointment time is required"
              : null,
            consultationTyp: !consultationType
              ? "Consultation Type is required"
              : null,
            symptoms: !symptoms ? "Symptoms is required" : null,
            previousVisit: !previousVisit ? "Previous visit is required" : null,
            paymentMethod: !paymentMethod
              ? "Payment method Modes is required"
              : null,
          },
        }),
        {
          status: 401,
          headers,
        }
      );
    }

    await connect();
    const userdetails = await userDetails.findOne({
      userId: id,
    });

    //console.log("🧞‍♂️userdetails --->", userdetails);

    if (userdetails) {
      const newbookAppoinmentsDetails = {
        patientName,
        patientEmail,
        patientPhone,
        appointmentDate,
        appointmentTime,
        consultationType,
        reasonForVisit,
        symptoms,
        previousVisit,
        emergencyContac,
        emergencyPhone,
        paymentMethod,
        specialRequests,
      };
      //console.log("newbookAppoinmentsDetails --->", newbookAppoinmentsDetails);

      const updatedUser = await userDetails.findByIdAndUpdate(
        userdetails._id,
        {
          $push: { appointments: newbookAppoinmentsDetails },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      const newbookAppoinmentsDataforDoctor = {
        patientId: userdetails._id,
        patientName,
        patientEmail,
        patientPhone,
        appointmentDate,
        appointmentTime,
        consultationType,
        reasonForVisit,
        symptoms,
        previousVisit,
        emergencyContac,
        emergencyPhone,
        paymentMethod,
        specialRequests,
      };
      const updateDoctor = await doctorDetails.findByIdAndUpdate(
        doctor.userId,
        {
          $push: { appointments: newbookAppoinmentsDataforDoctor },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return new Response(JSON.stringify({ userdetails }), {
        status: 200,
        headers,
      });
    } else {
      return new Response(
        JSON.stringify({
          message: "Your profile is not created.",
        }),
        {
          status: 403,
          headers,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't create book appoinment  ",

        error:
          error instanceof Error ? error.message : "Token verification failed",
      }),

      {
        status: 400,

        headers,
      }
    );
  }
};
