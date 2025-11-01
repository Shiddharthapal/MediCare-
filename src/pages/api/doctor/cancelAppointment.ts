import connect from "@/lib/connection";
import User from "@/model/userDetails";
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

    // Find the doctor and update the appointment status
    let doctordetails = await DoctorDetails.findOneAndUpdate(
      { userId: doctorId, "appointments._id": appointment.doctorpatinetId },
      { $set: { "appointments.$.status": "cancelled" } }
    );

    // Find the user and update the appointment status
    let userdetails = await User.findOneAndUpdate(
      { _id: patientId, "appointments._id": appointment.doctorpatinetId },
      { $set: { "appointments.$.status": "cancelled" } }
    );

    //add the data when doctor cancel appointment
    await adminStore.updateMany(
      {}, // Empty filter = update all admin documents
      {
        $push: {
          cancelAppointment: {
            doctorpatinetId: appointment.doctorpatinetId,
            doctorUserId: appointment.doctorUserId,
            doctorName: appointment.doctorName,
            doctorSpecialist: appointment.doctorSpecialist,
            doctorGender: appointment.doctorGender,
            doctorEmail: appointment.doctorEmail,
            hospital: appointment.hospital,
            patientId: appointment.patientId,
            patientName: appointment.patientName,
            patientEmail: appointment.patientEmail,
            patientPhone: appointment.patientPhone,
            patientGender: appointment.patientGender,
            patientAge: appointment.patientAge,
            patientAddress: appointment.patientAddress,
            patientBloodgroup: appointment.patientBloodgroup,
            patientBithofday: appointment.patientBithofday,
            appointmentDate: appointment.patientBithofday,
            appointmentTime: appointment.patientBithofday,
            consultationType: appointment.patientBithofday,
            consultedType: appointment.patientBithofday,
            reasonForVisit: appointment.patientBithofday,
            symptoms: appointment.patientBithofday,
            previousVisit: appointment.patientBithofday,
            emergencyContact: appointment.patientBithofday,
            emergencyPhone: appointment.patientBithofday,
            paymentMethod: appointment.patientBithofday,
            specialRequests: appointment.patientBithofday,
            prescription: appointment.patientBithofday || {},
            createdAt: new Date(),
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
