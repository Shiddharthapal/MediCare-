import connect from "@/lib/connection";
import userDetails from "@/model/userDetails";
import type { APIRoute } from "astro";

// CREATE - Add new payment method
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const { paymentData, id } = await request.json();
    // console.log("🧞‍♂️  id --->", id);
    // console.log("🧞‍♂️  paymentData --->", paymentData);

    if (!id) {
      return new Response(
        JSON.stringify({
          message: "User ID is required",
        }),
        { status: 400, headers }
      );
    }

    if (!paymentData || !paymentData.methodType) {
      return new Response(
        JSON.stringify({
          message: "Payment data and method type are required",
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

    let updateQuery: any = {};

    // Add payment method based on type
    if (paymentData.methodType === "card") {
      const cardMethod = {
        cardholderName: paymentData.cardholderName,
        type: paymentData.type,
        cardNumber: paymentData.cardNumber,
        expiryMonth: paymentData.expiryMonth,
        expiryYear: paymentData.expiryYear,
        cvv: paymentData.cvv,
        isPrimary: paymentData.isPrimary || false,
      };

      // If this is primary, set all others to non-primary first
      if (cardMethod.isPrimary) {
        await userDetails.findOneAndUpdate(
          { userId: id },
          { $set: { "payment.cardMethods.$[].isPrimary": false } }
        );
      }

      updateQuery = {
        $push: { "payment.cardMethods": cardMethod },
      };
    } else if (paymentData.methodType === "mobile-banking") {
      const mobileMethod = {
        provider: paymentData.provider,
        mobileNumber: paymentData.mobileNumber,
        accountName: paymentData.accountName,
        isPrimary: paymentData.isPrimary || false,
      };

      // If this is primary, set all others to non-primary first
      if (mobileMethod.isPrimary) {
        await userDetails.findOneAndUpdate(
          { userId: id },
          {
            $set: {
              "payment.mobileBankingMethods.$[].isPrimary": false,
            },
          }
        );
      }

      updateQuery = {
        $push: { "payment.mobileBankingMethods": mobileMethod },
      };

      //   console.log("🧞‍♂️  updateQuery --->", updateQuery);
    } else {
      return new Response(
        JSON.stringify({
          message: "Invalid payment method type",
        }),
        { status: 400, headers }
      );
    }

    // Update user with new payment method
    const updatedUser = await userDetails.findOneAndUpdate(
      { userId: id },
      updateQuery,
      { new: true, runValidators: true }
    );

    // console.log("🧞‍♂️  updatedUser --->", updatedUser);

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          message: "Failed to update payment methods",
        }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Payment method added successfully",
        paymentMethods: updatedUser.paymentMethods,
      }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Error adding payment method:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to add payment method",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers }
    );
  }
};
