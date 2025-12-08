import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import adminStore from "@/model/adminStore";
import type { APIRoute } from "astro";

// UPDATE - Set primary payment method
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const { id, methodType, identifier } = await request.json();
    console.log("🧞‍♂️  identifier --->", identifier);
    console.log("🧞‍♂️  methodType --->", methodType);

    if (!id) {
      return new Response(
        JSON.stringify({
          message: "User ID is required",
        }),
        { status: 400, headers }
      );
    }

    if (!methodType || !identifier) {
      return new Response(
        JSON.stringify({
          message: "Method type and identifier are required",
        }),
        { status: 400, headers }
      );
    }

    if (!["card", "mobile-banking"].includes(methodType)) {
      return new Response(
        JSON.stringify({
          message: "Invalid payment method type",
        }),
        { status: 400, headers }
      );
    }

    await connect();

    // Check if user exists
    const userExists = await userDetails.findOne({ userId: id });

    if (!userExists) {
      return new Response(
        JSON.stringify({
          message: "Invalid user",
        }),
        { status: 404, headers }
      );
    }

    // Check which arrays exist
    const hasCardMethods = userExists.payment?.cardMethods?.length > 0;
    const hasMobileMethods =
      userExists.payment?.mobileBankingMethods?.length > 0;

    if (methodType === "card" && !hasCardMethods) {
      return new Response(
        JSON.stringify({
          message: "No card methods found for this user",
        }),
        { status: 404, headers }
      );
    }

    if (methodType === "mobile-banking" && !hasMobileMethods) {
      return new Response(
        JSON.stringify({
          message: "No mobile banking methods found for this user",
        }),
        { status: 404, headers }
      );
    }

    if (hasMobileMethods && hasCardMethods) {
      if (methodType === "card") {
        // Reset all payment methods to non-primary
        await userDetails.findOneAndUpdate(
          { userId: id },
          {
            $set: {
              "payment.cardMethods.$[].isPrimary": false,
              "payment.mobileBankingMethods.$[].isPrimary": false,
            },
          }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[].isPrimary":
                false,
              "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary":
                false,
            },
          },
          { arrayFilters: [{ "patient.userId": id }] }
        );

        // Set selected card as primary
        await userDetails.findOneAndUpdate(
          { userId: id, "payment.cardMethods.cardNumber": identifier },
          { $set: { "payment.cardMethods.$.isPrimary": true } }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[card].isPrimary":
                true,
            },
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "card.cardNumber": identifier },
            ],
          }
        );
      } else if (methodType === "mobile-banking") {
        // Reset all payment methods to non-primary
        await userDetails.findOneAndUpdate(
          { userId: id },
          {
            $set: {
              "payment.cardMethods.$[].isPrimary": false,
              "payment.mobileBankingMethods.$[].isPrimary": false,
            },
          }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[].isPrimary":
                false,
              "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary":
                false,
            },
          },
          { arrayFilters: [{ "patient.userId": id }] }
        );

        // Set selected mobile banking as primary
        await userDetails.findOneAndUpdate(
          {
            userId: id,
            "payment.mobileBankingMethods.mobileNumber": identifier,
          },
          { $set: { "payment.mobileBankingMethods.$.isPrimary": true } }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[mobile].isPrimary":
                true,
            },
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "mobile.mobileNumber": identifier },
            ],
          }
        );
      }
    } else if (hasCardMethods) {
      await userDetails.findOneAndUpdate(
        { userId: id },
        { $set: { "payment.cardMethods.$[].isPrimary": false } }
      );

      await adminStore.updateOne(
        { "patientDetails.userId": id },
        {
          $set: {
            "patientDetails.$[patient].payment.cardMethods.$[].isPrimary":
              false,
          },
        },
        { arrayFilters: [{ "patient.userId": id }] }
      );

      // Set the selected method as primary
      if (methodType === "card") {
        await userDetails.findOneAndUpdate(
          { userId: id, "payment.cardMethods.cardNumber": identifier },
          { $set: { "payment.cardMethods.$.isPrimary": true } }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[card].isPrimary":
                true,
            },
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "card.cardNumber": identifier },
            ],
          }
        );
      } else if (methodType === "mobile-banking") {
        await userDetails.findOneAndUpdate(
          {
            userId: id,
            "payment.mobileBankingMethods.mobileNumber": identifier,
          },
          { $set: { "payment.mobileBankingMethods.$.isPrimary": true } }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[mobile].isPrimary":
                true,
            },
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "mobile.mobileNumber": identifier },
            ],
          }
        );
      }
    } else if (hasMobileMethods) {
      // Reset existing mobile methods (only if they exist)
      await userDetails.findOneAndUpdate(
        { userId: id },
        { $set: { "payment.mobileBankingMethods.$[].isPrimary": false } }
      );

      await adminStore.updateOne(
        { "patientDetails.userId": id },
        {
          $set: {
            "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary":
              false,
          },
        },
        { arrayFilters: [{ "patient.userId": id }] }
      );

      // Set the selected method as primary
      if (methodType === "card") {
        await userDetails.findOneAndUpdate(
          { userId: id, "payment.cardMethods.cardNumber": identifier },
          { $set: { "payment.cardMethods.$.isPrimary": true } }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[card].isPrimary":
                true,
            },
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "card.cardNumber": identifier },
            ],
          }
        );
      } else if (methodType === "mobile-banking") {
        await userDetails.findOneAndUpdate(
          {
            userId: id,
            "payment.mobileBankingMethods.mobileNumber": identifier,
          },
          { $set: { "payment.mobileBankingMethods.$.isPrimary": true } }
        );

        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[mobile].isPrimary":
                true,
            },
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "mobile.mobileNumber": identifier },
            ],
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        message: "Primary payment method updated successfully",
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error setting primary payment method:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to set primary payment method",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
