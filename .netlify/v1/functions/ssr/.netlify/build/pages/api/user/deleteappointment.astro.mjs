import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ request }) => {
  const headers = {
    "Content-type": "application/json"
  };
  try {
    let body = await request.json();
    const { appointmentId, userId } = body;
    await connect();
    let userdetails = await userDetails.findOne({ userId });
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
        $pull: { appointments: { _id: appointmentId } }
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
    userdetails = await userDetails.findOne({ userId });
    return new Response(JSON.stringify({ userdetails }), {
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
