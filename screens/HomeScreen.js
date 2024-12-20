import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // If using Expo for gradients
import { MaterialIcons } from "@expo/vector-icons";

// import FiltersSection from "../components/fliter";

export default function HomeScreen({ navigation }) {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab("home");
    }, [])
  );
  // const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState("home");

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };

  const cooksData = [
    {
      id: 1,
      name: "Sanjay Kumar",
      cuisine: "North Indian",
      rating: 4.5,
      image:
        "https://img.freepik.com/premium-vector/chef-cartoon-vector-illustration-chef-logo-template_752732-133.jpg?w=2000",
      bio: "A passionate cook specializing in mainly North Indian cuisine.",
      specialties: [
        {
          name: "Butter Chicken",
          image:
            "https://www.licious.in/blog/wp-content/uploads/2020/10/butter-chicken--750x750.jpg",
        },
        {
          name: "Gulab Jamun",
          image:
            "https://bakewithzoha.com/wp-content/uploads/2023/04/gulab-jamun-3-scaled.jpg",
        },
        {
          name: "Kheer",
          image:
            "https://api.vip.foodnetwork.ca/wp-content/uploads/2023/03/kheer-feat.jpg?w=3840&quality=75",
        },
        {
          name: "Puri",
          image:
            "http://www.archanaskitchen.com/images/archanaskitchen/0-Archanas-Kitchen-Recipes/2018/Puri_Recipe_Traditional_Homemade-2.jpg",
        },
        {
          name: "Samosa",
          image:
            "https://tse2.mm.bing.net/th?id=OIP.qHJIzQ-WXnx8QZBmQRaPHQHaE3&pid=Api&P=0&h=180",
        },
        {
          name: "Naan",
          image:
            "https://tse2.mm.bing.net/th?id=OIP.PbAB3Lh2A7c86SQMdoq9qwHaJQ&pid=Api&P=0&h=180",
        },
        {
          name: "Aloo Gobi",
          image:
            "https://veganhuggs.com/wp-content/uploads/2021/04/aloo-gobi-in-bowl-side-view.jpg",
        },
        {
          name: "Dal Makhani",
          image:
            "https://recipes.timesofindia.com/thumb/53097626.cms?imgsize=156015&width=800&height=800",
        },
        {
          name: "Tandoori Chicken",
          image:
            "https://tse2.mm.bing.net/th?id=OIP.21xfGQ9jUczQhBfBTgASHwHaEJ&pid=Api&P=0&h=180",
        },
        {
          name: "Palak Paneer",
          image: "https://recipes.timesofindia.com/photo/53093667.cms",
        },
        {
          name: "Chole Bhature",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.P13hIX9w9Apt04zskDD69QHaFb&pid=Api&P=0&h=180",
        },
        {
          name: "Biryani",
          image:
            "http://www.relishthebite.com/wp-content/uploads/2015/01/Vegbiryani.jpg3_.jpg",
        },
        {
          name: "Paneer Tikka",
          image:
            "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg",
        },
        {
          name: "Roti",
          image:
            "https://www.mydelicious-recipes.com/home/images/234_1200_1200/mydelicious-recipes-roti",
        },
        {
          name: "Rice",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.tTYO2xFwhnWqthCpnPT97gHaEK&pid=Api&P=0&h=180",
        },
      ],
      yearsOfExperience: 5,
      services: ["Meal Preparation", "DishWash"],
      pricing: "Rs 500 per meal",
      availability: "Everyday 10 AM - 8 PM",
    },
    {
      id: 2,
      name: "Priya Sharma",
      cuisine: "Chinese",
      rating: 4.8,
      image:
        "https://img.freepik.com/premium-vector/vector-chef-character-design_746655-2378.jpg?w=740",
      bio: "Expert in Chinese cuisine with a flair for traditional recipes.",
      specialties: [
        {
          name: "Kung Pao Chicken",
          image:
            "https://www.cookingclassy.com/wp-content/uploads/2020/02/kung-pao-chicken-1-1024x1536.jpg",
        },
        {
          name: "Dumplings",
          image:
            "https://khinskitchen.com/wp-content/uploads/2020/11/DSC01054.jpg",
        },
        {
          name: "Chow Mein",
          image:
            "https://laurenslatest.com/wp-content/uploads/2021/04/chow-mein-12-scaled.jpg",
        },
        {
          name: "Fried Rice",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.NWqDqY03A8J3qVFM8IHfTAHaFj&pid=Api&P=0&h=180",
        },
        {
          name: "Dim Sum",
          image:
            "https://tse3.mm.bing.net/th?id=OIP.2MsCWYC8k71VPoVybQsgrwHaFj&pid=Api&P=0&h=180",
        },
        {
          name: "Hot and Sour Soup",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.4RpbAf_3RbfsUO1XmJVN0wHaJ4&pid=Api&P=0&h=180",
        },
        {
          name: "Szechwan Chilli Chicken",
          image:
            "https://tipbuzz.com/wp-content/uploads/Szechuan-Chicken-12.jpg",
        },
        {
          name: "Spring Rolls",
          image:
            "https://www.upstateramblings.com/wp-content/uploads/2022/06/air-fryer-spring-rolls-0413-edited.jpg",
        },
      ],
      yearsOfExperience: 2,
      services: ["Meal Preparation"],
      pricing: "Rs 250 per meal",
      availability: "WeekDays 11 AM - 9 PM",
    },
    {
      id: 3,
      name: "Karthik Reddy",
      cuisine: "South Indian",
      rating: 4.7,
      image:
        "https://static.vecteezy.com/system/resources/previews/000/338/488/original/happy-chef-vector-icon.jpg",
      bio: "Bringing authentic South Indian flavors to your table.",
      specialties: [
        {
          name: "Rasam",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.3M9e0-9Y-qRES1VQ_E6lzAHaHs&pid=Api&P=0&h=180",
        },
        {
          name: "Paddu",
          image:
            "https://i1.wp.com/atasteofflavours.com/wp-content/uploads/2019/09/IMG_8139.jpg?fit=1242%2C828&ssl=1",
        },
        {
          name: "Biryani",
          image:
            "https://www.madhuseverydayindian.com/wp-content/uploads/2022/11/easy-vegetable-biryani.jpg",
        },
        {
          name: "Vada",
          image:
            "https://tse4.mm.bing.net/th?id=OIP.IOGh986tbXiRIj4CbLFqxgHaHa&pid=Api&P=0&h=180",
        },
        {
          name: "Sambar",
          image:
            "https://www.cubesnjuliennes.com/wp-content/uploads/2021/01/South-Indian-Sambar-Recipe.jpg",
        },
        {
          name: "Idli",
          image:
            "https://www.healthifyme.com/blog/wp-content/uploads/2018/03/idly2.jpeg",
        },
        {
          name: "Dosa",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.AecdFT6JJHcKfKMDrj3_ngHaEf&pid=Api&P=0&h=180",
        },
      ],
      yearsOfExperience: 6,
      services: ["Meal Preparation", "DishWash"],
      pricing: "Rs 150 per meal",
      availability: "Everyday 7 AM - 5 PM",
    },
    {
      id: 4,
      name: "Rahul Kumar",
      cuisine: "Western",
      rating: 4.2,
      image:
        "https://img.freepik.com/premium-vector/chef-logo-template-vector_671539-44.jpg?w=2000",
      bio: "Specializing in Western dishes with fresh ingredients.",
      specialties: [
        {
          name: "Grilled Steak",
          image:
            "https://tse4.mm.bing.net/th?id=OIP.JSbZt80v-tc5-NRfJh8F3AHaE8&pid=Api&P=0&h=180",
        },
        {
          name: "Caesar Salad",
          image:
            "https://tse3.mm.bing.net/th?id=OIP.8UagT3WWGxruvIOqJTCPeQHaE8&pid=Api&P=0&h=180",
        },
        {
          name: "Mac and Cheese",
          image:
            "https://www.willcookforsmiles.com/wp-content/uploads/2019/01/mac-and-cheese-4.jpg",
        },
        {
          name: "Stuffed Chicken",
          image:
            "https://tse3.mm.bing.net/th?id=OIP.cswaLLz7IzpweCUB9J6d2AHaE8&pid=Api&P=0&h=180",
        },
        {
          name: "Apple Pie",
          image:
            "https://natashaskitchen.com/wp-content/uploads/2019/10/Apple-Pie-2.jpg",
        },
        {
          name: "BBQ Ribs",
          image:
            "https://tse2.mm.bing.net/th?id=OIP.1l8D2-1dhI30ZflVj8W3RAHaFT&pid=Api&P=0&h=180",
        },
        {
          name: "Potato Wedges",
          image:
            "https://delicerecipes.com/wp-content/uploads/2020/11/Airfryer-potato-wedges-with-sauce.jpg",
        },
        {
          name: "Nachos With Dips",
          image:
            "https://cookthestory.com/wp-content/uploads/2018/04/Warm-Nacho-Dip.jpg",
        },
        {
          name: "Peri Peri Fries",
          image:
            "https://tse4.mm.bing.net/th?id=OIP.f-NCJsWQHND-2jDLxUsRzQHaHa&pid=Api&P=0&h=180",
        },
        {
          name: "Crispy Chicken Wings",
          image:
            "https://drdavinahseats.com/wp-content/uploads/2020/06/Crispy-Baked-Chicken-Wings-Close-up-1025x1536.jpg",
        },
        {
          name: "Stuffed Mushrooms",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.SYY8Wx7lNI5c3N89r9XQMwHaKX&pid=Api&P=0&h=180",
        },
        {
          name: "Paneer Sliders",
          image:
            "https://images.squarespace-cdn.com/content/v1/5ec30182cff13b4331c5384d/1691940905279-9ZL1J83FL9LJYQFTVPGB/IMG_8763.jpeg",
        },
        {
          name: "Mexian Rice",
          image:
            "https://tse1.mm.bing.net/th?id=OIP.svX6DNrsG101cKS5qf0faQHaHa&pid=Api&P=0&h=180",
        },
        {
          name: "Grilled Fish",
          image:
            "https://www.thespruceeats.com/thmb/rNmXWR-BQ1pe0K74BeWlLSUyAaM=/1956x1533/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-89804131-5832ecf25f9b58d5b10334fd.jpg",
        },
      ],
      yearsOfExperience: 8,
      services: ["Meal Preparation", "Cleaning"],
      pricing: "Rs 650 per meal",
      availability: "Everyday 10 AM - 8 PM",
    },
    // Add more cook objects here
  ];
  const services = [
    {
      id: 1,
      title: "Event Catering",
      image: "https://www.chefscater.com/static/sitefiles/blog/catering.png",
    },
    {
      id: 2,
      title: "Cooking Classes",
      image:
        "https://www.staywithstylescottsdale.com/wp-content/uploads/2023/07/Featured-Image-7-Best-Cooking-Classes-in-Scottsdale-for-All-Ages-1024x512.jpg",
    },
  ];

  return (
    // <SafeAreaView className="flex-1 flex-row justify-center items-center">
    //   <Text className="text-lg font-bold">Home Screen -</Text>
    //   <TouchableOpacity
    //     onPress={handleSignOut}
    //     className="p-1 bg-red-400 rounded-lg"
    //   >
    //     <Text className="text-white text-lg font-bold">Sign Out</Text>
    //   </TouchableOpacity>
    // </SafeAreaView>

    <View className="flex-1 bg-brown-100">
      <View
        className="bg-white h-20  flex-row justify-between items-center px-5 "
        style={{
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={require("../assets/images/user.png")}
            className="h-8 w-8 rounded-full"
          />
        </TouchableOpacity>
        <Text className="text-3xl font-bold mt-2 text-gray-900 text-center py-2">
          Discover Cooks
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Icon name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <SafeAreaView className="flex-1 mb-24">
        <ScrollView className="flex-1 p-1">
          {/* 9 */}
          <View>
            <Text className="text-2xl font-bold ml-4 mb-3">
              Recommended Cooks
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cooksData.map((cook) => (
                <View
                  key={cook.id}
                  className="bg-white rounded-lg shadow-lg m-2 w-40"
                  style={{ padding: 10 }}
                >
                  <Image
                    source={{ uri: cook.image }}
                    className="rounded-lg h-24 w-full"
                    resizeMode="cover"
                  />
                  <Text className="font-semibold mt-2 text-lg">
                    {cook.name}
                  </Text>
                  <Text className="text-gray-600">{cook.cuisine}</Text>
                  <View className="flex-row items-center mt-1">
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text className="ml-1">{cook.rating}</Text>
                  </View>

                  <TouchableOpacity
                    className="bg-gray-500 rounded-lg mt-2 p-2"
                    onPress={() => navigation.navigate("CookProfile", { cook })}
                  >
                    <Text className="text-white text-center">More Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          {/* <Text className="text-2xl font-bold mb-4 text-center">
          How It Works
        </Text>
        <ScrollView>
          {steps.map((step) => (
            <View
              key={step.id}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <View className="flex-row items-center">
                <Icon name={step.icon} size={30} color="brown" />
                <Text className="text-xl font-semibold ml-3">{step.title}</Text>
              </View>
              <Text className="text-gray-600 mt-2">{step.description}</Text>
            </View>
          ))}
        </ScrollView> */}
          {/* <View>
          <Text>Explore menu</Text>
        </View> */}
          <View className="mt-6">
            <View className="flex-row ">
              <Text className="text-2xl font-bold ml-4 mr-1 mb-3 ">
                Explore Menu
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ViewAllScreen", { cooksData })
                }
              >
                <Text className="text-lg ml-52 mt-1 text-blue-500">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cooksData.flatMap((cook) =>
                cook.specialties.slice(0, 1).map((item, index) => (
                  <View
                    key={`${cook.id}-${index}`}
                    className="bg-white rounded-lg shadow-lg m-2 w-36"
                    style={{ padding: 15 }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      className="rounded-lg h-24 w-full "
                      resizeMode="cover"
                    />
                    <Text className="font-semibold mt-2 text-center">
                      {item.name}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
          <View>
            <Text className="text-2xl font-bold mt-5 ml-4 mb-4">
              Cooking Services
            </Text>
            <View className="flex-row flex-wrap justify-between ">
              {services.map((service) => (
                <View
                  key={service.id}
                  className="bg-white rounded-lg shadow-lg mx-4 w-48 mb-6"
                >
                  <Image
                    source={{ uri: service.image }}
                    className="rounded-t-lg h-24 w-full"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <Text className="font-semibold text-lg">
                      {service.title}
                    </Text>
                    <Text className="text-gray-600">Coming Soon</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("HowItWorks")}
            className="rounded-lg shadow-lg mb-8  overflow-hidden "
          >
            <LinearGradient
              colors={["#4c8bf5", "#3f51b5"]} // Gradient colors
              className="p-4 flex-row items-center justify-center"
            >
              <MaterialIcons
                name="info"
                size={24}
                color="white"
                className="mr-2"
              />
              <Text className="text-2xl font-bold text-white text-center">
                How It Works
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* <TouchableOpacity
        className="bg-blue-500 rounded-lg p-3 m-4"
        onPress={() => navigation.navigate("BookingPage")} // Navigate to Booking Page
      >
        <Text className="text-white text-center text-lg font-bold">
          Book a Meal
        </Text>
      </TouchableOpacity> */}

      <View
        className="h-30 absolute bottom-0 left-0 right-0 bg-white shadow-lg flex-row justify-between items-center px-10"
        style={{
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          shadowColor: "#black",
          shadowOpacity: 0.3,
          elevation: 5,
        }}
      >
        {/* <View>
          <Entypo name="home" size={37} color="black" className="mt-5 ml-5" />
          <Text className="ml-5 mb-3">Home</Text>
        </View>
        <View>
          <Image
            source={require("../assets/images/user.png")}
            className="h-10 w-10 mt-5"
          />
          <Text className="mb-3">Profile</Text>
        </View> */}

        <TouchableOpacity onPress={() => setActiveTab("home")}>
          <Entypo
            name="home"
            size={37}
            color={activeTab === "home" ? "brown" : "black"}
            className="mt-5 ml-5"
          />
          <Text className="ml-5 mb-3">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab("bookNow");
            const allCooksPricing = {};

            // Assuming cooksData contains an array of objects with name and pricing
            cooksData.forEach((cook) => {
              // You need to define how you want to categorize the cooks (e.g., cuisine type)
              // Here, I'm assuming each cook has a cuisineType property
              const cuisineType = cook.cuisine; // Replace with the actual property that defines the cuisine
              const pricing = parseInt(cook.pricing.match(/\d+/)[0]);
              // Assign the cook and pricing to the respective cuisine type
              allCooksPricing[cuisineType] = {
                cook: cook.name,
                price: pricing,
              };
            });

            // Navigate to BookingPage with all cooks' pricing
            navigation.navigate("BookingPage", {
              pricing: allCooksPricing,
            });
          }}
        >
          <View
            className={`rounded-full border w-16 h-16 mb-3 ml-8 ${
              activeTab === "bookNow" ? "bg-red-800" : "bg-gray-900"
            }`}
          >
            <Text className="mt-2 ml-3 mb-0 text-white">Book</Text>
            <Text className=" ml-3.5 text-white">Now</Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setActiveTab("favorites")}>
          <Icon
            name="star"
            size={33}
            color={activeTab === "favorites" ? "brown" : "black"}
            className="mt-4 mr-1 ml-4"
          />
          <Text className="mr-1 mb-3">Favorites</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            setActiveTab("bookings");
            navigation.navigate("MyBookings");
          }}
        >
          <Icon
            name="book"
            size={37}
            color={activeTab === "bookings" ? "brown" : "black"}
            className="mt-5 ml-10"
          />
          <Text className="ml-5 mb-4">My Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
