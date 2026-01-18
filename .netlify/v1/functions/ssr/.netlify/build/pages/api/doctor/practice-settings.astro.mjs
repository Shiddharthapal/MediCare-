import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const { formData, id } = await request.json();
    if (!formData || !id) {
      return new Response(
        JSON.stringify({
          message: "Formdata & Userid required"
        }),
        {
          status: 401,
          headers
        }
      );
    }
    await connect();
    const doctor = await doctorDetails.find({ userId: id });
    if (!doctor) {
      return new Response(
        JSON.stringify({
          message: "Inavlid account!!!. Create an account"
        }),
        {
          status: 403,
          headers
        }
      );
    }
    const updatedDoctor = await doctorDetails.findOneAndUpdate(
      { userId: id },
      { $set: { practiceSettingData: formData } },
      { new: true, runValidators: true }
      // upsert: true,
    );
    if (!updatedDoctor) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found"
        }),
        { status: 404, headers }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Practice Data updated successfully",
        data: updatedDoctor
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error updating practice Data:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update practice data",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
