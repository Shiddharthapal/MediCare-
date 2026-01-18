import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import '../../../chunks/userDetails_BjvOpMvp.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    let { id, doctorpatinetId } = await request.json();
    await connect();
    let doctordetails = await doctorDetails.findOne({ userId: id });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Invalid user"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    if (!doctordetails?.appointments || doctordetails?.appointments.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No appointments found for this user"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    let appointmentDate = doctordetails?.appointments.find(
      (appointment) => appointment.doctorpatinetId === doctorpatinetId
    );
    return new Response(
      JSON.stringify({
        appointmentDate
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't fetch data",
        error: error instanceof Error ? error.message : "Token varification failed"
      }),
      {
        status: 400,
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
