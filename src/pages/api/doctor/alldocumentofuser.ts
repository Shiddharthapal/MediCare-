// File: src/pages/api/patient-documents.ts
import type { APIRoute } from "astro";

import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
interface VitalSign {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  bmi?: number;
}
interface Medication {
  id: string;
  medecineName: string;
  medecineDosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity: string;
  route?: string[];
  startDate?: Date;
  endDate?: Date;
}

interface Prescription {
  vitalSign: VitalSign;
  primaryDiagnosis: string;
  symptoms: string;
  testandReport: string;
  medication: Medication[];
  restrictions: string;
  followUpDate: string;
  additionalNote: string;
  prescriptionId: string;
  createdAt: Date;
}

interface FileUpload {
  _id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  path: string;
  url: string;
  checksum: string;
  uploadedAt: Date;
  doctorName?: string;
  category?: string;
  userIdWHUP?: string;
  appointmentId?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Parse request body
    const body = await request.json();
    const { doctorId, patientId } = body;

    // Validate input
    if (!doctorId || !patientId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "doctorId and patientId are required",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    // Connect to database
    await connect();

    // Step 1: Find user details by patientId
    const userdetails = await userDetails.findOne({ userId: patientId });

    if (!userDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Patient not found",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Step 2: Check if appointments exist
    if (!userdetails.appointments || userdetails.appointments.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No appointments found for this patient",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Step 3: Filter appointments by doctorId
    const doctorAppointments = userdetails.appointments.filter(
      (appointment) => appointment.doctorId === doctorId
    );

    if (doctorAppointments.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No appointments found with this doctor",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Step 4: Extract appointment IDs
    const result = doctorAppointments.map((appointment) => {
      // FIXED: Extract prescriptions from the current appointment, not from doctorAppointments array
      const prescriptions = appointment.prescription || [];

      // FIXED: Extract documents from the current appointment, not from doctorAppointments array
      const documents = appointment.document || [];

      return {
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        status: appointment.status,
        prescriptions: Array.isArray(prescriptions)
          ? prescriptions.map((p) => ({
              prescriptionId: p.prescriptionId || p._id,
              vitalSign: p.vitalSign,
              primaryDiagnosis: p.primaryDiagnosis,
              symptoms: p.symptoms,
              testandReport: p.testandReport,
              medication: p.medication,
              restrictions: p.restrictions,
              followUpDate: p.followUpDate,
              additionalNote: p.additionalNote,
              createdAt: p.createdAt,
            }))
          : [],
        documents: Array.isArray(documents)
          ? documents.map((d) => ({
              documentId: d._id,
              filename: d.filename,
              originalName: d.originalName,
              fileType: d.fileType,
              fileSize: d.fileSize,
              url: d.url,
              uploadedAt: d.uploadedAt,
              category: d.category,
            }))
          : [],
      };
    });

    // Step 8: Return organized data
    return new Response(
      JSON.stringify({
        success: true,
        message: "Patient documents retrieved successfully",
        data: {
          patientId,
          patientName: userDetails.name,
          doctorId,
          totalAppointments: doctorAppointments.length,
          appointments: result,
        },
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};
