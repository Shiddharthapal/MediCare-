import connect from "@/lib/connection";
import Doctor from "@/model/doctor";
import DoctorDetails from "@/model/doctorDetails";
import { verifyToken } from "@/utils/token";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    console.log("🧞‍♂️body --->", body);
    const { editedDoctor, token } = body;
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
      availableSlots,
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
      !availableSlots ||
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
            availableSlots: !availableSlots
              ? "AvailableSlots is required"
              : null,
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

    console.log("🧞‍♂️tokenDetails --->", editedDoctor);
    const tokenDetails = await verifyToken(token);
    console.log("🧞‍♂️tokenDetails --->", tokenDetails);

    await connect();

    const doctordata = await Doctor.findOne({ _id: tokenDetails?.userId });
    const doctordetails = await DoctorDetails.findOne({
      userId: tokenDetails?.userId,
    });
    if (!doctordetails) {
      const doctordetails = new DoctorDetails({
        userId: tokenDetails?.userId,
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
        degree,
        language,
        about,
        availableSlots,
        consultationModes,
      });
      console.log("doctordetails=>", doctordetails);

      await doctordetails.save();
    } else {
      (doctordetails.name = name || doctordetails.name),
        (doctordetails.email = doctordata?.email || doctordetails.email),
        (doctordata.registrationNo =
          doctordata?.registrationNo || doctordetails.registrationNo),
        (doctordetails.contact = contact || doctordetails.contact),
        (doctordetails.specialist = specialist || doctordetails.specialist),
        (doctordetails.specializations =
          specializations || doctordetails.specializations),
        (doctordetails.hospital = hospital || doctordetails.hospital),
        (doctordetails.gender = gender || doctordetails.gender),
        (doctordetails.fees = fees || doctordetails.fees),
        (doctordetails.experience = experience || doctordetails.experience),
        (doctordetails.education = education || doctordetails.education),
        (doctordetails.degree = degree || doctordetails.degree),
        (doctordetails.language = language || doctordetails.language),
        (doctordetails.about = about || doctordetails.about),
        (doctordetails.availableSlots =
          availableSlots || doctordetails.availableSlots),
        (doctordetails.consultationModes =
          consultationModes || doctordetails.consultationModes),
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
