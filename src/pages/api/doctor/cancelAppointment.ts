import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";
import adminStore from "@/model/adminStore";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    await connect();
    const { appointment, doctorId, patientId } = await request.json();

    if (!appointment || !doctorId || !patientId) {
      return new Response(
        JSON.stringify({
          message:
            "Missing required fields: appointment, doctorId, or patientId",
        }),
        { status: 400, headers }
      );
    }

    // Find the doctor and update the appointment status
    let doctordetails = await DoctorDetails.findOneAndUpdate(
      {
        userId: doctorId,
        "appointments.doctorpatinetId": appointment.doctorpatinetId,
      },
      {
        $set: {
          "appointments.$.status": "cancelled",
          "appointments.$.cancelledAt": new Date(),
          "appointments.$.cancelledBy": appointment.doctorName,
          "appointments.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    // Find the user and update the appointment status
    let userdetails = await userDetails.findOneAndUpdate(
      {
        userId: patientId,
        "appointments.doctorpatinetId": appointment.doctorpatinetId,
      },
      {
        $set: {
          "appointments.$.status": "cancelled",
          "appointments.$.cancelledAt": new Date(),
          "appointments.$.cancelledBy": appointment.doctorName,
          "appointments.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!doctordetails || !userdetails) {
      return new Response(
        JSON.stringify({
          message: "Appointment not found for doctor or patient",
        }),
        { status: 404, headers }
      );
    }

    //add the data when doctor cancel appointment
    await adminStore.updateMany(
      {}, // Empty filter = update all admin documents
      {
        $push: {
          cancelAppointment: {
            doctorpatinetId: appointment.doctorpatinetId,
            status: "cancelled",

            // Doctor information
            doctorUserId: appointment.doctorUserId,
            doctorName: appointment.doctorName,
            doctorSpecialist: appointment.doctorSpecialist,
            doctorGender: appointment.doctorGender || "",
            doctorEmail: appointment.doctorEmail || "",
            hospital: appointment.hospital || "",

            // Patient information
            patientId: appointment.patientId,
            patientName: appointment.patientName,
            patientEmail: appointment.patientEmail || "",
            patientPhone: appointment.patientPhone || "",
            patientGender: appointment.patientGender || "",
            patientAge: appointment.patientAge || null,
            patientAddress: appointment.patientAddress || "",
            patientBloodgroup: appointment.patientBloodgroup || "",
            patientBithofday: appointment.patientBithofday || null,

            // Appointment details (FIXED - these were all mapped to patientBithofday)
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            consultationType: appointment.consultationType || "",
            consultedType: appointment.consultedType || "",
            reasonForVisit: appointment.reasonForVisit || "",
            symptoms: appointment.symptoms || [],
            previousVisit: appointment.previousVisit || false,

            // Emergency contact
            emergencyContact: appointment.emergencyContact || "",
            emergencyPhone: appointment.emergencyPhone || "",

            // Payment and additional info
            paymentMethod: appointment.paymentMethod || "",
            specialRequests: appointment.specialRequests || "",
            prescription: appointment.prescription || null,

            // Timestamps
            cancelledAt: new Date(),
            cancelledBy: appointment.doctorName,
            updatedAt: new Date(),
            createdAt: appointment.createdAt || new Date(),
          },
        },
      }
    );

    return new Response(
      JSON.stringify({
        message: "Appointments cancel successfully",
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Can't cancel appointment. Error: ${error}`,
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
