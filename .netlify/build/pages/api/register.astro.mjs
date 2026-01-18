import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
import { u as user } from '../../chunks/user_DS_DMAEJ.mjs';
import jwt from 'jsonwebtoken';
import { D as Doctor } from '../../chunks/doctor_B3KOilzw.mjs';
import { a as adminStore } from '../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const { email, password, registrationNo } = body;
    await connect();
    let token = null;
    if (!registrationNo) {
      const existingUser = await user.findOne({
        email
      });
      if (existingUser) {
        return new Response(
          JSON.stringify({
            message: "User already register"
          }),
          {
            status: 400,
            headers
          }
        );
      }
      const users = new user({
        email,
        role: "user",
        password
      });
      users.email = email;
      users.password = password;
      await users.save();
      try {
        await adminStore.updateMany(
          {},
          // Empty filter = update all admin documents
          {
            $push: {
              patientRegister: {
                userId: users._id,
                email: users.email,
                role: "user",
                createdAt: users.createdAt || /* @__PURE__ */ new Date(),
                status: "active"
              }
            }
          }
        );
        console.log("User added to all admin stores");
      } catch (error) {
        console.error("Error updating admin stores:", error);
      }
      token = jwt.sign(
        { userId: users._id },
        undefined                           || "your_jwt_secret_here",
        { expiresIn: "24h" }
      );
      let _id = users._id;
      return new Response(
        JSON.stringify({
          _id,
          user: "user",
          token,
          message: "Registration successful"
        }),
        {
          status: 200,
          headers
        }
      );
    } else {
      const existingDoctor = await Doctor.findOne({
        email
      });
      if (existingDoctor) {
        return new Response(
          JSON.stringify({
            message: "Doctor already register"
          }),
          {
            status: 401,
            headers
          }
        );
      }
      const doctor = new Doctor({
        email,
        user: "doctor",
        password,
        registrationNo
      });
      await doctor.save();
      try {
        await adminStore.updateMany(
          {},
          // Empty filter = update all admin documents
          {
            $push: {
              doctorRegister: {
                userId: doctor._id,
                email: doctor.email,
                registrationNo: doctor.registrationNo,
                role: "doctor",
                createdAt: doctor.createdAt || /* @__PURE__ */ new Date(),
                status: "active"
              }
            }
          }
        );
        console.log("User added to all admin stores");
      } catch (error) {
        console.error("Error updating admin stores:", error);
      }
      token = jwt.sign(
        { userId: doctor._id },
        undefined                           || "your_jwt_secret_here",
        { expiresIn: "24h" }
      );
      let _id = doctor._id;
      return new Response(
        JSON.stringify({
          _id,
          user: "doctor",
          token,
          message: "Registration successful"
        }),
        {
          status: 200,
          headers
        }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "Internal server error";
    let statusCode = 500;
    if (error.name === "ValidationError") {
      statusCode = 400;
      const validationError = error;
      errorMessage = Object.values(validationError.errors)[0].message;
    }
    return new Response(
      JSON.stringify({
        message: errorMessage
      }),
      {
        status: statusCode,
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
