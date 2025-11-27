// /api/change-password.js
import bcrypt from "bcryptjs";
import doctor from "@/model/doctor"; // Your user model
import connect from "@/lib/connection";
import type { APIRoute } from "astro";
import adminDetails from "@/model/adminDetails";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("🧞‍♂️  body --->", body);
    const { currentPassword, newPassword, id } = body;
    // Get from auth

    await connect();

    // Find user
    const admin = await adminDetails.findOne({ adminId: id });

    if (!admin) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    //console.log("🧞‍♂️  isCurrentPasswordValid --->", isCurrentPasswordValid);
    if (!isCurrentPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Current password is incorrect",
        }),
        { status: 400 }
      );
    }

    //here use the hash password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await adminDetails.findOneAndUpdate(
      { adminId: id },
      {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      }
    );

    return new Response(
      JSON.stringify({
        message: "Password updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
