import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import { verifyToken } from "@/utils/token";

export const POST: APIRoute = async ({ request }) => {
  let body = await request.json();
  console.log("🧞‍♂️body --->", body);
  await connect();
  let tokenData = await verifyToken(body.token);
  let userdetails = await userDetails.findOne(tokenData);

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
