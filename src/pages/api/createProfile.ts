import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from "@/model/userDetails";
import { verifyToken } from "@/utils/token";

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
      weight,
      height,
    } = formData;
    if (!name || !address || !bloodGroup || !age || !weight || !contactNumber) {
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            name: !name ? "Name is required" : null,
            address: !address ? "Address is required" : null,
            age: !age ? "Age is required" : null,
            weight: !weight ? "Weight is required" : null,
            bloodGroup: !bloodGroup ? "Bloodgroup is required" : null,
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
    const userdetails = await UserDetails.findOne({ userId: id });
    console.log("userId=>", id);
    if (!userdetails) {
      const userDetails = new UserDetails({
        userId: id,
        name,
        fatherName,
        address,
        contactNumber,
        age,
        bloodGroup,
        weight,
        height,
      });
      //console.log("user=>", userDetails);
      userDetails.save();
    } else {
      userdetails.name = name || userdetails.name;
      userdetails.fatherName = fatherName || userdetails.fatherName;
      userdetails.address = address || userdetails.address;
      userdetails.contactNumber = contactNumber || userdetails.contactNumber;
      userdetails.age = age || userdetails.age;
      userdetails.bloodGroup = bloodGroup || userdetails.bloodGroup;
      userdetails.weight = weight || userdetails.weight;
      userdetails.height = height || userdetails.height;

      await userdetails.save();
    }

    return new Response(JSON.stringify({}), {
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
