import cron from "node-cron";
import Booking from "../models/Booking.js";
import { refundPayment } from "../utils/razorpay.js";
import { sendNotification } from "../utils/notifications.js";

const bookingCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      
      const expiredBookings = await Booking.find({
        status: "pending",
        createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }).populate("userId", "username fcmToken");

      for (const booking of expiredBookings) {
        let refundResult = null;
        if (booking.paymentId) {
          refundResult = await refundPayment(booking.paymentId, booking.totalAmount);
        }

        booking.status = "declined";
        booking.declineReason = "Auto-declined: Expired after 24 hours without cook response";
        booking.refundStatus = refundResult?.success ? "processed" : "failed";
        booking.refundId = refundResult?.refundId || "";
        booking.refundAmount = refundResult?.amount || 0;
        await booking.save();

        if (booking.userId && booking.userId.fcmToken) {
          const refundText = refundResult?.success
            ? ` A full refund of ₹${booking.totalAmount} has been initiated.`
            : "";
          await sendNotification(
            booking.userId.fcmToken,
            "Booking Expired & Refund Initiated",
            `Your ${booking.mealType} booking was auto-cancelled because the chef did not respond within 24 hours.${refundText}`,
            { bookingId: booking._id.toString(), action: "booking_declined" }
          );
        }
      }

      const bookings = await Booking.find({ status: "accepted" });
      for (const booking of bookings) {
        const [day, month, year] = booking.selectedDate.split("/").map(Number);
        const [hours, minutes] = booking.selectedTime
          .replace(/(am|pm)/i, "")
          .trim()
          .split(":")
          .map(Number);
        const period = booking.selectedTime.toLowerCase().includes("pm")
          ? "PM"
          : "AM";
        let adjustedHours = hours;
        if (period === "PM" && hours !== 12) adjustedHours += 12;
        if (period === "AM" && hours === 12) adjustedHours = 0;
        const bookingDateTime = new Date(
          year,
          month - 1,
          day,
          adjustedHours,
          minutes,
        );

        if (bookingDateTime < now) {
          await Booking.updateOne(
            { _id: booking._id },
            { status: "completed" },
          );
        }
      }
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  cron.schedule("*/14 * * * *", async () => {
    try {
      const baseUrl = process.env.API_BASE_URL;

      const response = await fetch(`${baseUrl}/health`);

      if (response.status === 200) {
        console.log(
          `Request sent successfully at ${new Date().toLocaleString()}`,
        );
      } else {
        console.warn(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error while sending request  :", error.message);
    }
  });
};

export default bookingCron;
