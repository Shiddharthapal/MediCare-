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
    console.log("🧞‍♂️body --->", body);
    const { formData, doctor, id } = body;
    const {
      appointmentDate,
      appointmentTime,
      consultationType,
      consultedType,
      reasonForVisit,
      symptoms,
      previousVisit,
      emergencyContact,
      emergencyPhone,
      paymentMethod,
      specialRequests,
    } = formData;
    console.log("🧞‍♂️formData --->", formData);

    const {
      userId,
      name,
      specialist,
      specializations,
      hospital,
      fees,
      rating,
      experience,
      education,
      degree,
      language,
      about,
      availableSlots,
      Appointments,
      consultationModes,
    } = doctor;

    if (
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

    console.log("🧞‍♂️userdetails --->", userdetails);

    if (userdetails) {
      const newbookAppoinmentsDetails = {
        doctorUserId: doctor.userId,
        doctorName: name,
        doctorSpecialist: specialist,
        patientName: userdetails?.name,
        patientEmail: userdetails?.email || "",
        patientPhone: userdetails?.contactNumber,
        appointmentDate,
        appointmentTime,
        consultationType,
        consultedType,
        reasonForVisit,
        symptoms,
        previousVisit,
        emergencyContact,
        emergencyPhone,
        paymentMethod,
        specialRequests,
      };
      console.log("newbookAppoinmentsDetails --->", newbookAppoinmentsDetails);

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

      console.log("🧞‍♂️updatedDoctor --->", updatedUser);
      const doctordetails = await doctorDetails.findOne({ userId: userId });
      console.log("🧞‍♂️updatedDoctor --->", doctordetails);
      if (!doctordetails) {
        return new Response(
          JSON.stringify({
            message: "No doctor found",
          }),
          {
            status: 500,
            headers,
          }
        );
      }
      const newbookAppoinmentsDataforDoctor = {
        patientId: userdetails._id,
        patientName: userdetails.name,
        patientEmail: userdetails.email || "",
        patientPhone: userdetails.contactNumber,
        appointmentDate,
        appointmentTime,
        consultationType,
        consultedType,
        reasonForVisit,
        symptoms,
        previousVisit,
        emergencyContact,
        emergencyPhone,
        paymentMethod,
        specialRequests,
      };
      console.log(
        "🧞‍♂️newbookAppoinmentsDataforDoctor --->",
        newbookAppoinmentsDataforDoctor
      );
      const updateDoctor = await doctorDetails.findByIdAndUpdate(
        doctordetails._id,
        {
          $push: { appointments: newbookAppoinmentsDataforDoctor },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return new Response(JSON.stringify({ updatedUser }), {
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
