import { b as bunnyStorageService } from '../../../chunks/bunny-cdn_BCUfwnqr.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import crypto from 'crypto';
import { d as doctorDetails } from '../../../chunks/doctorDetails_CR6glRtk.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const BUNNY_STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE_NAME || "side-effects";
const BUNNY_STORAGE_REGION_HOSTNAME = process.env.BUNNY_STORAGE_REGION_HOSTNAME || "storage.bunnycdn.com";
process.env.BUNNY_STORAGE_API_KEY || "9beb8922-fe4f-436f-8a74be6eea5e-a625-4332";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
function calculateChecksum(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase();
}
const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    let generateUniqueFilename = function(documentName, originalFilename) {
      const extension = originalFilename.split(".").pop()?.toLowerCase() || "";
      const cleanName = documentName.trim().replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
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
    console.log("🧞‍♂️  formData --->", formData);
    const userId = formData.get("userId");
    const patientId = formData.get("patientId");
    const category = formData.get("category") || "";
    const patientName = formData.get("patientName") || "";
    const files = formData.getAll("files");
    const appointmentId = formData.get("appointmentId");
    const doctorpatinetId = formData.get("doctorpatinetId");
    const useridwhup = formData.get("userIdWHUP");
    const documentNames = formData.getAll("documentNames");
    const originalNames = formData.getAll("originalNames");
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
    let userdetails = await userDetails.findOne({ userId: patientId });
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
    let doctordetails = await doctorDetails.findOne({ userId });
    if (!doctordetails) {
      return new Response(
        JSON.stringify({
          message: "Invalid doctor"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    const uploadedFiles = [];
    const uploadResults = [];
    const uploadedSingleFiles = [];
    const uploadSingleResults = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentName = documentNames[i];
      const originalName = originalNames[i];
      if (!file.type) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: `File type ${file.type} is not allowed`
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        uploadResults.push({
          filename: documentName,
          success: false,
          message: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        });
        continue;
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const checksum = calculateChecksum(buffer);
      const uniqueFilename = generateUniqueFilename(documentName, file.name);
      const fileCategory = getFileCategory(file.type);
      let destinationPath = `${userId}/${fileCategory}`;
      destinationPath += `/${uniqueFilename}`;
      try {
        let response = await bunnyStorageService.uploadFile(
          destinationPath,
          buffer,
          file.type,
          checksum
        );
        console.log("🧞‍♂️  response --->", response);
        const publicUrl = `https://${BUNNY_STORAGE_REGION_HOSTNAME}/${BUNNY_STORAGE_ZONE_NAME}/${destinationPath}`;
        const uploadfileforboth = {
          patientId,
          patientName: userdetails.name,
          doctorId: userId,
          filename: uniqueFilename,
          originalName,
          documentName,
          fileType: file.type,
          fileSize: file.size,
          path: destinationPath,
          url: publicUrl,
          checksum,
          uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
          doctorName: doctordetails.name,
          category,
          userIdWHUP: useridwhup,
          doctorpatinetId,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const uploadfileforsingle = {
          patientId: userId,
          filename: uniqueFilename,
          originalName,
          documentName,
          fileType: file.type,
          fileSize: file.size,
          path: destinationPath,
          url: publicUrl,
          checksum,
          uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
          doctorName: doctordetails.name,
          category,
          userIdWHUP: useridwhup,
          doctorpatinetId,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        uploadedFiles.push(uploadfileforboth);
        uploadResults.push({
          filename: documentName,
          success: true,
          url: publicUrl
        });
        uploadedSingleFiles.push(uploadfileforsingle);
        uploadSingleResults.push({
          filename: documentName,
          success: true,
          url: publicUrl
        });
      } catch (error) {
        console.error(`Error uploading file ${documentName}:`, error);
        uploadResults.push({
          filename: documentName,
          success: false,
          message: error instanceof Error ? error.message : "Upload failed"
        });
      }
    }
    if (uploadedFiles.length > 0) {
      await userDetails.findOneAndUpdate(
        { userId: patientId, "appointments.doctorpatinetId": doctorpatinetId },
        {
          $push: { "appointments.$.document": { $each: uploadedFiles } }
        },
        {
          new: true,
          runValidators: true
        }
      );
      await doctorDetails.findOneAndUpdate(
        { userId, "appointments.doctorpatinetId": doctorpatinetId },
        {
          $push: { "appointments.$.document": { $each: uploadedFiles } }
        },
        {
          new: true,
          runValidators: true
        }
      );
      await adminStore.updateOne(
        { "patientDetails.userId": patientId },
        {
          $push: {
            "patientDetails.$[patient].appointments.$[appointment].document": {
              $each: uploadedFiles
            }
          }
        },
        {
          arrayFilters: [
            { "patient.userId": patientId },
            // Match all patients with this ID
            { "appointment.doctorpatinetId": doctorpatinetId }
            // Match all patients with this ID
          ]
        }
      );
      await adminStore.updateOne(
        { "doctorDetails.userId": userId },
        {
          $push: {
            "doctorDetails.$[doctor].appointments.$[appointment].document": {
              $each: uploadedFiles
            }
          }
        },
        {
          arrayFilters: [
            { "doctor.userId": userId },
            // Match all patients with this ID
            { "appointment.doctorpatinetId": doctorpatinetId }
            // Match all patients with this ID
          ]
        }
      );
      await adminStore.updateMany(
        {},
        // Update all admin documents
        {
          $push: {
            upload: {
              $each: uploadedFiles
            }
          }
        }
      );
    }
    if (uploadedSingleFiles.length > 0) {
      await doctorDetails.findOneAndUpdate(
        { userId },
        {
          $push: { upload: { $each: uploadedSingleFiles } }
        },
        {
          new: true,
          runValidators: true
        }
      );
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
