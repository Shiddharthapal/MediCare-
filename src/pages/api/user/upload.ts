// File: src/pages/api/user/upload.ts
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

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Parse FormData
    const formData = await request.formData();
    console.log("🧞‍♂️  formData --->", formData);

    // Extract fields
    const userId = formData.get("userId") as string;
    const fileType = formData.get("fileType") as string; // 'report', 'document', 'image', 'file'
    const file = formData.get("file") as File;
    const appointmentId = formData.get("appointmentId") as string | null;

    // Validation
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        { status: 400, headers }
      );
    }

    if (!fileType) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "File type is required (report, document, image, or file)",
        }),
        { status: 400, headers }
      );
    }

    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No file provided",
        }),
        { status: 400, headers }
      );
    }

    // Validate file type
    if (!isValidFileType(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `File type ${file.type} is not allowed. Allowed types: images, PDFs, Word documents, Excel files, text files`,
        }),
        { status: 400, headers }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        }),
        { status: 400, headers }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate checksum for integrity
    const checksum = calculateChecksum(buffer);

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name);

    // Construct destination path based on file type
    // Structure: userId/fileType/appointmentId?/filename
    let destinationPath = `${userId}/${fileType}`;

    if (appointmentId) {
      destinationPath += `/${appointmentId}`;
    }

    destinationPath += `/${uniqueFilename}`;

    // Upload to Bunny CDN
    const uploadResponse = await bunnyStorageService.uploadFile(
      destinationPath,
      buffer,
      file.type,
      checksum
    );

    // Construct public URL for accessing the file
    const publicUrl = `https://${process.env.BUNNY_CDN_HOSTNAME}/${destinationPath}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        data: {
          filename: uniqueFilename,
          originalName: file.name,
          fileType: file.type,
          fileSize: file.size,
          path: destinationPath,
          url: publicUrl,
          checksum: checksum,
          uploadedAt: new Date().toISOString(),
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error uploading file:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to upload file",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
