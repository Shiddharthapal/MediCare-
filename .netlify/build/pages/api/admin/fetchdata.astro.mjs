import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    await connect();
    const doctordetails = await doctorDetails.find();
    const userdetails = await userDetails.find();
    const totalCountOfDoctor = await doctorDetails.countDocuments();
    const totalCountOfPatient = await userDetails.countDocuments();
    return new Response(
      JSON.stringify({
        doctordetails,
        totalCountOfDoctor,
        userdetails,
        totalCountOfPatient
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch doctors",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
