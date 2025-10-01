import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  FlatList,
  Image,
  BackHandler,
  Keyboard,
} from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { registerCook, storeCookToken } from '../utils/api';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SnackbarComponent from '../components/SnackbarComponent';

export default function CookSignUpScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [step, setStep] = useState(1);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    location: '',
    cuisineSpecialties: [],
    specialties: [],
    bio: '',
    experienceLevel: '',
    servicesOffered: [],
    pricing: { perDish: '', perHour: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const addSpecialty = () => {
    const trimmed = specialtyInput.trim();
    if (trimmed && !formData.specialties.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, trimmed],
      }));
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (item) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== item),
    }));
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-amber-700',
    buttonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    buttonText: 'text-white',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (step > 1) {
          setStep(step - 1);
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [step]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Please allow access to your photo library',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profileImage: result.assets[0].uri });
    }
  };

  const cuisineOptions = [
    'Italian',
    'Indian',
    'Vegan',
    'Mexican',
    'Chinese',
    'French',
  ];
  const serviceOptions = ['Meal Prep', 'Catering', 'Private Chef'];

  const handleNext = async () => {
    if (step === 1) {
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        Keyboard.dismiss();
        setSnackbarMessage('Please fill all fields');
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Keyboard.dismiss();
        setSnackbarMessage('Passwords do not match');
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (
        !formData.location ||
        formData.cuisineSpecialties.length === 0 ||
        formData.specialties.length === 0 ||
        !formData.bio ||
        !formData.experienceLevel
      ) {
         Keyboard.dismiss();
        setSnackbarMessage('Please fill all required fields');
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (formData.servicesOffered.length === 0) {
        Keyboard.dismiss();
        setSnackbarMessage('Please select at least one service');
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setLoading(true);
      try {
        const cookData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profileImage: formData.profileImage,
          location: formData.location,
          cuisineSpecialties: formData.cuisineSpecialties,
          specialties: formData.specialties,
          bio: formData.bio,
          experienceLevel: parseInt(formData.experienceLevel) || 0,
          servicesOffered: formData.servicesOffered,
          pricing: {
            perDish: parseFloat(formData.pricing.perDish) || 0,
            perHour: parseFloat(formData.pricing.perHour) || 0,
          },
        };
        const { token } = await registerCook(cookData);
        await storeCookToken(token);
        navigation.navigate('CookDashboard', {
          username: formData.username,
        });
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message;
        Keyboard.dismiss();
        setSnackbarMessage(errorMessage);
        setSnackbarType('error');
        setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCuisine = (cuisine) => {
    setFormData((prev) => ({
      ...prev,
      cuisineSpecialties: prev.cuisineSpecialties.includes(cuisine)
        ? prev.cuisineSpecialties.filter((item) => item !== cuisine)
        : [...prev.cuisineSpecialties, cuisine],
    }));
  };

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter((item) => item !== service)
        : [...prev.servicesOffered, service],
    }));
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <Text
            className={`text-3xl font-extrabold ${themeStyles.textAccent} text-center tracking-wide`}
          >
            Join as a Cook!
          </Text>
          <Text
            className={`text-lg ${themeStyles.textSecondary} text-center mt-2 mb-12`}
          >
            Create your account to start cooking
          </Text>
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Full Name
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter name"
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
            autoCapitalize="words"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Email Address
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
          <Text className={`text-lg ${themeStyles.textPrimary}`}>Password</Text>
          <View
            className={`flex-row items-center ${themeStyles.inputBg} rounded-xl mb-4 pr-4`}
          >
            <TextInput
              className={`flex-1 p-4 ${themeStyles.inputText}`}
              placeholder="Enter password"
              value={formData.password}
              secureTextEntry={!showPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              editable={!loading}
              placeholderTextColor={themeStyles.inputPlaceholder}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Confirm Password
          </Text>
          <View
            className={`flex-row items-center ${themeStyles.inputBg} rounded-xl mb-4 pr-4`}
          >
            <TextInput
              className={`flex-1 p-4 ${themeStyles.inputText}`}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              editable={!loading}
              placeholderTextColor={themeStyles.inputPlaceholder}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <Text
            className={`text-3xl font-extrabold ${themeStyles.textAccent} text-center tracking-wide`}
          >
            Set Up Your Profile
          </Text>
          <Text
            className={`text-lg ${themeStyles.textSecondary} text-center mb-8`}
          >
            Tell us about yourself
          </Text>
          <Text className={`text-lg ${themeStyles.textPrimary}`}>Location</Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter city or area"
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Cuisine Specialties
          </Text>
          <FlatList
            data={cuisineOptions}
            keyExtractor={(item) => item}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`flex-1 m-1 p-2 rounded-xl ${
                  formData.cuisineSpecialties.includes(item)
                    ? themeStyles.buttonBg
                    : themeStyles.inputBg
                }`}
                onPress={() => toggleCuisine(item)}
                disabled={loading}
              >
                <Text
                  className={`text-center ${
                    formData.cuisineSpecialties.includes(item)
                      ? themeStyles.buttonText
                      : themeStyles.inputText
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Text className={`text-lg ${themeStyles.textPrimary} mt-4`}>
            Specialties
          </Text>
          <View className="flex-row mb-4">
            <TextInput
              className={`flex-1 py-4 px-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl`}
              placeholder="Enter a specialty"
              value={specialtyInput}
              onChangeText={setSpecialtyInput}
              placeholderTextColor={themeStyles.inputPlaceholder}
            />
            <TouchableOpacity
              onPress={addSpecialty}
              className={`ml-2 px-4 flex justify-center ${themeStyles.buttonBg} rounded-xl`}
            >
              <Text className={`text-white font-bold`}>Add</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap">
            {formData.specialties.map((item) => (
              <View
                key={item}
                className="flex-row items-center bg-gray-300 dark:bg-gray-700 rounded-full px-3 py-1 m-1"
              >
                <Text className="mr-2">{item}</Text>
                <TouchableOpacity onPress={() => removeSpecialty(item)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text className={`text-lg ${themeStyles.textPrimary} mt-4`}>Bio</Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Describe your cooking passion"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Experience (Years)
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter years of experience"
            value={formData.experienceLevel}
            onChangeText={(text) =>
              setFormData({ ...formData, experienceLevel: text })
            }
            keyboardType="numeric"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
        </>
      );
    } else if (step === 3) {
      return (
        <>
          <Text
            className={`text-3xl font-extrabold ${themeStyles.textAccent} text-center tracking-wide`}
          >
            Service Details
          </Text>
          <Text
            className={`text-lg ${themeStyles.textSecondary} text-center mt-2 mb-8`}
          >
            Specify your services and pricing
          </Text>
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Services Offered
          </Text>
          <FlatList
            data={serviceOptions}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`m-1 p-2 rounded-xl ${
                  formData.servicesOffered.includes(item)
                    ? themeStyles.buttonBg
                    : themeStyles.inputBg
                }`}
                onPress={() => toggleService(item)}
                disabled={loading}
              >
                <Text
                  className={`text-center ${
                    formData.servicesOffered.includes(item)
                      ? themeStyles.buttonText
                      : themeStyles.inputText
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Text className={`text-lg ${themeStyles.textPrimary} mt-4`}>
            Pricing (Per Dish)
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter price per dish"
            value={formData.pricing.perDish}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, perDish: text },
              })
            }
            keyboardType="numeric"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Pricing (Per Hour)
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter price per hour"
            value={formData.pricing.perHour}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, perHour: text },
              })
            }
            keyboardType="numeric"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
        </>
      );
    } else if (step === 4) {
      return (
        <>
          <View className="px-4">
            <Text
              className={`text-3xl font-extrabold ${themeStyles.textAccent} text-center tracking-wide`}
            >
              Upload Profile Photo
            </Text>
            <Text
              className={`text-lg ${themeStyles.textSecondary} text-center mb-8`}
            >
              Add a profile picture to personalize your account
            </Text>
            <View className="items-center mb-12">
              <View
                className={`w-32 h-32 rounded-full items-center justify-center overflow-hidden 
        ${formData.profileImage ? '' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                {formData.profileImage ? (
                  <Image
                    source={{ uri: formData.profileImage }}
                    className="w-full h-full"
                  />
                ) : (
                  <Text
                    className={`text-4xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    +
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={pickImage}
                className={`mt-4 px-6 py-3 rounded-xl flex-row justify-center ${themeStyles.inputBg}`}
              >
                <Text
                  className={`text-base font-medium ${themeStyles.inputText}`}
                >
                  {formData.profileImage ? 'Change Photo' : 'Upload Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <View className="px-4 pt-4">
        <TouchableOpacity
          onPress={() =>
            step === 1 ? navigation.navigate('Welcome') : setStep(step - 1)
          }
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text
          className={`text-lg ${themeStyles.textSecondary} text-center mt-2`}
        >
          Step {step} of 4
        </Text>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 16,
          paddingHorizontal: 32,
          paddingBottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.select({ ios: 0, android: 20 })}
        enableAutomaticScroll={true}
      >
        <View className="mb-4">{renderStep()}</View>
        {step <= 4 && (
          <>
            <TouchableOpacity
              onPress={handleNext}
              className={`py-3 ${themeStyles.buttonBg} rounded-xl ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              <Text
                className={`text-center text-lg font-bold ${themeStyles.buttonText}`}
              >
                {loading
                  ? 'Processing...'
                  : step === 4
                    ? 'Complete Sign Up'
                    : 'Next'}
              </Text>
            </TouchableOpacity>
            {step === 1 && (
              <View className="flex-row justify-center mt-4">
                <Text className={`text-lg ${themeStyles.textSecondary}`}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CookSignIn')}
                  disabled={loading}
                >
                  <Text
                    className={`text-lg font-semibold ml-2 ${themeStyles.textAccent}`}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
      <SnackbarComponent
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </SafeAreaView>
  );
}
