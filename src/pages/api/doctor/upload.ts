// File: src/pages/api/user/upload.ts
import type { APIRoute } from "astro";
import { bunnyStorageService } from "@/lib/bunny-cdn";
import userDetails from "@/model/userDetails";
import connect from "@/lib/connection";
import crypto from "crypto";
import doctorDetails from "@/model/doctorDetails";
import adminStore from "@/model/adminStore";

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
    const patientId = formData.get("patientId") as string;
    const category = formData.get("category") || "";
    const patientName = formData.get("patientName") || "";
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
    let userdetails = await userDetails.findOne({ userId: patientId });
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
    let doctordetails = await doctorDetails.findOne({ userId: userId });
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

    //create unique file
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

    //findout the file category
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
      const uniqueFilename = generateUniqueFilename(documentName, file.name);
      const fileCategory = getFileCategory(file.type);

      // Construct destination path
      let destinationPath = `${userId}/${fileCategory}`;

      //unique file name add the extension of the file
      destinationPath += `/${uniqueFilename}`;

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

        // Prepare upload data
        const uploadfileforboth = {
          patientId: patientId,
          patientName: userdetails.name,
          doctorId: userId,
          filename: uniqueFilename,
          originalName: originalName,
          documentName: documentName,
          fileType: file.type,
          fileSize: file.size,
          path: destinationPath,
          url: publicUrl,
          checksum: checksum,
          uploadedAt: new Date().toISOString(),
          doctorName: doctordetails.name,
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
          doctorName: doctordetails.name,
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
        { userId: patientId, "appointments.doctorpatinetId": doctorpatinetId },
        {
          $push: { "appointments.$.document": { $each: uploadedFiles } },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await doctorDetails.findOneAndUpdate(
        { userId: userId, "appointments.doctorpatinetId": doctorpatinetId },
        {
          $push: { "appointments.$.document": { $each: uploadedFiles } },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      //upload multiple document into patientdetails of adminStore
      await adminStore.updateOne(
        { "patientDetails.userId": patientId },
        {
          $push: {
            "patientDetails.$[patient].appointments.$[appointment].document": {
              $each: uploadedFiles,
            },
          },
        },
        {
          arrayFilters: [
            { "patient.userId": patientId }, // Match all patients with this ID
            { "appointment.doctorpatinetId": doctorpatinetId }, // Match all patients with this ID
          ],
        }
      );

      //upload multiple document into doctordetails of adminStore
      await adminStore.updateOne(
        { "doctorDetails.userId": userId },
        {
          $push: {
            "doctorDetails.$[doctor].appointments.$[appointment].document": {
              $each: uploadedFiles,
            },
          },
        },
        {
          arrayFilters: [
            { "doctor.userId": userId }, // Match all patients with this ID
            { "appointment.doctorpatinetId": doctorpatinetId }, // Match all patients with this ID
          ],
        }
      );

      //upload multiple document into adminStore upload interface
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
    }

    if (uploadedSingleFiles.length > 0) {
      await doctorDetails.findOneAndUpdate(
        { userId: userId },
        {
          $push: { upload: { $each: uploadedSingleFiles } },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // //upload single document into patientdetails of adminStore
      // await adminStore.updateOne(
      //   { "patientDetails.userId": userId },
      //   {
      //     $push: {
      //       "patientDetails.$[patient].appointments.$[appointment].document": {
      //         $each: uploadedSingleFiles,
      //       },
      //     },
      //   },
      //   {
      //     arrayFilters: [
      //       { "patient.userId": userId }, // Match all patients with this ID
      //       { "appointment.doctorpatinetId": doctorpatinetId }, // Match all patients with this ID
      //     ],
      //   }
      // );

      // //upload multiple document into doctordetails of adminStore
      // await adminStore.updateOne(
      //   { "doctorDetails.userId": doctorId },
      //   {
      //     $push: {
      //       "doctorDetails.$[doctor].appointments.$[appointment].document": {
      //         $each: uploadedSingleFiles,
      //       },
      //     },
      //   },
      //   {
      //     arrayFilters: [
      //       { "doctor.userId": doctorId }, // Match all patients with this ID
      //       { "appointment.doctorpatinetId": doctorpatinetId }, // Match all patients with this ID
      //     ],
      //   }
      // );

      // //upload single document into adminStore upload interface
      // await adminStore.updateMany(
      //   {}, // Update all admin documents
      //   {
      //     $push: {
      //       upload: {
      //         $each: uploadedSingleFiles,
      //       },
      //     },
      //   }
      // );
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
