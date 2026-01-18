import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
import { d as doctorDetails } from '../../chunks/doctorDetails_CR6glRtk.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    await connect();
    const skip = (page - 1) * limit;
    const doctordetails = await doctorDetails.find().skip(skip).limit(limit).lean();
    const totalCount = await doctorDetails.countDocuments();
    return new Response(
      JSON.stringify({
        doctordetails,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasMore: skip + doctordetails.length < totalCount
        }
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
