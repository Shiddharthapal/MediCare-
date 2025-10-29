import connect from "@/lib/connection";
import adminDetails from "@/model/adminDetails";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }: any) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    let { id } = params;
    await connect();

    //check and findout admin and details
    let admindetails = await adminDetails.findOne({ adminId: id });

    // return the details of admin
    return new Response(
      JSON.stringify({
        admindetails,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't fetch data",
        error:
          error instanceof Error ? error.message : "Token varification failed",
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
