import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-brown-100">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View className="flex-1 flex justify-normal my-4">
        <View className="flex-row justify-center mt-20 mb-10">
          <Image
            source={require('../assets/splash-icon.png')}
            style={{ width: '90%', aspectRatio: 1, borderRadius: 70 }}
          />
        </View>
        <Text className="font-bold text-2xl text-center text-yellow-600  mt-12">
          Let's Get Started
        </Text>
        <Text className="font-bold text-5xl text-center text-yellow-950 mt-4 mb-3">
          Book A Cook
        </Text>
        <View className="space-y-2">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="py-3 bg-amber-700 mx-7 rounded-full mb-4 mt-10"
          >
            <Text className="text-center text-xl font-bold text-gray-900">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-slate-950 font-semibold">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text className="text-yellow-600 font-semibold mb-10 ml-2">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
