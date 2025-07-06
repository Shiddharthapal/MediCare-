import connect from "@/lib/connection";
import DoctorDetails from "@/model/doctorDetails";
import userDetails from "@/model/userDetails";
import { verifyToken } from "@/utils/token";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    const { doctor, token } = body;
    const {
      name,
      specialist,
      hospital,
      fees,
      rating,
      experience,
      education,
      degree,
      about,
      image,
      availableSlots,
    } = doctor;
    if (
      !name ||
      !specialist ||
      !hospital ||
      !fees ||
      !experience ||
      !education ||
      !degree ||
      !about ||
      !availableSlots
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            name: !name ? "Name is required" : null,
            specialist: !specialist ? "Specialist is required" : null,
            hospital: !hospital ? "Hospital is required" : null,
            fees: !fees ? "Fees is required" : null,
            experience: !experience ? "Exprience is required" : null,
            education: !education ? "Education is required" : null,
            degree: !degree ? "Degree is required" : null,
            about: !about ? "About is required" : null,
            availableSlots: !availableSlots
              ? "AvailableSlots is required"
              : null,
          },
        }),
        {
          status: 401,
          headers,
        }
      );
    }

    const tokenDetails = await verifyToken(token);

    await connect();

    const doctordetails = await DoctorDetails.findOne({
      userId: tokenDetails?.userId,
    });

    if (!doctordetails.ok) {
      const doctorDetails = new DoctorDetails({
        userId: userDetails,
        name,
        specialist,
        hospital,
        fees,
        experience,
        education,
        degree,
        about,
        availableSlots,
      });
      doctorDetails.save();
    } else {
      (doctordetails.name = name || doctordetails.name),
        (doctordetails.specialist = specialist || doctordetails.specialist),
        (doctordetails.hospital = hospital || doctordetails.specialist),
        (doctordetails.fees = fees || doctordetails.fees),
        (doctordetails.experience = experience || doctordetails.experience),
        (doctordetails.education = education || doctordetails.education),
        (doctordetails.degree = degree || doctordetails.degree),
        (doctordetails.about = about || doctordetails.about),
        (doctordetails.availableSlots =
          availableSlots || doctordetails.availableSlots),
        doctordetails.save();
    }
    return new Response(JSON.stringify({}), {
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
