import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const { formData, id } = await request.json();
    console.log("🧞‍♂️  formData --->", formData);
    if (!formData) {
      return new Response(JSON.stringify({ error: "Form data is required" }), {
        status: 400,
        headers
      });
    }
    if (!formData.weight) {
      return new Response(
        JSON.stringify({
          error: "Invalid weight value"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    if (!formData.heartRate) {
      return new Response(
        JSON.stringify({
          error: "Invalid weight value"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    if (!formData.temperature) {
      return new Response(
        JSON.stringify({
          error: "Invalid temperature value"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    await connect();
    const existingUser = await userDetails.findOne({
      userId: id
    });
    if (!existingUser) {
      return new Response(
        JSON.stringify({
          error: "User not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const newHealthRecoard = {
      weight: formData.weight,
      bloodPressure: formData.bloodPressure,
      heartRate: formData.heartRate,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      temperature: formData.temperature,
      notes: formData.notes,
      createdAt: /* @__PURE__ */ new Date()
    };
    const updatedRecord = await userDetails.findByIdAndUpdate(
      existingUser._id,
      {
        $push: { healthRecord: newHealthRecoard }
      },
      {
        new: true,
        runValidators: true
      }
    );
    await adminStore.updateOne(
      { "patientDetails.userId": existingUser?.userId },
      // Empty filter = update all admin documents
      {
        $push: {
          "patientDetails.$[patient].healthRecord": {
            weight: formData.weight,
            bloodPressure: formData.bloodPressure,
            heartRate: formData.heartRate,
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            temperature: formData.temperature,
            notes: formData.notes,
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      },
      {
        arrayFilters: [
          { "patient.userId": existingUser.userId }
          // Match all patients with this ID
        ]
      }
    );
    await adminStore.updateMany(
      {},
      // Empty filter = update all admin documents
      {
        $push: {
          healthRecord: {
            weight: formData.weight,
            bloodPressure: formData.bloodPressure,
            heartRate: formData.heartRate,
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            temperature: formData.temperature,
            notes: formData.notes,
            createdAt: /* @__PURE__ */ new Date()
          }
        }
      }
    );
    return new Response(
      JSON.stringify({
        updatedRecord
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Error in health records API:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error"
      }),
      {
        status: 500,
        headers
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
