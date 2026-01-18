import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import '../../../chunks/adminDetails_P3PTGn3q.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params, request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    let { id } = params;
    await connect();
    let adminstore = await adminStore.findOne({ adminId: id });
    return new Response(
      JSON.stringify({
        adminstore
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
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
