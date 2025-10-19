// File: src/pages/api/user/upload.ts
import type { APIRoute } from "astro";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import userDetails from "@/model/userDetails";
import connect from "@/lib/connection";
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

//Get file type from file extension
function getFileTypeFromExtension(extension: string): string | null {
  // Normalize extension (ensure it starts with a dot)
  const normalizedExt = extension.startsWith(".")
    ? extension.toLowerCase()
    : `.${extension.toLowerCase()}`;

  // Find the MIME type that matches this extension
  for (const [mimeType, ext] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (ext === normalizedExt) {
      return mimeType;
    }
  }
  return null;
}

//Get file extension
function extractExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.substring(lastDot).toLowerCase();
}

//Get file type from file name
function getFileTypeFromFilename(filename: string): string | null {
  const extension = extractExtension(filename);
  if (!extension) return null;
  return getFileTypeFromExtension(extension);
}

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

//Post operation for upload file, document, report
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
    const file = formData.get("files") as File;
    const fileType = getFileTypeFromFilename(file.name);
    const category = formData.get("category") || "";
    const doctorName = formData.get("doctorName") || "";
    const files = formData.getAll("files") as File[];
    const appointmentId = formData.get("appointmentId") as string | null;
    const useridwhup = formData.get("userIdWHUP") as string;
    const documentNames = formData.getAll("documentNames") as string[];
    const originalNames = formData.getAll("originalNames") as string[];

    //Check some field from formData
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        { status: 400, headers }
      );
    }

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No files provided",
        }),
        { status: 400, headers }
      );
    }

    // Connect to DB
    await connect();

    //Check user are exsist in the db
    let userdetails = await userDetails.findOne({ userId: userId });
    if (!userdetails) {
      return new Response(
        JSON.stringify({
          message: "Invalid user",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    //Take temporary array for upload and store file, report, document
    const uploadedFiles = [];
    const uploadResults = [];

    //Not sure user upload single or multiple file, that's why use for loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = documentNames[i];
      const originalName = originalNames[i];

      // Validate file type
      const fileType = getFileTypeFromFilename(documentName);

      //Check fileType have or not
      if (!fileType) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: "Invalid file type",
        });
        continue;
      }

      //Check fileType is valid or not
      if (!isValidFileType(file.type)) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: `File type ${file.type} is not allowed`,
        });
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        });
        continue;
      }

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate checksum
      const checksum = calculateChecksum(buffer);

      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(documentName);

      // Construct destination path
      let destinationPath = `${userId}/${fileType}`;
      if (appointmentId) {
        destinationPath += `/${appointmentId}`;
      }
      destinationPath += `/${uniqueFilename}`;

      //Here use try-catch for unexpected error
      try {
        // Upload to Bunny CDN
        await bunnyStorageService.uploadFile(
          destinationPath,
          buffer,
          file.type,
          checksum
        );

        // Construct public URL
        const publicUrl = `https://${process.env.BUNNY_CDN_HOSTNAME}/${destinationPath}`;

        // Prepare upload data
        const uploadfile = {
          patientId: userId,
          filename: uniqueFilename,
          originalName: originalName,
          documentName: documentName,
          fileType: file.type,
          fileSize: file.size,
          path: destinationPath,
          url: publicUrl,
          checksum: checksum,
          uploadedAt: new Date().toISOString(),
          doctorName: doctorName,
          category: category,
          userIdWHUP: useridwhup,
          appointmentId: appointmentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        //Push the uploaddata to array for upload the data into db
        uploadedFiles.push(uploadfile);
        uploadResults.push({
          filename: documentName,
          success: true,
          url: publicUrl,
        });
      } catch (error) {
        console.error(`Error uploading file ${documentName}:`, error);
        uploadResults.push({
          filename: documentName,
          success: false,
          message: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    // Save all successfully uploaded files to DB
    if (uploadedFiles.length > 0) {
      await userDetails.findOneAndUpdate(
        { userId: userId },
        {
          $push: { upload: { $each: uploadedFiles } },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    //Return response
    return new Response(
      JSON.stringify({
        success: uploadResults.some((r) => r.success),
        message: `Uploaded ${uploadedFiles.length} of ${files.length} files successfully`,
        data: uploadResults,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error uploading files:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to upload files",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
