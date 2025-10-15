import connect from "@/lib/connection";
import Doctor from "@/model/doctor";
import DoctorDetails from "@/model/doctorDetails";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    // console.log("🧞‍♂️body --->", body);
    const { editedDoctor, id, formData } = body;
    console.log("🧞‍♂️  id --->", id);
    console.log("🧞‍♂️  formData --->", formData);
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

    let parsedSlots;
    if (formData) {
      try {
        if (formData.availableSlots) {
          parsedSlots = JSON.parse(formData.availableSlots);
          // If it's an array, take the first element
          parsedSlots = Array.isArray(parsedSlots)
            ? parsedSlots[0]
            : parsedSlots;
        } else {
          parsedSlots = availableSlots; // Use from editedDoctor instead
        }
      } catch (parseError) {
        console.error("Error parsing availableSlots:", parseError);
        parsedSlots = availableSlots; // Fallback to editedDoctor
      }
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
        availableSlots: parsedSlots,
        degree,
        language,
        about,
        payment: {
          acceptCreditCards: false,
          acceptDebitCards: false,
          acceptBkash: false,
          acceptNagad: false,
          acceptRocket: false,
        },
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
      doctordetails.availableSlots =
        parsedSlots ?? doctordetails.availableSlots;
      doctordetails.consultationModes =
        consultationModes ?? doctordetails.consultationModes;

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
