// src/pages/api/user/rescheduleAppointment.ts

import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import doctorDetails from "@/model/doctorDetails";
import adminStore from "@/model/adminStore";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();

    const { formData, id } = body;

    // Validate appointmentId (doctorpatinetId)

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
      status,
    } = formData;

    // Validate required fields
    if (
      !appointmentDate ||
      !appointmentTime ||
      !consultationType ||
      !consultedType ||
      !reasonForVisit
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields",
          details: {
            appointmentDate: !appointmentDate
              ? "Appointment date is required"
              : null,
            appointmentTime: !appointmentTime
              ? "Appointment time is required"
              : null,
            consultationType: !consultationType
              ? "Consultation type is required"
              : null,
            consultedType: !consultedType ? "Consulted type is required" : null,
            reasonForVisit: !reasonForVisit
              ? "Reason for visit is required"
              : null,
          },
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    await connect();

    // Find user details
    const userdetails = await userDetails.findOne({ userId: id });

    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Find the appointment in user's appointments array
    const userAppointment = await userdetails.appointments.find(
      (apt: any) => apt.doctorpatinetId === doctorpatinetId
    );

    if (!userAppointment) {
      return new Response(
        JSON.stringify({
          message: "Appointment not found in user records",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Prepare updated appointment data for user
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
      emergencyContact:
        emergencyContact || userAppointment?.emergencyContact || "",
      emergencyPhone: emergencyPhone || userAppointment?.emergencyPhone || "",
      paymentMethod: paymentMethod || userAppointment?.paymentMethod || "",
      specialRequests:
        specialRequests || userAppointment?.specialRequests || "",
      prescription: userAppointment?.prescription || {},
      createdAt: userAppointment?.createdAt,
      updatedAt: new Date(),
      status: "pending",
    };

    // Update user's appointment using MongoDB positional operator
    const updatedUser = await userDetails.findOneAndUpdate(
      {
        userId: id,
        "appointments.doctorpatinetId": doctorpatinetId,
      },
      {
        $set: {
          "appointments.$": updatedAppointmentForUser,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          message: "Failed to update user appointment",
        }),
        {
          status: 500,
          headers,
        }
      );
    }

    // Find doctor details
    const doctordetails = await doctorDetails.findOne({
      userId: doctorUserId,
    });

    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Find the appointment in doctor's appointments array
    const doctorAppointment = doctordetails.appointments.find(
      (apt: any) => apt.doctorpatinetId === doctorpatinetId
    );

    if (!doctorAppointment) {
      return new Response(
        JSON.stringify({
          message: "Appointment not found in doctor records",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Prepare updated appointment data for doctor
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
      emergencyContact:
        emergencyContact || doctorAppointment.emergencyContact || "",
      emergencyPhone: emergencyPhone || doctorAppointment.emergencyPhone || "",
      paymentMethod: paymentMethod || doctorAppointment.paymentMethod || "",
      specialRequests:
        specialRequests || doctorAppointment.specialRequests || "",
      prescription: doctorAppointment.prescription || {},
      createdAt: doctorAppointment.createdAt,
      updatedAt: new Date(),
      status: "pending",
    };

    // Update doctor's appointment using MongoDB positional operator
    const updatedDoctor = await doctorDetails.findOneAndUpdate(
      {
        userId: doctorUserId,
        "appointments.doctorpatinetId": doctorpatinetId,
      },
      {
        $set: {
          "appointments.$": updatedAppointmentForDoctor,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return new Response(
        JSON.stringify({
          message: "Failed to update doctor appointment",
        }),
        {
          status: 500,
          headers,
        }
      );
    }

    await adminStore.updateMany(
      {}, // Empty filter = update all admin documents
      {
        $push: {
          rescheduleAppointment: {
            doctorpatinetId:
              userAppointment.doctorpatinetId ||
              doctorAppointment.doctorpatinetId,
            doctorUserId: doctordetails.userId,
            doctorName: doctorAppointment.doctorName,
            doctorSpecialist: doctorAppointment.doctorSpecialist,
            doctorGender: doctordetails.doctorGender,
            doctorEmail: doctordetails.doctorEmail,
            hospital: doctordetails.hospital,

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
            appointmentDate: appointmentDate,
            prevappointmentDate: userAppointment.appointmentDate,
            appointmentTime: appointmentTime,
            prevappointmentTime: userAppointment.appointmentTime,
            status: userAppointment.status,
            consultationType: consultationType,
            prevconsultationType: userAppointment.consultationType,
            consultedType: consultedType,
            prevconsultedType: userAppointment.consultedType,
            reasonForVisit: reasonForVisit,
            prevreasonForVisit: userAppointment.reasonForVisit,
            symptoms: symptoms,
            prevsymptoms: userAppointment.symptoms,
            previousVisit: userAppointment.previousVisit,

            // Emergency Contact
            emergencyContact: emergencyContact,
            prevemergencyContact: userAppointment.emergencyContact,
            emergencyPhone: emergencyPhone,
            prevemergencyPhone: userAppointment.emergencyPhone,

            // Payment & Additional
            paymentMethod: paymentMethod,
            prevpaymentMethod: userAppointment.paymentMethod,
            specialRequests: specialRequests,
            prevspecialRequests: userAppointment.specialRequests,

            // Timestamp
            prevcreatedAt: userAppointment.createdAt,
            createdAt: Date,
          },
        },
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Appointment rescheduled successfully",
        appointment: updatedAppointmentForUser,
        updatedUser,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Failed to reschedule appointment",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};
