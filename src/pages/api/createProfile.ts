import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from "@/model/userDetails";
import { verifyToken } from "@/utils/token";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const { updatedProfile, token } = await request.json();
    const {
      name,
      fatherName,
      address,
      contactNumber,
      age,
      bloodGroup,
      weight,
      height,
      lastTreatmentDate,
    } = updatedProfile;
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
    const tokenData = await verifyToken(token);
    let userId = tokenData.userId;
    console.log("🧞‍♂️tokenData --->", tokenData);
    const userdetails = await UserDetails.findOne({ userId: userId });
    console.log("userId=>", userId);
    if (!userdetails) {
      const userDetails = new UserDetails({
        userId: userId,
        name,
        fatherName,
        address,
        contactNumber,
        age,
        bloodGroup,
        weight,
        height,
        lastTreatmentDate,
      });
      console.log("user=>", userDetails);
      userDetails.save();
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
