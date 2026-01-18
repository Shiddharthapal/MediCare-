import { b as bunnyStorageService } from '../../chunks/bunny-cdn_BCUfwnqr.mjs';
import { u as userDetails } from '../../chunks/userDetails_BjvOpMvp.mjs';
import '../../chunks/adminStore_C1mgR9-O.mjs';
import { c as connect } from '../../chunks/connection_lTvPKgE7.mjs';
export { renderers } from '../../renderers.mjs';

const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME || "side-effects";
const BUNNY_STORAGE_REGION_HOSTNAME = process.env.BUNNY_STORAGE_REGION_HOSTNAME || "storage.bunnycdn.com";
process.env.BUNNY_STORAGE_API_KEY || "9beb8922-fe4f-436f-8a74be6eea5e-a625-4332";
const GET = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    let generateUniqueFilename2 = function(documentName2, originalFilename) {
      const extension = originalFilename.split(".").pop()?.toLowerCase() || "";
      const cleanName = documentName2.trim().replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return `${cleanName}_${uniqueId}.${extension}`;
    }, getFileCategory = function(mimeType) {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("application/pdf")) return "pdf";
      if (mimeType.startsWith("application/msword") || mimeType.startsWith(
        "application/vnd.openxmlformats-officedocument.wordprocessingml"
      )) {
        return "document";
      }
      if (mimeType.startsWith("application/vnd.ms-excel") || mimeType.startsWith(
        "application/vnd.openxmlformats-officedocument.spreadsheetml"
      )) {
        return "spreadsheet";
      }
      return "other";
    };
    const formData = await request.formData();
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required"
        }),
        { status: 400, headers }
      );
    }
    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No files provided"
        }),
        { status: 400, headers }
      );
    }
    await connect();
    let userdetails = await userDetails.findOne({ userId });
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "Invalid user"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    let destinationPath = `${userId}/${fileCategory}`;
    destinationPath += `/${uniqueFilename}`;
    try {
      let response = await bunnyStorageService.downloadFile(
        destinationPath,
        buffer,
        file.type,
        checksum
      );
      const publicUrl = `https://${BUNNY_STORAGE_REGION_HOSTNAME}/${BUNNY_STORAGE_ZONE_NAME}/${destinationPath}`;
    } catch (error) {
      console.error(`Error uploading file ${documentName}:`, error);
      uploadResults.push({
        filename: documentName,
        success: false,
        message: error instanceof Error ? error.message : "Upload failed"
      });
    }
    return new Response(
      JSON.stringify({
        success: uploadResults.some((r) => r.success),
        message: `Uploaded ${uploadedFiles.length} of ${files.length} files successfully`,
        data: uploadResults
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to upload files",
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
