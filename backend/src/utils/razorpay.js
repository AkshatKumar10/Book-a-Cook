import Razorpay from "razorpay";

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export const verifyPayment = async (paymentId) => {
  try {
    let payment = await rzp.payments.fetch(paymentId);
    if (payment.status === "authorized") {
      payment = await rzp.payments.capture(paymentId, payment.amount, payment.currency);
    }
    
    const capturedAmount = payment.amount / 100;

    if (payment.status === "captured") {
      return { valid: true, amount: capturedAmount };
    }

    return { valid: false, error: `Payment not captured. Status: ${payment.status}` };
  } catch (error) {
    console.error("Razorpay verification/capture error:", error);
    return { valid: false, error: error.message };
  }
};

export const refundPayment = async (paymentId, amount = null) => {
  try {
    const refundOptions = {};
    if (amount) {
      refundOptions.amount = Math.round(amount * 100); // Razorpay expects amount in paise
    }

    const refund = await rzp.payments.refund(paymentId, refundOptions);
    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    };
  } catch (error) {
    console.error("Razorpay refund error:", error);
    return {
      success: false,
      error: error.message || error.description || "Failed to process refund",
    };
  }
};
