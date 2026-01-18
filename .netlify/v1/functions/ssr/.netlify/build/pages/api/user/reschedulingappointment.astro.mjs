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
    const body = await request.json();
    const { formData, id } = body;
    const {
      doctorpatinetId,
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
      doctorUserId,
      patientEmail,
      patientName,
      patientPhone,
      status
    } = formData;
    if (!appointmentDate || !appointmentTime || !consultationType || !consultedType || !reasonForVisit) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          details: {
            appointmentDate: !appointmentDate ? "Appointment date is required" : null,
            appointmentTime: !appointmentTime ? "Appointment time is required" : null,
            consultationType: !consultationType ? "Consultation type is required" : null,
            consultedType: !consultedType ? "Consulted type is required" : null,
            reasonForVisit: !reasonForVisit ? "Reason for visit is required" : null
          }
        }),
        {
          status: 400,
          headers
        }
      );
    }
    await connect();
    const userdetails = await userDetails.findOne({ userId: id });
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "User not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const userAppointment = await userdetails.appointments.find(
      (apt) => apt.doctorpatinetId === doctorpatinetId
    );
    if (!userAppointment) {
      return new Response(
        JSON.stringify({
          message: "Appointment not found in user records"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const updatedAppointmentForUser = {
      doctorpatinetId: userAppointment?.doctorpatinetId,
      doctorUserId: userAppointment?.doctorUserId,
      doctorName: userAppointment?.doctorName,
      doctorSpecialist: userAppointment?.doctorSpecialist,
      doctorGender: userAppointment?.doctorGender,
      doctorEmail: userAppointment?.doctorEmail,
      hospital: userAppointment?.hospital,
      patientName: userAppointment?.patientName,
      patientEmail: userAppointment?.patientEmail,
      patientPhone: userAppointment?.patientPhone,
      // Updated fields
      appointmentDate,
      appointmentTime,
      consultationType,
      consultedType,
      reasonForVisit,
      symptoms: symptoms || userAppointment?.symptoms || "",
      previousVisit: previousVisit || userAppointment?.previousVisit || "",
      emergencyContact: emergencyContact || userAppointment?.emergencyContact || "",
      emergencyPhone: emergencyPhone || userAppointment?.emergencyPhone || "",
      paymentMethod: paymentMethod || userAppointment?.paymentMethod || "",
      specialRequests: specialRequests || userAppointment?.specialRequests || "",
      prescription: userAppointment?.prescription || {},
      createdAt: userAppointment?.createdAt,
      updatedAt: /* @__PURE__ */ new Date(),
      status: "pending"
    };
    const updatedUser = await userDetails.findOneAndUpdate(
      {
        userId: id,
        "appointments.doctorpatinetId": doctorpatinetId
      },
      {
        $set: {
          "appointments.$": updatedAppointmentForUser
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          message: "Failed to update user appointment"
        }),
        {
          status: 500,
          headers
        }
      );
    }
    const doctordetails = await doctorDetails.findOne({
      userId: doctorUserId
    });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const doctorAppointment = doctordetails.appointments.find(
      (apt) => apt.doctorpatinetId === doctorpatinetId
    );
    if (!doctorAppointment) {
      return new Response(
        JSON.stringify({
          message: "Appointment not found in doctor records"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const updatedAppointmentForDoctor = {
      doctorpatinetId: doctorAppointment.doctorpatinetId,
      doctorName: doctorAppointment.doctorName,
      doctorSpecialist: doctorAppointment.doctorSpecialist,
      doctorEmail: doctorAppointment.doctorEmail,
      patientId: doctorAppointment.patientId,
      patientName: doctorAppointment.patientName,
      patientEmail: doctorAppointment.patientEmail,
      patientPhone: doctorAppointment.patientPhone,
      patientGender: doctorAppointment.patientGender,
      patientAge: doctorAppointment.patientAge,
      patientAddress: doctorAppointment.patientAddress,
      patientBloodgroup: doctorAppointment.patientBloodgroup,
      patientBithofday: doctorAppointment.patientBithofday,
      // Updated fields
      appointmentDate,
      appointmentTime,
      consultationType,
      consultedType,
      reasonForVisit,
      symptoms: symptoms || doctorAppointment.symptoms || "",
      previousVisit: previousVisit || doctorAppointment.previousVisit || "",
      emergencyContact: emergencyContact || doctorAppointment.emergencyContact || "",
      emergencyPhone: emergencyPhone || doctorAppointment.emergencyPhone || "",
      paymentMethod: paymentMethod || doctorAppointment.paymentMethod || "",
      specialRequests: specialRequests || doctorAppointment.specialRequests || "",
      prescription: doctorAppointment.prescription || {},
      createdAt: doctorAppointment.createdAt,
      updatedAt: /* @__PURE__ */ new Date(),
      status: "pending"
    };
    const updatedDoctor = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorUserId,
        "appointments.doctorpatinetId": doctorpatinetId
      },
      {
        $set: {
          "appointments.$": updatedAppointmentForDoctor
        }
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updatedDoctor) {
      return new Response(
        JSON.stringify({
          message: "Failed to update doctor appointment"
        }),
        {
          status: 500,
          headers
        }
      );
    }
    await adminStore.updateMany(
      {},
      // Empty filter = update all admin documents
      {
        $push: {
          rescheduleAppointment: {
            doctorpatinetId: userAppointment.doctorpatinetId || doctorAppointment.doctorpatinetId,
            doctorUserId: doctordetails.userId,
            doctorName: doctorAppointment.doctorName,
            doctorSpecialist: doctorAppointment.doctorSpecialist,
            doctorGender: doctordetails.doctorGender,
            doctorEmail: doctordetails.doctorEmail,
            hospital: doctordetails.hospital,
            doctorContact: doctordetails?.contact,
            doctorRegistrationNo: doctordetails?.registrationNo,
            // Patient Information
            patientId: userAppointment.patientId,
            patientName: userAppointment.patientName,
            patientEmail: userAppointment.patientEmail,
            patientPhone: userAppointment.patientPhone,
            patientGender: userAppointment.patientGender,
            patientAge: userAppointment.patientAge,
            patientAddress: userAppointment.patientAddress,
            patientBloodgroup: userAppointment.patientBloodgroup,
            patientBithofday: userAppointment.patientBithofday,
            // Appointment Details
            appointmentDate,
            prevappointmentDate: userAppointment.appointmentDate,
            appointmentTime,
            prevappointmentTime: userAppointment.appointmentTime,
            status: userAppointment.status,
            consultationType,
            prevconsultationType: userAppointment.consultationType,
            consultedType,
            prevconsultedType: userAppointment.consultedType,
            reasonForVisit,
            prevreasonForVisit: userAppointment.reasonForVisit,
            symptoms,
            prevsymptoms: userAppointment.symptoms,
            previousVisit: userAppointment.previousVisit,
            // Emergency Contact
            emergencyContact,
            prevemergencyContact: userAppointment.emergencyContact,
            emergencyPhone,
            prevemergencyPhone: userAppointment.emergencyPhone,
            // Payment & Additional
            paymentMethod,
            prevpaymentMethod: userAppointment.paymentMethod,
            specialRequests,
            prevspecialRequests: userAppointment.specialRequests,
            // Timestamp
            prevcreatedAt: userAppointment.createdAt
          }
        }
      }
    );
    return new Response(
      JSON.stringify({
        success: true,
        message: "Appointment rescheduled successfully",
        appointment: updatedAppointmentForUser,
        updatedUser
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Failed to reschedule appointment",
        error: error instanceof Error ? error.message : "Unknown error occurred"
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
