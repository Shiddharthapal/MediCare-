// File: src/pages/api/user/upload.ts
import type { APIRoute } from "astro";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import userDetails from "@/model/userDetails";
import adminStore from "@/model/adminStore";
import connect from "@/lib/connection";
import crypto from "crypto";
import doctorDetails from "@/model/doctorDetails";

const BUNNY_STORAGE_ZONE_NAME =
  process.env.BUNNY_STORAGE_ZONE_NAME || "side-effects";
const BUNNY_STORAGE_REGION_HOSTNAME =
  process.env.BUNNY_STORAGE_REGION_HOSTNAME || "storage.bunnycdn.com";
const BUNNY_STORAGE_API_KEY =
  process.env.BUNNY_STORAGE_API_KEY ||
  "9beb8922-fe4f-436f-8a74be6eea5e-a625-4332";
// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Helper function to calculate SHA256 checksum
function calculateChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase();
}

// Helper function to validate file type
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
    let doctordetails = await doctorDetails.findOne({ userId: userId });
    if (!doctordetails) {
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

    function generateUniqueFilename(
      documentName: string,
      originalFilename: string
    ): string {
      // Get file extension from original filename
      const extension = originalFilename.split(".").pop()?.toLowerCase() || "";

      // Clean the document name
      const cleanName = documentName
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .substring(0, 50);

      // Generate unique ID
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Combine: documentName_uniqueId.extension
      return `${cleanName}_${uniqueId}.${extension}`;
    }

    function getFileCategory(mimeType: string): string {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("application/pdf")) return "pdf";
      if (
        mimeType.startsWith("application/msword") ||
        mimeType.startsWith(
          "application/vnd.openxmlformats-officedocument.wordprocessingml"
        )
      ) {
        return "document";
      }
      if (
        mimeType.startsWith("application/vnd.ms-excel") ||
        mimeType.startsWith(
          "application/vnd.openxmlformats-officedocument.spreadsheetml"
        )
      ) {
        return "spreadsheet";
      }
      return "other";
    }

    //Take temporary array for upload and store file, report, document
    const uploadedFiles = [];
    const uploadResults = [];

    //Not sure user upload single or multiple file, that's why use for loop
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = documentNames[i];
      const originalName = originalNames[i];

      //Check fileType have or not
      if (!file.type) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: "Invalid file type",
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
      const uniqueFilename = generateUniqueFilename(documentName, file.name);
      const fileCategory = getFileCategory(file.type);

      // Construct destination path
      let destinationPath = `${userId}/${fileCategory}`;

      //unique file name add the extension of the file
      destinationPath += `/${uniqueFilename}`;
      console.log("🧞‍♂️  destinationPath --->", destinationPath);

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
        const publicUrl = `https://${BUNNY_STORAGE_REGION_HOSTNAME}/${BUNNY_STORAGE_ZONE_NAME}/${destinationPath}`;
        console.log("🧞‍♂️  publicUrl --->", publicUrl);

        // Prepare upload data
        const uploadfile = {
          doctorId: userId,
          doctorName: doctordetails.name,
          filename: uniqueFilename,
          originalName: originalName,
          documentName: documentName,
          fileType: file.type,
          fileSize: file.size,
          path: destinationPath,
          url: publicUrl,
          checksum: checksum,
          uploadedAt: new Date().toISOString(),
          category: category,
          userIdWHUP: useridwhup,
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
      await doctorDetails.findOneAndUpdate(
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
    const documentReferences = uploadedFiles.map((file) => ({
      // You might need to generate ObjectId
      doctorId: userId,
      doctorName: doctordetails.name,
      filename: file.filename,
      url: file.url,
      fileType: file.fileType,
      uploadedAt: file.uploadedAt,
      originalName: file.originalName,
      documentName: file.documentName,
      fileSize: file.fileSize,
      path: file.path,
      checksum: file.checksum,
      category: category,
      userIdWHUP: useridwhup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Update the specific reschedule appointment with document references
    await adminStore.updateOne(
      { "doctorDetails.userId": userId },
      {
        $push: {
          "doctorDetails.$[doctor].upload": {
            $each: documentReferences,
          },
        },
      },
      {
        arrayFilters: [
          { "doctor.userId": userId }, // Match all patients with this ID
        ],
      }
    );

    await adminStore.updateMany(
      {}, // Update all admin documents
      {
        $push: {
          upload: {
            $each: uploadedFiles,
          },
        },
      }
    );

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
