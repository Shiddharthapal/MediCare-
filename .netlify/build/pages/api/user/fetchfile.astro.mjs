import { b as bunnyStorageService } from '../../../chunks/bunny-cdn_BCUfwnqr.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const fileType = url.searchParams.get("fileType");
    const appointmentId = url.searchParams.get("appointmentId");
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required"
        }),
        { status: 400, headers }
      );
    }
    let listPath = `${userId}/`;
    if (fileType) {
      listPath += `${fileType}/`;
      if (appointmentId) {
        listPath += `${appointmentId}/`;
      }
    }
    const files = await bunnyStorageService.listFiles(listPath);
    const fileList = files.filter((item) => !item.IsDirectory).map((item) => ({
      filename: item.ObjectName,
      path: item.Path,
      size: item.Length,
      lastModified: item.LastChanged,
      url: `https://${process.env.BUNNY_CDN_HOSTNAME}${item.Path}`
    }));
    return new Response(
      JSON.stringify({
        success: true,
        message: "Files retrieved successfully",
        data: {
          files: fileList,
          count: fileList.length
        }
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error listing files:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to retrieve files",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};
const DELETE = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const { filePath, userId } = await request.json();
    if (!userId || !filePath) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID and file path are required"
        }),
        { status: 400, headers }
      );
    }
    if (!filePath.startsWith(`${userId}/`)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized: You can only delete your own files"
        }),
        { status: 403, headers }
      );
    }
    await bunnyStorageService.deleteObject(filePath);
    return new Response(
      JSON.stringify({
        success: true,
        message: "File deleted successfully",
        data: {
          deletedPath: filePath
        }
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete file",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
