import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ request }) => {
  const headers = {
    "Content-type": "application/json"
  };
  try {
    let body = await request.json();
    const { appointment } = body;
    const doctorpatinetId = appointment.doctorpatinetId;
    const doctorUserId = appointment.doctorUserId;
    const patientId = appointment.patientId;
    await connect();
    let userdetails = await userDetails.findOne({ userId: patientId });
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "User not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const updatedUser = await userDetails.findByIdAndUpdate(
      userdetails._id,
      {
        $pull: { appointments: { doctorpatinetId } }
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          message: "Failed to update user"
        }),
        {
          status: 500,
          headers
        }
      );
    }
    let doctordetails = await doctorDetails.findOne({ userId: doctorUserId });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Doctor not found"
        }),
        {
          status: 404,
          headers
        }
      );
    }
    const updatedDoctor = await doctorDetails.findByIdAndUpdate(
      doctordetails._id,
      {
        $pull: { appointments: { doctorpatinetId } }
      },
      {
        new: true,
        runValidators: true
      }
    );
    if (!updatedDoctor) {
      return new Response(
        JSON.stringify({
          message: "Failed to update doctor"
        }),
        {
          status: 500,
          headers
        }
      );
    }
    userdetails = await userDetails.findOne({ userId: patientId });
    doctordetails = await doctorDetails.findOne({ userId: doctorUserId });
    return new Response(JSON.stringify({ userdetails, doctordetails }), {
      status: 200,
      headers
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't create book appoinment  ",
        error: error instanceof Error ? error.message : "Token verification failed"
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
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
