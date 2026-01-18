import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
import jwt from 'jsonwebtoken';
import { a as adminDetails } from '../../chunks/adminDetails_P3PTGn3q.mjs';
import mongoose from 'mongoose';
import { a as adminStore } from '../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../renderers.mjs';

const AdminSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => {
      const now = /* @__PURE__ */ new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka"
        })
      );
      return bdTime;
    }
  }
});
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    console.log("🧞‍♂️  body --->", body);
    const { email, adminId, name, password } = body;
    if (!adminId) {
      return new Response(
        JSON.stringify({
          message: "AdminId is required"
        }),
        {
          status: 401,
          headers
        }
      );
    }
    await connect();
    const adminExistence = await Admin.findOne({
      Id: adminId
    });
    if (!adminExistence) {
      const idofadmin = new Admin({
        Id: adminId
      });
      await idofadmin.save();
    }
    let token = null;
    const existingUser = await adminDetails.findOne({
      adminId
    });
    const existingUserdata = await adminStore.findOne({
      adminId
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
    if (existingUserdata) {
      return new Response(
        JSON.stringify({
          message: "User data already store"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    const admin = new adminDetails({
      email,
      name,
      adminId,
      role: "admin",
      password
    });
    admin.email = email;
    admin.password = password;
    await admin.save();
    const admindata = new adminStore({
      email,
      name,
      adminId
    });
    await admindata.save();
    token = jwt.sign(
      { IdOfAdmin: admin.adminId },
      undefined                           || "your_jwt_secret_here",
      { expiresIn: "24h" }
    );
    let _id = admin.adminId;
    return new Response(
      JSON.stringify({
        _id,
        admin: "admin",
        token,
        message: "Registration successful"
      }),
      {
        status: 200,
        headers
      }
    );
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
