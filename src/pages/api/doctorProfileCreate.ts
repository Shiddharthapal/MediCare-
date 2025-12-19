import connect from "@/lib/connection";
import Doctor from "@/model/doctor";
import DoctorDetails from "@/model/doctorDetails";
import adminStore from "@/model/adminStore";
import type { APIRoute } from "astro";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AppointmentSlot {
  enabled: boolean;
  slots: TimeSlot[]; // Array of time slots
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_SLOT: AppointmentSlot = {
  enabled: false,
  slots: [],
};

const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    console.log("🧞‍♂️body --->", body);
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
      console.log("🧞‍♂️  slotsData --->", slotsData);

      // Normalize and validate each day's slot against schema expectations
      for (const dayName of DAY_ORDER) {
        const daySlot = (slotsData as any)?.[dayName] as
          | AppointmentSlot
          | undefined;

        const enabled = Boolean(daySlot?.enabled);
        const slots =
          daySlot?.slots?.length && Array.isArray(daySlot.slots)
            ? daySlot.slots
            : [{ startTime: "09:00", endTime: "17:00" }];

        // Validate each time slot
        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          const startTime = slot?.startTime;
          const endTime = slot?.endTime;

          if (!TIME_REGEX.test(startTime) || !TIME_REGEX.test(endTime)) {
            return new Response(
              JSON.stringify({
                message: "Invalid time format for appointment slots",
                details: {
                  day: dayName,
                  slotIndex: i,
                  startTime,
                  endTime,
                },
              }),
              { status: 400, headers }
            );
          }
        }
        // Clean slots to remove any _id fields
        const cleanedSlots = slots.map(({ startTime, endTime }) => ({
          startTime,
          endTime,
        }));

        // THIS is where it's stored
        availableSlotsMap.set(dayName, {
          enabled,
          slots: cleanedSlots,
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

      //add doctordetails to admin when create profile
      await adminStore.updateMany(
        {}, // Empty filter = update all admin documents
        {
          $push: {
            doctorDetails: {
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
            },
          },
        }
      );
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

      //add doctordetails to admin after edit
      await adminStore.updateMany(
        {}, // Empty filter = update all admin documents
        {
          $push: {
            doctorDetails: {
              userId: id,
              name: name ?? doctordetails.name,
              email: doctordata?.email,
              registrationNo:
                doctordata?.registrationNo ?? doctordetails.registrationNo,
              contact: contact ?? doctordetails.contact,
              specialist: specialist ?? doctordetails.specialist,
              specializations: specializations ?? doctordetails.specializations,
              hospital: hospital ?? doctordetails.hospital,
              gender: gender ?? doctordetails.gender,
              fees: fees ?? doctordetails.fees,
              experience: experience ?? doctordetails.experience,
              education: education ?? doctordetails.education,
              availableSlots:
                availableSlotsMap ?? doctordetails?.availableSlots,
              degree: degree ?? doctordetails.degree,
              language: language ?? doctordetails.language,
              about: about ?? doctordetails.about,
              consultationModes:
                consultationModes ?? doctordetails.consultationModes,
            },
          },
        }
      );
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
