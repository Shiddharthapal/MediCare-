import { c as connect } from '../../../chunks/connection_lTvPKgE7.mjs';
import { u as userDetails } from '../../../chunks/userDetails_BjvOpMvp.mjs';
import { a as adminStore } from '../../../chunks/adminStore_C1mgR9-O.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const { paymentData, id } = await request.json();
    if (!id) {
      return new Response(
        JSON.stringify({
          message: "User ID is required"
        }),
        { status: 400, headers }
      );
    }
    if (!paymentData || !paymentData.methodType) {
      return new Response(
        JSON.stringify({
          message: "Payment data and method type are required"
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
    let updateQuery = {};
    if (paymentData.methodType === "card") {
      const cardMethod = {
        cardholderName: paymentData.cardholderName,
        type: paymentData.type,
        cardNumber: paymentData.cardNumber,
        expiryMonth: paymentData.expiryMonth,
        expiryYear: paymentData.expiryYear,
        cvv: paymentData.cvv,
        isPrimary: paymentData.isPrimary || false
      };
      if (cardMethod.isPrimary) {
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
          {
            arrayFilters: [{ "patient.userId": id }]
          }
        );
      }
      updateQuery = {
        $push: { "payment.cardMethods": cardMethod }
      };
      await adminStore.updateOne(
        { "patientDetails.userId": id },
        {
          $push: {
            "patientDetails.$[patient].payment.cardMethods": cardMethod
          }
        },
        {
          arrayFilters: [
            { "patient.userId": id }
            // Match all patients with this ID
          ]
        }
      );
    } else if (paymentData.methodType === "mobile-banking") {
      const mobileMethod = {
        provider: paymentData.provider,
        mobileNumber: paymentData.mobileNumber,
        accountName: paymentData.accountName,
        isPrimary: paymentData.isPrimary || false
      };
      if (mobileMethod.isPrimary) {
        await userDetails.findOneAndUpdate(
          { userId: id },
          {
            $set: {
              "payment.mobileBankingMethods.$[].isPrimary": false
            }
          }
        );
        await adminStore.updateOne(
          { "patientDetails.userId": id },
          {
            $set: {
              "patientDetails.$[patient].payment.mobileBankingMethods.$[].isPrimary": false
            }
          },
          {
            arrayFilters: [{ "patient.userId": id }]
          }
        );
      }
      updateQuery = {
        $push: { "payment.mobileBankingMethods": mobileMethod }
      };
      await adminStore.updateOne(
        { "patientDetails.userId": id },
        {
          $push: {
            "patientDetails.$[patient].payment.mobileBankingMethods": mobileMethod
          }
        },
        {
          arrayFilters: [
            { "patient.userId": id }
            // Match all patients with this ID
          ]
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Invalid payment method type"
        }),
        { status: 400, headers }
      );
    }
    const updatedUser = await userDetails.findOneAndUpdate(
      { userId: id },
      updateQuery,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          message: "Failed to update payment methods"
        }),
        { status: 500, headers }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Payment method added successfully",
        paymentMethods: updatedUser.paymentMethods
      }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Error adding payment method:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to add payment method",
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
