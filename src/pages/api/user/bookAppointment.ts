import type { APIRoute } from "astro";
import { verifyToken } from "@/utils/token";
import connect from "@/lib/connection";
import BookAppoinments from "@/model/bookAppointment";
import userDetails from "@/model/userDetails";
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    console.log("🧞‍♂️body --->", body);
    const { formData, doctor, token } = body;
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

    console.log("🧞‍♂️tokenDetails --->", formData);
    await connect();
    const bookappoinmentsdetails = await userDetails.findOne({
      userId: doctor?.userId,
      "appoinments.patientId": doctor?.userId,
    });
    if (!bookappoinmentsdetails) {
      const bookAppoinmentsDetails = new BookAppoinments({
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
      });

      console.log("doctordetails=>", bookAppoinmentsDetails);

      await bookAppoinmentsDetails.save();
    } else {
      (bookappoinmentsdetails.patientName =
        patientName || bookappoinmentsdetails.patientName),
        (bookappoinmentsdetails.patientEmail =
          patientEmail || bookappoinmentsdetails.patientEmail),
        (bookappoinmentsdetails.patientPhone =
          patientPhone || bookappoinmentsdetails.patientPhone),
        (bookappoinmentsdetails.appointmentDate =
          appointmentDate || bookappoinmentsdetails.appointmentDate),
        (bookappoinmentsdetails.appointmentTime =
          appointmentTime || bookappoinmentsdetails.appointmentTime),
        (bookappoinmentsdetails.consultationTyp =
          consultationType || bookappoinmentsdetails.consultationTyp),
        (bookappoinmentsdetails.reasonForVisit =
          reasonForVisit || bookappoinmentsdetails.reasonForVisit),
        (bookappoinmentsdetails.symptoms =
          symptoms || bookappoinmentsdetails.symptoms),
        (bookappoinmentsdetails.previousVisit =
          previousVisit || bookappoinmentsdetails.previousVisit),
        (bookappoinmentsdetails.emergencyContac =
          emergencyContac || bookappoinmentsdetails.emergencyContac),
        (bookappoinmentsdetails.emergencyPhone =
          emergencyPhone || bookappoinmentsdetails.emergencyPhone),
        (bookappoinmentsdetails.paymentMethod =
          paymentMethod || bookappoinmentsdetails.paymentMethod),
        (bookappoinmentsdetails.specialRequests =
          specialRequests || bookappoinmentsdetails.specialRequests),
        await bookappoinmentsdetails.save();
    }

    return new Response(JSON.stringify({}), {
      status: 200,

      headers,
    });
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
