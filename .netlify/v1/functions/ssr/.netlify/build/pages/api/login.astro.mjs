import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
import { u as user } from '../../chunks/user_DS_DMAEJ.mjs';
import jwt from 'jsonwebtoken';
import { D as Doctor } from '../../chunks/doctor_B3KOilzw.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, role } = body;
    await connect();
    if (role === "user") {
      const users = await user.findOne({
        email
      });
      if (!users) {
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
      const isPasswordValid = await users.comparePassword(password);
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
        userId: users._id
      };
      const token = jwt.sign(
        payload,
        undefined                           || undefined                                  || "your-secret-key",
        { expiresIn: "24h" }
      );
      return new Response(
        JSON.stringify({
          _id: users._id,
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
    } else {
      const doctor = await Doctor.findOne({
        email
      }).select("+password");
      if (!doctor) {
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
      const ispasswordValid = await doctor.comparePassword(password);
      if (!ispasswordValid) {
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
        userId: doctor._id
      };
      const token = jwt.sign(
        payload,
        undefined                           || "your-secret-key",
        { expiresIn: "24h" }
      );
      return new Response(
        JSON.stringify({
          _id: doctor._id,
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
    }
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
