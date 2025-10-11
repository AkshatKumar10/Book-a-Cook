import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  FlatList,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '../context/ThemeContext';
import useCookProfile from '../hooks/useCookProfile';
import { updateCookProfile } from '../utils/api';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import SnackbarComponent from '../components/SnackbarComponent';
import Navbar from '../components/Navbar';
import { Skeleton } from 'moti/skeleton';
import { useWindowDimensions } from 'react-native';

const EditCookProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { data, dataLoading } = useCookProfile();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [initialData, setInitialData] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage: null,
    location: '',
    cuisineSpecialties: [],
    specialties: [],
    bio: '',
    experienceLevel: '',
    servicesOffered: [],
    pricing: { perDish: '', perHour: '' },
  });

  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  useEffect(() => {
    if (data) {
      let specialtiesArray = [];
      if (typeof data.specialties === 'string') {
        specialtiesArray = data.specialties
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      let cuisinesArray = [];
      if (typeof data.cuisine === 'string') {
        cuisinesArray = data.cuisine
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
      }

      const newFormData = {
        username: data.name,
        email: data.email || '',
        profileImage: data.image,
        location: data.location,
        cuisineSpecialties: cuisinesArray,
        specialties: specialtiesArray,
        bio: data.bio,
        experienceLevel: data.experienceLevel?.toString(),
        servicesOffered: data.servicesOffered,
        pricing: {
          perDish: data.pricing?.perDish?.toString(),
          perHour: data.pricing?.perHour?.toString(),
        },
      };

      setFormData(newFormData);
      setInitialData(newFormData);
      setCuisineOptions(cuisinesArray);
      setServiceOptions(data.servicesOffered);
    }
  }, [data]);

  const hasChanged = () => {
    if (!initialData) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-50',
    header: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    buttonBg: 'bg-orange-500',
    buttonText: 'text-white',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
    chipBg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
    chipText: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
  };

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

  const handleSave = async () => {
    if (!formData.username || !formData.email || !formData.location || !formData.bio) {
      Keyboard.dismiss();
      setSnackbarMessage('Please fill all required fields');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Keyboard.dismiss();
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }

    if (formData.cuisineSpecialties.length === 0) {
      Keyboard.dismiss();
      setSnackbarMessage('Please select at least one cuisine specialty');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }

    if (formData.servicesOffered.length === 0) {
      Keyboard.dismiss();
      setSnackbarMessage('Please select at least one service');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }

    if (!hasChanged()) {
      Keyboard.dismiss();
      setSnackbarMessage('No changes made to the profile');
      setSnackbarType('info');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
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

      await updateCookProfile(updateData);
      Keyboard.dismiss();
      setInitialData(formData);
      setSnackbarMessage('Profile updated successfully');
      setSnackbarType('success');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Update error:', error);
      Keyboard.dismiss();
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to update profile',
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Edit Profile" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center mb-6">
              <Skeleton colorMode={theme} width={128} height={128} radius="round" />
              <View style={{ height: 16 }} />
              <Skeleton colorMode={theme} width={width * 0.4} height={36} radius={10} />
            </View>
            <Skeleton colorMode={theme} width={width * 0.3} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={48} radius={10} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.3} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={48} radius={10} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.3} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={48} radius={10} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <View className="flex-row flex-wrap gap-2">
              {[...Array(6)].map((_, index) => (
                <Skeleton
                  key={index}
                  colorMode={theme}
                  width={width * 0.44}
                  height={48}
                  radius={10}
                />
              ))}
            </View>
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <View className="flex-row">
              <Skeleton colorMode={theme} width={width * 0.7} height={48} radius={10} />
              <View style={{ width: 8 }} />
              <Skeleton colorMode={theme} width={width * 0.2} height={48} radius={10} />
            </View>
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={120} radius={10} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={48} radius={10} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <View className="flex-row flex-wrap gap-2">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  colorMode={theme}
                  width={width * 0.44}
                  height={48}
                  radius={10}
                  style={{ margin: 4 }}
                />
              ))}
            </View>
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={48} radius={10} />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={width * 0.4} height={20} radius={10} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={width - 40} height={48} radius={10} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Edit Profile" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        className="flex-1"
      >
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="items-center mb-6">
              <View className="w-32 h-32 rounded-full overflow-hidden">
                {formData.profileImage && (
                  <Image
                    source={{ uri: formData.profileImage }}
                    className="w-full h-full"
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={pickImage}
                className={`mt-4 px-6 py-2 rounded-xl ${themeStyles.inputBg}`}
              >
                <Text className={`font-medium ${themeStyles.inputText}`}>
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
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

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
              Email
            </Text>
            <TextInput
              className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
              placeholder="Enter email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              placeholderTextColor={themeStyles.inputPlaceholder}
            />

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
              Location
            </Text>
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

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
              Cuisine Specialties
            </Text>
            <FlatList
              data={cuisineOptions}
              keyExtractor={(item) => item}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-1 m-1 p-3 rounded-xl ${
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

            <Text
              className={`text-base font-semibold mb-2 mt-4 ${themeStyles.textPrimary}`}
            >
              Specialties
            </Text>
            <View className="flex-row mb-2">
              <TextInput
                className={`flex-1 p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl`}
                placeholder="Add a specialty"
                value={specialtyInput}
                onChangeText={setSpecialtyInput}
                placeholderTextColor={themeStyles.inputPlaceholder}
              />
              <TouchableOpacity
                onPress={addSpecialty}
                className={`ml-2 px-4 justify-center ${themeStyles.buttonBg} rounded-xl`}
              >
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap mb-4">
              {formData.specialties.map((item) => (
                <View
                  key={item}
                  className={`flex-row items-center ${themeStyles.chipBg} rounded-full px-3 py-2 m-1`}
                >
                  <Text className={themeStyles.chipText}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => removeSpecialty(item)}
                    className="ml-2"
                  >
                    <Ionicons name="close-circle" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
              Bio
            </Text>
            <TextInput
              className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
              placeholder="Describe your cooking passion"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={10}
              editable={!loading}
              placeholderTextColor={themeStyles.inputPlaceholder}
              textAlignVertical="top"
            />

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
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

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
              Services Offered
            </Text>
            <FlatList
              data={serviceOptions}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`m-1 p-3 rounded-xl ${
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

            <Text
              className={`text-base font-semibold mb-2 mt-4 ${themeStyles.textPrimary}`}
            >
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

            <Text
              className={`text-base font-semibold mb-2 ${themeStyles.textPrimary}`}
            >
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
          </ScrollView>
          <View
            className={`absolute bottom-0 left-0 right-0 px-4 py-1 bg-transparent ${
              theme === 'dark' ? 'bg-black/50' : 'bg-gray-50/50'
            }`}
          >
            <TouchableOpacity
              onPress={handleSave}
              className={`py-4 ${themeStyles.buttonBg} rounded-xl ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              <Text
                className={`text-center text-lg font-bold ${themeStyles.buttonText}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <SnackbarComponent
          visible={snackbarVisible}
          message={snackbarMessage}
          type={snackbarType}
          onDismiss={() => setSnackbarVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditCookProfileScreen;