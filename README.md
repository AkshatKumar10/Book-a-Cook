# 👨‍🍳 BookACook App

**BookACook** is a full-featured **React Native (Expo)** app that lets users book professional home cooks based on cuisine, availability, and pricing. From browsing personalized recommendations to secure payments via Razorpay, this app streamlines the entire home-cook booking experience.


## 🚀 Features

- 🔐 **Firebase Email/Password Authentication**  
  Secure login/signup using Firebase Authentication.

- 🧑‍🍳 **Cook Profiles**   
  View detailed cook information including name, cuisine, bio, experience, specialties, pricing, and availability.

- 🍽 **Cuisine-Based Browsing**  
  Explore popular cuisines and view associated dishes.

- 🔍 **Search Functionality**  
  Search for cooks or cuisines easily from the home screen.

- 📅 **Smart Booking Flow**  
  Book a cook by selecting cuisine, guest count, date and time. Auto-calculate total pricing based on your inputs.

- 💳 **Razorpay Payment Integration**   
  Seamless and secure payments using Razorpay. Confirm bookings after successful transactions.

- 🔔 **Notification on Successful Booking**\
  Instantly receive a local notification confirming your booking along with cook and event details.

- 📂 **Bookings Management**  
  View Upcoming and Past bookings. Keep track of when a cook is arriving and past events.

- ❓ **How It Works & FAQ Screens**  
  Help screens to guide users and answer frequently asked questions.

- 🌓 **Dark/Light Theme Support**    
  Seamless switching between dark and light themes for a better user experience.


## 🧰 Tech Stack

- **Framework:** React Native with Expo
- **Payments:** Razorpay React Native SDK
- **Authentication:** Firebase Email/Password
- **UI & UX:** TailwindCSS (via NativeWind)

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/AkshatKumar10/Book-a-Cook.git
cd Book-a-Cook
```

2. Install dependencies
```bash
npm install
```

3. Start the Expo project
```bash
npx expo start
```

⚠️ Make sure you have the Expo Go app on your phone.


## 🔐 Firebase & Environment Setup

- Create a Firebase project.

+ Enable Email/Password Authentication.

- Create a .env file in the root of your project and add your Firebase credentials:

```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```
