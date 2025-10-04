import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "firebase-service-account.json"),
    "utf8"
  )
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const messaging = admin.messaging();

export const sendNotification = async (toToken, title, body, data = {}) => {
  if (!toToken) {
    console.log("No FCM token available for notification");
    return;
  }

  const message = {
    notification: { title, body },
    data: { ...data, click_action: "FLUTTER_NOTIFICATION_CLICK" },
    token: toToken,
  };

  try {
    const response = await messaging.send(message);
    console.log("Successfully sent notification:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};