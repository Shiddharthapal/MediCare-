import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const { id, methodType, identifier } = await request.json();
    console.log("🧞‍♂️  identifier --->", identifier);
    console.log("🧞‍♂️  methodType --->", methodType);
    if (!id) {
      return new Response(
        JSON.stringify({
          message: "User ID is required"
        }),
        { status: 400, headers }
      );
    }
    if (!methodType || !identifier) {
      return new Response(
        JSON.stringify({
          message: "Method type and identifier are required"
        }),
        { status: 400, headers }
      );
    }
    if (!["card", "mobile-banking"].includes(methodType)) {
      return new Response(
        JSON.stringify({
          message: "Invalid payment method type"
        }),
        { status: 400, headers }
      );
    }
    await connect();
    const userExists = await userDetails.findOne({ userId: id });
    if (!userExists) {
      return new Response(
        JSON.stringify({
          message: "Invalid user"
        }),
        { status: 404, headers }
      );
    }
    const hasCardMethods = userExists.payment?.cardMethods?.length > 0;
    const hasMobileMethods = userExists.payment?.mobileBankingMethods?.length > 0;
    if (methodType === "card" && !hasCardMethods) {
      return new Response(
        JSON.stringify({
          message: "No card methods found for this user"
        }),
        { status: 404, headers }
      );
    }
    if (methodType === "mobile-banking" && !hasMobileMethods) {
      return new Response(
        JSON.stringify({
          message: "No mobile banking methods found for this user"
        }),
        { status: 404, headers }
      );
    }
    if (hasMobileMethods && hasCardMethods) {
      if (methodType === "card") {
        await userDetails.findOneAndUpdate(
          { userId: id },
          {
            $set: {
              "payment.cardMethods.$[].isPrimary": false,
              "payment.mobileBankingMethods.$[].isPrimary": false
            }
          }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[].isPrimary": false,
              "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary": false
            }
          },
          { arrayFilters: [{ "patient.userId": id }] }
        );
        await userDetails.findOneAndUpdate(
          { userId: id, "payment.cardMethods.cardNumber": identifier },
          { $set: { "payment.cardMethods.$.isPrimary": true } }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[card].isPrimary": true
            }
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "card.cardNumber": identifier }
            ]
          }
        );
      } else if (methodType === "mobile-banking") {
        await userDetails.findOneAndUpdate(
          { userId: id },
          {
            $set: {
              "payment.cardMethods.$[].isPrimary": false,
              "payment.mobileBankingMethods.$[].isPrimary": false
            }
          }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[].isPrimary": false,
              "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary": false
            }
          },
          { arrayFilters: [{ "patient.userId": id }] }
        );
        await userDetails.findOneAndUpdate(
          {
            userId: id,
            "payment.mobileBankingMethods.mobileNumber": identifier
          },
          { $set: { "payment.mobileBankingMethods.$.isPrimary": true } }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[mobile].isPrimary": true
            }
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "mobile.mobileNumber": identifier }
            ]
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
            "patientDetails.$[patient].payment.cardMethods.$[].isPrimary": false
          }
        },
        { arrayFilters: [{ "patient.userId": id }] }
      );
      if (methodType === "card") {
        await userDetails.findOneAndUpdate(
          { userId: id, "payment.cardMethods.cardNumber": identifier },
          { $set: { "payment.cardMethods.$.isPrimary": true } }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[card].isPrimary": true
            }
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "card.cardNumber": identifier }
            ]
          }
        );
      } else if (methodType === "mobile-banking") {
        await userDetails.findOneAndUpdate(
          {
            userId: id,
            "payment.mobileBankingMethods.mobileNumber": identifier
          },
          { $set: { "payment.mobileBankingMethods.$.isPrimary": true } }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[mobile].isPrimary": true
            }
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "mobile.mobileNumber": identifier }
            ]
          }
        );
      }
    } else if (hasMobileMethods) {
      await userDetails.findOneAndUpdate(
        { userId: id },
        { $set: { "payment.mobileBankingMethods.$[].isPrimary": false } }
      );
      await adminStore.updateOne(
        { "patientDetails.userId": id },
        {
          $set: {
            "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary": false
          }
        },
        { arrayFilters: [{ "patient.userId": id }] }
      );
      if (methodType === "card") {
        await userDetails.findOneAndUpdate(
          { userId: id, "payment.cardMethods.cardNumber": identifier },
          { $set: { "payment.cardMethods.$.isPrimary": true } }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.cardMethods.$[card].isPrimary": true
            }
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "card.cardNumber": identifier }
            ]
          }
        );
      } else if (methodType === "mobile-banking") {
        await userDetails.findOneAndUpdate(
          {
            userId: id,
            "payment.mobileBankingMethods.mobileNumber": identifier
          },
          { $set: { "payment.mobileBankingMethods.$.isPrimary": true } }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[mobile].isPrimary": true
            }
          },
          {
            arrayFilters: [
              { "patient.userId": id },
              { "mobile.mobileNumber": identifier }
            ]
          }
        );
      }
    }
    return new Response(
      JSON.stringify({
        message: "Primary payment method updated successfully"
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error setting primary payment method:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to set primary payment method",
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
