import bcrypt from 'bcryptjs';
import { D as Doctor } from '../../../chunks/doctor_B3KOilzw.mjs';
import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("🧞‍♂️  body --->", body);
    const { currentPassword, newPassword, id } = body;
    await connect();
    const user = await Doctor.findById({ _id: id });
    console.log("🧞‍♂️  user --->", user);
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "User not found"
        }),
        { status: 404 }
      );
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
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
    console.log("🧞‍♂️  hashedNewPassword --->", hashedNewPassword);
    await Doctor.findByIdAndUpdate(
      { _id: id },
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
