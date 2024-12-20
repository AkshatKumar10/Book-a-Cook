import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const CookProfileScreen = ({ route, navigation }) => {
  const { cook } = route.params;

  // // State to track if the cook is a favorite
  // const [isFavorite, setIsFavorite] = useState(false);

  // const handleFavoriteToggle = () => {
  //   setIsFavorite((prevState) => {
  //     const newState = !prevState;
  //     Alert.alert(
  //       newState ? "Added to Favorites!" : "Removed from Favorites!",
  //       newState
  //         ? "This item is now saved in your favorites"
  //         : "You can always add it back if you change your mind."
  //     );
  //     return newState;
  //   });
  // };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Image
            source={{ uri: cook.image }}
            className="w-52 h-52 rounded-full ml-32 flex-row justify-center items-center"
          />
          <Text className="font-bold text-4xl mt-5 text-center">
            {cook.name}
          </Text>
          <Text className="text-center text-xl mx-4">{cook.bio}</Text>
        </View>

        <View>
          <Text className="font-bold text-2xl ml-6 text-slate-600">
            Specialties:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2"
          >
            {cook.specialties.map((specialty, index) => (
              <View
                key={index}
                className="bg-white border border-gray-300 rounded-lg shadow-md mx-2 p-4"
                style={{ width: 120 }}
              >
                <Image
                  source={{ uri: specialty.image }}
                  className="h-24 w-24 rounded-lg mb-2"
                />
                <Text className="text-center items-center text-xl font-semibold">
                  {specialty.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="font-bold text-2xl mt-3 ml-6 text-slate-600">
            Years of Experience:
          </Text>
          <Text className="ml-6 text-xl">{cook.yearsOfExperience}</Text>
        </View>

        <View>
          <Text className="font-bold mt-3 text-2xl ml-6 text-slate-600">
            Services:
          </Text>
          <Text className="ml-6 text-xl">{cook.services.join(", ")}</Text>
        </View>

        <View>
          <Text className="font-bold mt-3 text-2xl ml-6 text-slate-600">
            Pricing:
          </Text>
          <Text className="ml-6 text-xl">{cook.pricing}</Text>
        </View>
        <View>
          <Text className="font-bold mt-3 text-2xl ml-6 text-slate-600">
            Availability:
          </Text>
          <Text className="ml-6 text-xl mb-8">{cook.availability}</Text>
        </View>
        {/* <View className="bg-gray-200">
          <View className="flex-row justify-center gap-4 mb-7 bg-gray-200 ">
            <TouchableOpacity
              className="bg-amber-900 rounded-full flex-row px-12 py-2 ml-32 justify-center mx-auto mt-5 "
              onPress={() => {
                // navigation.navigate("BookingPage");
                const allCooksPricing = {};

                const cuisineType = cook.cuisine;
                const pricing = parseInt(cook.pricing.match(/\d+/)[0]);

                allCooksPricing[cuisineType] = {
                  cook: cook.name,
                  price: pricing,
                };
                // Navigate to BookingPage with all cooks' pricing
                navigation.navigate("BookingPage", {
                  cook: cook.name,
                  pricing: allCooksPricing,
                });
              }}
            >
              <Text className="font-bold text-2xl mt-2 text-center mb-2 text-gray-900">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CookProfileScreen;
