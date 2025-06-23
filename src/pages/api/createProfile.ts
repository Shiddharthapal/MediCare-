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
    const {
      name,
      fatherName,
      address,
      contractNumber,
      age,
      bloodGroup,
      weight,
      height,
      lastTreatmentDate,
    } = body.updatedProfile;
    await connect();
    const tokenData = await verifyToken(body.token);
    console.log("🧞‍♂️tokenData --->", tokenData);
    const userdetails = await UserDetails.findOne(tokenData);
    console.log("🧞‍♂️userdetails --->", userdetails);

    console.log("name=>", name);
    if (
      !name ||
      !address ||
      !bloodGroup ||
      !age ||
      !weight ||
      !contractNumber
    ) {
      console.log("name=>", name);
      console.log("address=>", address);
      console.log("bloodGroup=>", bloodGroup);
      console.log("age=>", age);
      console.log("weight=>", weight);
      console.log("contractNumber=>", contractNumber);
      return new Response(
        JSON.stringify({
          message: "Missing field required",
          details: {
            name: !name ? "Name is required" : null,
            address: !address ? "Address is required" : null,
            age: !age ? "Age is required" : null,
            weight: !weight ? "Weight is required" : null,
            bloodGroup: !bloodGroup ? "Bloodgroup is required" : null,
            contractNumber: !contractNumber
              ? "Contact number is required"
              : null,
          },
        }),
        {
          status: 401,
          headers,
        }
      );
    }
    console.log("userId=>", tokenData.userId);
    if (!userdetails) {
      const userDetails = new UserDetails({
        userId: tokenData.userId,
        name,
        fatherName,
        address,
        contractNumber,
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
