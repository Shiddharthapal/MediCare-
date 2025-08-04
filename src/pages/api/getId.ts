import { verifyToken } from "@/utils/token";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let body = await request.json();
    let tokenDetails = await verifyToken(body?.token);
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
