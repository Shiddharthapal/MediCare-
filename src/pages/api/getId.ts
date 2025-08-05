import { verifyToken } from "@/utils/token";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let body = await request.json();
    console.log("🧞‍♂️body --->", body);
    if (!body) {
      return new Response(
        JSON.stringify({
          message: "Can't fetch data",
        }),
        {
          status: 401,
          headers,
        }
      );
    }
    let tokenDetails = await verifyToken(body.token);
    console.log("🧞‍♂️tokenDetails --->", tokenDetails);
    let userId = tokenDetails?.userId;
    console.log("🧞‍♂️userId --->", userId);
    return new Response(
      JSON.stringify({
        userId,
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
