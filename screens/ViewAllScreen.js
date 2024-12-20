import React, { useState } from "react";
import { View, Text, ScrollView, Image, TextInput } from "react-native";

const ViewAllScreen = ({ route }) => {
  const { cooksData } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  const allSpecialties = cooksData.flatMap((cook) => cook.specialties);
  const filteredSpecialties = allSpecialties.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1">
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          margin: 10,
        }}
        placeholder="Search for food..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((item, index) => {
              const cook = cooksData.find((cook) =>
                cook.specialties.includes(item)
              );
              return (
                <View
                  key={`${cook.id}-${index}`}
                  className="flex-row flex-wrap justify-between"
                  style={{ padding: 10 }}
                >
                  <View
                    className="bg-white rounded-lg shadow-lg m-2 w-48 h-56"
                    style={{ padding: 15 }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      className="rounded-lg h-32 w-full "
                      resizeMode="cover"
                    />
                    <Text className="font-semibold mt-2 text-center text-lg">
                      {item.name}
                    </Text>
                    <View className="flex-row">
                      <Text className="mr-1">Cook:</Text>
                      <Text className="text-center text-gray-500">
                        {cook.name}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text className="text-center text-2xl mt-4 ml-24">
              This item does not exist
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewAllScreen;
