# 👨‍🍳 BookACook App

**BookACook** is a mobile application built with **React Native (Expo)** that connects users with professional home cooks. Users can browse cooks by cuisine, view detailed profiles, book services, and make secure payments. Cooks can manage their profiles, track bookings, and receive real-time notifications. The app integrates a backend built with **Node.js**, **Express**, and **MongoDB** for authentication and data management, **Razorpay for payments**, and **Firebase** for notifications, creating a complete end-to-end booking experience.


## 🚀 Features

<details>
<summary><strong>User Features</strong></summary>

- 🔐 **Email/Password Authentication via Backend**  
  All authentication is handled through Node.js/Express/MongoDB.

- 🧑‍🍳 **Cook Profiles**   
  View detailed cook information including name, cuisine, bio, location, experience, specialties and pricing.

- 🍽 **Cuisine-Based Browsing**  
  Explore popular cuisines and view associated dishes.

- 🔍 **Search Functionality**  
  Search for cooks or cuisines easily from the home screen.

- 🗺️ **Map Integration**  
  Pick booking addresses accurately with an interactive map.

- 📅 **Smart Booking Flow**  
  Book a cook by selecting cuisine, guest count, address, date and time. Auto-calculate total pricing based on your inputs.

- 💳 **Razorpay Payment Integration**   
  Seamless and secure payments using Razorpay. Confirm bookings after successful transactions.

- 🔔 **Notifications**\
  Users receive notifications when a cook accepts or declines their booking.

- 📂 **Bookings Management**  
  View upcoming and past bookings. Track statuses: pending, confirmed, accepted, or declined.

- 🌓 **Dark/Light Theme Support**    
  Seamless switching between dark and light themes for a better user experience.

</details>

<details>
<summary><strong>Cook Features</strong></summary>

- 📋 **Cook Dashboard**  
  Manage bookings, view total earnings, and track booking statuses.

- 🔔 **Notification**  
  Receive notifications when a user makes a booking. Accept or decline bookings, and notify the user in real time.

- ✏️ **Profile Management**  
  Edit profile, specialties, pricing, experience, services offered, bio.

</details>

## 🧰 Tech Stack

- **Frontend:** React Native (Expo) + NativeWind (TailwindCSS)  
- **Backend:** Node.js + Express + MongoDB  
- **Notifications:** Firebase Cloud Messaging  
- **Payments:** Razorpay React Native SDK  
- **Cloud Storage:** Cloudinary  

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/AkshatKumar10/Book-a-Cook.git
cd Book-a-Cook
```

2. Install dependencies \

   Navigate into both the frontend and backend folders and install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```
> Make sure to run the cd backend command from the root of the cloned repository.

3. Start the projects

- Backend
```bash
npm run dev
```

- Frontend
```bash
npm start
```

> Make sure you have the Expo Go app on your phone.


## 🔐 Environment Setup

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` folder with the following variables:

```env
RAZORPAY_KEY_ID=
API_BASE_URL=
```

### Backend (`backend/.env`)
Create a `.env` file in the `backend` folder with the following variables:

```env
PORT=
MONGO_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FIREBASE_PROJECT_ID=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET_KEY=
```

> Notes:
> - The backend handles authentication, user/cook management, and bookings.
> - Cloudinary is used to store cook profile images and other media.
> - Firebase is used only for push notifications.
> - Razorpay keys are required for payment integration.
