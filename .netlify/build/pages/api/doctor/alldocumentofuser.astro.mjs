import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const { doctorId, patientId } = body;
    if (!doctorId || !patientId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "doctorId and patientId are required"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    await connect();
    const userdetails = await userDetails.findOne({ userId: patientId });
    if (!userDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Patient not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    if (!userdetails.appointments || userdetails.appointments.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No appointments found for this patient"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const doctorAppointments = userdetails.appointments.filter(
      (appointment) => appointment.doctorId === doctorId
    );
    if (doctorAppointments.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No appointments found with this doctor"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const result = doctorAppointments.map((appointment) => {
      const prescriptions = appointment.prescription || [];
      const documents = appointment.document || [];
      return {
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        status: appointment.status,
        prescriptions: Array.isArray(prescriptions) ? prescriptions.map((p) => ({
          prescriptionId: p.prescriptionId || p._id,
          vitalSign: p.vitalSign,
          primaryDiagnosis: p.primaryDiagnosis,
          symptoms: p.symptoms,
          testandReport: p.testandReport,
          medication: p.medication,
          restrictions: p.restrictions,
          followUpDate: p.followUpDate,
          additionalNote: p.additionalNote,
          createdAt: p.createdAt
        })) : [],
        documents: Array.isArray(documents) ? documents.map((d) => ({
          documentId: d._id,
          filename: d.filename,
          originalName: d.originalName,
          fileType: d.fileType,
          fileSize: d.fileSize,
          url: d.url,
          uploadedAt: d.uploadedAt,
          category: d.category
        })) : []
      };
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Patient documents retrieved successfully",
        data: {
          patientId,
          patientName: userDetails.name,
          doctorId,
          totalAppointments: doctorAppointments.length,
          appointments: result
        }
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message
      }),
      {
        status: 500,
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
