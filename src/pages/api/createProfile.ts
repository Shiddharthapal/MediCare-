import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from "@/model/userDetails";
import User from "@/model/user";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();
    console.log("🧞‍♂️body --->", body);
    const { formData, id } = body;
    const {
      name,
      fatherName,
      address,
      contactNumber,
      age,
      bloodGroup,
      dateOfBirth,
      weight,
      height,
      gender,
    } = formData;
    if (
      !name ||
      !address ||
      !bloodGroup ||
      !age ||
      !weight ||
      !contactNumber ||
      !dateOfBirth
    ) {
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            name: !name ? "Name is required" : null,
            address: !address ? "Address is required" : null,
            age: !age ? "Age is required" : null,
            gender: !gender ? "Gender is required" : null,
            weight: !weight ? "Weight is required" : null,
            bloodGroup: !bloodGroup ? "Bloodgroup is required" : null,
            dateOfBirth: !dateOfBirth ? "Birthday is required" : null,
            contactNumber: !contactNumber ? "Contact number is required" : null,
          },
        }),
        {
          status: 401,
          headers,
        }
      );
    }
    await connect();
    let userdetails = await UserDetails.findOne({ userId: id });
    let userdata = await User.findOne({ _id: id });
    //console.log("userId=>", id);
    if (!userdetails) {
      userdetails = new UserDetails({
        userId: id,
        email: userdata?.email,
        name,
        fatherName,
        address,
        dateOfBirth,
        contactNumber,
        age,
        gender,
        bloodGroup,
        weight,
        height,
      });

      await userdetails.save();
    } else {
      userdetails.name = name || userdetails.name;
      userdetails.email = userdata?.email || userdetails.email;
      userdetails.fatherName = fatherName || userdetails.fatherName;
      userdetails.address = address || userdetails.address;
      userdetails.dateOfBirth = dateOfBirth || userdetails.dateOfBirth;
      userdetails.contactNumber = contactNumber || userdetails.contactNumber;
      userdetails.age = age || userdetails.age;
      userdetails.gender = gender || userdetails.gender;
      userdetails.bloodGroup = bloodGroup || userdetails.bloodGroup;
      userdetails.weight = weight || userdetails.weight;
      userdetails.height = height || userdetails.height;

      await userdetails.save();
    }

    //console.log("=>", userdetails);
    return new Response(JSON.stringify({ userdetails }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't create profile.",
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
