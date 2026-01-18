import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    await connect();
    const { appointment, doctorId, patientId } = await request.json();
    if (!appointment || !doctorId || !patientId) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields: appointment, doctorId, or patientId"
        }),
        { status: 400, headers }
      );
    }
    let doctordetails = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorId,
        "appointments.doctorpatinetId": appointment.doctorpatinetId
      },
      {
        $set: {
          "appointments.$.status": "cancelled",
          "appointments.$.cancelledAt": /* @__PURE__ */ new Date(),
          "appointments.$.cancelledBy": appointment.doctorName,
          "appointments.$.updatedAt": /* @__PURE__ */ new Date()
        }
      },
      { new: true }
    );
    let userdetails = await userDetails.findOneAndUpdate(
      {
        userId: patientId,
        "appointments.doctorpatinetId": appointment.doctorpatinetId
      },
      {
        $set: {
          "appointments.$.status": "cancelled",
          "appointments.$.cancelledAt": /* @__PURE__ */ new Date(),
          "appointments.$.cancelledBy": appointment.doctorName,
          "appointments.$.updatedAt": /* @__PURE__ */ new Date()
        }
      },
      { new: true }
    );
    if (!doctordetails || !userdetails) {
      return new Response(
        JSON.stringify({
          message: "Appointment not found for doctor or patient"
        }),
        { status: 404, headers }
      );
    }
    await adminStore.updateMany(
      {},
      // Empty filter = update all admin documents
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
            cancelledAt: /* @__PURE__ */ new Date(),
            cancelledBy: appointment.doctorName,
            updatedAt: /* @__PURE__ */ new Date(),
            createdAt: appointment.createdAt || /* @__PURE__ */ new Date()
          }
        }
      }
    );
    return new Response(
      JSON.stringify({
        message: "Appointments cancel successfully"
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Can't cancel appointment. Error: ${error}`
      }),
      {
        status: 400,
        headers
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
