import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
import jwt from 'jsonwebtoken';
import { a as adminDetails } from '../../chunks/adminDetails_P3PTGn3q.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { adminId, password } = body;
    await connect();
    const admin = await adminDetails.findOne({
      adminId
    });
    if (!admin) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Incorrect Passeord"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const payload = {
      userId: admin.adminId
    };
    const token = jwt.sign(
      payload,
      undefined                           || undefined                                  || "your-secret-key",
      { expiresIn: "24h" }
    );
    return new Response(
      JSON.stringify({
        _id: admin.adminId,
        token,
        message: "Login successful"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
