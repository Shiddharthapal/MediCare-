import bcrypt from 'bcryptjs';
import '../../../chunks/doctor_B3KOilzw.mjs';
import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { a as adminDetails } from '../../../chunks/adminDetails_P3PTGn3q.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("🧞‍♂️  body --->", body);
    const { currentPassword, newPassword, id } = body;
    await connect();
    const admin = await adminDetails.findOne({ adminId: id });
    if (!admin) {
      return new Response(
        JSON.stringify({
          message: "User not found"
        }),
        { status: 404 }
      );
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Current password is incorrect"
        }),
        { status: 400 }
      );
    }
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await adminDetails.findOneAndUpdate(
      { adminId: id },
      {
        password: hashedNewPassword,
        passwordChangedAt: /* @__PURE__ */ new Date()
      }
    );
    return new Response(
      JSON.stringify({
        message: "Password updated successfully"
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal server error"
      }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
