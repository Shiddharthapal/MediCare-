import type { APIRoute } from "astro";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import crypto from "crypto";

// Allowed file types with their MIME types
const ALLOWED_FILE_TYPES: { [key: string]: string } = {
  // Images
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",

  // Documents
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
  "text/csv": ".csv",

  // Medical Reports (DICOM)
  "application/dicom": ".dcm",
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Helper function to generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = originalName.substring(originalName.lastIndexOf("."));
  const nameWithoutExt = originalName
    .substring(0, originalName.lastIndexOf("."))
    .replace(/[^a-zA-Z0-9]/g, "_");

  return `${nameWithoutExt}_${timestamp}_${randomString}${extension}`;
}

// Helper function to calculate SHA256 checksum
function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase();
}

// Helper function to validate file type
function isValidFileType(mimeType: string): boolean {
  return Object.keys(ALLOWED_FILE_TYPES).includes(mimeType);
}

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const fileType = url.searchParams.get("fileType"); // Optional filter
    const appointmentId = url.searchParams.get("appointmentId"); // Optional filter

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        { status: 400, headers }
      );
    }

    // Construct path to list
    let listPath = `${userId}/`;

    if (fileType) {
      listPath += `${fileType}/`;

      if (appointmentId) {
        listPath += `${appointmentId}/`;
      }
    }

    // List files from Bunny CDN
    const files = await bunnyStorageService.listFiles(listPath);

    // Filter only files (not directories) and format response
    const fileList = files
      .filter((item) => !item.IsDirectory)
      .map((item) => ({
        filename: item.ObjectName,
        path: item.Path,
        size: item.Length,
        lastModified: item.LastChanged,
        url: `https://${process.env.BUNNY_CDN_HOSTNAME}${item.Path}`,
      }));

    return new Response(
      JSON.stringify({
        success: true,
        message: "Files retrieved successfully",
        data: {
          files: fileList,
          count: fileList.length,
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error listing files:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to retrieve files",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};

//DELETE - delete file, document
export const DELETE: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const { filePath, userId } = await request.json();

    if (!userId || !filePath) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID and file path are required",
        }),
        { status: 400, headers }
      );
    }

    // Security check: ensure the path belongs to the user
    if (!filePath.startsWith(`${userId}/`)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized: You can only delete your own files",
        }),
        { status: 403, headers }
      );
    }

    // Delete from Bunny CDN
    await bunnyStorageService.deleteObject(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        message: "File deleted successfully",
        data: {
          deletedPath: filePath,
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error deleting file:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete file",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
