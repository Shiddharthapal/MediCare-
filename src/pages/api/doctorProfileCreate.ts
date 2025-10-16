import connect from "@/lib/connection";
import Doctor from "@/model/doctor";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

interface AppointmentSlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    // console.log("🧞‍♂️body --->", body);
    const { editedDoctor, id, formData } = body;
    const {
      name,
      specialist,
      specializations,
      hospital,
      contact,
      gender,
      fees,
      experience,
      education,
      degree,
      language,
      about,
      consultationModes,
    } = editedDoctor;
    if (
      !name ||
      !specialist ||
      !specializations ||
      !hospital ||
      !contact ||
      !gender ||
      !fees ||
      !experience ||
      !education ||
      !degree ||
      !language ||
      !about ||
      !consultationModes
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            name: !name ? "Name is required" : null,
            specialist: !specialist ? "Specialist is required" : null,
            specializations: !specializations
              ? "Area of specializations is required"
              : null,
            hospital: !hospital ? "Hospital is required" : null,
            contact: !contact ? "Contact is required" : null,
            gender: !gender ? "Gender is required" : null,

            fees: !fees ? "Fees is required" : null,
            experience: !experience ? "Exprience is required" : null,
            education: !education ? "Education is required" : null,
            degree: !degree ? "Degree is required" : null,
            language: !language ? "Language is required" : null,
            about: !about ? "About is required" : null,
            consultationModes: !consultationModes
              ? "Consultation Modes is required"
              : null,
          },
        }),
        {
          status: 401,
          headers,
        }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({
          message: "Id required",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    if (!formData) {
      return new Response(
        JSON.stringify({
          message: "Formdata required",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    await connect();

    if (!formData || !formData.appointmentSlot) {
      return new Response(
        JSON.stringify({
          message: "Appointment slots data required",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    const doctordata = await Doctor.findOne({ _id: id });
    if (!doctordata) {
      return new Response(
        JSON.stringify({
          message: "Login required",
        }),
        {
          status: 404,
          headers,
        }
      );
    }

    // Process availableSlots
    const availableSlotsMap = new Map<string, AppointmentSlot>();

    if (formData.appointmentSlot) {
      // Handle both object and Map input
      const slotsData =
        formData.appointmentSlot instanceof Map
          ? Object.fromEntries(formData.appointmentSlot)
          : formData.appointmentSlot;

      // Validate and add each day's slot
      for (const [dayName, dayData] of Object.entries(slotsData)) {
        const slot = dayData as AppointmentSlot;

        // Validate time format

        availableSlotsMap.set(dayName, {
          enabled: slot.enabled,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
    }

    let doctordetails = await DoctorDetails.findOne({
      userId: id,
    });
    if (!doctordetails) {
      doctordetails = new DoctorDetails({
        userId: id,
        name,
        email: doctordata?.email,
        registrationNo: doctordata?.registrationNo,
        contact,
        specialist,
        specializations,
        hospital,
        gender,
        fees,
        experience,
        education,
        availableSlots:
          availableSlotsMap.size > 0 ? availableSlotsMap : undefined,
        degree,
        language,
        about,
        consultationModes,
      });

      await doctordetails.save();
    } else {
      doctordetails.name = name ?? doctordetails.name;
      doctordetails.email = doctordata?.email ?? doctordetails.email;
      doctordetails.registrationNo =
        doctordata?.registrationNo ?? doctordetails.registrationNo;
      doctordetails.contact = contact ?? doctordetails.contact;
      doctordetails.specialist = specialist ?? doctordetails.specialist;
      doctordetails.specializations =
        specializations ?? doctordetails.specializations;
      doctordetails.hospital = hospital ?? doctordetails.hospital;
      doctordetails.gender = gender ?? doctordetails.gender;
      doctordetails.fees = fees ?? doctordetails.fees;
      doctordetails.experience = experience ?? doctordetails.experience;
      doctordetails.education = education ?? doctordetails.education;
      doctordetails.degree = degree ?? doctordetails.degree;
      doctordetails.language = language ?? doctordetails.language;
      doctordetails.about = about ?? doctordetails.about;
      doctordetails.consultationModes =
        consultationModes ?? doctordetails.consultationModes;

      if (availableSlotsMap && availableSlotsMap.size > 0) {
        doctordetails.availableSlots = availableSlotsMap;
      }

      await doctordetails.save();
    }
    return new Response(JSON.stringify({ doctordetails }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't create profile ",
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
