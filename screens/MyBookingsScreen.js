// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Icon from "react-native-vector-icons/FontAwesome";

// const MyBookingsScreen = ({ navigation }) => {
//   const [bookings, setBookings] = useState([
//     {
//       id: 1,
//       cook: {
//         name: "Sanjay Kumar",
//         cuisine: "North Indian",
//         rating: 4.5,
//         image:
//           "https://img.freepik.com/premium-vector/chef-cartoon-vector-illustration-chef-logo-template_752732-133.jpg?w=2000",
//       },
//       status: "upcoming",
//       date: "2023-10-15",
//       time: "12:00 PM",
//       pricing: "Rs 500",
//     },
//     {
//       id: 2,
//       cook: {
//         name: "Priya Sharma",
//         cuisine: "Chinese",
//         rating: 4.8,
//         image:
//           "https://img.freepik.com/premium-vector/vector-chef-character-design_746655-2378.jpg?w=740",
//       },
//       status: "completed",
//       date: "2023-10-10",
//       time: "1:00 PM",
//       pricing: "Rs 250",
//     },
//     {
//       id: 3,
//       cook: {
//         name: "Karthik Reddy",
//         cuisine: "South Indian",
//         rating: 4.7,
//         image:
//           "https://static.vecteezy.com/system/resources/previews/000/338/488/original/happy-chef-vector-icon.jpg",
//       },
//       status: "canceled",
//       date: "2023-10-05",
//       time: "3:00 PM",
//       pricing: "Rs 150",
//     },
//   ]);

//   const handleCancelBooking = (id) => {
//     Alert.alert(
//       "Cancel Booking",
//       "Are you sure you want to cancel this booking?",
//       [
//         {
//           text: "Cancel",
//         },
//         {
//           text: "OK",
//           onPress: () => {
//             setBookings((prevBookings) =>
//               prevBookings.filter((booking) => booking.id !== id)
//             );
//           },
//         },
//       ]
//     );
//   };

//   const renderBooking = (booking) => (
//     <View key={booking.id} className="bg-white rounded-lg shadow-lg m-2 p-4">
//       <View className="flex-row">
//         <Image
//           source={{ uri: booking.cook.image }}
//           className="h-16 w-16 rounded-full"
//         />
//         <View className="ml-3">
//           <Text className="font-semibold text-lg">{booking.cook.name}</Text>
//           <Text className="text-gray-600">{booking.cook.cuisine}</Text>
//           <View className="flex-row items-center mt-1">
//             <Icon name="star" size={16} color="#FFD700" />
//             <Text className="ml-1">{booking.cook.rating}</Text>
//           </View>
//           <Text className="text-gray-600">
//             {booking.date} at {booking.time}
//           </Text>
//           <Text className="text-gray-600">Price: {booking.pricing}</Text>
//           <Text
//             className={`mt-1 ${
//               booking.status === "canceled" ? "text-red-500" : "text-green-500"
//             }`}
//           >
//             {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//           </Text>
//           {booking.status === "upcoming" && (
//             <View className="flex-row mt-2">
//               <TouchableOpacity
//                 className="bg-blue-500 rounded-lg p-2 mr-2"
//                 onPress={() =>
//                   navigation.navigate("ModifyBooking", { booking })
//                 }
//               >
//                 <Text className="text-white">Modify</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="bg-red-500 rounded-lg p-2"
//                 onPress={() => handleCancelBooking(booking.id)}
//               >
//                 <Text className="text-white">Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <ScrollView>
//         {["upcoming", "completed", "canceled"].map((status) => (
//           <View key={status} className="mb-4">
//             <Text className="text-xl font-semibold ml-4 mt-2">
//               {status.charAt(0).toUpperCase() + status.slice(1)} Bookings
//             </Text>
//             {bookings
//               .filter((booking) => booking.status === status)
//               .map(renderBooking)}
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default MyBookingsScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      cook: {
        name: "Sanjay Kumar",
        cuisine: "North Indian",
        rating: 4.5,
        image:
          "https://img.freepik.com/premium-vector/chef-cartoon-vector-illustration-chef-logo-template_752732-133.jpg?w=2000",
      },
      status: "upcoming",
      date: "2024-10-15",
      time: "12:00 PM",
      pricing: "Rs 500",
    },
    {
      id: 2,
      cook: {
        name: "Priya Sharma",
        cuisine: "Chinese",
        rating: 4.8,
        image:
          "https://img.freepik.com/premium-vector/vector-chef-character-design_746655-2378.jpg?w=740",
      },
      status: "completed",
      date: "2024-10-10",
      time: "1:00 PM",
      pricing: "Rs 250",
    },
    {
      id: 3,
      cook: {
        name: "Karthik Reddy",
        cuisine: "South Indian",
        rating: 4.7,
        image:
          "https://static.vecteezy.com/system/resources/previews/000/338/488/original/happy-chef-vector-icon.jpg",
      },
      status: "canceled",
      date: "2024-10-05",
      time: "3:00 PM",
      pricing: "Rs 150",
    },
  ]);

  const handleCancelBooking = (id) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setBookings((prevBookings) =>
              prevBookings.filter((booking) => booking.id !== id)
            );
          },
        },
      ]
    );
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleModifyBooking = (booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.date); // Set new date from selected booking
    setNewTime(booking.time); // Set new time from selected booking
    setDatePickerVisibility(true);
  };

  const handleConfirmDate = (date) => {
    setNewDate(date.toISOString().split("T")[0]); // Format date
    setDatePickerVisibility(false);
    setTimePickerVisibility(true); // Show time picker after selecting date
  };

  const handleConfirmTime = (time) => {
    setNewTime(
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ); // Format time
    setTimePickerVisibility(false);

    // Update booking with new date and time
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, date: newDate, time: newTime }
          : booking
      )
    );
  };

  const renderBooking = (booking) => (
    <View key={booking.id} className="bg-white rounded-lg shadow-lg m-2 p-4">
      <View className="flex-row">
        <Image
          source={{ uri: booking.cook.image }}
          className="h-16 w-16 rounded-full"
        />
        <View className="ml-3">
          <Text className="font-semibold text-lg">{booking.cook.name}</Text>
          <Text className="text-gray-600">{booking.cook.cuisine}</Text>
          <View className="flex-row items-center mt-1">
            <Icon name="star" size={16} color="#FFD700" />
            <Text className="ml-1">{booking.cook.rating}</Text>
          </View>
          <Text className="text-gray-600">
            {booking.date} at {booking.time}
          </Text>
          <Text className="text-gray-600">Price: {booking.pricing}</Text>
          <Text
            className={`mt-1 ${
              booking.status === "canceled" ? "text-red-500" : "text-green-500"
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
          {booking.status === "upcoming" && (
            <View className="flex-row mt-2">
              <TouchableOpacity
                className="bg-blue-500 rounded-lg p-2 mr-2"
                onPress={() => handleModifyBooking(booking)}
              >
                <Text className="text-white">Modify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 rounded-lg p-2"
                onPress={() => handleCancelBooking(booking.id)}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        {["upcoming", "completed", "canceled"].map((status) => (
          <View key={status} className="mb-4">
            <Text className="text-xl font-semibold ml-4 mt-2">
              {status.charAt(0).toUpperCase() + status.slice(1)} Bookings
            </Text>
            {bookings
              .filter((booking) => booking.status === status)
              .map(renderBooking)}
          </View>
        ))}
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
        date={new Date(newDate)} // Set initial date from selected booking
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
        date={new Date(`1970-01-01T${newTime}`)} // Set initial time from selected booking
      />
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
