// File: src/pages/api/user/upload.ts
import type { APIRoute } from "astro";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import userDetails from "@/model/userDetails";
import connect from "@/lib/connection";
import crypto from "crypto";
import doctorDetails from "@/model/doctorDetails";

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
    const doctorId = formData.get("doctorId") as string;
    const category = formData.get("category") || "";
    const doctorName = formData.get("doctorName") || "";
    const files = formData.getAll("files") as File[];
    const appointmentId = formData.get("appointmentId") as string | null;
    const doctorpatinetId = formData.get("doctorpatinetId") as string | null;
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

    //Check doctor are exsist in the db
    let doctordetails = await doctorDetails.findOne({ userId: doctorId });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Invalid doctor",
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

    const uploadedSingleFiles = [];
    const uploadSingleResults = [];

    //Not sure user upload single or multiple file, that's why use for loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = documentNames[i];
      const originalName = originalNames[i];

      //Check fileType is valid or not
      if (!file.type) {
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
      let destinationPath = `${userId}/${file.type}`;
      if (doctorpatinetId) {
        destinationPath += `/${appointmentId}`;
      }
      destinationPath += `/${appointmentId}`;

      //Here use try-catch for unexpected error
      try {
        // Upload to Bunny CDN
        let response = await bunnyStorageService.uploadFile(
          destinationPath,
          buffer,
          file.type,
          checksum
        );
        console.log("🧞‍♂️  response --->", response);

        // Construct public URL
        const publicUrl = `https://${process.env.BUNNY_CDN_HOSTNAME}/${destinationPath}`;

        // Prepare upload data
        const uploadfileforboth = {
          patientId: userId,
          doctorId: doctorId,
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
          doctorpatinetId: doctorpatinetId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const uploadfileforsingle = {
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
          doctorpatinetId: doctorpatinetId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        //Push the uploaddata to array for upload the data into db
        uploadedFiles.push(uploadfileforboth);
        uploadResults.push({
          filename: documentName,
          success: true,
          url: publicUrl,
        });

        uploadedSingleFiles.push(uploadfileforsingle);
        uploadSingleResults.push({
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
        { userId: userId, doctorpatinetId: doctorpatinetId },
        {
          $push: { "appoinments.$.document": { $each: uploadedFiles } },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await doctorDetails.findOneAndUpdate(
        { userId: doctorId, doctorpatinetId: doctorpatinetId },
        {
          $push: { "appointments.$.document": { $each: uploadedFiles } },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (uploadedSingleFiles.length > 0) {
      await userDetails.findOneAndUpdate(
        { userId: userId },
        {
          $push: { upload: { $each: uploadedSingleFiles } },
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
