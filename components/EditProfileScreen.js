// // EditProfileScreen.js
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

// const EditProfileScreen = ({ route, navigation }) => {
//   const { fullName: initialFullName, email: initialEmail } = route.params;

//   const [fullName, setFullName] = useState(initialFullName);
//   const [email, setEmail] = useState(initialEmail);

//   const handleSave = () => {
//     // Logic to save updated profile info (e.g., update in database)
//     Alert.alert("Profile Updated", "Your profile details have been updated.");
//     navigation.navigate("Profile", { fullName, email }); // Navigate back to ProfileScreen with updated info
//   };

//   return (
//     <View className="flex-1 bg-brown-100 p-5">
//       <Text className="text-xl font-semibold mb-4">Edit Profile</Text>
//       {/* <TextInput
//         value={fullName}
//         onChangeText={setFullName}
//         placeholder="Full Name"
//         className="border border-gray-300 rounded p-2 mb-4"
//       /> */}
//       <TextInput
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Email"
//         className="border border-gray-300 rounded p-2 mb-4"
//       />
//       <TouchableOpacity
//         onPress={handleSave}
//         className="bg-amber-900 rounded p-3"
//       >
//         <Text className="text-white text-center">Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default EditProfileScreen;

// EditProfileScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const EditProfileScreen = ({ route, navigation }) => {
  const { fullName: initialFullName, email: initialEmail } = route.params;

  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    // Logic to save updated profile info (e.g., update in database)
    Alert.alert("Profile Updated", "Your profile details have been updated.");
    navigation.navigate("Profile", { fullName, email }); // Navigate back to ProfileScreen with updated info
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Edit Profile
      </Text>

      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        style={{
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#ffcc00",
          borderRadius: 5,
          padding: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;
